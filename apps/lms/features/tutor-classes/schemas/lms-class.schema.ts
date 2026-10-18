import { z } from "zod";

export const lmsClassLearnerPreviewSchema = z.object({
  id: z.guid(),
  avatarUrl: z.string().nullish(),
});
export type LmsClassLearnerPreview = z.infer<typeof lmsClassLearnerPreviewSchema>;

// Source: api-test.beewise.vn/swagger/v1/swagger.json, LmsClassView/Page (13/10/2026).
// Swagger leaves type/status as nullable strings. Unknown values stay read-only
// in the UI instead of being silently classified as an active/individual class.
// BE uses .NET Guid, including seeded hashes without RFC UUID version/variant bits.
// Live list/detail accept those IDs; z.uuid() would reject valid BE records.
export const lmsClassSchema = z.object({
  id: z.guid(),
  type: z.string().nullish(),
  teachingOfferingId: z.guid().nullish(),
  programName: z.string().nullish(),
  teachingItemName: z.string().nullish(),
  contextName: z.string().nullish(),
  tutorId: z.guid(),
  tutorName: z.string().nullish(),
  tutorAvatarUrl: z.string().nullish(),
  learners: z.array(lmsClassLearnerPreviewSchema).nullish(),
  teachingMode: z.string().nullish(),
  status: z.string().nullish(),
  capacity: z.number().int().nonnegative(),
  activeMembers: z.number().int().nonnegative(),
  pricePerHour: z.number(),
  sessionDurationMinutes: z.number().int().nonnegative(),
  numberOfSessions: z.number().int().nonnegative(),
  createdAt: z.iso.datetime({ offset: true }),
  title: z.string().nullish(),
  code: z.string().nullish(),
  approvalStatus: z.string().nullish(),
  billingMode: z.string().nullish(),
  openingAt: z.iso.datetime({ offset: true }).nullish(),
  sessionCount: z.number().int().nonnegative(),
  learnerCount: z.number().int().nonnegative(),
  features: z.object({ feedback: z.boolean(), attendance: z.boolean() }),
});

export const lmsClassPageSchema = z.object({
  items: z.array(lmsClassSchema).nullable().transform((items) => items ?? []),
  total: z.number().int().nonnegative(),
  page: z.number().int().min(1),
  pageSize: z.number().int().min(1).max(100),
});

export const lmsClassQuerySchema = z.object({
  search: z.string().trim().max(100).optional(),
  status: z.enum(["PENDING_PAYMENT", "UPCOMING", "ACTIVE", "COMPLETED", "CANCELLED"]).optional(),
  sort: z.enum(["NEWEST", "OLDEST", "TEACHING_ITEM", "STATUS", "STATUS_DESC"]).default("NEWEST"),
  page: z.number().int().min(1).max(100000).default(1),
  pageSize: z.number().int().min(1).max(100).default(6),
  teachingOfferingId: z.guid().optional(),
  type: z.enum(["INDIVIDUAL", "GROUP"]).optional(),
});

export type LmsClassDto = z.infer<typeof lmsClassSchema>;
export type LmsClassPage = z.infer<typeof lmsClassPageSchema>;
export type LmsClassQuery = z.infer<typeof lmsClassQuerySchema>;
