import { notFound } from "next/navigation";
import { TutorOnboardingPreview } from "@/features/tutor-onboarding/tutor-onboarding.preview";

const previewEnabled =
  process.env.NODE_ENV === "development" &&
  process.env.NEXT_PUBLIC_ENABLE_TUTOR_ONBOARDING_PREVIEW === "true";

export default async function DevTutorOnboardingPage({
  searchParams,
}: {
  searchParams: Promise<{ scenario?: string; capture?: string }>;
}) {
  if (!previewEnabled) notFound();

  const params = await searchParams;

  return (
    <TutorOnboardingPreview
      scenario={params.scenario}
      capture={params.capture === "1"}
    />
  );
}
