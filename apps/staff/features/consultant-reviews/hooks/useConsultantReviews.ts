"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getApiErrorMessage } from "@workspace/core/sys-libs/error-handler";
import { toast } from "@workspace/ui/components/ui/bee-toast";
import {
  consultantReviewsApi,
  type ReviewListParams,
} from "../api/consultant-reviews.api";
import { consultantReviewKeys } from "../queryKeys";
import type { PendingFieldChange, ReviewSubmission } from "../schemas/consultant-review.schema";

export function useReviewList(params: ReviewListParams) {
  return useQuery({
    queryKey: consultantReviewKeys.list(params),
    queryFn: ({ signal }) => consultantReviewsApi.listAll(params, signal),
    staleTime: 30_000,
  });
}

export function useProfileReview(profileId: string) {
  return useQuery({
    queryKey: consultantReviewKeys.profile(profileId),
    queryFn: () => consultantReviewsApi.profile(profileId),
    enabled: Boolean(profileId),
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
