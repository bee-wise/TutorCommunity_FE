"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@workspace/core/store/useAuthStore";
import { TutorOnboardingProvider } from "./tutor-onboarding.provider";
import {
  parseTutorOnboardingScenario,
} from "./tutor-onboarding.resolver";
import {
  tutorOnboardingScenarios,
  type TutorOnboardingScenario,
} from "./tutor-onboarding.types";
import {
  PreviewToolbar,
  TutorOnboardingShell,
} from "./components/TutorOnboardingLayout";
import { TutorOnboardingScreen } from "./components/TutorOnboardingScreens";
import { useTutorOnboardingViewModel } from "./tutor-onboarding.provider";

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

export function TutorOnboardingExperience() {
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

    if (user.canAccessTutorLms === true) {
      router.replace("/lms/tutor/dashboard");
    }
  }, [isAuthenticated, isAuthLoading, router, user]);

  if (
    isAuthLoading ||
    !isAuthenticated ||
    !user ||
    user.role?.trim().toUpperCase() !== "TUTOR" ||
    user.canAccessTutorLms === true
  ) {
    return null;
  }

  return (
    <TutorOnboardingProvider scenario="journey">
      <TutorOnboardingShell
        capture={false}
        toolbar={null}
        useAuthenticatedHeader
      >
        <TutorOnboardingScreen />
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

  const navigate = (nextScenario: TutorOnboardingScenario, nextCapture = capture) => {
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
      <TutorOnboardingScreen />
    </TutorOnboardingShell>
  );
}
