import { apiClient } from "@workspace/core/configs/client";
import { AIAnalyzeRequest, AIAnalyzeResponse } from "../types";

export const aiAnalyze = async (
  data: AIAnalyzeRequest,
): Promise<AIAnalyzeResponse> => {
  return apiClient
    .post<AIAnalyzeResponse>("/ai/lesson/analyze", data)
    .then((res) => res.data || res);
};
