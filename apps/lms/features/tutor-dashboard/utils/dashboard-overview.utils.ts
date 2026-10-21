import { parseVietnamDateTime, type LmsScheduleView } from "@workspace/core/lms-calendar";

const DAY_MS = 24 * 60 * 60 * 1000;
const WEEKDAY_LABELS = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"] as const;
const INACTIVE_STATUSES = new Set(["CANCELLED", "CANCELED", "RESCHEDULED"]);

export interface DashboardWeekDay {
  date: string;
  weekday: string;
  day: string;
  sessionCount: number;
  minutes: number;
  isToday: boolean;
}

function toUtcDate(date: string): Date {
  return new Date(`${date}T00:00:00Z`);
}

function toDateKey(value: Date): string {
  return value.toISOString().slice(0, 10);
}

/** Monday-based week containing `today` (YYYY-MM-DD in Vietnam time). */
export function getWeekDates(today: string): string[] {
  const base = toUtcDate(today);
  const offset = (base.getUTCDay() + 6) % 7;
  const monday = base.getTime() - offset * DAY_MS;
  return Array.from({ length: 7 }, (_, index) => toDateKey(new Date(monday + index * DAY_MS)));
}

export function getWeekRangeIso(weekDates: readonly string[]): { from: string; to: string } {
  const nextMonday = toDateKey(new Date(toUtcDate(weekDates[6]).getTime() + DAY_MS));
  return { from: `${weekDates[0]}T00:00:00+07:00`, to: `${nextMonday}T00:00:00+07:00` };
}

export function isActiveSession(item: Pick<LmsScheduleView, "status">): boolean {
  return !INACTIVE_STATUSES.has((item.status ?? "").toUpperCase());
}

export function buildWeekDays(
  items: readonly LmsScheduleView[],
  weekDates: readonly string[],
  today: string,
): DashboardWeekDay[] {
  const totals = new Map<string, { count: number; minutes: number }>();
  for (const item of items) {
    if (!isActiveSession(item)) continue;
    const key = parseVietnamDateTime(item.startAt).dateKey;
    const minutes = Math.max(0, Math.round((Date.parse(item.endAt) - Date.parse(item.startAt)) / 60000));
    const current = totals.get(key) ?? { count: 0, minutes: 0 };
    totals.set(key, { count: current.count + 1, minutes: current.minutes + minutes });
  }
  return weekDates.map((date) => {
    const total = totals.get(date);
    return {
      date,
      weekday: WEEKDAY_LABELS[toUtcDate(date).getUTCDay()],
      day: date.slice(8, 10),
      sessionCount: total?.count ?? 0,
      minutes: total?.minutes ?? 0,
      isToday: date === today,
    };
  });
}

export function formatDuration(minutes: number): string {
  if (minutes <= 0) return "0 giờ";
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  if (!hours) return `${rest} phút`;
  return rest ? `${hours} giờ ${rest} phút` : `${hours} giờ`;
}

export function formatHours(minutes: number): string {
  return `${Math.round((minutes / 60) * 10) / 10}`.replace(".", ",");
}

export function getGreeting(date = new Date()): string {
  const hour = Number(
    new Intl.DateTimeFormat("en-GB", { hour: "2-digit", hour12: false, timeZone: "Asia/Ho_Chi_Minh" }).format(date),
  );
  if (hour < 11) return "Chào buổi sáng";
  if (hour < 14) return "Chào buổi trưa";
  if (hour < 18) return "Chào buổi chiều";
  return "Chào buổi tối";
}

export function formatLongDate(date: string): string {
  return new Intl.DateTimeFormat("vi-VN", {
    weekday: "long",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    timeZone: "Asia/Ho_Chi_Minh",
  }).format(new Date(`${date}T12:00:00+07:00`));
}

export function formatRelativeTime(value: string, now = Date.now()): string {
  const diff = Math.max(0, now - Date.parse(value));
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return "Vừa xong";
  if (minutes < 60) return `${minutes} phút trước`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} giờ trước`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days} ngày trước`;
  return new Intl.DateTimeFormat("vi-VN", { day: "2-digit", month: "2-digit", timeZone: "Asia/Ho_Chi_Minh" }).format(new Date(value));
}
