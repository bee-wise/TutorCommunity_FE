import Link from "next/link";
import { ArrowRightIcon, ClockIcon } from "@heroicons/react/24/outline";
import type { InterviewListItem } from "@workspace/core/ai-interviews/schemas/review.schema";
import { Button } from "@workspace/ui/components/ui/button";
import { formatScore, interviewDate } from "../utils/interview-presentation";
import { actionClass, Chip, InterviewStatus } from "./InterviewUi";

export function InterviewQueueTable({
  items,
  role,
}: {
  items: InterviewListItem[];
  role: "consultant" | "admin";
}) {
  return (
    <ul className="divide-y divide-border">
      {items.map((item) => {
        const pending = item.status === "PENDING_REVIEW";
        const code = item.tutor_id.replace(/-/g, "").slice(-4).toUpperCase();
        return (
          <li
            key={item.interview_id}
            className="grid items-center gap-x-6 gap-y-3 px-4 py-4 transition-colors hover:bg-muted sm:px-5 md:grid-cols-[minmax(0,1fr)_auto_96px_132px]"
          >
            <div className="flex min-w-0 items-center gap-3.5">
              <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-muted font-nunito text-sm font-extrabold text-primary">
                {code}
              </span>
              <div className="min-w-0">
                <p className="truncate text-sm font-bold">
                  Gia sư #{code}
                </p>
                <p className="mt-0.5 flex items-center gap-1.5 text-xs text-muted-foreground">
                  <ClockIcon className="size-3.5 shrink-0" aria-hidden="true" />
                  Nộp {interviewDate(item.submitted_at)}
                </p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2 md:justify-end">
              <InterviewStatus status={item.status} />
              {item.manual_review_required && (
                <Chip tone="flag">Cần xem kỹ</Chip>
              )}
            </div>
            <div className="md:text-right">
              {item.overall_score == null ? (
                <span className="text-xs text-muted-foreground">
                  Chưa đủ điểm
                </span>
              ) : (
                <span className="font-nunito text-xl font-black text-primary tabular-nums">
                  {formatScore(item.overall_score)}
                  <span className="ml-0.5 text-xs font-semibold text-muted-foreground">
                    /100
                  </span>
                </span>
              )}
            </div>
            <Button
              asChild
              variant={pending ? "default" : "outline"}
              className={`${actionClass} md:w-full`}
            >
              <Link
                href={`/${role}/ai-interviews/${encodeURIComponent(item.interview_id)}`}
              >
                {pending ? "Xét duyệt" : "Xem hồ sơ"}
                <ArrowRightIcon className="size-4" aria-hidden="true" />
              </Link>
            </Button>
          </li>
        );
      })}
    </ul>
  );
}
