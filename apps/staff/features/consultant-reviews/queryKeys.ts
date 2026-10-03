import type { ReviewListParams } from "./api/consultant-reviews.api";

export const consultantReviewKeys = {
  all: ["consultant-reviews"] as const,
  list: (params: ReviewListParams) => [...consultantReviewKeys.all, "list", params] as const,
  profile: (id: string) => [...consultantReviewKeys.all, "profile", id] as const,
};
