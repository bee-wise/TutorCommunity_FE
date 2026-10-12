import { z } from "zod";
import { tutorProfileDraftResponseSchema } from "./profile-registration.schema";

export const tutorProfileReviewSchema = z.object({
  profileId: z.string().uuid(),
  status: z.string(),
  reviewedAt: z.string().nullish(),
  profile: tutorProfileDraftResponseSchema,
  rejectedFields: z.array(z.object({
    offeringId: z.string().nullish(),
    fieldName: z.string(),
    rejectionReason: z.string(),
  })).default([]),
  reviewCount: z.number().default(0),
  previouslyApprovedFields: z.array(z.object({
    fieldName: z.string(),
    approvedValue: z.string().nullish(),
    reviewedAt: z.string().nullish(),
  })).default([]),
});

export type TutorProfileReview = z.infer<typeof tutorProfileReviewSchema>;
