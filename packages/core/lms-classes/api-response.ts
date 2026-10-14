import { z } from "zod";
import { apiClient } from "@workspace/core/apiClient";
import { ApiError } from "@workspace/core/sys-libs/error-handler";
import { guid } from "./schemas";

export function classPath(id: string) {
  return `/lms/classes/${guid.parse(id)}`;
}
export function sessionPath(id: string) {
  return `/class-sessions/${guid.parse(id)}`;
}
export function parseLmsResponse<T>(schema: z.ZodType<T>, payload: unknown): T {
  const result = z
    .object({ success: z.literal(true), data: schema })
    .safeParse(payload);
  if (!result.success)
    throw new ApiError(
      "Dữ liệu LMS chưa đúng định dạng.",
      502,
      "LMS_CONTRACT_MISMATCH",
    );
  return result.data.data;
}
export async function getLmsResource<T>(
  path: string,
  schema: z.ZodType<T>,
  signal?: AbortSignal,
  params?: Record<string, unknown>,
) {
  return parseLmsResponse(
    schema,
    await apiClient.get<unknown, unknown>(path, {
      signal,
      params,
      withCredentials: true,
    }),
  );
}
export async function postLmsCommand<T>(
  path: string,
  schema: z.ZodType<T>,
  body?: unknown,
) {
  return parseLmsResponse(
    schema,
    await apiClient.post<unknown, unknown>(path, body, {
      withCredentials: true,
    }),
  );
}
export async function putLmsCommand<T>(
  path: string,
  schema: z.ZodType<T>,
  body: unknown,
) {
  return parseLmsResponse(
    schema,
    await apiClient.put<unknown, unknown>(path, body, {
      withCredentials: true,
    }),
  );
}
export function nullableList<T>(schema: z.ZodType<T>) {
  return z
    .array(schema)
    .nullable()
    .transform((v) => v ?? []);
}
