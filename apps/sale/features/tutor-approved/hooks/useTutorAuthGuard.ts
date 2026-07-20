import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "@workspace/core/store/useAuthStore";
import { getTutorOnboardingStatus } from "@workspace/core/configs/navbar";
import { getTutorPublicProfilePath } from "@workspace/core/constants/tutor-links";

export function useTutorAuthGuard() {
  const router = useRouter();
  const pathname = usePathname();
  const user = useAuthStore((state) => state.user);
  const authenticated = useAuthStore((state) => state.isAuthenticated);
  const loading = useAuthStore((state) => state.isAuthLoading);

  const role = user?.role?.trim().toUpperCase();
  const status = getTutorOnboardingStatus(user)?.trim().toUpperCase();
  const profileCompleted =
    user?.tutorProfileStatus?.trim().toUpperCase() === "COMPLETED";
  const approved =
    (status === "APPROVED" && profileCompleted) ||
    status === "COMPLETED" ||
    user?.canAccessTutorLms === true;

  useEffect(() => {
    if (loading) return;
    if (!authenticated || !user) {
      router.replace(`/login?returnUrl=${encodeURIComponent(pathname || "")}`);
      return;
    }
    if (role !== "TUTOR") {
      router.replace("/");
      return;
    }
    if (!approved) {
      router.replace("/tutor/onboarding");
      return;
    }
    if (user.canAccessTutorLms !== true) {
      router.replace("/tutor/post-approval");
      return;
    }
  }, [loading, authenticated, user, role, approved, router, pathname]);

  return {
    loading,
    authenticated,
    user,
    role,
    approved,
    isAuthorized:
      !loading &&
      authenticated &&
      user &&
      role === "TUTOR" &&
      approved &&
      user.canAccessTutorLms === true,
  };
}

export function useTutorPublicProfileRedirect() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const authenticated = useAuthStore((state) => state.isAuthenticated);
  const loading = useAuthStore((state) => state.isAuthLoading);

  useEffect(() => {
    if (loading) return;
    if (!authenticated || !user) {
      router.replace("/login");
      return;
    }
    router.replace(getTutorPublicProfilePath(user));
  }, [authenticated, loading, router, user]);

  return { loading, authenticated, user };
}
