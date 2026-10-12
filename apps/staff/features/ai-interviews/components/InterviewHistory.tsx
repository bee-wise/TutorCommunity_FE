"use client";

import type { InterviewPackage } from "@workspace/core/ai-interviews/schemas/review.schema";
import { DisclosureCard } from "@workspace/ui/components/ui/collapsible";
import { interviewDate } from "../utils/interview-presentation";
import { InterviewAudit } from "./InterviewAudit";
import { InterviewStatus, panelClass } from "./InterviewUi";

export function InterviewHistory({ data }: { data: InterviewPackage }) {
  return (
    <div className="space-y-5">
      <section className={panelClass}>
        <h2 className="font-nunito text-lg font-extrabold">
          Lịch sử quyết định
        </h2>
        {!data.decisions.length && (
          <p className="py-8 text-sm text-muted-foreground">
            Chưa có quyết định xét duyệt.
          </p>
        )}
        <ol className="mt-4 divide-y divide-border">
          {data.decisions.map((decision) => (
            <li key={decision.id} className="space-y-3 py-5 first:pt-0">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <InterviewStatus status={decision.decision} />
                <time className="text-xs text-muted-foreground">
                  {interviewDate(decision.created_at)}
                </time>
              </div>
              {decision.reason && (
                <p className="whitespace-pre-wrap text-sm leading-6">
                  <strong>Lý do: </strong>
                  {decision.reason}
                </p>
              )}
              {decision.feedback && (
                <p className="whitespace-pre-wrap rounded-xl bg-muted/40 p-3 text-sm leading-6">
                  <strong>Phản hồi: </strong>
                  {decision.feedback}
                </p>
              )}
              <p
                className={`text-xs font-medium ${decision.synced_at ? "text-secondary" : "text-muted-foreground"}`}
              >
                {decision.synced_at
                  ? "Đã đồng bộ BeeWise Core"
                  : "Đang chờ đồng bộ BeeWise Core"}
              </p>
              <DisclosureCard
                title="Thông tin quyết định"
                variant="subtle"
                size="sm"
              >
                <p className="break-all text-xs text-muted-foreground">
                  Consultant: {decision.consultant_id}
                </p>
                {decision.details && (
                  <pre className="mt-3 overflow-auto whitespace-pre-wrap break-all text-xs">
                    {JSON.stringify(decision.details, null, 2)}
                  </pre>
                )}
              </DisclosureCard>
            </li>
          ))}
        </ol>
      </section>
      <InterviewAudit
        entity="interview"
        id={data.interview.interview_id}
        defaultOpen
      />
    </div>
  );
}
