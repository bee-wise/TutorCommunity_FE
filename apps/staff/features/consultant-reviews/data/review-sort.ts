import type { PendingFieldChange, PendingProfile } from "../schemas/consultant-review.schema";

export type ReviewSort = "newest" | "oldest";

export function sortBySubmittedAt<T extends PendingProfile | PendingFieldChange>(
  items: readonly T[],
  sort: ReviewSort,
): T[] {
  const direction = sort === "newest" ? -1 : 1;
  return [...items].sort((a, b) => {
    const first = "submittedAt" in a ? a.submittedAt : a.requestedAt;
    const second = "submittedAt" in b ? b.submittedAt : b.requestedAt;
    const difference = Date.parse(first) - Date.parse(second);
    if (Number.isFinite(difference) && difference !== 0) return difference * direction;
    const firstId = "submittedAt" in a ? a.profileId : a.requestId;
    const secondId = "submittedAt" in b ? b.profileId : b.requestId;
    return firstId.localeCompare(secondId);
  });
}
