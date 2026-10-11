import { z } from "zod";

export const policySchema = z.object({
  version: z.string(),
  content: z.string(),
  confirmation_text: z.string(),
});
export const eligibilitySchema = z.object({
  state: z.enum(["NOT_STARTED", "READY", "IN_PROGRESS", "USED"]),
  interview_id: z.string().nullish(),
  consent_id: z.string().nullish(),
  attempts_used: z.number().int(),
  attempts_allowed: z.number().int(),
  policy_version: z.string().nullish(),
  resumable_interview_id: z.string().nullish(),
});
export const micCheckSchema = z.object({
  ok: z.boolean(),
  reason: z.string().nullish(),
  message: z.string().nullish(),
});
export const videoUploadSchema = z.object({
  url: z.url(),
  method: z.literal("PUT").default("PUT"),
  content_type: z.string(),
  key: z.string(),
});
export const promptSchema = z.object({
  q_code: z.string().min(1).max(10),
  kind: z.enum(["main", "followup"]),
  title: z.string(),
  group: z.string(),
  text: z.string(),
  question_number: z.number().int().positive(),
  total_questions: z.number().int().positive(),
  prep_seconds: z.number().int().nonnegative(),
  answer_seconds: z.number().int().positive(),
  video_upload: videoUploadSchema,
});
export const interviewStateSchema = z.object({
  interview_id: z.string(),
  status: z.string(),
  intro: z.string().nullish(),
  outro: z.string().nullish(),
  prompt: promptSchema.nullish(),
  all_answered: z.boolean().default(false),
  retry: z.boolean().default(false),
  retry_reason: z.string().nullish(),
  retry_message: z.string().nullish(),
});
export const statusSchema = z.object({
  interview_id: z.string(),
  status: z.string(),
});
export const consentRequestSchema = z.object({
  policy_version: z.string().min(1).max(50),
  checks: z.object({
    camera: z.literal(true),
    mic: z.literal(true),
    network: z.literal(true),
    time_confirmed: z.literal(true),
  }).strict(),
});
export const consentSchema = z.object({ consent_id: z.string() });
export const startRequestSchema = z.object({
  consent_id: z.guid(),
  video_mime: z.enum(["video/webm", "video/mp4"]),
});
export const answerMetadataSchema = z.object({
  q_code: z.string().min(1).max(10),
  kind: z.enum(["main", "followup"]),
  duration_ms: z.number().int().positive().max(900000),
});

export type InterviewPolicy = z.infer<typeof policySchema>;
export type InterviewEligibility = z.infer<typeof eligibilitySchema>;
export type InterviewPrompt = z.infer<typeof promptSchema>;
export type InterviewState = z.infer<typeof interviewStateSchema>;
export type ConsentRequest = z.infer<typeof consentRequestSchema>;
export type StartRequest = z.infer<typeof startRequestSchema>;
export type AnswerRequest = z.infer<typeof answerMetadataSchema> & {
  audio: Blob;
};
