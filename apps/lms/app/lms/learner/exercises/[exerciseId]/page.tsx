import type { Metadata } from "next";
import { ExerciseWorkspaceScreen } from "@/features/learner-exercises/components/ExerciseWorkspaceScreen";

export const metadata: Metadata = {
  title: "Luyện tập | BeeWise Learner",
  description: "Làm bài và xem lại lời giải theo từng buổi học.",
};

export default async function LearnerExercisePage({
  params,
}: {
  params: Promise<{ exerciseId: string }>;
}) {
  const { exerciseId } = await params;
  return <ExerciseWorkspaceScreen exerciseId={exerciseId} />;
}
