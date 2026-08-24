export type LearnerSessionStatus = "UPCOMING" | "COMPLETED" | "CANCELED";

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

