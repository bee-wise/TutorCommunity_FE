import { z } from "zod";
import { apiClient } from "@workspace/core/configs/client";
import { tutorProfileSchema } from "../types/profile.schemas";

const responseSchema = z.object({ success: z.literal(true), data: tutorProfileSchema });

export async function getOwnTutorProfile(id: string, signal?: AbortSignal) {
  const response: unknown = await apiClient.get(`/tutors/${encodeURIComponent(id)}`, { signal });
  const parsed = responseSchema.safeParse(response);
  if (!parsed.success) throw new Error("Chưa đọc được thông tin hồ sơ gia sư. Vui lòng thử lại.");
  return parsed.data.data;
}
