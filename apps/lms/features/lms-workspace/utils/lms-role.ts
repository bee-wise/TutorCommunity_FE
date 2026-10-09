export type LmsRole = "TUTOR" | "LEARNER";

export function normalizeLmsRole(role: unknown): LmsRole | null {
  if (typeof role !== "string") return null;
  const normalized = role.trim().toUpperCase();
  return normalized === "TUTOR" || normalized === "LEARNER"
    ? normalized
    : null;
}

export function getLmsRoleFromToken(token?: string): LmsRole | null {
  if (!token) return null;

  try {
    const payload = token.split(".")[1];
    if (!payload) return null;
    const decoded = JSON.parse(atob(payload.replace(/-/g, "+").replace(/_/g, "/")));
    return normalizeLmsRole(decoded?.role);
  } catch {
    return null;
  }
}

export function getLmsRoleRedirectPath(
  pathname: string,
  role: LmsRole | null,
): string | null {
  if (!role) return "/login";
  if (pathname === "/lms") {
    return role === "TUTOR" ? "/lms/tutor/dashboard" : "/lms/learner";
  }
  if (role === "LEARNER" && (pathname === "/lms/tutor" || pathname.startsWith("/lms/tutor/"))) {
    return "/lms/learner";
  }
  if (role === "TUTOR" && (pathname === "/lms/learner" || pathname.startsWith("/lms/learner/"))) {
    return "/lms/tutor/dashboard";
  }
  return null;
}
