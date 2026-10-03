import { z } from "zod";
import { apiClient } from "@workspace/core/configs/client";
import {
  profileReviewSchema,
  reviewListSchema,
  reviewSubmissionSchema,
  type PendingFieldChange,
  type PendingProfile,
  type ProfileReview,
  type ReviewList,
  type ReviewSubmission,
} from "../schemas/consultant-review.schema";

export type ReviewQueue = "profiles" | "fieldChanges";

export interface ReviewListParams {
  queue: ReviewQueue;
  search: string;
}

const REVIEW_BATCH_SIZE = 100;
const MAX_REVIEW_BATCHES = 100;

function unwrap<T extends z.ZodType>(response: unknown, schema: T): z.infer<T> {
  const envelope = z.object({
    success: z.boolean(),
    message: z.string().nullish(),
    data: z.unknown(),
  }).parse(response);
  if (!envelope.success) throw new Error(envelope.message || "Yêu cầu không thành công.");
  return schema.parse(envelope.data);
}

const fieldActionSchema = z.object({
  requestId: z.string().uuid(),
  status: z.string().nullish(),
  applied: z.boolean(),
  rejectionReason: z.string().nullish(),
});

const pathId = (id: string) => encodeURIComponent(id);

export const consultantReviewsApi = {
  async list(params: ReviewListParams, page: number, signal?: AbortSignal): Promise<ReviewList> {
    const response: unknown = await apiClient.get("/consultant/reviews", {
      signal,
      params: {
        page,
        pageSize: REVIEW_BATCH_SIZE,
        includeProfiles: params.queue === "profiles",
        includeFieldChanges: params.queue === "fieldChanges",
        ...(params.search.trim() ? { search: params.search.trim() } : {}),
      },
    });
    return unwrap(response, reviewListSchema);
  },

  async listAll(params: ReviewListParams, signal?: AbortSignal): Promise<ReviewList> {
    const profiles: PendingProfile[] = [];
    const fieldChanges: PendingFieldChange[] = [];

    for (let page = 1; page <= MAX_REVIEW_BATCHES; page += 1) {
      const batch = await this.list(params, page, signal);
      profiles.push(...(batch.profiles ?? []));
      fieldChanges.push(...(batch.fieldChanges ?? []));
      const count = params.queue === "profiles"
        ? batch.profiles?.length ?? 0
        : batch.fieldChanges?.length ?? 0;
      if (count < REVIEW_BATCH_SIZE) {
        return { page: 1, pageSize: REVIEW_BATCH_SIZE, profiles, fieldChanges };
      }
    }
    throw new Error("Hàng chờ quá lớn để sắp xếp đầy đủ. Vui lòng thu hẹp từ khóa tìm kiếm.");
  },

  async profile(profileId: string): Promise<ProfileReview> {
    const response: unknown = await apiClient.get(`/consultant/reviews/${pathId(profileId)}`);
    return unwrap(response, profileReviewSchema);
  },

  async reviewProfile(profileId: string, values: ReviewSubmission): Promise<ProfileReview> {
    const response: unknown = await apiClient.post(
      `/consultant/reviews/${pathId(profileId)}/review`,
      reviewSubmissionSchema.parse(values),
    );
    return unwrap(response, profileReviewSchema);
  },

  async approveFieldChange(requestId: string, note: string): Promise<void> {
    const response: unknown = await apiClient.post(
      `/consultant/field-changes/${pathId(requestId)}/approve`,
      { note: note.trim() || null },
    );
    unwrap(response, fieldActionSchema);
  },

  async rejectFieldChange(requestId: string, rejectionReason: string): Promise<void> {
    const response: unknown = await apiClient.post(
      `/consultant/field-changes/${pathId(requestId)}/reject`,
      { rejectionReason: rejectionReason.trim() },
    );
    unwrap(response, fieldActionSchema);
  },

  async reviewOfferingsChange(
    request: PendingFieldChange,
    rejected: boolean,
    reason: string,
    note: string,
  ): Promise<void> {
    const values: ReviewSubmission = {
      rejectedFields: rejected
        ? [{ fieldName: "teachingOfferings", rejectionReason: reason.trim() }]
        : [],
      note: note.trim() || null,
    };
    await apiClient.post(
      `/consultant/field-changes/${pathId(request.requestId)}/review`,
      reviewSubmissionSchema.parse(values),
    );
  },
};
