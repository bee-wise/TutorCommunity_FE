"use client";

import { usePathname } from "next/navigation";
import { useAuthBootstrap } from "@workspace/core/hooks/useAuthBootstrap";

const tutorPreviewEnabled =
  process.env.NODE_ENV === "development" &&
  process.env.NEXT_PUBLIC_ENABLE_TUTOR_ONBOARDING_PREVIEW === "true";

export function AuthBootstrap() {
  const pathname = usePathname();
  const isTutorPreviewRoute =
    tutorPreviewEnabled && pathname?.startsWith("/dev/tutor-onboarding");

  useAuthBootstrap({ enabled: !isTutorPreviewRoute });
  return null;
}
