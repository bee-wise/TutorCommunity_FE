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
) {
  const role = normalizeAuthRole(user.role);
  const safeReturnUrl = getSafeInternalReturnUrl(options.returnUrl);

  if (role === "LEARNER") {
    return options.preferReturnUrl && safeReturnUrl ? safeReturnUrl : "/tutors";
  }

  if (role === "TUTOR") {
    if (user.canAccessTutorLms === true) return "/lms/tutor/dashboard";
    return "/tutor/onboarding";
  }

  if (role === "ADMIN" || role === "CONSULTANT") {
    return "/staff";
  }

  return safeReturnUrl ?? "/";
}
