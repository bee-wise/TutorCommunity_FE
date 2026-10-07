import { CLASS_LABELS, SESSION_LABELS, type ClassStatus, type SessionAttendance, type SessionStatus } from "../types/classes.types";
import { attendanceStateLabel } from "../utils/classes.utils";

const base = "inline-flex items-center rounded-full border px-3 py-1 text-xs font-bold leading-5";
const success = "border-secondary bg-secondary text-secondary-foreground";
const pending = "border-accent bg-accent text-accent-foreground";
const quiet = "border-border bg-card text-muted-foreground";

export function ClassStatusBadge({ status }: { status: ClassStatus }) {
  return <span className={`${base} ${status === "active" ? success : status === "upcoming" ? pending : quiet}`}>{CLASS_LABELS[status]}</span>;
}
export function SessionStatusBadge({ status }: { status: SessionStatus }) {
  return <span className={`${base} ${status === "ongoing" ? "border-primary bg-primary text-primary-foreground" : status === "completed" ? success : quiet}`}>{SESSION_LABELS[status]}</span>;
}
export function AttendanceStateBadge({ record }: { record?: SessionAttendance }) {
  return <span className={`${base} ${!record ? quiet : record.state === "confirmed" ? success : pending}`}>{attendanceStateLabel(record)}</span>;
}
