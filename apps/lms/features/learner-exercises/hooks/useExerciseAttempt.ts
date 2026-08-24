"use client";

import { useMemo, useState } from "react";
import {
  EXERCISE_ATTEMPTS,
  LEARNER_EXERCISES,
} from "../data/learner-exercises.mock";
import { gradeExercise } from "../utils/learner-exercises.utils";

export function useExerciseAttempt(exerciseId: string) {
  const exercise = useMemo(
    () => LEARNER_EXERCISES.find((item) => item.id === exerciseId),
    [exerciseId],
  );
  const savedAttempt = EXERCISE_ATTEMPTS[exerciseId];
  const [answers, setAnswers] = useState<Record<string, string>>(() => savedAttempt?.answers ?? {});
  const [flaggedQuestionIds, setFlaggedQuestionIds] = useState<Set<string>>(() => new Set());
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [showResult, setShowResult] = useState(exercise?.status === "reviewed");
  const [submittedFileName, setSubmittedFileName] = useState(savedAttempt?.submittedFileName);
  const [fileSubmitted, setFileSubmitted] = useState(exercise?.status === "submitted");

  const answeredCount = Object.values(answers).filter((answer) => answer.trim()).length;
  const currentQuestion = exercise?.questions[currentQuestionIndex];
  const result = useMemo(
    () => exercise ? gradeExercise(exercise, answers) : undefined,
    [answers, exercise],
  );

  function setAnswer(questionId: string, answer: string) {
    setAnswers((current) => ({ ...current, [questionId]: answer }));
  }

  function toggleFlag(questionId: string) {
    setFlaggedQuestionIds((current) => {
      const next = new Set(current);
      if (next.has(questionId)) next.delete(questionId);
      else next.add(questionId);
      return next;
    });
  }

  function submitInteractiveExercise() {
    setShowResult(true);
  }

  function retryExercise() {
    setAnswers({});
    setFlaggedQuestionIds(new Set());
    setCurrentQuestionIndex(0);
    setShowResult(false);
  }

  function submitFile(fileName: string) {
    setSubmittedFileName(fileName);
    setFileSubmitted(true);
  }

  return {
    exercise,
    answers,
    flaggedQuestionIds,
    currentQuestionIndex,
    currentQuestion,
    answeredCount,
    showResult,
    result,
    submittedFileName,
    fileSubmitted,
    setAnswer,
    toggleFlag,
    setCurrentQuestionIndex,
    submitInteractiveExercise,
    retryExercise,
    submitFile,
  };
}
