import type {
  ExerciseResultSummary,
  LearnerExercise,
} from "../types/learner-exercises.types";

export function formatExerciseDate(value: string) {
  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

export function formatExerciseDay(value: string) {
  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(value));
}

export function getExerciseSessionHref(exercise: LearnerExercise) {
  return `/lms/learner/exercises/classes/${exercise.classId}/sessions/${exercise.sessionId}`;
}

export function normalizeExerciseAnswer(value: string) {
  return value.trim().toLocaleLowerCase("vi");
}

export function gradeExercise(
  exercise: LearnerExercise,
  answers: Record<string, string>,
): ExerciseResultSummary {
  const totalPoints = exercise.questions.reduce((total, question) => total + question.points, 0);
  const correctQuestions = exercise.questions.filter(
    (question) => normalizeExerciseAnswer(answers[question.id] ?? "") === normalizeExerciseAnswer(question.correctAnswer),
  );
  const earnedPoints = correctQuestions.reduce((total, question) => total + question.points, 0);
  return {
    earnedPoints,
    totalPoints,
    correctCount: correctQuestions.length,
    questionCount: exercise.questions.length,
    percentage: totalPoints > 0 ? Math.round((earnedPoints / totalPoints) * 100) : 0,
  };
}

export function downloadMockExercise(exercise: LearnerExercise) {
  const documentContent = `<!doctype html><html lang="vi"><head><meta charset="UTF-8"><title>${exercise.title}</title><style>body{font-family:Arial,sans-serif;max-width:760px;margin:40px auto;padding:24px;color:#17142f}h1{color:#280f91}.note{margin-top:24px;padding:16px;background:#fff9e8;border:1px solid #fadc76;border-radius:12px}</style></head><body><h1>${exercise.title}</h1><p><strong>Lớp:</strong> ${exercise.className}</p><p><strong>Chủ đề:</strong> ${exercise.lessonTopic}</p><p><strong>Gia sư:</strong> ${exercise.tutorName}</p><p>${exercise.description}</p><div class="note">Đây là tệp đề bài minh họa của bản mock UI. Nội dung file gốc sẽ được tải từ kho tài liệu khi kết nối backend.</div></body></html>`;
  const blob = new Blob([documentContent], { type: "text/html;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `de-bai-mock-${exercise.id}.html`;
  anchor.click();
  URL.revokeObjectURL(url);
}
