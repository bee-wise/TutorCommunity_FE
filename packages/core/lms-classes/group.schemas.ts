import { z } from "zod";
import { guid, dateTime, versionCommand } from "./schemas";

const text = z.string().nullish();
const integer = z.number().int().nonnegative();
const optionalDate = dateTime.nullish();
export const roadmapLessonSchema = z.object({
  id: guid,
  title: z.string().trim().min(1),
  content: text,
  order: integer,
});
export const roadmapStageSchema = z.object({
  id: guid,
  title: z.string().trim().min(1),
  objective: text,
  order: integer,
  lessons: z
    .array(roadmapLessonSchema)
    .nullable()
    .transform((v) => v ?? []),
});
export const groupDraftSchema = z.object({
  title: z.string().trim().min(1).max(200),
  description: text,
  teachingOfferingId: guid,
  teachingMode: z.enum(["ONLINE", "OFFLINE"]),
  location: text,
  openingAt: optionalDate,
  capacity: z.number().int().min(2),
  billingMode: z.enum(["MONTHLY", "FULL_COURSE"]),
  sessionDurationMinutes: z.number().int().positive(),
  numberOfSessions: z.number().int().positive(),
  pricePerSession: z.number().int().positive(),
  highlight: text,
});
export const groupSchema = groupDraftSchema.extend({
  title: text,
  teachingMode: text,
  billingMode: text,
  capacity: integer,
  sessionDurationMinutes: integer,
  numberOfSessions: integer,
  pricePerSession: z.number(),
  id: guid,
  code: text,
  tutorId: guid,
  programName: text,
  teachingItemName: text,
  contextName: text,
  totalAmount: z.number(),
  approvalStatus: text,
  status: text,
  isPublished: z.boolean(),
  assignedConsultantId: guid.nullish(),
  approvalNote: text,
  version: integer,
  roadmap: z
    .array(roadmapStageSchema)
    .nullable()
    .transform((v) => v ?? []),
});
export const createGroupSchema = z.object({
  id: guid,
  draft: groupDraftSchema,
});
export const updateGroupSchema = versionCommand.extend({
  draft: groupDraftSchema,
});
export const roadmapCommandSchema = versionCommand
  .extend({
    stages: z.array(
      roadmapStageSchema.extend({ lessons: z.array(roadmapLessonSchema) }),
    ),
  })
  .superRefine((v, ctx) => {
    const ids = [
      ...v.stages.map((s) => s.id),
      ...v.stages.flatMap((s) => s.lessons.map((l) => l.id)),
    ];
    if (new Set(ids).size !== ids.length)
      ctx.addIssue({
        code: "custom",
        message: "ID lộ trình phải khác nhau.",
        path: ["stages"],
      });
    for (const items of [v.stages, ...v.stages.map((s) => s.lessons)]) {
      if (new Set(items.map((i) => i.order)).size !== items.length)
        ctx.addIssue({
          code: "custom",
          message: "Thứ tự không được trùng.",
          path: ["stages"],
        });
    }
  });
export const reviewGroupSchema = versionCommand
  .extend({
    decision: z.enum(["APPROVE", "REJECT", "REQUEST_CHANGES"]),
    reason: z.string().trim().max(1000),
  })
  .refine((v) => v.decision === "APPROVE" || Boolean(v.reason), {
    path: ["reason"],
    message: "Nhập lý do.",
  });
export const groupHistorySchema = z.object({
  actorId: guid,
  action: text,
  changes: text,
  createdAt: dateTime,
});
export const lifecycleSchema = z.object({
  classId: guid,
  status: text,
  version: integer,
});
export const firstMonthFeeSchema = z.object({
  month: z.iso.date(),
  amount: z.number().nullish(),
  platformFeeAmount: z.number().nullish(),
  tutorAmount: z.number().nullish(),
  status: text,
  acceptedAt: optionalDate,
  reviewedAt: optionalDate,
});
export const admissionSchema = z.object({
  id: guid,
  classId: guid,
  learnerId: guid,
  status: text,
  version: integer,
  trialStartAt: optionalDate,
  trialEndAt: optionalDate,
  trialMeetingInfo: text,
  trialCompletedAt: optionalDate,
  missedLessonsAcknowledgedAt: optionalDate,
  enrollmentId: guid.nullish(),
  missedSessionIds: z
    .array(guid)
    .nullable()
    .transform((v) => v ?? []),
  referredByTutorId: guid.nullish(),
  firstMonthFee: firstMonthFeeSchema.nullish(),
});
export const referSchema = z.object({ admissionId: guid, learnerId: guid });
export const joinSchema = z.object({
  admissionId: guid,
  acknowledgeMissedLessons: z.boolean(),
});
export const trialSchema = versionCommand
  .extend({ startAt: dateTime, endAt: dateTime, meetingInfo: text })
  .refine((v) => Date.parse(v.endAt) > Date.parse(v.startAt), {
    path: ["endAt"],
    message: "Giờ kết thúc phải sau giờ bắt đầu.",
  });
export const feeCommandSchema = versionCommand.extend({
  amount: z.number().int().positive(),
});
export const reviewFeeSchema = versionCommand.extend({
  decision: z.enum(["APPROVE", "REJECT"]),
});
export const paymentSchema = z.object({
  id: guid,
  admissionId: guid,
  chargeKey: text,
  orderCode: z.number().int(),
  amount: z.number(),
  status: text,
  checkoutUrl: text,
  expiresAt: dateTime,
  paidAt: optionalDate,
  platformFeeAmount: z.number().nullish(),
  tutorAmount: z.number().nullish(),
});
export const paymentCommandSchema = z.object({
  month: z.iso
    .date()
    .refine((v) => v.endsWith("-01"), "Chọn ngày đầu tháng.")
    .nullable(),
});
export type GroupDto = z.infer<typeof groupSchema>;
export type GroupDraft = z.infer<typeof groupDraftSchema>;
export type AdmissionDto = z.infer<typeof admissionSchema>;
export type GroupPaymentDto = z.infer<typeof paymentSchema>;
export type RoadmapStage = z.infer<typeof roadmapStageSchema>;
