export type LearnerMaterialSource = "ai" | "upload";
export type LearnerMaterialFileType = "PDF" | "DOCX" | "PPTX" | "BEEWISE";
export type LearnerClassSessionStatus = "COMPLETED" | "UPCOMING" | "CANCELED";
export type SessionMaterialAvailability = "all" | "available" | "empty";

export interface LearnerClass {
  id: string;
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
  latestMaterialAt?: string;
}

