import { CheckCircleIcon, ClockIcon, ExclamationTriangleIcon, NoSymbolIcon, PencilSquareIcon, PlayCircleIcon, XCircleIcon } from "@heroicons/react/16/solid";
import { CLASS_LABELS, SESSION_LABELS, type ClassKind, type ClassStatus, type SessionAttendance, type SessionStatus } from "../types/classes.types";
import { attendanceStateLabel } from "../utils/classes.utils";
import { statusTone } from "../../../components/lms-status";

const base = "inline-flex shrink-0 items-center gap-1 rounded-full border px-2.5 py-0.5 text-[11px] font-bold leading-5 whitespace-nowrap";
const success = statusTone.done;
const pending = statusTone.pending;
const quiet = statusTone.cancelled;

export function ClassStatusBadge({ status }: { status: ClassStatus }) {
  const waiting = status === "upcoming" || status === "pending_payment";
  const Icon = status === "cancelled" ? NoSymbolIcon : waiting || status === "unknown" ? ClockIcon : CheckCircleIcon;
  return <span className={`${base} ${status === "active" ? success : waiting ? pending : status === "cancelled" ? statusTone.cancelled : statusTone.planned}`}><Icon className="size-3.5" aria-hidden="true" />{CLASS_LABELS[status]}</span>;
}
export function ClassKindBadge({ kind }: { kind: ClassKind | "unknown" }) {
  return <span className={`${base} border-border bg-card text-primary`}>{kind === "individual" ? "Lớp 1:1" : kind === "group" ? "Lớp nhóm" : "Chưa xác định loại lớp"}</span>;
}
export function SessionStatusBadge({ status }: { status: SessionStatus }) {
  const Icon = status === "ongoing" ? PlayCircleIcon : status === "completed" ? CheckCircleIcon : status === "cancelled" ? NoSymbolIcon : ClockIcon;
  return <span className={`${base} ${status === "ongoing" ? statusTone.active : status === "completed" ? success : status === "cancelled" ? statusTone.cancelled : statusTone.planned}`}><Icon className="size-3.5" aria-hidden="true" />{SESSION_LABELS[status]}</span>;
}
export function AttendanceStateBadge({ record }: { record?: SessionAttendance }) {
  const Icon = record?.state === "confirmed" ? CheckCircleIcon : ClockIcon;
  return <span className={`${base} ${!record ? statusTone.planned : record.state === "confirmed" ? success : pending}`}><Icon className="size-3.5" aria-hidden="true" />{attendanceStateLabel(record)}</span>;
}

const approvalViews: Record<string, { label: string; tone: string; Icon: typeof ClockIcon }> = {
  DRAFT: { label: "Bản nháp", tone: statusTone.planned, Icon: PencilSquareIcon },
  SUBMITTED: { label: "Chờ duyệt", tone: pending, Icon: ClockIcon },
  PENDING: { label: "Chờ duyệt", tone: pending, Icon: ClockIcon },
  APPROVED: { label: "Đã duyệt", tone: success, Icon: CheckCircleIcon },
  CHANGES_REQUESTED: { label: "Cần chỉnh sửa", tone: pending, Icon: ExclamationTriangleIcon },
  REQUEST_CHANGES: { label: "Cần chỉnh sửa", tone: pending, Icon: ExclamationTriangleIcon },
  REJECTED: { label: "Không được duyệt", tone: statusTone.overdue, Icon: XCircleIcon },
};
export function approvalStatusView(status?: string | null) {
  return approvalViews[status ?? ""] ?? null;
}
export function ApprovalStatusBadge({ status }: { status?: string | null }) {
  const view = approvalViews[status ?? ""];
  if (!view) return null;
  return <span className={`${base} ${view.tone}`}><view.Icon className="size-3.5" aria-hidden="true" />{view.label}</span>;
}
