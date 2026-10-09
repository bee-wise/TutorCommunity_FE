export type LearnerMaterialSource = "ai" | "upload";
export type LearnerMaterialFileType = "PDF" | "DOCX" | "PPTX" | "BEEWISE";
export type LearnerClassSessionStatus = "COMPLETED" | "UPCOMING" | "CANCELED";
export type SessionMaterialAvailability = "all" | "available" | "empty";
export type LearnerClassKind = "individual" | "group";
export type LearnerClassStatus = "active" | "upcoming" | "completed";
export type LearnerClassSort = "newest" | "oldest" | "status";

export const LEARNER_CLASS_STATUS_LABELS: Record<LearnerClassStatus, string> = {
  active: "Đang học",
  upcoming: "Sắp khai giảng",
  completed: "Đã kết thúc",
};

export const LEARNER_SESSION_STATUS_LABELS: Record<LearnerClassSessionStatus, string> = {
  COMPLETED: "Đã hoàn thành",
  UPCOMING: "Sắp diễn ra",
  CANCELED: "Đã hủy",
};

export interface LearnerClass {
  id: string;
  title: string;
  code: string;
  kind: LearnerClassKind;
  status: LearnerClassStatus;
  subject: string;
  level: string;
  tutorName: string;
  tutorInitials: string;
  scheduleLabel: string;
  startedAt: string;
}

export interface LearnerClassSession {
  id: string;
  classId: string;
  sequence: number;
  topic: string;
  taughtAt: string;
  durationMinutes: number;
  status: LearnerClassSessionStatus;
}

export interface LearnerSharedMaterial {
  id: string;
  sessionId: string;
  title: string;
  description: string;
  source: LearnerMaterialSource;
  fileType: LearnerMaterialFileType;
  fileSize?: string;
  sharedAt: string;
  isNew?: boolean;
}

export interface LearnerClassSummary {
  classInfo: LearnerClass;
  sessionCount: number;
  completedSessionCount: number;
  materialCount: number;
  newMaterialCount: number;
  latestMaterialAt?: string;
}

export interface LearnerSessionSummary {
  session: LearnerClassSession;
  materialCount: number;
}

export interface ClassLibraryFilters {
  search: string;
  subject: string;
  kind: LearnerClassKind;
  status: "all" | LearnerClassStatus;
  sort: LearnerClassSort;
}

export interface ClassSessionFilters {
  search: string;
  status: "all" | LearnerClassSessionStatus;
  availability: SessionMaterialAvailability;
}

export interface SessionMaterialFilters {
  search: string;
  source: "all" | LearnerMaterialSource;
  fileType: "all" | LearnerMaterialFileType;
}

