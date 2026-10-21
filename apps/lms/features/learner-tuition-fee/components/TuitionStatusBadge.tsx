import { LmsStatusBadge } from "../../../components/LmsStatusBadge";
import type { StatusTone } from "../../../components/lms-status";
import type {
  TuitionChargeStatus,
  TuitionClassStatus,
} from "../types/tuition-fee.types";

const CHARGE: Record<TuitionChargeStatus, { label: string; tone: StatusTone }> = {
  RECORDED: { label: "Đã ghi nhận", tone: "done" },
  RESERVED: { label: "Đã giữ học phí", tone: "active" },
  NO_CHARGE: { label: "Không tính phí", tone: "cancelled" },
};

export function TuitionClassStatusBadge({ status }: { status: TuitionClassStatus }) {
  return <LmsStatusBadge status={status === "ACTIVE" ? "done" : "cancelled"} label={status === "ACTIVE" ? "Đang học" : "Đã hoàn thành"} />;
}

export function TuitionChargeStatusBadge({ status }: { status: TuitionChargeStatus }) {
  return <LmsStatusBadge status={CHARGE[status].tone} label={CHARGE[status].label} />;
}
