"use client";

import type { InterviewQuestion as Question } from "@workspace/core/ai-interviews/schemas/review.schema";
import { DisclosureCard } from "@workspace/ui/components/ui/collapsible";
import {
  criterionFlagged,
  formatScore,
  reviewReason,
} from "../utils/interview-presentation";
import { InterviewCriterion } from "./InterviewCriterion";
import { Chip, panelClass } from "./InterviewUi";

export function InterviewQuestion({
  question,
  interviewId,
  canOverride,
}: {
  question: Question;
  interviewId: string;
  canOverride: boolean;
}) {
  const turn = question.turn;
  const flagged = question.criteria.filter(criterionFlagged).length;
  return (
    <div className="min-w-0 space-y-5">
      <section className={panelClass}>
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-xs font-bold text-primary">{question.q_code}</p>
            <h2 className="mt-1 font-nunito text-xl font-extrabold leading-snug">
              {question.title}
            </h2>
          </div>
          <span className="shrink-0 rounded-2xl bg-muted px-4 py-2.5 text-center">
            <span className="block font-nunito text-2xl font-black leading-none text-primary tabular-nums">
              {formatScore(question.points)}
            </span>
            <span className="text-xs text-muted-foreground">
              / {question.max_points} điểm
            </span>
          </span>
        </div>
        {!turn ? (
          <p className="mt-5 rounded-2xl bg-muted p-6 text-sm text-muted-foreground">
            Chưa có nội dung câu trả lời.
          </p>
        ) : (
          <div className="mt-5 space-y-4">
            <DisclosureCard title="Câu hỏi đã đặt cho gia sư" variant="subtle" size="sm">
              <p className="whitespace-pre-wrap text-sm leading-6">
                {turn.question}
              </p>
            </DisclosureCard>
            {turn.needs_review && (
              <p className="rounded-xl bg-highlight p-3 text-sm font-medium">
                {turn.review_reasons.length
                  ? turn.review_reasons.map(reviewReason).join("; ")
                  : "Câu trả lời cần xem lại."}
              </p>
            )}
            <div className="grid items-start gap-4 md:grid-cols-2">
              <InterviewMedia
                video={turn.video_url}
                audio={turn.audio_url}
                label={`câu ${question.q_code}`}
              />
              <div>
                <h3 className="mb-2 text-sm font-bold">Bản chép lời</h3>
                <p className="max-h-80 overflow-y-auto whitespace-pre-wrap rounded-2xl bg-muted p-4 text-sm leading-7">
                  {turn.transcript ?? "Chưa có bản chép lời."}
                </p>
              </div>
            </div>
            {turn.followup && (
              <DisclosureCard title="Câu hỏi bổ sung" variant="subtle" size="sm">
                <p className="mb-4 whitespace-pre-wrap text-sm leading-6">
                  {turn.followup}
                </p>
                <div className="grid gap-4 md:grid-cols-2">
                  <InterviewMedia
                    video={turn.followup_video_url}
                    audio={turn.followup_audio_url}
                    label={`bổ sung ${question.q_code}`}
                  />
                  <p className="max-h-80 overflow-y-auto whitespace-pre-wrap text-sm leading-7">
                    {turn.followup_transcript ?? "Chưa có bản chép lời bổ sung."}
                  </p>
                </div>
              </DisclosureCard>
            )}
            <p className="text-xs text-muted-foreground">
              Link bản ghi hết hạn sau 15 phút; bấm “Cập nhật” ở đầu trang để
              lấy link mới.
            </p>
          </div>
        )}
      </section>
      <section className={panelClass}>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 className="font-nunito text-lg font-extrabold">
            Chấm điểm theo tiêu chí
          </h3>
          {flagged > 0 && <Chip tone="flag">{flagged} tiêu chí cần xem lại</Chip>}
        </div>
        <p className="mt-1 text-sm leading-6 text-muted-foreground">
          {question.objective}
        </p>
        <div className="mt-4 space-y-3">
          {question.criteria.map((criterion) => (
            <InterviewCriterion
              key={criterion.criterion_code}
              criterion={criterion}
              interviewId={interviewId}
              canOverride={canOverride}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
function InterviewMedia({
  video,
  audio,
  label,
}: {
  video: string | null;
  audio: string | null;
  label: string;
}) {
  return (
    <div>
      <h3 className="mb-2 text-sm font-bold">Bản ghi</h3>
      {video ? (
        <video
          controls
          preload="none"
          src={video}
          className="aspect-video w-full rounded-2xl border border-border bg-foreground"
          aria-label={`Video ${label}`}
        />
      ) : audio ? (
        <audio
          controls
          preload="none"
          src={audio}
          className="w-full"
          aria-label={`Audio ${label}`}
        />
      ) : (
        <p className="rounded-2xl border border-dashed border-border p-6 text-sm text-muted-foreground">
          Chưa có bản ghi.
        </p>
      )}
    </div>
  );
}
