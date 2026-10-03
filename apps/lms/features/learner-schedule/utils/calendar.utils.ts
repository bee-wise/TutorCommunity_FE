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

const VI_WEEKDAYS = [
  "Chủ nhật",
  "Thứ 2",
  "Thứ 3",
  "Thứ 4",
  "Thứ 5",
  "Thứ 6",
  "Thứ 7",
];

export function formatLearnerSessionDate(date: string) {
  const [yearStr, monthStr, dayStr] = date.split("-");
  const year = parseInt(yearStr, 10);
  const month = parseInt(monthStr, 10) - 1;
  const day = parseInt(dayStr, 10);

  if (isNaN(year) || isNaN(month) || isNaN(day)) {
    return date;
  }

  const d = new Date(year, month, day);
  const weekday = VI_WEEKDAYS[d.getDay()];
  const formattedDay = String(day).padStart(2, "0");
  const formattedMonth = String(month + 1).padStart(2, "0");

  return `${weekday}, ${formattedDay}/${formattedMonth}/${year}`;
}

