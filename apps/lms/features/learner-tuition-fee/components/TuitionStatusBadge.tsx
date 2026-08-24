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
  return <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-bold ${status === "ACTIVE" ? "bg-[#DDF1E5] text-[#365D43]" : "bg-slate-100 text-slate-600"}`}>{status === "ACTIVE" ? "Đang học" : "Đã hoàn thành"}</span>;
}

export function TuitionChargeStatusBadge({ status }: { status: TuitionChargeStatus }) {
  const style = status === "RECORDED"
    ? "bg-[#DDF1E5] text-[#365D43]"
    : status === "RESERVED"
      ? "bg-[#EEF2FF] text-[#280F91]"
      : "bg-slate-100 text-slate-600";
  return <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-bold ${style}`}>{CHARGE_LABELS[status]}</span>;
}
