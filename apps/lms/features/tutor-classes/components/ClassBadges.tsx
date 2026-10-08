import { CLASS_LABELS, SESSION_LABELS, type ClassStatus, type SessionAttendance, type SessionStatus } from "../types/classes.types";
import { attendanceStateLabel } from "../utils/classes.utils";

const base = "inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-bold leading-5";
const success = "border-secondary/30 bg-secondary/10 text-foreground/80";
const pending = "border-accent/40 bg-accent/15 text-warning";
const quiet = "border-border bg-muted/40 text-muted-foreground";

export function ClassStatusBadge({ status }: { status: ClassStatus }) {
  return <span className={`${base} ${status === "active" ? success : status === "upcoming" ? pending : quiet}`}>{CLASS_LABELS[status]}</span>;
}
export function SessionStatusBadge({ status }: { status: SessionStatus }) {
  return <span className={`${base} ${status === "ongoing" ? "border-primary/20 bg-primary/5 text-primary" : status === "completed" ? success : status === "cancelled" ? "border-destructive/20 bg-destructive/5 text-destructive" : quiet}`}>{SESSION_LABELS[status]}</span>;
}
export function AttendanceStateBadge({ record }: { record?: SessionAttendance }) {
  return <span className={`${base} ${!record ? quiet : record.state === "confirmed" ? success : pending}`}>{attendanceStateLabel(record)}</span>;
}
