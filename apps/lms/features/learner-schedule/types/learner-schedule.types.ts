export type LearnerSessionStatus = "UPCOMING" | "COMPLETED" | "CANCELED";
export type LearnerScheduleView = "calendar" | "list";
export type LearnerCancellationReasonCode = "schedule_conflict" | "health" | "technical_issue" | "no_longer_needed" | "other";

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
  classroomLink: string;
  status: LearnerSessionStatus;
  notes?: string;
  cancellation?: LearnerSessionCancellation;
}

export interface LearnerScheduleFilters {
  subject: string;
  status: "all" | LearnerSessionStatus;
}

export const LEARNER_STATUS_LABELS: Record<LearnerSessionStatus, string> = {
  UPCOMING: "Sắp diễn ra",
  COMPLETED: "Đã hoàn thành",
  CANCELED: "Đã hủy",
};
