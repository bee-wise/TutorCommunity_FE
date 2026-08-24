import type { LearnerSession } from "../types/learner-schedule.types";

export const WEEKDAY_LABELS = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];

export function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

export function getMondayFirstOffset(year: number, month: number) {
  return (new Date(year, month, 1).getDay() + 6) % 7;
}

export function toCalendarDate(year: number, month: number, day: number) {
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

export function getSessionsForDay(sessions: LearnerSession[], date: string) {
  return sessions.filter((session) => session.date === date);
}

export function formatLearnerSessionDate(date: string) {
  return new Intl.DateTimeFormat("vi-VN", {
    weekday: "short",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(`${date}T12:00:00+07:00`));
}

