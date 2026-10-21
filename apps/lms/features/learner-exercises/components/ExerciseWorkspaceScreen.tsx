"use client";

import Link from "next/link";
import { ExclamationCircleIcon as WarningCircle } from "@heroicons/react/24/outline";
import { useExerciseAttempt } from "../hooks/useExerciseAttempt";
import { ExerciseQuizWorkspace } from "./ExerciseQuizWorkspace";
import { ExerciseResultScreen } from "./ExerciseResultScreen";
import { FileExerciseWorkspace } from "./FileExerciseWorkspace";

export function ExerciseWorkspaceScreen({ exerciseId }: { exerciseId: string }) {
  const attempt = useExerciseAttempt(exerciseId);
  if (!attempt.exercise) return <MissingExercise />;
  if (attempt.exercise.mode === "file_submission") return <FileExerciseWorkspace exercise={attempt.exercise} submittedFileName={attempt.submittedFileName} fileSubmitted={attempt.fileSubmitted} onSubmit={attempt.submitFile} />;
  if (attempt.showResult && attempt.result) return <ExerciseResultScreen exercise={attempt.exercise} answers={attempt.answers} result={attempt.result} onRetry={attempt.retryExercise} />;
  if (!attempt.currentQuestion) return <MissingExercise />;
  return <ExerciseQuizWorkspace exercise={attempt.exercise} answers={attempt.answers} flaggedQuestionIds={attempt.flaggedQuestionIds} currentQuestionIndex={attempt.currentQuestionIndex} currentQuestion={attempt.currentQuestion} answeredCount={attempt.answeredCount} onAnswer={attempt.setAnswer} onToggleFlag={attempt.toggleFlag} onQuestionChange={attempt.setCurrentQuestionIndex} onSubmit={attempt.submitInteractiveExercise} />;
}

function MissingExercise() {
  return <div className="grid min-h-[60dvh] place-items-center bg-muted p-6 text-center"><div><WarningCircle className="mx-auto text-warning" width={36} height={36} /><h1 className="mt-3 text-xl font-extrabold">Không tìm thấy bài tập</h1><Link href="/lms/learner/exercises" className="mt-4 inline-flex min-h-11 items-center rounded-xl bg-primary px-4 text-sm font-bold text-primary-foreground">Quay lại danh sách</Link></div></div>;
}
