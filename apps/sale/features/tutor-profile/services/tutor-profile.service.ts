import { apiClient } from "@workspace/core/configs/client";
import { GetTutorDetailResponse } from "../types/tutor.type";

export const tutorProfileService = {
  getTutorDetail: async (tutorProfileId: string): Promise<GetTutorDetailResponse> => {
    return await apiClient.get(`/tutors/${tutorProfileId}`);
  },
};
