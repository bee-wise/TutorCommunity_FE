import { apiClient } from "@workspace/core/configs/client";
import { AIAnalyzeRequest, AIAnalyzeResponse } from "../types";
import { AIAnalyzeResponseSchema } from "../types/material.schemas";

export const aiAnalyze = async (
  data: AIAnalyzeRequest,
): Promise<AIAnalyzeResponse> => {
  const response: unknown = await apiClient.post<unknown, unknown>("/ai/lesson/analyze", data, { timeout: 180000 });
  const payload = typeof response === "object" && response !== null && "data" in response ? response.data : response;
  const parsed = AIAnalyzeResponseSchema.safeParse(payload);
  if (!parsed.success) throw new Error("API trả về nội dung tài liệu không đúng định dạng. Vui lòng thử lại.");
  return parsed.data;
};
