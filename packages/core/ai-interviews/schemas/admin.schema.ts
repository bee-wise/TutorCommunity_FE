import { z } from "zod";
import { policySchema } from "./tutor.schema";

export const policyRequestSchema = z.object({
  version: z.string().trim().min(1).max(50),
  content: z.string().min(1).max(100000),
  confirmation_text: z.string().min(1).max(4000),
});
export const policyItemSchema = policySchema.extend({
  is_active: z.boolean(),
  created_by: z.string(),
  created_at: z.string(),
});
export const policyCreatedSchema = z.object({
  version: z.string(),
  is_active: z.boolean(),
});
export const rubricSummarySchema = z.object({
  version: z.string(),
  is_active: z.boolean(),
  is_default: z.boolean().default(false),
  note: z.string().nullable(),
  created_by: z.string(),
  created_at: z.string(),
});
export const rubricDetailSchema = z.object({
  version: z.string(),
  is_active: z.boolean(),
  note: z.string().nullable(),
  content: z.record(z.string(), z.unknown()),
});
export type PolicyRequest = z.infer<typeof policyRequestSchema>;
