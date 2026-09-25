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

  if (app === "LMS") {
    if (role === "TUTOR") {
      return "/lms/tutor/dashboard";
    }
    if (role === "LEARNER") {
      return "/lms/learner";
    }
    return "/";
  }

  if (app === "STAFF") {
    if (role === "ADMIN") {
      return "/admin";
    }
    if (role === "CONSULTANT") {
      return "/consultant";
    }
    return "/";
  }

  // Mặc định hoặc app === "SALE"
  if (role === "LEARNER") {
    return options.preferReturnUrl && safeReturnUrl ? safeReturnUrl : "/tutors";
  }

  if (role === "TUTOR") {
    return options.preferReturnUrl && safeReturnUrl
      ? safeReturnUrl
      : resolveTutorLoginDestination(user);
  }

  if (role === "ADMIN" || role === "CONSULTANT") {
    return "/staff";
  }

  return "/";
}

export function resolveTutorLoginDestination(user: MeType) {
  if (user.canAccessTutorLms) {
    return "/tutor/home";
  }

  if (user.tutorProfileStatus === "APPROVED") {
    if (user.bankInformationCompleted && user.availabilityCompleted) {
      return "/tutor/home";
    }
    return "/tutor/post-approval";
  }

  return "/tutor/onboarding";
}
