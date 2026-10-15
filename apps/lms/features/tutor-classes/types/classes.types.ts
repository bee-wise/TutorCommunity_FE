import type { LmsClassDto } from "../schemas/lms-class.schema";

export type ClassKind = "individual" | "group";
export type ClassStatus = "active" | "upcoming" | "completed" | "pending_payment" | "cancelled" | "unknown";
export type SessionStatus = "scheduled" | "ongoing" | "completed" | "cancelled";
export type AttendanceStatus = "unmarked" | "present" | "absent";
export type AttendanceState = "draft" | "confirmed";

export interface TutorClass {
  id: string; code: string; title: string; subject: string; level: string;
  kind: ClassKind | "unknown"; status: ClassStatus; createdAt: string; learnerIds: string[];
  serverDetails?: LmsClassDto;
}
export interface ClassLearner {
  id: string; fullName: string; initials: string; gradeLevel: string;
  email: string | null; avatarUrl: string | null;
}
export interface TutorClassSession {
  id: string; classId: string; topic: string; taughtAt: string;
  durationMinutes: number; status: SessionStatus;
}
export interface TutorClassCardModel {
  classInfo: TutorClass;
  learners: readonly ClassLearner[];
  sessionCount: number;
  attendancePendingCount?: number;
  learnerCount?: number;
}
export interface AttendanceEntry { learnerId: string; status: AttendanceStatus; note: string }
export interface SessionAttendance {
  sessionId: string; classId: string; state: AttendanceState; version: number;
  entries: AttendanceEntry[]; updatedAt: string;
}
export interface AttendanceRevision { previous: SessionAttendance | null; next: SessionAttendance }
export interface ClassFilters {
  kind: ClassKind; search: string; status: "all" | Exclude<ClassStatus, "unknown">;
  sort: "newest" | "oldest" | "status";
}
export const CLASS_LABELS: Record<ClassStatus, string> = { active: "Đang học", upcoming: "Sắp khai giảng", completed: "Đã kết thúc", pending_payment: "Chờ thanh toán", cancelled: "Đã hủy", unknown: "Chưa xác định trạng thái" };
export const SESSION_LABELS: Record<SessionStatus, string> = { scheduled: "Chưa bắt đầu", ongoing: "Đang diễn ra", completed: "Đã hoàn thành", cancelled: "Đã hủy" };
export const ATTENDANCE_LABELS: Record<AttendanceStatus, string> = { unmarked: "Chưa điểm danh", present: "Có mặt", absent: "Vắng" };
