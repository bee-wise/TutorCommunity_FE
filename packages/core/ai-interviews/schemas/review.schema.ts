import { z } from "zod";

const jsonObject = z.record(z.string(), z.unknown());
const nullableText = z.string().nullable();
export const interviewListItemSchema = z.object({
  interview_id: z.string(),
  tutor_id: z.string(),
  status: z.string(),
  overall_score: z.number().nullable(),
  manual_review_required: z.boolean(),
  started_at: z.string(),
  submitted_at: nullableText,
  last_activity_at: z.string(),
});
export const summarySchema = z.object({
  overall_score: z.number().nullable(),
  max_score: z.number().default(100),
  score_complete: z.boolean(),
  assessment_level: nullableText,
  requires_human_review: z.boolean(),
  human_review_reasons: z.array(z.string()),
  questions: z.array(
    z.object({
      q_code: z.string(),
      title: z.string(),
      points: z.number().nullable(),
      max_points: z.number(),
    }),
  ),
});
const evidenceSchema = z.object({
  q_code: z.string(),
  quote: z.string(),
  type: z.string(),
});
export const criterionSchema = z.object({
  criterion_code: z.string(),
  description: z.string(),
  weight: z.number(),
  levels: z.array(z.string()),
  score_status: z.string().nullish(),
  score: z.number().nullish(),
  confidence: z.number().nullish(),
  probabilities: z.record(z.string(), z.number()).nullish(),
  coverage: z.number().nullish(),
  effective_score: z.number().nullish(),
  evidence: z.array(evidenceSchema).default([]),
  rationale: z.string().nullish(),
  comment: z.string().nullish(),
  needs_review: z.boolean().nullish(),
  review_reasons: z.array(z.string()).default([]),
  override_level: z.number().nullish(),
  override_reason: z.string().nullish(),
});
const turnSchema = z.object({
  question: z.string(),
  transcript: nullableText,
  clarity_p: z.number().nullable(),
  followup: nullableText,
  followup_transcript: nullableText,
  video_url: nullableText,
  audio_url: nullableText,
  followup_video_url: nullableText,
  followup_audio_url: nullableText,
  needs_review: z.boolean(),
  review_reasons: z.array(z.string()),
});
export const questionSchema = z.object({
  q_code: z.string(),
  title: z.string(),
  objective: z.string(),
  max_points: z.number(),
  points: z.number().nullable(),
  turn: turnSchema.nullable(),
  criteria: z.array(criterionSchema),
});
const policyInfoSchema = z.object({
  status: z.string(),
  version: z.string(),
  confirmed_at: z.string(),
});
export const reportSchema = z.object({
  summary: summarySchema.nullish(),
  data_conflicts: z
    .array(
      z.object({
        q_code: z.string(),
        criterion_codes: z.array(z.string()),
        interview_quote: z.string(),
        profile: z.object({
          fact_id: z.string(),
          label: z.string(),
          text: z.string(),
        }),
        note: z.string(),
        status: z.string(),
      }),
    )
    .default([]),
  strengths: z.array(z.string()).default([]),
  improvements: z.array(z.string()).default([]),
  verification_required: z
    .array(
      z.object({
        q_code: z.string(),
        claim: z.string(),
        what_to_verify: z.string(),
        evidence_type: z.string(),
      }),
    )
    .default([]),
  question_comments: z.record(z.string(), z.string()).default({}),
  items_to_check: z
    .array(
      z.object({
        scope: z.enum(["turn", "criterion"]),
        ref: z.string(),
        reasons: z.array(z.string()),
      }),
    )
    .default([]),
  policy: policyInfoSchema.nullish(),
  final_decision: z.string().default("PENDING"),
});
export const packageSchema = z.object({
  interview: z.object({
    interview_id: z.string(),
    tutor_id: z.string(),
    status: z.string(),
    rubric_version: z.string(),
    language: z.string(),
    overall_score: z.number().nullable(),
    manual_review_required: z.boolean(),
    started_at: z.string(),
    submitted_at: nullableText,
  }),
  summary: summarySchema.nullable(),
  report: reportSchema.nullable(),
  questions: z.array(questionSchema),
  decisions: z.array(
    z.object({
      id: z.number(),
      decision: z.string(),
      reason: nullableText,
      feedback: nullableText,
      details: jsonObject.nullable(),
      consultant_id: z.string(),
      created_at: z.string(),
      synced_at: nullableText,
    }),
  ),
  tutor: jsonObject.nullable(),
  tutor_error: nullableText,
});
export const reasonSchema = z
  .string()
  .trim()
  .min(3, "Lý do cần ít nhất 3 ký tự.")
  .max(2000);
export const overrideRequestSchema = z.object({
  criterion_code: z.string().min(1),
  new_level: z.number().int().min(0).max(4),
  reason: reasonSchema,
});
export const decisionRequestSchema = z
  .object({
    decision: z.enum(["APPROVED", "NEEDS_REVISION", "REJECTED"]),
    reason: z.string().trim().max(4000).default(""),
    feedback: z.string().trim().max(4000).default(""),
    details: jsonObject.nullish(),
  })
  .refine((value) => value.decision === "APPROVED" || value.reason.length > 0, {
    path: ["reason"],
    message: "Vui lòng nhập lý do yêu cầu bổ sung hoặc từ chối.",
  });
export const attemptGrantRequestSchema = z.object({
  previous_interview_id: z.guid(),
  reason: reasonSchema,
});
export const auditLogSchema = z.object({
  id: z.number(),
  actor_id: nullableText,
  actor_role: z.string(),
  action: z.string(),
  data: jsonObject.nullable(),
  reason: nullableText,
  created_at: z.string(),
});
export type InterviewListItem = z.infer<typeof interviewListItemSchema>;
export type InterviewPackage = z.infer<typeof packageSchema>;
export type InterviewQuestion = z.infer<typeof questionSchema>;
export type InterviewCriterion = z.infer<typeof criterionSchema>;
export type InterviewReport = z.infer<typeof reportSchema>;
export type DecisionRequest = z.infer<typeof decisionRequestSchema>;
export type OverrideRequest = z.infer<typeof overrideRequestSchema>;
export type AttemptGrantRequest = z.infer<typeof attemptGrantRequestSchema>;
