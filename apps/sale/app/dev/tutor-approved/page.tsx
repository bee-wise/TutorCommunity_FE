import { notFound } from "next/navigation";
import { TutorApprovedPreview } from "@/features/tutor-approved/tutor-approved.preview";

const enabled = process.env.NODE_ENV === "development" && process.env.NEXT_PUBLIC_ENABLE_TUTOR_APPROVED_PREVIEW === "true";

export default async function Page({ searchParams }: { searchParams: Promise<{ scenario?: string; capture?: string }> }) {
  if (!enabled) notFound();
  const params = await searchParams;
  return <TutorApprovedPreview scenario={params.scenario} capture={params.capture === "1"}/>;
}
