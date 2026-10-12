"use client";

import { useInterviewAuditQuery } from "@workspace/core/ai-interviews/hooks/useInterviewQueries";
import { DisclosureCard } from "@workspace/ui/components/ui/collapsible";
import { InterviewQueryState } from "./InterviewUi";

export function InterviewAudit({
  entity,
  id,
  defaultOpen = false,
}: {
  entity: string;
  id: string;
  defaultOpen?: boolean;
}) {
  const query = useInterviewAuditQuery(entity, id);
  return (
    <DisclosureCard
      variant="outline"
      title="Lịch sử thay đổi"
      defaultOpen={defaultOpen}
      size="lg"
    >
      <InterviewQueryState
        pending={query.isPending}
        error={query.error}
        retry={() => void query.refetch()}
      />
      {query.data?.length === 0 && (
        <p className="text-sm text-muted-foreground">
          Chưa có lịch sử thay đổi.
        </p>
      )}
      <div className="space-y-4">
        {query.data?.map((item) => (
          <article
            key={item.id}
            className="rounded-2xl border border-border p-4 text-sm"
          >
            <p className="font-semibold">
              {item.action} · {item.actor_role}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              {new Date(item.created_at).toLocaleString("vi-VN")} ·{" "}
              {item.actor_id ?? "Hệ thống"}
            </p>
            {item.reason && (
              <p className="mt-2 whitespace-pre-wrap">{item.reason}</p>
            )}
            {item.data && (
              <DisclosureCard
                title="Chi tiết thay đổi"
                variant="subtle"
                size="sm"
                className="mt-3"
              >
                <pre className="mt-3 max-h-60 overflow-auto whitespace-pre-wrap break-all rounded-xl bg-muted p-3 text-xs">
                  {JSON.stringify(item.data, null, 2)}
                </pre>
              </DisclosureCard>
            )}
          </article>
        ))}
      </div>
    </DisclosureCard>
  );
}
