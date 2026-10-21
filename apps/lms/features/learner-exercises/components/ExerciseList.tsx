import Link from "next/link";
import { ArrowRightIcon as ArrowRight, ClockIcon as Clock, BookOpenIcon as Notebook } from "@heroicons/react/24/outline";
import type { LearnerExercise } from "../types/learner-exercises.types";
import { formatExerciseDate } from "../utils/learner-exercises.utils";
import { ExerciseBadges } from "./ExerciseBadges";

export function ExerciseList({ exercises }: { exercises: LearnerExercise[] }) {
  if (exercises.length === 0) {
    return <div className="rounded-2xl border border-dashed border-border bg-card px-5 py-14 text-center"><Notebook className="mx-auto text-muted-foreground" width={34} height={34} /><h2 className="mt-3 font-extrabold text-foreground">Không có bài tập phù hợp</h2><p className="mt-1 text-sm text-muted-foreground">Hãy thử thay đổi từ khóa hoặc bộ lọc.</p></div>;
  }

  return (
    <section aria-labelledby="exercise-list-title">
      <header className="mb-4"><h2 id="exercise-list-title" className="text-lg font-extrabold text-foreground">Bài tập của buổi học</h2><p className="mt-1 text-xs text-muted-foreground">Bài tập được tạo hoặc chia sẻ từ tài liệu của gia sư.</p></header>
      <div className="grid gap-4 md:grid-cols-2">
        {exercises.map((exercise, index) => {
          const highlighted = index === 0 && (exercise.status === "not_started" || exercise.status === "in_progress");
          const actionLabel = exercise.status === "reviewed" ? "Xem kết quả" : exercise.status === "submitted" ? "Xem bài đã nộp" : exercise.status === "in_progress" ? "Tiếp tục làm" : exercise.status === "overdue" ? "Xem bài tập" : "Bắt đầu làm";
          return <article key={exercise.id} className={`flex min-h-[300px] flex-col rounded-2xl border p-5 shadow-sm ${highlighted ? "border-highlight bg-accent/15" : "border-border bg-card"}`}>
            <ExerciseBadges source={exercise.source} status={exercise.status} difficulty={exercise.difficulty} />
            <h3 className="mt-4 text-lg font-extrabold leading-6 text-foreground">{exercise.title}</h3>
            <p className="mt-2 line-clamp-3 text-sm leading-6 text-muted-foreground">{exercise.description}</p>
            <dl className="mt-5 grid grid-cols-2 gap-3 text-sm">
              <div><dt className="text-xs text-muted-foreground">Hạn hoàn thành</dt><dd className="mt-1 font-bold text-foreground">{formatExerciseDate(exercise.dueAt)}</dd></div>
              <div><dt className="flex items-center gap-1 text-xs text-muted-foreground"><Clock width={14} height={14} /> Thời gian</dt><dd className="mt-1 font-bold text-foreground">{exercise.estimatedMinutes} phút</dd></div>
              {exercise.score !== undefined ? <div className="col-span-2"><dt className="text-xs text-muted-foreground">Kết quả gần nhất</dt><dd className="mt-1 font-extrabold text-foreground">{exercise.score}/10 điểm</dd></div> : null}
            </dl>
            <Link href={`/lms/learner/exercises/${exercise.id}`} className="mt-auto inline-flex min-h-11 items-center justify-center gap-1.5 whitespace-nowrap rounded-xl bg-primary px-4 text-sm font-bold text-primary-foreground hover:bg-primary/90 active:scale-[0.98]">{actionLabel}<ArrowRight width={16} height={16} /></Link>
          </article>;
        })}
      </div>
    </section>
  );
}
