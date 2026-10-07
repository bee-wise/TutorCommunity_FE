import { z } from "zod";
import { apiClient } from "../configs/client";
import type { ApiResponse } from "../types/api-response.type";

const tutorReadinessSchema = z.object({
  isReady: z.boolean().default(false),
  isPublic: z.boolean().default(false),
  availabilityTimeCompleted: z.boolean().default(false),
  bankInformationCompleted: z.boolean().default(false),
  missingConditions: z.array(z.string()).default([]),
}).passthrough();

export type TutorReadiness = z.infer<typeof tutorReadinessSchema>;
export const tutorReadinessQueryKey = (userId: string | undefined) =>
  ["tutor-profile", "readiness", userId] as const;

export async function getTutorReadiness(): Promise<TutorReadiness> {
  const response = await apiClient.get<never, ApiResponse<unknown>>(
    "/tutors/profile/readiness",
  );
  return tutorReadinessSchema.parse(response.data);
}
