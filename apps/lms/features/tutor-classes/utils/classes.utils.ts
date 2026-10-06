import type { ClassFilters, ClassLearner, SessionAttendance, TutorClass, TutorClassSession } from "../types/classes.types";

const dateFormatter = new Intl.DateTimeFormat("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit", timeZone: "Asia/Ho_Chi_Minh" });
export function formatClassDate(value: string) { return dateFormatter.format(new Date(value)); }
export function canMarkAttendance(classInfo: TutorClass, session: TutorClassSession) {
  return classInfo.id === session.classId && classInfo.status === "active" && (session.status === "ongoing" || session.status === "completed");
}
export function normalizeClassSearch(value: string) {
  return value.trim().toLocaleLowerCase("vi").normalize("NFD").replace(/[\u0300-\u036f]/g, "").replaceAll("đ", "d");
}
export function filterTutorClasses(classes: readonly TutorClass[], learners: readonly ClassLearner[], filters: ClassFilters) {
  const names = new Map(learners.map((learner) => [learner.id, learner.fullName]));
  const order = { active: 0, upcoming: 1, completed: 2 };
  const search = normalizeClassSearch(filters.search);
  return classes.filter((item) => item.kind === filters.kind && (filters.status === "all" || item.status === filters.status)
    && normalizeClassSearch(`${item.title} ${item.code} ${item.subject} ${item.learnerIds.map((id) => names.get(id) ?? "").join(" ")}`).includes(search))
    .sort((a, b) => filters.sort === "oldest" ? a.createdAt.localeCompare(b.createdAt) : filters.sort === "status" ? order[a.status] - order[b.status] || b.createdAt.localeCompare(a.createdAt) : b.createdAt.localeCompare(a.createdAt));
}
export function attendanceStateLabel(record?: SessionAttendance) {
  return !record ? "Chưa điểm danh" : record.state === "draft" ? "Bản nháp điểm danh" : "Đã xác nhận điểm danh";
}
