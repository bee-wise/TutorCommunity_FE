import type { GroupDto } from "@workspace/core/lms-classes/group.schemas";

export type TeachingMode = "ONLINE" | "OFFLINE";

export function normalizeSearch(value: string) {
  return value
    .toLocaleLowerCase("vi-VN")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/đ/g, "d")
    .trim();
}

// contextName is the subject, teachingItemName the level (same reading as the LMS class screens).
export function getClassSubject(item: GroupDto) {
  return (
    item.contextName?.trim() ||
    item.teachingItemName?.trim() ||
    item.programName?.trim() ||
    "Khác"
  );
}

// Catalog names and class names are compared ignoring case, accents and spacing.
export function nameKey(value?: string | null) {
  return normalizeSearch(value ?? "");
}

export function getClassLevel(item: GroupDto) {
  const level = item.teachingItemName?.trim();
  return level && level !== getClassSubject(item) ? level : undefined;
}

export function getTeachingModeLabel(mode?: string | null) {
  return mode === "ONLINE"
    ? "Online"
    : mode === "OFFLINE"
      ? "Trực tiếp"
      : "Chưa xác định";
}

// Opening time is stored in UTC; learners always see Vietnam time.
const VIETNAM_TIME_ZONE = "Asia/Ho_Chi_Minh";

export function formatOpeningDate(value?: string | null) {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? null
    : date.toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        timeZone: VIETNAM_TIME_ZONE,
      });
}

export function formatOpeningTime(value?: string | null) {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? null
    : date.toLocaleTimeString("vi-VN", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
        timeZone: VIETNAM_TIME_ZONE,
      });
}

export function getTotalHours(item: GroupDto) {
  const hours = (item.numberOfSessions * item.sessionDurationMinutes) / 60;
  return Number.isInteger(hours) ? String(hours) : hours.toFixed(1).replace(".", ",");
}

// Full-course classes are sold as one price; others are priced per session.
export function getPriceSummary(item: GroupDto) {
  const perSession = item.pricePerSession;
  if (item.billingMode === "FULL_COURSE") {
    const total = item.totalAmount || perSession * item.numberOfSessions;
    return { amount: total, unit: "/ cả khóa", note: null };
  }
  return { amount: perSession, unit: "/ buổi", note: getBillingLabel(item.billingMode) };
}

export function getBillingLabel(mode?: string | null) {
  return mode === "MONTHLY"
    ? "Thu theo tháng"
    : mode === "FULL_COURSE"
      ? "Thu cả khóa"
      : null;
}
