import type { LmsScheduleView } from "@workspace/core/lms-calendar";
import {
  parseVietnamDateTime,
  formatLmsSubject,
} from "@workspace/core/lms-calendar";

export type SessionStatus =
  | "UPCOMING"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "CANCELED"
  | "RESCHEDULED";

export type ViewMode = "calendar" | "list";

export interface Session {
  id: string;
  classId: string;
  classCode?: string;
  classType?: string;
  source?: "SESSION" | "PLANNED";
  version?: number;
  subject: string;
  subjectLevel: string; // e.g. "12", "B2", "11"
  studentName: string; // first name only (for badge)
  studentFullName: string;
  consultantName: string;
  date: string; // ISO date string: "YYYY-MM-DD"
  startTime: string; // "14:00"
  endTime: string; // "15:30"
  startAt?: string;
  endAt?: string;
  classroomLink?: string;
  teachingMode?: string;
  location?: string;
  status: SessionStatus;
  rawStatus?: string;
  feeVnd?: number;
  notes?: string;
  plannedScheduleId?: string | null;
  replacesSessionId?: string | null;
  rawItem?: LmsScheduleView;
}

export interface FilterState {
  subject: string;
  status: string;
}

export const STATUS_LABELS: Record<SessionStatus, string> = {
  UPCOMING: "Sắp diễn ra",
  IN_PROGRESS: "Đang diễn ra",
  COMPLETED: "Đã hoàn thành",
  CANCELED: "Đã hủy",
  RESCHEDULED: "Đã đổi lịch",
};

export const STATUS_COLORS: Record<
  SessionStatus,
  { bg: string; text: string; border: string; dot: string }
> = {
  UPCOMING: {
    bg: "bg-accent/20",
    text: "text-warning",
    border: "border-accent/40",
    dot: "bg-warning",
  },
  IN_PROGRESS: {
    bg: "bg-card",
    text: "text-primary",
    border: "border-primary",
    dot: "bg-primary",
  },
  COMPLETED: {
    bg: "bg-secondary/15",
    text: "text-foreground",
    border: "border-secondary/30",
    dot: "bg-secondary",
  },
  CANCELED: {
    bg: "bg-muted",
    text: "text-muted-foreground",
    border: "border-border",
    dot: "bg-muted-foreground",
  },
  RESCHEDULED: {
    bg: "bg-card",
    text: "text-muted-foreground",
    border: "border-dashed border-border",
    dot: "bg-muted-foreground",
  },
};

export const SUBJECT_OPTIONS = [
  { value: "all", label: "Tất cả môn" },
  { value: "Toán", label: "Toán" },
  { value: "Tiếng Anh", label: "Tiếng Anh" },
  { value: "Vật Lý", label: "Vật Lý" },
  { value: "Hóa Học", label: "Hóa Học" },
];

export const STATUS_OPTIONS = [
  { value: "all", label: "Tất cả trạng thái" },
  { value: "SCHEDULED", label: "Sắp diễn ra" },
  { value: "IN_PROGRESS", label: "Đang diễn ra" },
  { value: "COMPLETED", label: "Đã hoàn thành" },
  { value: "CANCELLED", label: "Đã hủy" },
  { value: "RESCHEDULED", label: "Đã đổi lịch" },
];

export function mapLmsScheduleViewToTutorSession(
  item: LmsScheduleView,
): Session {
  const parsedStart = parseVietnamDateTime(item.startAt);
  const parsedEnd = parseVietnamDateTime(item.endAt);

  let status: SessionStatus = "UPCOMING";
  const upperStatus = (item.status ?? "").toUpperCase();
  if (upperStatus === "COMPLETED") {
    status = "COMPLETED";
  } else if (upperStatus === "CANCELLED" || upperStatus === "CANCELED") {
    status = "CANCELED";
  } else if (upperStatus === "IN_PROGRESS" || upperStatus === "ONGOING") {
    status = "IN_PROGRESS";
  } else if (upperStatus === "RESCHEDULED") {
    status = "RESCHEDULED";
  } else {
    status = "UPCOMING";
  }

  const studentFullName =
    item.learnerName ||
    (item.classType === "GROUP" ? "Lớp học nhóm" : "Chưa có học viên");
  const studentParts = studentFullName.trim().split(/\s+/);
  const studentName = studentParts[studentParts.length - 1] || studentFullName;

  return {
    id: item.id,
    classId: item.classId,
    classCode: item.classCode ?? item.classId.slice(0, 8),
    classType: item.classType ?? "INDIVIDUAL",
    source: item.source ?? "SESSION",
    version: item.version,
    subject: formatLmsSubject(item),
    subjectLevel: item.programName || "",
    studentName,
    studentFullName,
    consultantName: item.consultantName || "Chưa phân công",
    date: parsedStart.dateKey,
    startTime: parsedStart.timeString,
    endTime: parsedEnd.timeString,
    startAt: item.startAt,
    endAt: item.endAt,
    teachingMode: item.teachingMode ?? "ONLINE",
    location: item.location ?? "",
    status,
    rawStatus: item.status ?? undefined,
    notes: item.description ?? undefined,
    plannedScheduleId: item.plannedScheduleId,
    replacesSessionId: item.replacesSessionId,
    rawItem: item,
  };
}
