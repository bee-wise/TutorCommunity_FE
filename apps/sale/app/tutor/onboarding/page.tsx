import { TutorOnboardingExperience } from "@/features/tutor-onboarding";
import { parseTutorOnboardingScenario } from "@/features/tutor-onboarding/schemas/tutor-onboarding.resolver";

export default async function TutorOnboardingPage({
  searchParams,
}: {
  searchParams: Promise<{ scenario?: string | string[] }>;
}) {
  const params = await searchParams;
  const requestedScenario = Array.isArray(params.scenario)
    ? params.scenario[0]
    : params.scenario;
  const scenario = parseTutorOnboardingScenario(requestedScenario);

  return (
    <TutorOnboardingExperience
      scenario={scenario === "unknown" ? "journey" : scenario}
    />
  );
}
