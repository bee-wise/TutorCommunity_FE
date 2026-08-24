import type { Metadata } from "next";
import { ExerciseLibraryScreen } from "@/features/learner-exercises/components/ExerciseLibraryScreen";

export const metadata: Metadata = {
  title: "Bài tập buổi học | BeeWise Learner",
};

export default async function LearnerSessionExercisesPage({
  params,
}: {
  params: Promise<{ classId: string; sessionId: string }>;
}) {
  const { classId, sessionId } = await params;
  return <ExerciseLibraryScreen classId={classId} sessionId={sessionId} />;
}
