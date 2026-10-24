import type { GroupDto } from "@workspace/core/lms-classes/group.schemas";

export type TeachingMode = "ONLINE" | "OFFLINE";

export const SUBJECT_STYLES = [
  "bg-primary text-primary-foreground",
  "bg-accent text-accent-foreground",
  "bg-muted text-primary",
];

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

export function getClassLevel(item: GroupDto) {
  const level = item.teachingItemName?.trim();
  return level && level !== getClassSubject(item) ? level : undefined;
}

export function getLevelMark(item: GroupDto) {
  const source = `${getClassLevel(item) ?? ""} ${item.title ?? ""}`;
  if (/ielts/i.test(source)) return "IELTS";
  const grade = source.match(/\b(\d{1,2})\b/)?.[1];
  if (grade) return grade;
  return getClassSubject(item).slice(0, 2).toLocaleUpperCase("vi-VN");
}

export function getSubjectStyle(subject: string) {
  let hash = 0;
  for (const char of subject) hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
  return SUBJECT_STYLES[hash % SUBJECT_STYLES.length]!;
}

export function getTeachingModeLabel(mode?: string | null) {
  return mode === "ONLINE"
    ? "Online"
    : mode === "OFFLINE"
      ? "Trực tiếp"
      : "Chưa xác định";
}

export function formatOpeningDate(value?: string | null) {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? null
    : date.toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
}

export function getBillingLabel(mode?: string | null) {
  return mode === "MONTHLY"
    ? "Thu theo tháng"
    : mode === "FULL_COURSE"
      ? "Thu cả khóa"
      : null;
}
