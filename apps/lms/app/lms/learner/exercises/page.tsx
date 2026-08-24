import type { Metadata } from "next";
import { ExerciseClassSelectionScreen } from "@/features/learner-exercises/components/ExerciseClassSelectionScreen";

export const metadata: Metadata = {
  title: "Làm bài tập | BeeWise Learner",
  description: "Luyện tập sau buổi học với bài tập từ gia sư.",
};

export default function LearnerExercisesPage() {
  return <ExerciseClassSelectionScreen />;
}
