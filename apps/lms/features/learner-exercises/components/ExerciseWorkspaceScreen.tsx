"use client";

import Link from "next/link";
import { WarningCircle } from "@phosphor-icons/react";
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
  return <div className="grid min-h-[60dvh] place-items-center bg-[#F8FAFC] p-6 text-center"><div><WarningCircle className="mx-auto text-[#905B0F]" size={36} weight="duotone" /><h1 className="mt-3 text-xl font-extrabold">Không tìm thấy bài tập</h1><Link href="/lms/learner/exercises" className="mt-4 inline-flex h-10 items-center rounded-xl bg-[#280F91] px-4 text-sm font-bold text-white">Quay lại danh sách</Link></div></div>;
}
