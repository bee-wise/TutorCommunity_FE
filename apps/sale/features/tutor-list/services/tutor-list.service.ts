import { apiClient } from "@workspace/core/configs/client";
import { ApiResponse } from "@workspace/core/types/api-response.type";
import { AISearchQuery, ApiTutorProfile } from "../data/types";

export const tutorListService = {
  searchAI: async (params: AISearchQuery, signal?: AbortSignal): Promise<ApiResponse<{ items: ApiTutorProfile[] }>> => {
    const res = await apiClient.get("/ai/search-ai", {
      params,
      signal,
    });
    return res as unknown as ApiResponse<{ items: ApiTutorProfile[] }>;
  },
  searchManual: async (
    params: import("../data/types").ManualSearchQuery
  ): Promise<
    ApiResponse<{
      items: ApiTutorProfile[];
      pagination: {
        page: number;
        pageSize: number;
        totalItems: number;
        totalPages: number;
      };
    }>
  > => {
    const res = await apiClient.get("/tutors/search", {
      params,
    });
    return res as unknown as ApiResponse<{
      items: ApiTutorProfile[];
      pagination: {
        page: number;
        pageSize: number;
        totalItems: number;
        totalPages: number;
      };
    }>;
  },
};
