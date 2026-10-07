import { REPORT_LABELS, SETTLEMENT_LABELS, type ReportStatus, type SettlementStatus } from "../types/earnings.types";

const base = "inline-flex shrink-0 items-center rounded-full border px-3 py-1 text-xs font-bold leading-5";
const success = "border-secondary bg-secondary text-secondary-foreground";
const pending = "border-accent bg-accent text-accent-foreground";
const review = "border-primary bg-card text-primary";

export function EarningsStatusBadge({ status }: { status: SettlementStatus }) {
  return <span className={`${base} ${status === "settled" ? success : status === "pending" ? pending : review}`}>{SETTLEMENT_LABELS[status]}</span>;
}

export function EarningsReportStatusBadge({ status }: { status: ReportStatus }) {
  return <span className={`${base} ${status === "resolved" ? success : status === "processing" ? pending : review}`}>{REPORT_LABELS[status]}</span>;
}
