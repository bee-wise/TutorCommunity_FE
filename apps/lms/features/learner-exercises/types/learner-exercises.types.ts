export type ExerciseSource = "ai" | "upload";
export type ExerciseMode = "interactive" | "file_submission";
export type ExerciseDifficulty = "easy" | "medium" | "hard";
export type ExerciseStatus = "not_started" | "in_progress" | "submitted" | "reviewed" | "overdue";
export type ExerciseStatusFilter = "all" | ExerciseStatus;
export type ExerciseQuestionType = "multiple_choice" | "true_false" | "short_answer";
export type ExerciseAvailabilityFilter = "all" | "with_exercises" | "without_exercises";
export type LearnerExerciseClassStatus = "active" | "paused" | "completed";

export interface LearnerExerciseClass {
  id: string;
  classCode: string;
  name: string;
  subject: string;
  level: string;
  tutorName: string;
  tutorInitials: string;
  scheduleLabel: string;
  startedAt: string;
  status: LearnerExerciseClassStatus;
}

export interface LearnerExerciseSession {
  id: string;
  classId: string;
  sequence: number;
  topic: string;
  taughtAt: string;
  durationMinutes: number;
}

export interface LearnerExerciseClassSummary {
  classInfo: LearnerExerciseClass;
  sessionCount: number;
  exerciseCount: number;
  pendingExerciseCount: number;
}

export interface ExerciseOption {
  id: string;
  label: string;
}

export interface ExerciseQuestion {
  id: string;
  type: ExerciseQuestionType;
  prompt: string;
  options?: ExerciseOption[];
  correctAnswer: string;
  explanation: string;
  points: number;
}

export interface LearnerExercise {
  id: string;
  materialId: string;
  sessionId: string;
  classId: string;
  className: string;
  subject: string;
  lessonTopic: string;
  tutorName: string;
  title: string;
  description: string;
  source: ExerciseSource;
  mode: ExerciseMode;
  difficulty: ExerciseDifficulty;
  status: ExerciseStatus;
  assignedAt: string;
  dueAt: string;
  estimatedMinutes: number;
  attachmentName?: string;
  questions: ExerciseQuestion[];
  score?: number;
}

export interface ExerciseAttempt {
  exerciseId: string;
  answers: Record<string, string>;
  submittedFileName?: string;
}

export interface ExerciseResultSummary {
  earnedPoints: number;
  totalPoints: number;
  correctCount: number;
  questionCount: number;
  percentage: number;
}
