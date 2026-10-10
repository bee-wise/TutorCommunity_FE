import type { Metadata } from "next";
import { LearnerClassOverviewScreen } from "@/features/learner-classes/components/LearnerClassOverviewScreen";

export const metadata: Metadata = { title: "Thông tin lớp | BeeWise Learner" };

export default async function LearnerClassPage({ params }: { params: Promise<{ classId: string }> }) {
  const { classId } = await params;
  return <LearnerClassOverviewScreen classId={classId} />;
}
