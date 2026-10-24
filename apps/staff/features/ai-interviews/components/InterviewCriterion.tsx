import { DisclosureCard } from "@workspace/ui/components/ui/collapsible";
import type { InterviewCriterion as Criterion } from "@workspace/core/ai-interviews/schemas/review.schema";
import {
  criterionFlagged,
  evidenceLabel,
  formatScore,
  reviewReason,
  scoreStatusLabel,
} from "../utils/interview-presentation";
import { InterviewCriterionOverride } from "./InterviewCriterionOverride";
import { Chip } from "./InterviewUi";

function LevelMeter({ value }: { value: number | null | undefined }) {
  return (
    <div className="flex gap-1" aria-hidden="true">
      {[1, 2, 3, 4].map((step) => (
        <span
          key={step}
          className={`h-2 w-6 rounded-full ${value != null && value >= step - 0.5 ? "bg-primary" : "bg-border"}`}
        />
      ))}
    </div>
  );
}

export function InterviewCriterion({
  criterion,
  interviewId,
  canOverride,
}: {
  criterion: Criterion;
  interviewId: string;
  canOverride: boolean;
}) {
  const flagged = criterionFlagged(criterion);
  const overridden = criterion.override_level != null;
  const shown = overridden ? criterion.override_level : criterion.effective_score;
  return (
    <DisclosureCard
      variant="outline"
      defaultOpen={flagged}
      title={criterion.description}
      description={
        <span className="flex flex-wrap items-center gap-2">
          <span>{criterion.criterion_code}</span>
          <span>· Trọng số {Math.round(criterion.weight * 100)}%</span>
          {flagged && <Chip tone="flag">{scoreStatusLabel(criterion.score_status)}</Chip>}
          {overridden && <Chip tone="ok">Consultant đã chấm</Chip>}
        </span>
      }
      badge={
        <span className="flex items-center gap-3">
          <LevelMeter value={shown} />
          <span className="w-12 text-right text-sm font-bold tabular-nums">
            {formatScore(shown)}
            <span className="font-normal text-muted-foreground">/4</span>
          </span>
        </span>
      }
    >
      <div className="space-y-4">
        {overridden && (
          <p className="rounded-xl bg-muted p-3 text-sm">
            <strong>Consultant chấm {criterion.override_level}/4</strong>
            <span className="mt-1 block whitespace-pre-wrap">
              {criterion.override_reason}
            </span>
          </p>
        )}
        {!!criterion.review_reasons.length && (
          <p className="rounded-xl bg-highlight p-3 text-sm font-medium">
            {Array.from(new Set(criterion.review_reasons))
              .map(reviewReason)
              .join("; ")}
          </p>
        )}
        {criterion.rationale && (
          <div>
            <h4 className="text-xs font-bold text-muted-foreground">
              AI nhận định
            </h4>
            <p className="mt-1 whitespace-pre-wrap text-sm leading-6">
              {criterion.rationale}
            </p>
          </div>
        )}
        {criterion.comment && (
          <div>
            <h4 className="text-xs font-bold text-muted-foreground">
              Gợi ý cho Consultant
            </h4>
            <p className="mt-1 whitespace-pre-wrap text-sm leading-6">
              {criterion.comment}
            </p>
          </div>
        )}
        <div>
          <h4 className="text-xs font-bold text-muted-foreground">
            Trích dẫn trong câu trả lời
          </h4>
          {criterion.evidence.length ? (
            criterion.evidence.map((item, index) => (
              <blockquote
                key={`${item.q_code}-${index}`}
                className="mt-2 rounded-xl bg-muted p-3 text-sm leading-6"
              >
                “{item.quote}”
                <p className="mt-1 text-xs text-muted-foreground">
                  {evidenceLabel(item.type)}
                </p>
              </blockquote>
            ))
          ) : (
            <p className="mt-1 text-sm text-muted-foreground">
              AI không tìm thấy trích dẫn phù hợp.
            </p>
          )}
        </div>
        <DisclosureCard
          variant="subtle"
          size="sm"
          title={canOverride ? "Barem và chấm lại" : "Barem"}
        >
          <ol className="space-y-2 text-sm">
            {criterion.levels.map((level, index) => {
              const [label, ...rest] = level.split(":");
              return (
                <li
                  key={index}
                  className={`rounded-xl p-3 ${Math.round(shown ?? -1) === index ? "border border-primary bg-card" : "bg-card"}`}
                >
                  <strong className="text-primary">{label}</strong>
                  {rest.length > 0 && <span>: {rest.join(":").trim()}</span>}
                </li>
              );
            })}
          </ol>
          {canOverride && (
            <InterviewCriterionOverride
              interviewId={interviewId}
              code={criterion.criterion_code}
            />
          )}
        </DisclosureCard>
        <DisclosureCard title="Chỉ số kỹ thuật của AI" variant="subtle" size="sm">
          <dl className="grid grid-cols-2 gap-3 text-xs sm:grid-cols-4">
            <Metric label="Điểm AI" value={formatScore(criterion.score, 2)} />
            <Metric
              label="Độ tin cậy"
              value={
                criterion.confidence != null
                  ? `${Math.round(criterion.confidence * 100)}%`
                  : "—"
              }
            />
            <Metric
              label="Độ bao phủ"
              value={
                criterion.coverage != null
                  ? `${Math.round(criterion.coverage * 100)}%`
                  : "—"
              }
            />
            <Metric label="Trạng thái" value={scoreStatusLabel(criterion.score_status)} />
          </dl>
          {criterion.probabilities && (
            <p className="mt-3 text-xs text-muted-foreground">
              Xác suất theo mức:{" "}
              {Object.entries(criterion.probabilities)
                .map(([level, p]) => `${level}: ${Math.round(p * 100)}%`)
                .join(" · ")}
            </p>
          )}
        </DisclosureCard>
      </div>
    </DisclosureCard>
  );
}
function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="mt-0.5 font-bold tabular-nums">{value}</dd>
    </div>
  );
}
