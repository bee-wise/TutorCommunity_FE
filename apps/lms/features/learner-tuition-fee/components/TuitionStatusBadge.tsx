import type {
  TuitionChargeStatus,
  TuitionClassStatus,
} from "../types/tuition-fee.types";

const CHARGE_LABELS: Record<TuitionChargeStatus, string> = {
  RECORDED: "Đã ghi nhận",
  RESERVED: "Đã giữ học phí",
  NO_CHARGE: "Không tính phí",
};

export function TuitionClassStatusBadge({ status }: { status: TuitionClassStatus }) {
  return <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-bold ${status === "ACTIVE" ? "bg-secondary/15 text-foreground" : "bg-muted text-muted-foreground"}`}>{status === "ACTIVE" ? "Đang học" : "Đã hoàn thành"}</span>;
}

export function TuitionChargeStatusBadge({ status }: { status: TuitionChargeStatus }) {
  const style = status === "RECORDED"
    ? "bg-secondary/15 text-foreground"
    : status === "RESERVED"
      ? "bg-muted text-primary"
      : "bg-muted text-muted-foreground";
  return <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-bold ${style}`}>{CHARGE_LABELS[status]}</span>;
}
