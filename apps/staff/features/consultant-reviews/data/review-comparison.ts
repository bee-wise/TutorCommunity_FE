import { profileSections, type ProfileFieldName } from "./profile-fields";
import { hasReviewableValue } from "./review-eligibility";
import type { ProfileReview } from "../schemas/consultant-review.schema";

export type ReviewFieldComparison = {
  status: "approved" | "changed" | "new" | "empty";
  previousValue?: unknown;
  reviewedAt?: string;
};

export type ReviewComparisons = Partial<Record<ProfileFieldName, ReviewFieldComparison>>;

function parseApprovedValue(value: string): unknown {
  try {
    return JSON.parse(value) as unknown;
  } catch {
    return value;
  }
}

function canonicalValue(value: unknown): string {
  if (value === null || value === undefined) return "null";
  if (Array.isArray(value)) {
    return `[${value.map(canonicalValue).sort().join(",")}]`;
  }
  if (typeof value === "object") {
    return `{${Object.entries(value)
      .filter(([, item]) => item !== undefined)
      .sort(([first], [second]) => first.localeCompare(second))
      .map(([key, item]) => `${JSON.stringify(key)}:${canonicalValue(item)}`)
      .join(",")}}`;
  }
  return JSON.stringify(value) ?? "null";
}

export function compareProfileReview(review: ProfileReview): ReviewComparisons | null {
  if (review.reviewCount === 0) return null;

  const approvedByField = new Map<string, ProfileReview["previouslyApprovedFields"][number]>();
  for (const approved of review.previouslyApprovedFields) {
    const previous = approvedByField.get(approved.fieldName);
    if (!previous || Date.parse(approved.reviewedAt) > Date.parse(previous.reviewedAt)) {
      approvedByField.set(approved.fieldName, approved);
    }
  }

  const comparisons: ReviewComparisons = {};
  for (const section of profileSections) {
    for (const field of section.fields) {
      const currentValue = review.profile[field];
      const approved = approvedByField.get(field);
      if (approved) {
        const previousValue = parseApprovedValue(approved.approvedValue);
        comparisons[field] = {
          status: (typeof currentValue === "string" && currentValue === approved.approvedValue) ||
            canonicalValue(currentValue) === canonicalValue(previousValue)
            ? "approved"
            : "changed",
          previousValue,
          reviewedAt: approved.reviewedAt,
        };
      } else {
        comparisons[field] = { status: hasReviewableValue(currentValue) ? "new" : "empty" };
      }
    }
  }
  return comparisons;
}
