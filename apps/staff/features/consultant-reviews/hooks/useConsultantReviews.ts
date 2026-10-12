"use client";

import { useMemo } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getApiErrorMessage } from "@workspace/core/sys-libs/error-handler";
import { toast } from "@workspace/ui/components/ui/bee-toast";
import {
  consultantReviewsApi,
  type ReviewListParams,
  type ReviewCatalogResource,
} from "../api/consultant-reviews.api";
import { consultantReviewKeys } from "../queryKeys";
import type { PendingFieldChange, ReviewSubmission } from "../schemas/consultant-review.schema";

export function useReviewList(params: ReviewListParams, enabled = true, staleTime = 30_000, refreshOnFocus = false) {
  return useQuery({
    queryKey: consultantReviewKeys.list(params),
    queryFn: ({ signal }) => consultantReviewsApi.listAll(params, signal),
    enabled,
    staleTime,
    refetchOnWindowFocus: refreshOnFocus ? "always" : false,
  });
}

export function useReviewQueues(search: string) {
  const profileReviews = useReviewList({ queue: "profiles", search }, true, 30_000, true);
  const fieldReviews = useReviewList({ queue: "fieldChanges", search });

  const profileCounts = useMemo(() => {
    if (!profileReviews.data) return null;
    return (profileReviews.data.profiles ?? []).reduce(
      (counts, profile) => {
        if (profile.reviewCount === 0) counts.newProfiles += 1;
        else counts.resubmittedProfiles += 1;
        return counts;
      },
      { newProfiles: 0, resubmittedProfiles: 0 },
    );
  }, [profileReviews.data]);

  const tabCounts = {
    newProfiles: profileCounts?.newProfiles ?? null,
    resubmittedProfiles: profileCounts?.resubmittedProfiles ?? null,
    fieldChanges: fieldReviews.data ? (fieldReviews.data.fieldChanges ?? []).length : null,
  };

  function refreshQueues() {
    void Promise.all([profileReviews.refetch(), fieldReviews.refetch()]);
  }

  return { profileReviews, fieldReviews, tabCounts, refreshQueues };
}

export function useProfileReview(profileId: string) {
  return useQuery({
    queryKey: consultantReviewKeys.profile(profileId),
    queryFn: () => consultantReviewsApi.profile(profileId),
    enabled: Boolean(profileId),
    refetchOnWindowFocus: false,
  });
}

export function useReviewCatalogName(resource: ReviewCatalogResource, id: string) {
  return useQuery({
    queryKey: consultantReviewKeys.catalogName(resource, id),
    queryFn: () => consultantReviewsApi.catalogName(resource, id),
    enabled: Boolean(id),
    staleTime: 5 * 60 * 1000,
    retry: false,
  });
}

function useReviewMutation<T>(mutationFn: (input: T) => Promise<unknown>, successMessage: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: consultantReviewKeys.all });
      toast.success(successMessage);
    },
    onError: (error: unknown) => toast.error(getApiErrorMessage(error)),
  });
}

export function useSubmitProfileReview(profileId: string) {
  return useReviewMutation(
    (values: ReviewSubmission) => consultantReviewsApi.reviewProfile(profileId, values),
    "Đã gửi kết quả duyệt hồ sơ.",
  );
}

export type FieldReviewAction = {
  request: PendingFieldChange;
  decision: "approve" | "reject";
  reason: string;
  note: string;
};

export function useSubmitFieldReview() {
  return useReviewMutation(async ({ request, decision, reason, note }: FieldReviewAction) => {
    if (request.fieldName?.toLowerCase() === "teachingofferings" || request.targetTable?.toLowerCase().includes("teaching_offering")) {
      await consultantReviewsApi.reviewOfferingsChange(request, decision === "reject", reason, note);
    } else if (decision === "approve") {
      await consultantReviewsApi.approveFieldChange(request.requestId, note);
    } else {
      await consultantReviewsApi.rejectFieldChange(request.requestId, reason);
    }
  }, "Đã xử lý yêu cầu thay đổi.");
}
