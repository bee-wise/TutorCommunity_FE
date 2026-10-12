import type { InterviewPackage } from "@workspace/core/ai-interviews/schemas/review.schema";
import { DisclosureCard } from "@workspace/ui/components/ui/collapsible";
import {
  interviewDate,
  tutorDisplayName,
  assessmentLabel,
} from "../utils/interview-presentation";
import { InterviewStatus, panelClass } from "./InterviewUi";

export function InterviewReviewHeader({ data }: { data: InterviewPackage }) {
  const score = data.summary
    ? data.summary.overall_score
    : data.interview.overall_score;
  const needsReview =
    data.interview.manual_review_required ||
    data.summary?.requires_human_review;
  return (
    <section className={panelClass}>
      <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
        <div>
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-muted-foreground">
              PHỎNG VẤN AI
            </span>
            <InterviewStatus status={data.interview.status} />
            {needsReview && (
              <span className="rounded-full border border-accent/50 bg-accent/15 px-3 py-1.5 text-xs font-bold">
                Cần xem kỹ
              </span>
            )}
          </div>
          <h1 className="font-nunito text-2xl leading-[1.2] font-black sm:text-3xl">
            {tutorDisplayName(data.tutor)}
          </h1>
          <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-xs text-muted-foreground">
            <span>Nộp: {interviewDate(data.interview.submitted_at)}</span>
            <span>Bộ câu hỏi: {data.interview.rubric_version}</span>
          </div>
        </div>
        <div className="rounded-2xl bg-primary/5 px-6 py-4 sm:min-w-44">
          <p className="text-xs font-semibold text-muted-foreground">
            Điểm đánh giá AI
          </p>
          <p className="mt-1 text-3xl font-black text-primary tabular-nums">
            {score ?? "—"}
            <span className="text-sm font-medium text-muted-foreground">
              {" "}
              / {data.summary?.max_score ?? 100}
            </span>
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            {assessmentLabel(data.summary?.assessment_level)}
          </p>
          {data.summary && !data.summary.score_complete && (
            <p className="mt-2 text-xs font-bold">Điểm chưa đầy đủ</p>
          )}
        </div>
      </div>
      <DisclosureCard
        title="Thông tin buổi phỏng vấn"
        variant="ghost"
        size="sm"
        className="mt-4 border-t border-border"
      >
        <dl className="grid gap-3 text-xs sm:grid-cols-2">
          <div>
            <dt className="text-muted-foreground">Mã gia sư</dt>
            <dd className="mt-1 break-all font-mono">
              {data.interview.tutor_id}
            </dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Mã buổi phỏng vấn</dt>
            <dd className="mt-1 break-all font-mono">
              {data.interview.interview_id}
            </dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Bắt đầu</dt>
            <dd className="mt-1">{interviewDate(data.interview.started_at)}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Ngôn ngữ</dt>
            <dd className="mt-1">{data.interview.language}</dd>
          </div>
        </dl>
      </DisclosureCard>
    </section>
  );
}
