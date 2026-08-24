import type { Metadata } from "next";
import { ExerciseSessionSelectionScreen } from "@/features/learner-exercises/components/ExerciseSessionSelectionScreen";

export const metadata: Metadata = {
  title: "Buổi học | BeeWise Learner",
};

export default async function LearnerExerciseSessionsPage({
  params,
}: {
  params: Promise<{ classId: string }>;
}) {
  const { classId } = await params;
  return <ExerciseSessionSelectionScreen classId={classId} />;
}
