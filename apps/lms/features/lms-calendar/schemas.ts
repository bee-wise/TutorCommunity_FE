import { z } from "zod";

export const guid = z.guid();
export const dateTime = z.iso.datetime({ offset: true });
const text = z.string().nullish();
const count = z.number().int().nonnegative();

export const sessionStatusSchema = z.enum([
  "SCHEDULED",
  "IN_PROGRESS",
  "COMPLETED",
  "CANCELLED",
  "RESCHEDULED",
]);

export type SessionStatus = z.infer<typeof sessionStatusSchema>;

export const scheduleSourceSchema = z.enum(["SESSION", "PLANNED"]);
export type ScheduleSource = z.infer<typeof scheduleSourceSchema>;

export const lmsScheduleViewSchema = z.object({
  id: guid,
  classId: guid,
  source: scheduleSourceSchema.nullish().transform((v) => v ?? "SESSION"),
  startAt: dateTime,
  endAt: dateTime,
  status: z.string().nullish().transform((v) => {
    if (!v) return null;
    const upper = v.toUpperCase();
    if (upper === "ONGOING") return "IN_PROGRESS";
    return upper;
  }),
  classTitle: text,
  classType: text,
  name: text,
  description: text,
  version: count,
  plannedScheduleId: guid.nullish(),
  replacesSessionId: guid.nullish(),
  teachingOfferingId: guid.nullish(),
  programName: text,
  teachingItemName: text,
  contextName: text,
  tutorId: guid,
  tutorName: text,
  classCode: text,
  teachingMode: text,
  learnerId: guid.nullish(),
  learnerName: text,
  consultantId: guid.nullish(),
  consultantName: text,
  location: text,
});

export type LmsScheduleView = z.infer<typeof lmsScheduleViewSchema>;

export interface LmsOfficialSessionView extends LmsScheduleView {
  source: "SESSION";
}

export interface LmsPlannedScheduleView extends LmsScheduleView {
  source: "PLANNED";
}

export function isOfficialSession(
  item: LmsScheduleView,
): item is LmsOfficialSessionView {
  return item.source === "SESSION";
}

export function isPlannedSchedule(
  item: LmsScheduleView,
): item is LmsPlannedScheduleView {
  return item.source === "PLANNED";
}

export const lmsSchedulePageViewSchema = z.object({
  items: z
    .array(lmsScheduleViewSchema)
    .nullable()
    .transform((v) => v ?? []),
  total: count,
  page: z.number().int().positive(),
  pageSize: z.number().int().positive(),
});

export type LmsSchedulePageView = z.infer<typeof lmsSchedulePageViewSchema>;

export const lmsScheduleKpiViewSchema = z.object({
  date: z.string(),
  timeZoneId: text,
  sessionsToday: count,
  activeClasses: count,
  upcomingSessions: count,
});

export type LmsScheduleKpiView = z.infer<typeof lmsScheduleKpiViewSchema>;

export const lmsSessionJoinViewSchema = z.object({
  sessionId: guid,
  url: z
    .string()
    .url()
    .refine((u) => u.startsWith("https://"), {
      message: "Room URL must use HTTPS",
    })
    .nullable(),
});

export type LmsSessionJoinView = z.infer<typeof lmsSessionJoinViewSchema>;

export const calendarRangeSchema = z
  .object({
    from: dateTime,
    to: dateTime,
  })
  .refine(
    (data) => {
      const fromTime = new Date(data.from).getTime();
      const toTime = new Date(data.to).getTime();
      if (fromTime >= toTime) return false;
      const diffMs = toTime - fromTime;
      const maxMs = 32 * 24 * 60 * 60 * 1000;
      return diffMs <= maxMs;
    },
    {
      message: "Khoảng thời gian lịch tối đa 32 ngày và to phải lớn hơn from.",
    },
  );
