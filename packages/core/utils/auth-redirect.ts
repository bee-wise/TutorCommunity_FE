import { toast } from "@workspace/ui/components/ui/bee-toast";
import type { MeType } from "../types/auth.type";

export function normalizeAuthRole(role?: string | null) {
  return role?.trim().toUpperCase() ?? "";
}

export function getSafeInternalReturnUrl(returnUrl?: string | null) {
  if (!returnUrl) return null;

  try {
    const decoded = decodeURIComponent(returnUrl);

    if (!decoded.startsWith("/") || decoded.startsWith("//")) return null;
    if (decoded.startsWith("/login") || decoded.startsWith("/register")) {
      return null;
    }

    return decoded;
  } catch {
    return null;
  }
}

export function getRoleRedirectPath(
  user: MeType,
  options: { returnUrl?: string | null; preferReturnUrl?: boolean } = {},
  app?: "SALE" | "LMS" | "STAFF",
) {
  const role = normalizeAuthRole(user.role);
  const safeReturnUrl = getSafeInternalReturnUrl(options.returnUrl);

  if (app === "SALE") {
    if (role === "LEARNER") {
      return options.preferReturnUrl && safeReturnUrl
        ? safeReturnUrl
        : "/tutors";
    }
    if (role === "TUTOR") {
      return options.preferReturnUrl && safeReturnUrl
        ? safeReturnUrl
        : resolveTutorLoginDestination(user);
    }
  }

  if (app === "LMS") {
    if (role === "TUTOR") {
      return "/lms/tutor/dashboard";
    }

    if (role === "LEARNER") {
      return "/lms/learner";
    }
  }

  if (app === "STAFF") {
    if (role === "ADMIN") {
      return "/admin";
    } else {
      return "/consultant";
    }
  }

  return "/";
}

export function resolveTutorLoginDestination(user: MeType) {
  const completeProfile =
    user.role === "TUTOR" && user.tutorProfileStatus === "APPROVED";

  return completeProfile ? "/tutor/post-approval" : "/tutor/onboarding";
}
