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
    ? "bg-[#DDF1E5] text-[#365D43]"
    : status === "overdue"
      ? "bg-[#F7E5E3] text-[#8A3730]"
      : status === "in_progress"
        ? "bg-[#FFF3CB] text-[#805512]"
        : "bg-slate-100 text-slate-600";
  return <div className="flex flex-wrap gap-1.5"><span className={`rounded-full px-2.5 py-1 text-xs font-bold ${source === "ai" ? "bg-[#EEF2FF] text-[#280F91]" : "bg-[#DDF1E5] text-[#365D43]"}`}>{source === "ai" ? "Tạo bằng AI" : "Gia sư tải lên"}</span><span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-600">{DIFFICULTY_LABELS[difficulty]}</span><span className={`rounded-full px-2.5 py-1 text-xs font-bold ${statusStyle}`}>{STATUS_LABELS[status]}</span></div>;
}
