import type {
  ExerciseDifficulty,
  ExerciseSource,
  ExerciseStatus,
} from "../types/learner-exercises.types";

const STATUS_LABELS: Record<ExerciseStatus, string> = {
  not_started: "Chưa làm",
  in_progress: "Đang làm",
  submitted: "Đã nộp",
  reviewed: "Đã chấm",
  overdue: "Quá hạn",
};

const DIFFICULTY_LABELS: Record<ExerciseDifficulty, string> = {
  easy: "Cơ bản",
  medium: "Vừa sức",
  hard: "Thử thách",
};

export function ExerciseBadges({ source, status, difficulty }: { source: ExerciseSource; status: ExerciseStatus; difficulty: ExerciseDifficulty }) {
  const statusStyle = status === "reviewed" || status === "submitted"
    ? "bg-secondary/15 text-foreground"
    : status === "overdue"
      ? "bg-destructive/10 text-destructive"
      : status === "in_progress"
        ? "bg-accent/15 text-warning"
        : "bg-muted text-muted-foreground";
  return <div className="flex flex-wrap gap-1.5"><span className={`rounded-full px-2.5 py-1 text-xs font-bold ${source === "ai" ? "bg-muted text-primary" : "bg-secondary/15 text-foreground"}`}>{source === "ai" ? "Tạo bằng AI" : "Gia sư tải lên"}</span><span className="rounded-full bg-muted px-2.5 py-1 text-xs font-bold text-muted-foreground">{DIFFICULTY_LABELS[difficulty]}</span><span className={`rounded-full px-2.5 py-1 text-xs font-bold ${statusStyle}`}>{STATUS_LABELS[status]}</span></div>;
}
