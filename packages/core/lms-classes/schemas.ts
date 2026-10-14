import { z } from "zod";

// api-test Swagger, 13/10/2026. .NET Guid does not require RFC UUID bits.
export const guid = z.guid();
export const dateTime = z.iso.datetime({ offset: true });
const text = z.string().nullish();
const count = z.number().int().nonnegative();
const optionalDate = dateTime.nullish();
export const versionCommand = z.object({ expectedVersion: count });
export const slotSchema = z.object({
  startAt: dateTime,
  endAt: dateTime,
  locationOrMeetingInfo: text,
  plannedScheduleId: guid.nullish(),
});
export const sessionSchema = z.object({
  id: guid,
  classId: guid,
  tutorId: guid,
  learnerId: guid.nullish(),
  startAt: dateTime,
  endAt: dateTime,
  actualEndAt: optionalDate,
  teachingMode: text,
  locationOrMeetingInfo: text,
  status: text,
  replacesSessionId: guid.nullish(),
  plannedScheduleId: guid.nullish(),
  actualStartAt: optionalDate,
  version: count,
  durationMinutes: z.number(),
});
export const sessionPageSchema = z.object({
  items: z
    .array(sessionSchema)
    .nullable()
    .transform((v) => v ?? []),
  total: count,
  page: z.number().int().positive(),
  pageSize: z.number().int().positive(),
});
export const plannedSchema = z.object({
  id: guid,
  classId: guid,
  startAt: dateTime,
  endAt: dateTime,
  timeZoneId: text,
  status: text,
  version: count,
});
export const createPlannedSchema = z.object({
  id: guid,
  startAt: dateTime,
  endAt: dateTime,
  timeZoneId: z.string().min(1),
});
export const conflictSchema = z.object({
  candidateIndex: z.number().int(),
  existingId: guid,
  existingStartAt: dateTime,
  existingEndAt: dateTime,
  source: text,
});
export const previewSchema = z.object({
  sessions: z.array(slotSchema).nullish(),
  conflicts: z
    .array(conflictSchema)
    .nullable()
    .transform((v) => v ?? []),
});
export const scheduleResultSchema = z.object({
  sessions: z
    .array(sessionSchema)
    .nullable()
    .transform((v) => v ?? []),
  conflicts: z
    .array(conflictSchema)
    .nullable()
    .transform((v) => v ?? []),
});
export const batchSchema = z.object({
  sessions: z.array(slotSchema).min(1).max(100),
  submitKey: z.string().min(1).max(100),
});
export const rosterSchema = z.object({
  learnerId: guid,
  enrollmentId: guid,
  capturedAt: dateTime,
});
export const markSchema = z.object({
  learnerId: guid,
  status: z.enum(["UNMARKED", "PRESENT", "ABSENT"]),
  absenceType: text,
  note: z.string().max(1000).nullish(),
  isLate: z.boolean(),
  leftEarly: z.boolean(),
});
export const attendanceSchema = z.object({
  sessionId: guid,
  status: text,
  version: count,
  confirmedAt: optionalDate,
  marks: z
    .array(markSchema)
    .nullable()
    .transform((v) => v ?? []),
});
export const attendanceCommandSchema = versionCommand.extend({
  status: z.enum(["DRAFT", "CONFIRMED"]),
  marks: z.array(markSchema),
});
export const historySchema = z.object({
  actorId: guid,
  createdAt: dateTime,
  status: text,
  version: count,
  marks: z
    .array(markSchema)
    .nullable()
    .transform((v) => v ?? []),
});
export const recordingSchema = z.object({
  sessionId: guid,
  visibility: text,
  version: count,
  url: text,
  deletedAt: optionalDate,
});
export const httpsUrlSchema = z
  .string()
  .url()
  .refine((v) => new URL(v).protocol === "https:", "Dùng đường dẫn HTTPS.");
export const recordingCommandSchema = versionCommand.extend({
  url: httpsUrlSchema.nullable(),
  visibility: z.enum(["PUBLIC", "PRIVATE"]),
});
export const memberSchema = z.object({
  enrollmentId: guid,
  learnerId: guid,
  name: text,
  joinedAt: dateTime,
  leftAt: optionalDate,
});
export const currentMemberSchema = z.object({
  enrollmentId: guid,
  learnerId: guid,
  displayName: text,
  joinedAt: dateTime,
  avatarUrl: text,
  level: text,
});
export const memberChangeSchema = z.object({
  id: guid,
  classId: guid,
  learnerId: guid,
  operation: text,
  reason: text,
  status: text,
  requestedBy: guid,
  requestedAt: dateTime,
  reviewedBy: guid.nullish(),
  reviewedAt: optionalDate,
  reviewNote: text,
  cancelledAt: optionalDate,
  version: count,
});
export const createMemberChangeSchema = z.object({
  requestId: guid,
  learnerId: guid,
  operation: z.enum(["ADD", "REMOVE"]),
  reason: z.string().trim().min(1).max(1000),
});
export const reviewMemberChangeSchema = versionCommand
  .extend({
    decision: z.enum(["APPROVE", "REJECT"]),
    note: z.string().trim().max(1000),
  })
  .refine((v) => v.decision !== "REJECT" || Boolean(v.note), {
    path: ["note"],
    message: "Nhập ghi chú từ chối.",
  });
export const chatMessageSchema = z.object({
  id: guid,
  classId: guid,
  senderId: guid,
  content: text,
  createdAt: dateTime,
});
export const chatPageSchema = z.object({
  items: z
    .array(chatMessageSchema)
    .nullable()
    .transform((v) => v ?? []),
  nextCursor: guid.nullish(),
  hasMore: z.boolean(),
});
export const sendMessageSchema = z.object({
  messageId: guid,
  content: z.string().trim().min(1).max(2000),
});
export const subscriptionSchema = z.object({
  token: z.string().min(1),
  channel: z.string().min(1),
  expiresAt: dateTime,
});

export type ClassSessionDto = z.infer<typeof sessionSchema>;
export type PlannedDto = z.infer<typeof plannedSchema>;
export type AttendanceDto = z.infer<typeof attendanceSchema>;
export type AttendanceMarkDto = z.infer<typeof markSchema>;
export type MemberDto = z.infer<typeof currentMemberSchema>;
export type MemberChangeDto = z.infer<typeof memberChangeSchema>;
export type ChatMessageDto = z.infer<typeof chatMessageSchema>;
