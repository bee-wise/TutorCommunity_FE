"use client";

import { useState } from "react";
import type { InterviewQuestion as Question } from "@workspace/core/ai-interviews/schemas/review.schema";
import { Button } from "@workspace/ui/components/ui/button";
import { DisclosureCard } from "@workspace/ui/components/ui/collapsible";
import { reviewReason } from "../utils/interview-presentation";
import { InterviewCriterion } from "./InterviewCriterion";
import { actionClass, panelClass } from "./InterviewUi";

export function InterviewQuestion({
  question,
  interviewId,
  canOverride,
}: {
  question: Question;
  interviewId: string;
  canOverride: boolean;
}) {
  const [tab, setTab] = useState<"answer" | "scoring">("answer");
  const turn = question.turn;
  return (
    <section className={panelClass}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-bold text-primary">{question.q_code}</p>
          <h2 className="mt-1 font-nunito text-xl font-extrabold">
            {question.title}
          </h2>
        </div>
        <span className="shrink-0 rounded-2xl bg-primary/5 px-4 py-3 text-lg font-bold text-primary tabular-nums">
          {question.points ?? "—"}
          <span className="text-xs text-muted-foreground">
            {" "}
            / {question.max_points}
          </span>
        </span>
      </div>
      <p className="mt-3 text-sm leading-6 text-muted-foreground">
        {question.objective}
      </p>
      <div
        className="mt-5 flex flex-wrap gap-2 border-b border-border pb-4"
        aria-label="Nội dung câu hỏi"
      >
        <Button
          variant="ghost"
          className={`${actionClass} ${tab === "answer" ? "bg-primary/5 text-primary ring-1 ring-primary/15 hover:bg-primary/10" : ""}`}
          aria-pressed={tab === "answer"}
          onClick={() => setTab("answer")}
        >
          Câu trả lời & bản ghi
        </Button>
        <Button
          variant="ghost"
          className={`${actionClass} ${tab === "scoring" ? "bg-primary/5 text-primary ring-1 ring-primary/15 hover:bg-primary/10" : ""}`}
          aria-pressed={tab === "scoring"}
          onClick={() => setTab("scoring")}
        >
          Tiêu chí & chấm điểm ({question.criteria.length})
        </Button>
      </div>
      {tab === "answer" && (
        <div className="mt-5 space-y-4">
          {!turn ? (
            <p className="rounded-2xl bg-muted/30 p-6 text-sm text-muted-foreground">
              Chưa có nội dung câu trả lời.
            </p>
          ) : (
            <>
              <p className="whitespace-pre-wrap text-sm font-medium leading-6">
                {turn.question}
              </p>
              {turn.needs_review && (
                <p className="rounded-xl bg-accent/15 p-3 text-sm">
                  {turn.review_reasons.length
                    ? turn.review_reasons.map(reviewReason).join("; ")
                    : "Câu trả lời cần xem lại."}
                </p>
              )}
              <div className="grid items-start gap-5 md:grid-cols-2">
                <div>
                  <h3 className="mb-3 text-sm font-bold">Bản ghi</h3>
                  <InterviewMedia
                    video={turn.video_url}
                    audio={turn.audio_url}
                    label={`câu ${question.q_code}`}
                  />
                </div>
                <div>
                  <h3 className="mb-3 text-sm font-bold">Bản chép lời</h3>
                  <p className="max-h-96 overflow-y-auto whitespace-pre-wrap rounded-2xl bg-muted/40 p-4 text-sm leading-7">
                    {turn.transcript ?? "Chưa có bản chép lời."}
                  </p>
                </div>
              </div>
              {turn.followup && (
                <DisclosureCard title="Câu hỏi bổ sung" variant="subtle">
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
                      {turn.followup_transcript ??
                        "Chưa có bản chép lời bổ sung."}
                    </p>
                  </div>
                </DisclosureCard>
              )}
            </>
          )}
          <p className="text-xs leading-5 text-muted-foreground">
            Link bản ghi có hiệu lực 15 phút. Dùng nút cập nhật hồ sơ nếu link
            hết hạn.
          </p>
        </div>
      )}
      <div hidden={tab !== "scoring"} className="mt-5 space-y-3">
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
  return video ? (
    <video
      controls
      preload="none"
      src={video}
      className="aspect-video w-full rounded-2xl border border-border bg-muted"
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
    <p className="rounded-xl border border-dashed border-border p-6 text-sm text-muted-foreground">
      Chưa có bản ghi.
    </p>
  );
}
