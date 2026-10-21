export const lmsCalendarKeys = {
  all: ["lms-personal-calendar"] as const,
  actor: (role: string) => ["lms-personal-calendar", role] as const,
  calendar: (role: string, params: unknown) =>
    ["lms-personal-calendar", role, "calendar", params] as const,
  sessions: (role: string, params: unknown) =>
    ["lms-personal-calendar", role, "sessions", params] as const,
  upcoming: (role: string) =>
    ["lms-personal-calendar", role, "upcoming"] as const,
  detail: (role: string, id: string) =>
    ["lms-personal-calendar", role, "detail", id] as const,
  kpis: (role: string) =>
    ["lms-personal-calendar", role, "kpis"] as const,
};
