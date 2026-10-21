import type { LmsScheduleView } from "@/features/lms-calendar";
import {
  parseVietnamDateTime,
  formatLmsSubject,
} from "@/features/lms-calendar";

export type LearnerSessionStatus =
  | "UPCOMING"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "CANCELED"
  | "RESCHEDULED";

export type LearnerScheduleView = "calendar" | "list";

export type LearnerCancellationReasonCode =
  | "schedule_conflict"
  | "health"
  | "technical_issue"
  | "no_longer_needed"
  | "other";

export interface LearnerCancellationRequest {
  reasonCode: LearnerCancellationReasonCode;
  reasonText: string;
}

export interface LearnerSessionCancellation extends LearnerCancellationRequest {
  canceledAt: string;
  canceledBy: "LEARNER";
}

export interface LearnerSession {
  id: string;
  classId?: string;
  classCode: string;
  subject: string;
  level: string;
  topic: string;
  tutorName: string;
  tutorInitials: string;
  consultantName: string;
  date: string;
  startTime: string;
  endTime: string;
  startAt?: string;
  endAt?: string;
  classroomLink?: string;
  teachingMode?: string;
  status: LearnerSessionStatus;
  rawStatus?: string;
  source?: "SESSION" | "PLANNED";
  version?: number;
  notes?: string;
  cancellation?: LearnerSessionCancellation;
  rawItem?: LmsScheduleView;
}

export interface LearnerScheduleFilters {
  subject: string;
  status: "all" | LearnerSessionStatus;
}

export const LEARNER_STATUS_LABELS: Record<LearnerSessionStatus, string> = {
  UPCOMING: "Sắp diễn ra",
  IN_PROGRESS: "Đang diễn ra",
  COMPLETED: "Đã hoàn thành",
  CANCELED: "Đã hủy",
  RESCHEDULED: "Đã đổi lịch",
};

export function mapLmsScheduleViewToLearnerSession(
  item: LmsScheduleView,
): LearnerSession {
  const parsedStart = parseVietnamDateTime(item.startAt);
  const parsedEnd = parseVietnamDateTime(item.endAt);

  let status: LearnerSessionStatus = "UPCOMING";
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

  const tutorName = item.tutorName || "Gia sư";
  const nameParts = tutorName.trim().split(/\s+/);
  const tutorInitials =
    nameParts.length >= 2
      ? (nameParts[0][0] + nameParts[nameParts.length - 1][0]).toUpperCase()
      : tutorName.slice(0, 2).toUpperCase();

  return {
    id: item.id,
    classId: item.classId,
    classCode: item.classCode ?? "",
    subject: formatLmsSubject(item),
    level: item.programName || item.contextName || "Khóa học",
    topic: item.name || item.description || "Nội dung buổi học",
    tutorName,
    tutorInitials,
    consultantName: item.consultantName || "Chưa phân công",
    date: parsedStart.dateKey,
    startTime: parsedStart.timeString,
    endTime: parsedEnd.timeString,
    startAt: item.startAt,
    endAt: item.endAt,
    teachingMode: item.teachingMode ?? "ONLINE",
    status,
    rawStatus: item.status ?? undefined,
    source: item.source ?? "SESSION",
    version: item.version,
    notes: item.description ?? undefined,
    rawItem: item,
  };
}
