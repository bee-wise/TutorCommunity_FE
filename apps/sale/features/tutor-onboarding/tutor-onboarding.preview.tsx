"use client";

import { useRouter } from "next/navigation";
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
