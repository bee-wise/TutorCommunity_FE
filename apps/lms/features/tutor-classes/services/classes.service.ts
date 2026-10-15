import { z } from "zod";
import { apiClient } from "@workspace/core/apiClient";
import { ApiError } from "@workspace/core/sys-libs/error-handler";
import { lmsClassPageSchema, lmsClassQuerySchema, lmsClassSchema, type LmsClassQuery } from "../schemas/lms-class.schema";

function parseResponse<T>(schema: z.ZodType<T>, payload: unknown): T {
  const envelope = z.object({ success: z.literal(true), data: schema }).safeParse(payload);
  if (!envelope.success) {
    throw new ApiError("Dữ liệu lớp học không đúng contract. Vui lòng thử lại hoặc liên hệ hỗ trợ.", 502, "LMS_CLASS_CONTRACT_MISMATCH");
  }
  return envelope.data.data;
}

export function getClassQueryParams(query: LmsClassQuery) {
  const value = lmsClassQuerySchema.parse(query);
  return {
    Search: value.search || undefined, Status: value.status, Sort: value.sort,
    Page: value.page, PageSize: value.pageSize,
    TeachingOfferingId: value.teachingOfferingId, Type: value.type,
  };
}

export async function getTutorClasses(query: LmsClassQuery, signal?: AbortSignal) {
  const payload = await apiClient.get<unknown, unknown>("/lms/classes", {
    params: getClassQueryParams(query), signal, withCredentials: true,
  });
  return parseResponse(lmsClassPageSchema, payload);
}

export async function getTutorClassDetail(classId: string, signal?: AbortSignal) {
  const id = z.guid().parse(classId);
  const payload = await apiClient.get<unknown, unknown>(`/lms/classes/${encodeURIComponent(id)}`, {
    signal, withCredentials: true,
  });
  return parseResponse(lmsClassSchema, payload);
}
