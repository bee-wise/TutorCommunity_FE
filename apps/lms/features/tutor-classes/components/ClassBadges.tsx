import { CheckCircleIcon, ClockIcon, NoSymbolIcon, PlayCircleIcon } from "@heroicons/react/16/solid";
import { CLASS_LABELS, SESSION_LABELS, type ClassKind, type ClassStatus, type SessionAttendance, type SessionStatus } from "../types/classes.types";
import { attendanceStateLabel } from "../utils/classes.utils";

const base = "inline-flex shrink-0 items-center gap-1 rounded-full border px-2.5 py-0.5 text-[11px] font-bold leading-5 whitespace-nowrap";
// Match the benchmark's quiet status pills; dark copy keeps the current lime token readable.
const success = "border-secondary/25 bg-secondary/15 text-foreground";
const pending = "border-accent/30 bg-accent/25 text-warning";
const quiet = "border-border bg-card text-muted-foreground";

export function ClassStatusBadge({ status }: { status: ClassStatus }) {
  const Icon = status === "upcoming" ? ClockIcon : CheckCircleIcon;
  return <span className={`${base} ${status === "active" ? success : status === "upcoming" ? pending : quiet}`}><Icon className="size-3.5" aria-hidden="true" />{CLASS_LABELS[status]}</span>;
}
export function ClassKindBadge({ kind }: { kind: ClassKind }) {
  return <span className={`${base} border-border bg-card text-primary`}>{kind === "individual" ? "Lớp 1:1" : "Lớp nhóm"}</span>;
}
export function SessionStatusBadge({ status }: { status: SessionStatus }) {
  const Icon = status === "ongoing" ? PlayCircleIcon : status === "completed" ? CheckCircleIcon : status === "cancelled" ? NoSymbolIcon : ClockIcon;
  return <span className={`${base} ${status === "ongoing" ? "border-primary/20 bg-primary/10 text-primary" : status === "completed" ? success : status === "cancelled" ? "border-destructive/25 bg-card text-destructive" : quiet}`}><Icon className="size-3.5" aria-hidden="true" />{SESSION_LABELS[status]}</span>;
}
export function AttendanceStateBadge({ record }: { record?: SessionAttendance }) {
  const Icon = record?.state === "confirmed" ? CheckCircleIcon : ClockIcon;
  return <span className={`${base} ${!record ? quiet : record.state === "confirmed" ? success : pending}`}><Icon className="size-3.5" aria-hidden="true" />{attendanceStateLabel(record)}</span>;
}
