"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@workspace/core/store/useAuthStore";

import { TutorOnboardingProvider } from "./TutorOnboardingProvider";
import { parseTutorOnboardingScenario } from "../schemas/tutor-onboarding.resolver";
import {
  tutorOnboardingScenarios,
  type TutorOnboardingScenario,
} from "../types";
import { PreviewToolbar, TutorOnboardingShell } from "./TutorOnboardingLayout";
import { TutorOnboardingScreenView } from "./TutorOnboardingScreens";
import { useTutorOnboardingViewModel } from "./TutorOnboardingProvider";

export function TutorOnboardingPreview({
  scenario,
  capture,
}: {
  scenario?: string | null;
  capture: boolean;
}) {
  const parsedScenario = parseTutorOnboardingScenario(scenario);

  return (
    <TutorOnboardingProvider scenario={parsedScenario}>
      <TutorOnboardingPreviewContent
        scenario={parsedScenario === "unknown" ? "journey" : parsedScenario}
        capture={capture}
      />
    </TutorOnboardingProvider>
  );
}

export function TutorOnboardingExperience({
  scenario = "journey",
}: {
  scenario?: TutorOnboardingScenario;
} = {}) {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isAuthLoading = useAuthStore((state) => state.isAuthLoading);

  useEffect(() => {
    if (isAuthLoading) return;

    if (!isAuthenticated || !user) {
      router.replace("/login?returnUrl=%2Ftutor%2Fonboarding");
      return;
    }

    if (user.role?.trim().toUpperCase() !== "TUTOR") {
      router.replace("/");
      return;
    }
  }, [isAuthenticated, isAuthLoading, router, user]);

  if (
    isAuthLoading ||
    !isAuthenticated ||
    !user ||
    user.role?.trim().toUpperCase() !== "TUTOR"
  ) {
    return null;
  }

  return (
    <TutorOnboardingProvider scenario={scenario}>
      <TutorOnboardingShell
        capture={false}
        toolbar={null}
        useAuthenticatedHeader
      >
        <TutorOnboardingScreenView />
      </TutorOnboardingShell>
    </TutorOnboardingProvider>
  );
}

function TutorOnboardingPreviewContent({
  scenario,
  capture,
}: {
  scenario: TutorOnboardingScenario;
  capture: boolean;
}) {
  const router = useRouter();
  const { reset } = useTutorOnboardingViewModel();

  const navigate = (
    nextScenario: TutorOnboardingScenario,
    nextCapture = capture,
  ) => {
    const params = new URLSearchParams({ scenario: nextScenario });
    if (nextCapture) params.set("capture", "1");
    router.push(`/dev/tutor-onboarding?${params.toString()}`);
  };

  return (
    <TutorOnboardingShell
      capture={capture}
      toolbar={
        <PreviewToolbar
          scenario={scenario}
          capture={capture}
          scenarios={tutorOnboardingScenarios}
          onScenarioChange={(nextScenario) => navigate(nextScenario, false)}
          onToggleCapture={() => navigate(scenario, true)}
          onReset={reset}
        />
      }
    >
      <TutorOnboardingScreenView />
    </TutorOnboardingShell>
  );
}
