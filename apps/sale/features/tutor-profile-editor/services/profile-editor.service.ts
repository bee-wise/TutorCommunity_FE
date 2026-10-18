import { apiClient } from "@workspace/core/configs/client";
import type { ApiResponse } from "@workspace/core/types/api-response.type";
import type { TutorProfileData } from "../../tutor-profile/types/tutor.type";
import type {
  TutorProfileEditorValues,
  TutorProfileMutationResult,
} from "../schemas/profile-editor.schema";
import type { ProfileMediaState } from "../types/profile-editor.types";

import { buildTutorProfileEditorPayload } from "../utils/build-editor-payload";
export { buildTutorProfileEditorPayload };

export const tutorProfileEditorService = {
  async getProfile(tutorProfileId?: string): Promise<TutorProfileData> {
    if (!tutorProfileId) {
      throw new Error("Không tìm thấy mã hồ sơ gia sư.");
    }
    try {
      const response = await apiClient.get<
        never,
        ApiResponse<TutorProfileData>
      >(`/tutors/${tutorProfileId}`);
      if (response?.data) return response.data;
    } catch {
      // Fallback: try /tutors/profile draft endpoint
      try {
        const draftRes = await apiClient.get<
          never,
          ApiResponse<TutorProfileData>
        >("/tutors/profile");
        if (draftRes?.data) return draftRes.data;
      } catch {
        throw new Error("Không thể tải thông tin hồ sơ gia sư. Vui lòng thử lại.");
      }
    }
    throw new Error("Dữ liệu hồ sơ gia sư không hợp lệ.");
  },

  async saveDraft(
    profile: TutorProfileEditorValues,
    media: ProfileMediaState,
    baseProfile?: Partial<TutorProfileData> | null,
  ): Promise<TutorProfileMutationResult> {
    const payload = buildTutorProfileEditorPayload(profile, media, baseProfile);
    const response = await apiClient.put<
      never,
      ApiResponse<TutorProfileMutationResult>
    >("/tutors/profile", payload);
    return (
      response?.data ?? {
        status: "PENDING_REVIEW",
        updatedAt: new Date().toISOString(),
      }
    );
  },

  async submitForReview(
    profile: TutorProfileEditorValues,
    media: ProfileMediaState,
    baseProfile?: Partial<TutorProfileData> | null,
  ): Promise<TutorProfileMutationResult> {
    const payload = buildTutorProfileEditorPayload(profile, media, baseProfile);
    const response = await apiClient.post<
      never,
      ApiResponse<TutorProfileMutationResult>
    >("/tutors/profile/submit", payload);
    return (
      response?.data ?? {
        status: "PENDING_REVIEW",
        updatedAt: new Date().toISOString(),
      }
    );
  },
};

