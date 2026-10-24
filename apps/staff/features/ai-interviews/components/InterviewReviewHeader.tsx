import {
  AcademicCapIcon,
  CalendarDaysIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";
import type { InterviewPackage } from "@workspace/core/ai-interviews/schemas/review.schema";
import {
  assessmentLabel,
  formatScore,
  interviewDate,
  studentYearLabel,
  text,
  tutorDisplayName,
  tutorInitials,
} from "../utils/interview-presentation";
import { Chip, InterviewStatus, panelClass } from "./InterviewUi";

export function InterviewReviewHeader({ data }: { data: InterviewPackage }) {
  const name = tutorDisplayName(data.tutor);
  const avatar = text(data.tutor?.avatarUrl);
  const headline = text(data.tutor?.profileHeadline);
  const school = [
    text(data.tutor?.universityName),
    text(data.tutor?.major),
    studentYearLabel(data.tutor?.studentYear),
  ].filter(Boolean);
  const score = data.summary?.overall_score ?? data.interview.overall_score;
  const complete = data.summary?.score_complete ?? score != null;
  const max = data.summary?.max_score ?? 100;
  const needsReview =
    data.interview.manual_review_required ||
    data.summary?.requires_human_review;
  return (
    <section className={`${panelClass} !p-0 overflow-hidden`}>
      <div className="flex flex-col gap-6 p-5 sm:p-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex min-w-0 items-center gap-4">
          <span className="flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-muted font-nunito text-xl font-extrabold text-primary sm:size-20">
            {avatar ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={avatar} alt="" className="size-full object-cover" />
            ) : (
              tutorInitials(name)
            )}
          </span>
          <div className="min-w-0">
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <InterviewStatus status={data.interview.status} />
              {needsReview && <Chip tone="flag">Cần xem kỹ</Chip>}
            </div>
            <h1 className="font-nunito text-2xl leading-[1.2] font-black sm:text-3xl">
              {name}
            </h1>
            {headline && (
              <p className="mt-1 text-sm text-muted-foreground">{headline}</p>
            )}
            <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1.5 text-xs text-muted-foreground">
              {!!school.length && (
                <span className="flex items-center gap-1.5">
                  <AcademicCapIcon className="size-4" aria-hidden="true" />
                  {school.join(" · ")}
                </span>
              )}
              <span className="flex items-center gap-1.5">
                <CalendarDaysIcon className="size-4" aria-hidden="true" />
                Nộp {interviewDate(data.interview.submitted_at)}
              </span>
              <span className="flex items-center gap-1.5">
                <ClockIcon className="size-4" aria-hidden="true" />
                Bắt đầu {interviewDate(data.interview.started_at)}
              </span>
            </div>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-4 rounded-2xl bg-muted px-5 py-4 lg:min-w-60">
          <div>
            <p className="text-xs font-semibold text-muted-foreground">
              Điểm AI tạm tính
            </p>
            <p className="mt-1 font-nunito text-4xl font-black leading-none text-primary tabular-nums">
              {formatScore(score)}
              <span className="ml-1 text-sm font-semibold text-muted-foreground">
                / {max}
              </span>
            </p>
          </div>
          <div className="min-w-0 border-l border-border pl-4 text-xs">
            <p className="font-bold">
              {assessmentLabel(data.summary?.assessment_level)}
            </p>
            {!complete && (
              <p className="mt-1 text-warning">Chưa chấm đủ các câu</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
