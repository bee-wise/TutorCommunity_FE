"use client";

import type { InterviewPackage } from "@workspace/core/ai-interviews/schemas/review.schema";
import { interviewDate } from "../utils/interview-presentation";
import { InterviewAudit } from "./InterviewAudit";
import { Chip, InterviewStatus, panelClass } from "./InterviewUi";

export function InterviewHistory({ data }: { data: InterviewPackage }) {
  return (
    <div className="space-y-5">
      <section className={panelClass}>
        <h2 className="font-nunito text-lg font-extrabold">
          Lịch sử quyết định
        </h2>
        {!data.decisions.length && (
          <p className="py-8 text-center text-sm text-muted-foreground">
            Chưa có quyết định xét duyệt.
          </p>
        )}
        <ol className="mt-4 space-y-4">
          {data.decisions.map((decision) => (
            <li
              key={decision.id}
              className="rounded-2xl border border-border p-4"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <InterviewStatus status={decision.decision} />
                <time className="text-xs text-muted-foreground">
                  {interviewDate(decision.created_at)}
                </time>
              </div>
              {decision.reason && (
                <p className="mt-3 whitespace-pre-wrap text-sm leading-6">
                  <strong>Lý do: </strong>
                  {decision.reason}
                </p>
              )}
              {decision.feedback && (
                <p className="mt-3 whitespace-pre-wrap rounded-xl bg-muted p-3 text-sm leading-6">
                  <strong>Phản hồi gửi gia sư: </strong>
                  {decision.feedback}
                </p>
              )}
              <div className="mt-3">
                <Chip tone={decision.synced_at ? "ok" : "neutral"}>
                  {decision.synced_at ? "Đã đồng bộ" : "Đang chờ đồng bộ"}
                </Chip>
              </div>
            </li>
          ))}
        </ol>
      </section>
      <InterviewAudit
        entity="interview"
        id={data.interview.interview_id}
        defaultOpen={false}
      />
    </div>
  );
}
