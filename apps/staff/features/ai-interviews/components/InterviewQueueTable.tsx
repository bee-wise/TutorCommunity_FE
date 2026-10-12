import Link from "next/link";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import type { InterviewListItem } from "@workspace/core/ai-interviews/schemas/review.schema";
import { Button } from "@workspace/ui/components/ui/button";
import { interviewDate } from "../utils/interview-presentation";
import { actionClass, InterviewStatus } from "./InterviewUi";

export function InterviewQueueTable({
  items,
  role,
}: {
  items: InterviewListItem[];
  role: "consultant" | "admin";
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[720px] text-left text-sm">
        <thead className="bg-muted/30">
          <tr className="border-b border-border text-xs text-muted-foreground">
            <th className="px-5 py-3 font-semibold">Gia sư / buổi phỏng vấn</th>
            <th className="px-5 py-3 font-semibold">Trạng thái</th>
            <th className="px-5 py-3 font-semibold">Điểm AI</th>
            <th className="px-5 py-3 font-semibold">Thời gian nộp</th>
            <th className="px-5 py-3">
              <span className="sr-only">Xem hồ sơ</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr
              key={item.interview_id}
              className="border-b border-border transition-colors last:border-0 hover:bg-muted/20"
            >
              <td className="px-5 py-5">
                <p className="text-xs text-muted-foreground">Mã gia sư</p>
                <p className="mt-1 max-w-64 break-all font-mono text-xs font-medium">
                  {item.tutor_id}
                </p>
                <p className="mt-2 max-w-64 break-all text-[11px] text-muted-foreground">
                  Buổi: {item.interview_id}
                </p>
              </td>
              <td className="px-5 py-5">
                <InterviewStatus status={item.status} />
                {item.manual_review_required && (
                  <span className="mt-2 flex items-center gap-1.5 rounded-lg bg-accent/15 px-2 py-1 text-xs font-medium">
                    <ExclamationTriangleIcon className="size-4 text-foreground" />
                    Cần xem kỹ
                  </span>
                )}
              </td>
              <td className="px-5 py-5 font-bold text-primary tabular-nums">
                {item.overall_score ?? "—"}
                <span className="ml-1 text-xs font-normal text-muted-foreground">
                  /100
                </span>
              </td>
              <td className="whitespace-nowrap px-5 py-5 text-xs">
                {interviewDate(item.submitted_at)}
              </td>
              <td className="px-5 py-5">
                <Button
                  asChild
                  variant={
                    item.status === "PENDING_REVIEW" ? "default" : "outline"
                  }
                  className={actionClass}
                >
                  <Link
                    href={`/${role}/ai-interviews/${encodeURIComponent(item.interview_id)}`}
                  >
                    Xem hồ sơ
                  </Link>
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
