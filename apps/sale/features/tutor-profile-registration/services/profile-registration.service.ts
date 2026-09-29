import { z } from "zod";
import { apiClient } from "@workspace/core/configs/client";
import { ApiError } from "@workspace/core/sys-libs/error-handler";
import type { ApiResponse } from "@workspace/core/types/api-response.type";
import {
  mapDraftResponseToFormValues,
  tutorProfileDraftResponseSchema,
  type TutorProfileFormValues,
} from "../schemas/profile-registration.schema";
import type {
  CatalogItem,
  CatalogResource,
  FileUploadResult,
  TutorProfileMutationResult,
} from "../types/profile-registration.types";
import { buildTutorProfileDraftPayload } from "../utils/build-draft-payload";

const catalogItemSchema = z.object({
  id: z.union([z.string(), z.number()]).transform(String),
  name: z.string(),
  source: z.string().default("BEEWISE"),
  isApproved: z.boolean().default(true),
  sortOrder: z.number().nullable().default(null),
});

function normalizeCatalogList(response: unknown): CatalogItem[] {
  if (!response) return [];
  if (Array.isArray(response)) {
    return response.map((item) => catalogItemSchema.parse(item));
  }
  if (typeof response === "object" && response !== null) {
    const res = response as Record<string, unknown>;
    const target =
      res.data ??
      res.items ??
      res.results ??
      res.universities ??
      res.majors ??
      res.subjects ??
      [];
    if (Array.isArray(target)) {
      return target.map((item) => catalogItemSchema.parse(item));
    }
    if (typeof target === "object" && target !== null) {
      const nested = target as Record<string, unknown>;
      const nestedList = nested.items ?? nested.data ?? nested.list ?? [];
      if (Array.isArray(nestedList)) {
        return nestedList.map((item) => catalogItemSchema.parse(item));
      }
    }
  }
  return [];
}

const catalogCreateResponseSchema = z.object({
  success: z.boolean().optional(),
  data: catalogItemSchema,
});

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
      const response = await apiClient.get<never, ApiResponse<unknown>>(
        "/tutors/profile",
      );
      if (!response.data) return null;
      const container = profileContainerSchema.safeParse(response.data);
      const rawDraft = container.success
        ? container.data.profile
        : response.data;
      const draft = tutorProfileDraftResponseSchema.parse(rawDraft);
      return mapDraftResponseToFormValues(draft);
    } catch (error) {
      if (error instanceof ApiError && error.statusCode === 404) return null;
      throw error;
    }
  },

  async saveDraft(
    profile: TutorProfileFormValues,
    exists: boolean,
  ): Promise<TutorProfileMutationResult> {
    const payload = buildTutorProfileDraftPayload(profile);
    const response = exists
      ? await apiClient.put<never, ApiResponse<TutorProfileMutationResult>>(
          "/tutors/profile",
          payload,
        )
      : await apiClient.post<never, ApiResponse<TutorProfileMutationResult>>(
          "/tutors/profile",
          payload,
        );
    return response.data ?? {};
  },

  async submit(
    profile: TutorProfileFormValues,
  ): Promise<TutorProfileMutationResult> {
    const response = await apiClient.post<
      never,
      ApiResponse<TutorProfileMutationResult>
    >("/tutors/profile/submit", profile);
    return response.data ?? {};
  },

  async listCatalog(
    resource: CatalogResource,
    search = "",
  ): Promise<CatalogItem[]> {
    try {
      const response = await apiClient.get<never, unknown>(`/${resource}`, {
        params: { search: search || undefined, limit: 50 },
      });
      return normalizeCatalogList(response);
    } catch {
      return [];
    }
  },

  async getCatalogItem(
    resource: CatalogResource,
    id: string,
  ): Promise<CatalogItem> {
    if (!id) throw new Error("Missing ID");
    try {
      const response = await apiClient.get<never, unknown>(
        `/${resource}/${id}`,
      );
      if (response && typeof response === "object") {
        const resObj = response as Record<string, unknown>;
        const rawData =
          "data" in resObj && resObj.data ? resObj.data : response;
        const target = Array.isArray(rawData) ? rawData[0] : rawData;
        if (target && typeof target === "object") {
          return catalogItemSchema.parse(target);
        }
      }
    } catch {
      // Fallback
    }

    try {
      const list = await tutorProfileRegistrationService.listCatalog(
        resource,
        "",
      );
      const found = list.find(
        (item) =>
          item.id === id || item.name.toLowerCase() === id.toLowerCase(),
      );
      if (found) return found;
    } catch {
      // ignore
    }

    return {
      id,
      name: id,
      source: "BEEWISE",
      isApproved: true,
      sortOrder: null,
    };
  },

  async proposeCatalog(
    resource: CatalogResource,
    name: string,
  ): Promise<CatalogItem> {
    const response = await apiClient.post<never, unknown>(`/${resource}`, {
      name: name.trim(),
    });
    return catalogCreateResponseSchema.parse(response).data;
  },

  async uploadImage(
    file: File,
    folder: string,
    existingUrl?: string,
  ): Promise<FileUploadResult> {
    const body = new FormData();
    body.append("file", file);
    body.append("folder", folder);
    if (existingUrl) body.append("existingUrl", existingUrl);
    const response = await apiClient.post<never, unknown>(
      "/files/upload",
      body,
      {
        headers: { "Content-Type": "multipart/form-data" },
      },
    );
    return normalizeUploadResponse(response);
  },

  async uploadVideo(
    file: File,
    folder: string,
    existingUrl?: string,
  ): Promise<FileUploadResult> {
    const body = new FormData();
    body.append("file", file);
    body.append("folder", folder);
    if (existingUrl) body.append("existingUrl", existingUrl);
    const response = await apiClient.post<never, unknown>(
      "/files/upload-video",
      body,
      {
        headers: { "Content-Type": "multipart/form-data" },
      },
    );
    return normalizeUploadResponse(response);
  },

  async deleteFile(fileUrl: string): Promise<void> {
    await apiClient.delete("/files", {
      params: { url: fileUrl },
    });
  },
};
