"use client";

import { LmsMissingState } from "../../../components/LmsMissingState";
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
  return <LmsMissingState title="Không tìm thấy bài tập" href="/lms/learner/exercises" backLabel="Quay lại danh sách" />;
}
