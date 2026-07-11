"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@workspace/core/store/useAuthStore";
import { getTutorOnboardingStatus } from "@workspace/core/configs/navbar";
import { getTutorPublicProfilePath } from "@workspace/core/constants/tutor-links";
import { TutorApprovedProvider } from "./tutor-approved.provider";
import { resolveTutorApprovedScenario } from "./tutor-approved.resolver";
import { TutorApprovedScreenView, TutorApprovedShell } from "./tutor-approved.ui";
import type { TutorApprovedScreen } from "./tutor-approved.types";

export function TutorApprovedRoute({ screen, chatRoomId }: { screen: TutorApprovedScreen; chatRoomId?: string }) {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const authenticated = useAuthStore((state) => state.isAuthenticated);
  const loading = useAuthStore((state) => state.isAuthLoading);
  const role = user?.role?.trim().toUpperCase();
  const status = getTutorOnboardingStatus(user)?.trim().toUpperCase();
  const approved = status === "APPROVED" || status === "COMPLETED" || user?.canAccessTutorLms === true;

  useEffect(() => {
    if (loading) return;
    if (!authenticated || !user) return router.replace(`/login?returnUrl=${encodeURIComponent(location.pathname)}`);
    if (role !== "TUTOR") return router.replace("/");
    if (!approved) return router.replace("/tutor/onboarding");
    if (user.canAccessTutorLms !== true) return router.replace("/tutor/post-approval");
  }, [approved, authenticated, loading, role, router, user]);

  if (loading || !authenticated || !user || role !== "TUTOR" || !approved || user.canAccessTutorLms !== true) return null;
  return <TutorApprovedProvider scenario={resolveTutorApprovedScenario(user)}><TutorApprovedShell><TutorApprovedScreenView screen={screen} chatRoomId={chatRoomId}/></TutorApprovedShell></TutorApprovedProvider>;
}

export function TutorPublicProfileRedirect() {
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

  return null;
}
