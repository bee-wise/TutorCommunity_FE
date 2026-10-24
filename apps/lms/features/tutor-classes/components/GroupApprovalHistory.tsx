import { ChatBubbleLeftEllipsisIcon, ClockIcon } from "@heroicons/react/24/outline";
import type { z } from "zod";
import type { groupHistorySchema } from "@workspace/core/lms-classes/group.schemas";
import { toApprovalHistoryView } from "../utils/group-approval-history";
import { ApprovalStatusBadge, approvalStatusView } from "./ClassBadges";

type GroupHistoryDto = z.infer<typeof groupHistorySchema>;
const dateTime = new Intl.DateTimeFormat("vi-VN", { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Ho_Chi_Minh" });

export function GroupApprovalHistory({ items }: { items: readonly GroupHistoryDto[] }) {
  const sorted = [...items].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  return (
    <ol className="space-y-3">
      {sorted.map((item, i) => {
        const view = toApprovalHistoryView(item.action, item.changes);
        const statusView = approvalStatusView(view.status);
        return (
          <li key={`${item.createdAt}-${i}`} className="flex items-center gap-3">
            <span className={`grid size-9 shrink-0 place-items-center rounded-xl border ${statusView?.tone ?? "border-border bg-muted text-primary"}`}>
              {statusView ? <statusView.Icon className="size-5" aria-hidden="true" /> : <ClockIcon className="size-5" aria-hidden="true" />}
            </span>
            <div className="min-w-0 flex-1 space-y-1.5 rounded-2xl border border-border bg-card px-4 py-3">
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                <p className="text-sm font-extrabold text-foreground">{view.title}</p>
                <ApprovalStatusBadge status={view.status} />
                <time dateTime={item.createdAt} className="ml-auto text-xs tabular-nums text-muted-foreground">
                  {dateTime.format(new Date(item.createdAt))}
                </time>
              </div>
              {view.note && (
                <p className="flex items-start gap-2 text-sm text-muted-foreground">
                  <ChatBubbleLeftEllipsisIcon className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
                  <span className="[overflow-wrap:anywhere]">{view.note}</span>
                </p>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
