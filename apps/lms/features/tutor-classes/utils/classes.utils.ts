import type { ClassFilters, ClassLearner, SessionAttendance, TutorClass, TutorClassCardModel, TutorClassSession } from "../types/classes.types";

const dateFormatter = new Intl.DateTimeFormat("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit", timeZone: "Asia/Ho_Chi_Minh" });
const dayFormatter = new Intl.DateTimeFormat("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric", timeZone: "Asia/Ho_Chi_Minh" });
export function formatClassDate(value: string) { return dateFormatter.format(new Date(value)); }
export function formatClassDay(value: string) { return dayFormatter.format(new Date(value)); }
export function formatClassIdentifier(value: string) {
  const identifier = value.trim().toUpperCase();
  if (/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(identifier)) {
    return identifier.slice(-8);
  }
  const generatedCode = /^([a-z]{2,8}-)[0-9a-f]{24,}$/i.exec(identifier);
  return generatedCode ? `${generatedCode[1]}${identifier.slice(-6)}` : identifier;
}
export function canMarkAttendance(classInfo: TutorClass, session: TutorClassSession) {
  return classInfo.id === session.classId && classInfo.status === "active" && (session.status === "ongoing" || session.status === "completed");
}
export function normalizeClassSearch(value: string) {
  return value.trim().toLocaleLowerCase("vi").normalize("NFD").replace(/[\u0300-\u036f]/g, "").replaceAll("đ", "d");
}
export function filterTutorClasses(classes: readonly TutorClass[], learners: readonly ClassLearner[], filters: ClassFilters) {
  const names = new Map(learners.map((learner) => [learner.id, learner.fullName]));
  const order = { active: 0, upcoming: 1, completed: 2, pending_payment: 3, cancelled: 4, unknown: 5 };
  const search = normalizeClassSearch(filters.search);
  return classes.filter((item) => item.kind === filters.kind && (filters.status === "all" || item.status === filters.status)
    && normalizeClassSearch(`${item.title} ${item.code} ${item.subject} ${item.learnerIds.map((id) => names.get(id) ?? "").join(" ")}`).includes(search))
    .sort((a, b) => filters.sort === "oldest" ? a.createdAt.localeCompare(b.createdAt) : filters.sort === "status" ? order[a.status] - order[b.status] || b.createdAt.localeCompare(a.createdAt) : b.createdAt.localeCompare(a.createdAt));
}
export function attendanceStateLabel(record?: SessionAttendance) {
  return !record ? "Chưa điểm danh" : record.state === "draft" ? "Bản nháp điểm danh" : "Đã xác nhận điểm danh";
}
export function getTutorClassCardModel(classInfo: TutorClass, learners: readonly ClassLearner[], sessions: readonly TutorClassSession[], records: Readonly<Record<string, SessionAttendance>>): TutorClassCardModel {
  const classSessions = sessions.filter((session) => session.classId === classInfo.id);
  return {
    classInfo,
    learners: learners.filter((learner) => classInfo.learnerIds.includes(learner.id)),
    sessionCount: classSessions.length,
    attendancePendingCount: classSessions.filter((session) => canMarkAttendance(classInfo, session) && records[session.id]?.state !== "confirmed").length,
  };
}
