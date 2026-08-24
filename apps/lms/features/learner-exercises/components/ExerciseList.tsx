import Link from "next/link";
import { ArrowRight, Clock, Notebook } from "@phosphor-icons/react";
import type { LearnerExercise } from "../types/learner-exercises.types";
import { formatExerciseDate } from "../utils/learner-exercises.utils";
import { ExerciseBadges } from "./ExerciseBadges";

export function ExerciseList({ exercises }: { exercises: LearnerExercise[] }) {
  if (exercises.length === 0) {
    return <div className="rounded-2xl border border-dashed border-border bg-white px-5 py-14 text-center"><Notebook className="mx-auto text-slate-400" size={34} weight="duotone" /><h2 className="mt-3 font-extrabold text-slate-950">Không có bài tập phù hợp</h2><p className="mt-1 text-sm text-slate-500">Hãy thử thay đổi từ khóa hoặc bộ lọc.</p></div>;
  }

  return (
    <section aria-labelledby="exercise-list-title">
      <header className="mb-4"><h2 id="exercise-list-title" className="text-lg font-extrabold text-slate-950">Bài tập của buổi học</h2><p className="mt-1 text-xs text-slate-500">Bài tập được tạo hoặc chia sẻ từ tài liệu của gia sư.</p></header>
      <div className="grid gap-4 md:grid-cols-2">
        {exercises.map((exercise, index) => {
          const highlighted = index === 0 && (exercise.status === "not_started" || exercise.status === "in_progress");
          const actionLabel = exercise.status === "reviewed" ? "Xem kết quả" : exercise.status === "submitted" ? "Xem bài đã nộp" : exercise.status === "in_progress" ? "Tiếp tục làm" : exercise.status === "overdue" ? "Xem bài tập" : "Bắt đầu làm";
          return <article key={exercise.id} className={`flex min-h-[300px] flex-col rounded-2xl border p-5 shadow-sm ${highlighted ? "border-[#FADC76] bg-[#FFF9E8]" : "border-border bg-white"}`}>
            <ExerciseBadges source={exercise.source} status={exercise.status} difficulty={exercise.difficulty} />
            <h3 className="mt-4 text-lg font-extrabold leading-6 text-slate-950">{exercise.title}</h3>
            <p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-600">{exercise.description}</p>
            <dl className="mt-5 grid grid-cols-2 gap-3 text-sm">
              <div><dt className="text-xs text-slate-500">Hạn hoàn thành</dt><dd className="mt-1 font-bold text-slate-800">{formatExerciseDate(exercise.dueAt)}</dd></div>
              <div><dt className="flex items-center gap-1 text-xs text-slate-500"><Clock size={14} /> Thời gian</dt><dd className="mt-1 font-bold text-slate-800">{exercise.estimatedMinutes} phút</dd></div>
              {exercise.score !== undefined ? <div className="col-span-2"><dt className="text-xs text-slate-500">Kết quả gần nhất</dt><dd className="mt-1 font-extrabold text-[#447353]">{exercise.score}/10 điểm</dd></div> : null}
            </dl>
            <Link href={`/lms/learner/exercises/${exercise.id}`} className="mt-auto inline-flex h-10 items-center justify-center gap-1.5 whitespace-nowrap rounded-xl bg-[#280F91] px-4 text-sm font-bold text-white hover:bg-[#1F0B70] active:scale-[0.98]">{actionLabel}<ArrowRight size={16} weight="bold" /></Link>
          </article>;
        })}
      </div>
    </section>
  );
}
