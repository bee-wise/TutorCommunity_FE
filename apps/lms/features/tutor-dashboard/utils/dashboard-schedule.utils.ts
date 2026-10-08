import type { Session } from "@/features/tutor-schedule/types/schedule.types";

export function getUpcomingDashboardSessions(sessions: readonly Session[]): Session[] {
  return sessions.filter((session) => session.status === "UPCOMING")
    .sort((a, b) => `${a.date}T${a.startTime}`.localeCompare(`${b.date}T${b.startTime}`) || a.id.localeCompare(b.id));
}

export function dashboardDateLabel(date: string): string {
  const [year, month, day] = date.split("-");
  return `${day}/${month}/${year}`;
}

export function dashboardWeekday(date: string): string {
  return new Intl.DateTimeFormat("vi-VN", { weekday: "short", timeZone: "Asia/Ho_Chi_Minh" }).format(new Date(`${date}T12:00:00+07:00`));
}
