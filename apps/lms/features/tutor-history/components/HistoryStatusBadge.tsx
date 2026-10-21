import { HISTORY_STATUS_LABELS, type HistoryStatus } from "../types/history.types";

export function HistoryStatusBadge({ status }: { status: HistoryStatus }) {
  const color = status === "converted" ? "border-secondary/30 bg-secondary/15 text-foreground"
    : status === "waiting" ? "border-accent bg-accent text-accent-foreground"
      : status === "active" ? "border-primary bg-primary text-primary-foreground"
        : "border-border bg-card text-muted-foreground";
  return <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-bold leading-5 ${color}`}>{HISTORY_STATUS_LABELS[status]}</span>;
}
