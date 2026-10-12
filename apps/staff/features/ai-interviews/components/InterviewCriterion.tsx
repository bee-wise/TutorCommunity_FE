import { DisclosureCard } from "@workspace/ui/components/ui/collapsible";
import type { InterviewCriterion as Criterion } from "@workspace/core/ai-interviews/schemas/review.schema";

import { reviewReason } from "../utils/interview-presentation";
import { InterviewCriterionOverride } from "./InterviewCriterionOverride";

export function InterviewCriterion({
  criterion,
  interviewId,
  canOverride,
}: {
  criterion: Criterion;
  interviewId: string;
  canOverride: boolean;
}) {
  const flagged =
    criterion.needs_review ||
    criterion.review_reasons.length > 0 ||
    criterion.effective_score == null;
  return (
    <DisclosureCard
      variant="outline"
      title={criterion.description}
      description={`${criterion.criterion_code} · Trọng số ${Math.round(criterion.weight * 100)}%`}
      badge={
        <span
          className={`rounded-lg px-2 py-1 text-xs font-bold tabular-nums ${flagged ? "bg-accent/20" : "bg-primary/5 text-primary"}`}
        >
          {criterion.effective_score ?? "—"} / 4{flagged && " · Cần xem lại"}
        </span>
      }
    >
      <div className="space-y-4">
        <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
          <span>
            Điểm AI:{" "}
            <strong className="text-foreground">
              {criterion.score ?? "Chưa chấm"}
            </strong>
          </span>
          <span>Trạng thái: {criterion.score_status ?? "Chưa có"}</span>
          {criterion.confidence != null && (
            <span>Độ tin cậy: {Math.round(criterion.confidence * 100)}%</span>
          )}
          {criterion.coverage != null && (
            <span>Độ bao phủ: {Math.round(criterion.coverage * 100)}%</span>
          )}
        </div>
        {criterion.override_level != null && (
          <p className="rounded-xl bg-primary/5 p-3 text-sm text-primary">
            <strong>Consultant chấm: {criterion.override_level}/4</strong>
            <span className="mt-1 block whitespace-pre-wrap">
              {criterion.override_reason}
            </span>
          </p>
        )}
        {!!criterion.review_reasons.length && (
          <p className="rounded-xl bg-accent/15 p-3 text-sm">
            {criterion.review_reasons.map(reviewReason).join("; ")}
          </p>
        )}
        {criterion.comment && (
          <p className="whitespace-pre-wrap text-sm leading-6">
            {criterion.comment}
          </p>
        )}
        {criterion.rationale && (
          <p className="whitespace-pre-wrap text-sm leading-6 text-muted-foreground">
            {criterion.rationale}
          </p>
        )}
        {criterion.evidence.length ? (
          <div>
            <h4 className="text-sm font-bold">Minh chứng trong câu trả lời</h4>
            {criterion.evidence.map((item, index) => (
              <blockquote
                key={`${item.q_code}-${index}`}
                className="mt-3 border-l-2 border-primary/25 bg-muted/30 p-3 text-sm leading-6"
              >
                “{item.quote}”
                <p className="mt-1 text-xs text-muted-foreground">
                  {item.q_code} · {item.type}
                </p>
              </blockquote>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            Chưa có trích dẫn minh chứng.
          </p>
        )}
        <DisclosureCard
          variant="subtle"
          size="sm"
          title="Barem và điểm Consultant"
        >
          <ol className="space-y-2 text-sm">
            {criterion.levels.map((level, index) => (
              <li
                key={index}
                className={`rounded-xl p-3 ${criterion.effective_score === index ? "bg-primary/5 ring-1 ring-primary/20" : "bg-background"}`}
              >
                <strong className="text-primary">Mức {index}: </strong>
                {level}
              </li>
            ))}
          </ol>
          {canOverride && (
            <InterviewCriterionOverride
              interviewId={interviewId}
              code={criterion.criterion_code}
            />
          )}
        </DisclosureCard>
        {criterion.probabilities && (
          <DisclosureCard title="Phân bố điểm AI" variant="subtle" size="sm">
            <dl className="space-y-2 text-xs">
              {Object.entries(criterion.probabilities).map(
                ([level, probability]) => (
                  <div key={level} className="flex justify-between gap-3">
                    <dt>Mức {level}</dt>
                    <dd className="tabular-nums">
                      {Math.round(probability * 100)}%
                    </dd>
                  </div>
                ),
              )}
            </dl>
          </DisclosureCard>
        )}
      </div>
    </DisclosureCard>
  );
}
