import { apiClient } from "@workspace/core/configs/client";
import type { GetTutorDetailResponse } from "../types/tutor.type";
import type {
  GetTutorViewsResponse,
  RecordTutorViewResponse,
} from "../types/tutor-views.type";

export const tutorProfileService = {
  getTutorDetail: async (
    tutorProfileId: string,
  ): Promise<GetTutorDetailResponse> => {
    return await apiClient.get(`/tutors/${tutorProfileId}`);
  },

  getTutorViews: async (
    tutorProfileId: string,
    signal?: AbortSignal,
  ): Promise<GetTutorViewsResponse> => {
    return await apiClient.get(`/tutors/${tutorProfileId}/views`, { signal });
  },

  recordTutorView: async (
    tutorProfileId: string,
    viewId: string,
  ): Promise<RecordTutorViewResponse> => {
    return await apiClient.post(`/tutors/${tutorProfileId}/views`, { viewId });
  },
};

