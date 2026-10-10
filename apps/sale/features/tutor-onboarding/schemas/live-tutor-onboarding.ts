import type { MeType } from "@workspace/core/types/auth.type";
import type { TutorOnboardingScenario } from "../types";

const statusScenarioMap = {
  ACCOUNT_CREATED: "journey",
  DRAFT: "journey",
  PROFILE_DRAFT: "journey",
  PROFILE_SUBMITTED: "pending-review",
  INTERVIEW_PENDING: "pending-review",
  PENDING_REVIEW: "pending-review",
  INTERVIEW_COMPLETED: "pending-review",
  PENDING_VERIFICATION: "pending-review",
  REJECTED: "rejected",
  APPROVED: "approved",
  POST_APPROVAL_INFO_REQUIRED: "post-approval",
  COMPLETED: "completed",
} as const satisfies Record<string, TutorOnboardingScenario>;

type KnownStatus = keyof typeof statusScenarioMap;

const laterOnboardingStatuses = new Set<KnownStatus>([
  "INTERVIEW_COMPLETED",
  "PENDING_VERIFICATION",
  "REJECTED",
  "APPROVED",
  "POST_APPROVAL_INFO_REQUIRED",
  "COMPLETED",
]);

function normalizeStatus(status?: string | null): string {
  return status?.trim().toUpperCase() ?? "";
}

function isKnownStatus(status: string): status is KnownStatus {
  return Object.hasOwn(statusScenarioMap, status);
}

export function resolveLiveTutorOnboardingScenario(
  user: Pick<
    MeType,
    | "tutorOnboardingStatus"
    | "tutorProfileStatus"
    | "onboardingStatus"
    | "canAccessTutorLms"
    | "isInterviewed"
  >,
): TutorOnboardingScenario | "unknown" {
  if (user.canAccessTutorLms === true) return "completed";

  const profileStatus = normalizeStatus(user.tutorProfileStatus);
  const detailedStatuses = [
    normalizeStatus(user.tutorOnboardingStatus),
    normalizeStatus(user.onboardingStatus),
  ];
  const laterStatus = detailedStatuses.find(
    (status): status is KnownStatus =>
      isKnownStatus(status) && laterOnboardingStatuses.has(status),
  );
  const status =
    laterStatus ??
    (isKnownStatus(profileStatus) ? profileStatus : undefined) ??
    detailedStatuses.find(isKnownStatus);

  if (status) {
    // A stale COMPLETED status must not unlock the LMS while BE denies access.
    if (status === "COMPLETED") return "post-approval";

    if (profileStatus === "REJECTED" || status === "REJECTED") {
      return "rejected";
    }

    if (status === "POST_APPROVAL_INFO_REQUIRED") return "post-approval";

    // Profile approval is the prerequisite for entering the AI interview.
    // An onboarding status alone must not unlock it while the profile is pending.
    if (profileStatus === "APPROVED") {
      return user.isInterviewed === true ? "post-approval" : "interview";
    }

    const isInterviewStageStatus =
      status === "PROFILE_SUBMITTED" ||
      status === "INTERVIEW_PENDING" ||
      status === "PENDING_REVIEW" ||
      status === "INTERVIEW_COMPLETED" ||
      status === "PENDING_VERIFICATION" ||
      status === "APPROVED";

    if (isInterviewStageStatus) {
      return "pending-review";
    }

    return statusScenarioMap[status];
  }

  return [profileStatus, ...detailedStatuses].some(Boolean)
    ? "unknown"
    : "journey";
}
