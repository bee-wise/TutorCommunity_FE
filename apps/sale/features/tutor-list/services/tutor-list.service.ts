import { apiClient } from "@workspace/core/configs/client";
import type { ApiResponse } from "@workspace/core/types/api-response.type";
import type {
  AISearchQuery,
  ApiTutorProfile,
  ManualSearchQuery,
  TutorSearchResponse,
} from "../data/types";

export const tutorListService = {
  searchAI: async (
    params: AISearchQuery,
    signal?: AbortSignal,
  ): Promise<ApiResponse<{ items: ApiTutorProfile[] }>> => {
    return await apiClient.get("/ai/search-ai", {
      params,
      signal,
    });
  },

  searchManual: async (
    params: ManualSearchQuery,
  ): Promise<TutorSearchResponse> => {
    return await apiClient.get("/tutors/search", {
      params,
    });
  },
};
