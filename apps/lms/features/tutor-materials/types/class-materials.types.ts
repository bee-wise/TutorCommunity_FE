import type { AIAnalyzeResponse, LibraryMaterialStatus, TutorMaterial } from "../types";

export type ClassKind = "individual" | "group";
export type ClassStatus = "active" | "upcoming" | "completed";
export type ClassSort = "newest" | "oldest" | "status";
export interface MaterialClass {
  id: string;
  code: string;
  title: string;
  subject: string;
  level: string;
  kind: ClassKind;
  status: ClassStatus;
  createdAt: string;
  learnerIds: string[];
}
export interface ClassSession {
  id: string;
  classId: string;
  topic: string;
  taughtAt: string;
  durationMinutes: number;
  completed: boolean;
  zoomTranscript?: string;
}
export interface ClassMaterial extends Omit<TutorMaterial, "learnerId"> {
  classId: string;
  data?: AIAnalyzeResponse;
  hasLocalFile?: boolean;
}
export interface AIJob {
  id: string;
  classId: string;
  sessionId: string;
  startedAt: number;
  status: "running" | "ready" | "error";
  materialId?: string;
  error?: string;
}
export const CLASS_STATUS_LABELS: Record<ClassStatus, string> = {
  active: "Đang học", upcoming: "Sắp khai giảng", completed: "Đã kết thúc",
};
export const MATERIAL_STATUS_LABELS: Record<LibraryMaterialStatus, string> = {
  draft: "Bản nháp", published: "Đã xuất bản", hidden: "Đang ẩn",
};
