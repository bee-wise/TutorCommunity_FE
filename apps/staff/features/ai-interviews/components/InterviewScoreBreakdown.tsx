import type { InterviewPackage } from "@workspace/core/ai-interviews/schemas/review.schema";
import { DisclosureCard } from "@workspace/ui/components/ui/collapsible";

export function InterviewScoreBreakdown({
  summary,
}: {
  summary: NonNullable<InterviewPackage["summary"]>;
}) {
  return (
    <DisclosureCard title="Điểm theo câu hỏi" variant="outline" size="lg">
      <dl className="divide-y divide-border text-sm">
        {summary.questions.map((item) => (
          <div key={item.q_code} className="flex justify-between gap-4 py-3">
            <dt className="min-w-0 break-words">
              <span className="mr-2 font-bold text-primary">{item.q_code}</span>
              {item.title}
            </dt>
            <dd className="shrink-0 font-bold tabular-nums">
              {item.points ?? "—"}
              <span className="font-normal text-muted-foreground">
                {" "}
                / {item.max_points}
              </span>
            </dd>
          </div>
        ))}
      </dl>
    </DisclosureCard>
  );
}
