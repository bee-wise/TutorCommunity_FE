import { ArrowsRightLeftIcon } from "@heroicons/react/24/outline";
import type { InterviewReport } from "@workspace/core/ai-interviews/schemas/review.schema";
import { conflictStatusLabel } from "../utils/interview-presentation";
import { Chip, panelClass, SectionTitle } from "./InterviewUi";

export function InterviewConflicts({
  conflicts,
}: {
  conflicts: InterviewReport["data_conflicts"];
}) {
  if (!conflicts.length) return null;
  return (
    <section className={panelClass}>
      <SectionTitle
        icon={<ArrowsRightLeftIcon />}
        aside={<Chip tone="flag">{conflicts.length} điểm khác biệt</Chip>}
      >
        Đối chiếu với hồ sơ
      </SectionTitle>
      <ul className="mt-4 space-y-3">
        {conflicts.map((item, index) => (
          <li key={index} className="rounded-2xl border border-border p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-sm font-bold">
                {item.profile.label}
                <span className="ml-2 font-normal text-muted-foreground">
                  {item.q_code}
                </span>
              </p>
              <Chip tone="flag">{conflictStatusLabel(item.status)}</Chip>
            </div>
            <div className="mt-3 grid gap-3 md:grid-cols-2">
              <div className="rounded-xl bg-muted p-3">
                <p className="text-xs font-bold text-muted-foreground">
                  Gia sư nói khi phỏng vấn
                </p>
                <blockquote className="mt-1.5 text-sm leading-6">
                  “{item.interview_quote}”
                </blockquote>
              </div>
              <div className="rounded-xl border border-border p-3">
                <p className="text-xs font-bold text-muted-foreground">
                  Hồ sơ đã đăng ký
                </p>
                <p className="mt-1.5 text-sm font-semibold leading-6">
                  {item.profile.text}
                </p>
              </div>
            </div>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              {item.note}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}
