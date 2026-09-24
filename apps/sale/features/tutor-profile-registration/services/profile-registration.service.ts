import { z } from "zod";
import { apiClient } from "@workspace/core/configs/client";
import { ApiError } from "@workspace/core/sys-libs/error-handler";
import type { ApiResponse } from "@workspace/core/types/api-response.type";
import {
  mapDraftResponseToFormValues,
  tutorProfileDraftResponseSchema,
  type TutorProfileFormValues,
} from "../schemas/profile-registration.schema";
import type { CatalogItem, CatalogResource, FileUploadResult, TutorProfileMutationResult } from "../types/profile-registration.types";

const catalogItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  source: z.string().default("BEEWISE"),
  isApproved: z.boolean().default(true),
  sortOrder: z.number().nullable().default(null),
});

const catalogResponseSchema = z.object({ success: z.boolean(), data: z.array(catalogItemSchema).default([]) });
const catalogCreateResponseSchema = z.object({ success: z.boolean(), data: catalogItemSchema });

const uploadResponseSchema = z.object({
  success: z.boolean(),
  data: z.union([
    z.string().url(),
    z.object({
      url: z.string().url().optional(),
      fileUrl: z.string().url().optional(),
    }),
  ]),
});

const profileContainerSchema = z.object({ profile: z.unknown() }).passthrough();

function normalizeUploadResponse(response: unknown): FileUploadResult {
  const parsed = uploadResponseSchema.parse(response);
  if (typeof parsed.data === "string") return { url: parsed.data };
  const url = parsed.data.url ?? parsed.data.fileUrl;
  if (!url) throw new Error("Máy chủ không trả về đường dẫn tệp.");
  return { url };
}

export const tutorProfileRegistrationService = {
  async getProfile(): Promise<TutorProfileFormValues | null> {
    try {
      const response = await apiClient.get<never, ApiResponse<unknown>>("/tutors/profile");
      if (!response.data) return null;
      const container = profileContainerSchema.safeParse(response.data);
      const rawDraft = container.success ? container.data.profile : response.data;
      const draft = tutorProfileDraftResponseSchema.parse(rawDraft);
      return mapDraftResponseToFormValues(draft);
    } catch (error) {
      if (error instanceof ApiError && error.statusCode === 404) return null;
      throw error;
    }
  },

  async saveDraft(profile: TutorProfileFormValues, exists: boolean): Promise<TutorProfileMutationResult> {
    const response = exists
      ? await apiClient.put<never, ApiResponse<TutorProfileMutationResult>>("/tutors/profile", profile)
      : await apiClient.post<never, ApiResponse<TutorProfileMutationResult>>("/tutors/profile", profile);
    return response.data ?? {};
  },

  async submit(profile: TutorProfileFormValues): Promise<TutorProfileMutationResult> {
    const response = await apiClient.post<never, ApiResponse<TutorProfileMutationResult>>("/tutors/profile/submit", profile);
    return response.data ?? {};
  },

  async listCatalog(resource: CatalogResource, search = ""): Promise<CatalogItem[]> {
    const response = await apiClient.get<never, unknown>(`/${resource}`, { params: { search: search || undefined, limit: 20 } });
    return catalogResponseSchema.parse(response).data;
  },

  async getCatalogItem(resource: CatalogResource, id: string): Promise<CatalogItem> {
    const response = await apiClient.get<never, unknown>(`/${resource}/${id}`);
    const parsed = z.object({ success: z.boolean(), data: catalogItemSchema }).parse(response);
    return parsed.data;
  },

  async proposeCatalog(resource: CatalogResource, name: string): Promise<CatalogItem> {
    const response = await apiClient.post<never, unknown>(`/${resource}`, { name: name.trim() });
    return catalogCreateResponseSchema.parse(response).data;
  },

  async uploadImage(file: File, folder: string, existingUrl?: string): Promise<FileUploadResult> {
    const body = new FormData();
    body.append("file", file);
    body.append("folder", folder);
    if (existingUrl) body.append("existingUrl", existingUrl);
    const response = await apiClient.post<never, unknown>("/files/upload", body, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return normalizeUploadResponse(response);
  },

  async uploadVideo(file: File, folder: string, existingUrl?: string): Promise<FileUploadResult> {
    const body = new FormData();
    body.append("file", file);
    body.append("folder", folder);
    if (existingUrl) body.append("existingUrl", existingUrl);
    const response = await apiClient.post<never, unknown>("/files/upload-video", body, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return normalizeUploadResponse(response);
  },

  async deleteFile(fileUrl: string): Promise<void> {
    await apiClient.delete("/files", {
      params: { url: fileUrl },
    });
  },
};
