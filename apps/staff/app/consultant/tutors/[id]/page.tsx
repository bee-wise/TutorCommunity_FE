import { ProfileReviewScreen } from "@/features/consultant-reviews";

export default async function TutorDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <ProfileReviewScreen key={id} profileId={id} />;
}
