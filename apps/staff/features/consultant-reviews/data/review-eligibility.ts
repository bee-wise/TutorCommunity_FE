export function hasReviewableValue(value: unknown): boolean {
  if (value === null || value === undefined) return false;
  if (typeof value === "string") return value.trim().length > 0;
  if (Array.isArray(value)) return value.length > 0;
  return true;
}

export function canRejectSubmittedField({
  submitted,
  reviewCount,
}: {
  submitted: boolean;
  reviewCount: number;
}): boolean {
  return reviewCount === 0 || submitted;
}

export function canSubmitProfileReview(
  pendingReview: boolean,
  reviewCount: number,
  resubmissionQueueReady: boolean,
): boolean {
  return pendingReview && (reviewCount === 0 || resubmissionQueueReady);
}
