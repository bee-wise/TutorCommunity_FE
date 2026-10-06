import { redirect } from "next/navigation";
export default async function Page({ params }: { params: Promise<{ learnerId: string }> }) {
  const { learnerId } = await params;
  redirect(`/lms/tutor/materials?learner=${encodeURIComponent(learnerId)}`);
}

