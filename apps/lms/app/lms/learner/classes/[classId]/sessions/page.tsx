import type { Metadata } from "next";
import { LearnerClassSessionsScreen } from "@/features/learner-classes/components/LearnerClassSessionsScreen";

export const metadata: Metadata = { title: "Buổi học | BeeWise Learner" };

export default async function LearnerClassSessionsPage({ params }: { params: Promise<{ classId: string }> }) {
  const { classId } = await params;
  return <LearnerClassSessionsScreen classId={classId} />;
}
