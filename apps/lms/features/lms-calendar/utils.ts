/**
 * Helper utilities for LMS personal calendar timezones and boundaries.
 * Vietnam timezone is Asia/Ho_Chi_Minh (+07:00).
 */

export const VIETNAM_TIMEZONE = "Asia/Ho_Chi_Minh";
export const VIETNAM_OFFSET = "+07:00";

function pad2(n: number): string {
  return n.toString().padStart(2, "0");
}

/**
 * Returns ISO strings with explicit +07:00 offset for the start of the month [from)
 * to the start of the next month [to), spanning 28-31 days (<= 32 days).
 *
 * @param year e.g. 2026
 * @param monthIndex 0 for January, 11 for December
 */
export function getMonthRangeIso(
  year: number,
  monthIndex: number,
): { from: string; to: string } {
  const fromY = year;
  const fromM = monthIndex + 1;

  let toY = year;
  let toM = fromM + 1;
  if (toM > 12) {
    toM = 1;
    toY += 1;
  }

  const from = `${fromY}-${pad2(fromM)}-01T00:00:00+07:00`;
  const to = `${toY}-${pad2(toM)}-01T00:00:00+07:00`;

  return { from, to };
}

/**
 * Parses an ISO date-time string and extracts Vietnam local year, month, day, hour, minute.
 */
export function parseVietnamDateTime(isoString: string): {
  year: number;
  month: number; // 1-12
  monthIndex: number; // 0-11
  day: number;
  hour: number;
  minute: number;
  dateKey: string; // "YYYY-MM-DD"
  timeString: string; // "HH:mm"
} {
  const d = new Date(isoString);
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: VIETNAM_TIMEZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(d);

  const map: Record<string, string> = {};
  for (const p of parts) {
    if (p.type !== "literal") {
      map[p.type] = p.value;
    }
  }

  const year = parseInt(map.year, 10);
  const month = parseInt(map.month, 10);
  const day = parseInt(map.day, 10);
  const hour = parseInt(map.hour, 10);
  const minute = parseInt(map.minute, 10);
  const dateKey = `${year}-${pad2(month)}-${pad2(day)}`;
  const timeString = `${pad2(hour)}:${pad2(minute)}`;

  return {
    year,
    month,
    monthIndex: month - 1,
    day,
    hour,
    minute,
    dateKey,
    timeString,
  };
}

/**
 * Returns today's date in Vietnam as "YYYY-MM-DD".
 */
export function getVietnamToday(): string {
  const d = new Date();
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: VIETNAM_TIMEZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(d);

  const map: Record<string, string> = {};
  for (const p of parts) {
    if (p.type !== "literal") map[p.type] = p.value;
  }
  return `${map.year}-${map.month}-${map.day}`;
}

/**
 * Formats subject display string as "contextName - teachingItemName" or fallback.
 */
export function formatLmsSubject(params?: {
  contextName?: string | null;
  teachingItemName?: string | null;
  classTitle?: string | null;
  fallback?: string;
} | null): string {
  if (!params) return "Môn học";
  const context = params.contextName?.trim();
  const teachingItem = params.teachingItemName?.trim();
  if (context && teachingItem) {
    return `${context} - ${teachingItem}`;
  }
  if (teachingItem) {
    return teachingItem;
  }
  if (context) {
    return context;
  }
  return params.classTitle?.trim() || params.fallback || "Môn học";
}

/** True once the session's Vietnam-local end (date "YYYY-MM-DD" + time "HH:mm") has passed. */
export function hasSessionEnded(date: string, endTime: string, now: number = Date.now()) {
  const end = new Date(`${date}T${endTime}:00+07:00`).getTime();
  return !Number.isNaN(end) && now >= end;
}
