import { apiClient } from "@workspace/core/configs/client";
import type { ApiResponse } from "@workspace/core/types/api-response.type";
import type { TutorProfileData } from "../../tutor-profile/types/tutor.type";
import type { TutorProfileFormValues } from "../../tutor-profile-registration/schemas/profile-registration.schema";
import { tutorProfileRegistrationService } from "../../tutor-profile-registration/services/profile-registration.service";
import type { TutorProfileMutationResult } from "../../tutor-profile-registration/types/profile-registration.types";

/**
 * The editor reads and writes the same `/tutors/profile` resource as the
 * registration flow, so both share one payload contract (ids for university,
 * major and teaching offerings — never display names).
 */
export const tutorProfileEditorService = {
  getDraft(): Promise<TutorProfileFormValues | null> {
    return tutorProfileRegistrationService.getProfile();
  },

  async getPublicProfile(tutorProfileId: string): Promise<TutorProfileData> {
    const response = await apiClient.get<never, ApiResponse<TutorProfileData>>(
      `/tutors/${tutorProfileId}`,
    );
    if (!response?.data) throw new Error("Dữ liệu hồ sơ gia sư không hợp lệ.");
    return response.data;
  },

  saveDraft(
    values: TutorProfileFormValues,
    exists: boolean,
  ): Promise<TutorProfileMutationResult> {
    return tutorProfileRegistrationService.saveDraft(values, exists);
  },

  submitForReview(
    values: TutorProfileFormValues,
  ): Promise<TutorProfileMutationResult> {
    return tutorProfileRegistrationService.submit(values);
  },
};
