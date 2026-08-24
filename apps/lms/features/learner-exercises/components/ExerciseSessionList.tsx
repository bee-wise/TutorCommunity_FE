import Link from "next/link";
import { ArrowRight, CalendarBlank } from "@phosphor-icons/react";
import { LEARNER_EXERCISES } from "../data/learner-exercises.mock";
import type { LearnerExerciseSession } from "../types/learner-exercises.types";
import { formatExerciseDate } from "../utils/learner-exercises.utils";

export function ExerciseSessionList({ classId, sessions }: { classId: string; sessions: LearnerExerciseSession[] }) {
  if (sessions.length === 0) {
    return <div className="grid min-h-64 place-items-center rounded-2xl border border-dashed border-[#280F91]/20 bg-white p-6 text-center"><div><CalendarBlank className="mx-auto text-[#280F91]" size={30} weight="duotone" /><h2 className="mt-3 text-lg font-extrabold text-slate-950">Không có buổi học phù hợp</h2><p className="mt-1 text-sm text-slate-500">Hãy thay đổi bộ lọc để xem các buổi học khác.</p></div></div>;
  }

  return (
    <section className="overflow-hidden rounded-2xl border border-border bg-white shadow-sm" aria-labelledby="exercise-sessions-title">
      <header className="border-b border-border px-4 py-4 sm:px-5">
        <h2 id="exercise-sessions-title" className="text-lg font-extrabold text-slate-950">Danh sách buổi học</h2>
        <p className="mt-0.5 text-xs text-slate-500">Chọn buổi học để xem bài tập gia sư đã giao.</p>
      </header>
      <div className="divide-y divide-border">
        {sessions.map((session) => {
          const exercises = LEARNER_EXERCISES.filter((exercise) => exercise.sessionId === session.id);
          const pendingCount = exercises.filter((exercise) => exercise.status === "not_started" || exercise.status === "in_progress").length;
          const hasExercises = exercises.length > 0;
          return (
            <article key={session.id} className="p-4 transition-colors hover:bg-slate-50/70 sm:p-5">
              <div className="flex flex-col gap-4 md:flex-row md:items-center">
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold text-[#280F91]">Buổi {session.sequence}</p>
                  <h3 className="mt-1.5 font-extrabold text-slate-950">{session.topic}</h3>
                  <p className="mt-1 text-xs text-slate-500">{formatExerciseDate(session.taughtAt)} | {session.durationMinutes} phút</p>
                </div>
                <div className="flex items-center justify-between gap-4 md:justify-end">
                  <div className="text-right">
                    <p className={`text-sm font-bold ${hasExercises ? "text-[#447353]" : "text-slate-500"}`}>{hasExercises ? `${exercises.length} bài tập` : "Chưa có bài tập"}</p>
                    {pendingCount > 0 ? <p className="mt-0.5 text-xs font-semibold text-[#905B0F]">{pendingCount} bài cần hoàn thành</p> : null}
                  </div>
                  {hasExercises ? <Link href={`/lms/learner/exercises/classes/${classId}/sessions/${session.id}`} className="inline-flex h-9 items-center gap-1.5 whitespace-nowrap rounded-lg bg-[#280F91] px-3 text-xs font-bold text-white hover:bg-[#1F0B70]">Xem bài tập <ArrowRight size={14} weight="bold" /></Link> : <button type="button" disabled className="h-9 cursor-not-allowed rounded-lg border border-input px-3 text-xs font-bold text-slate-500 opacity-60">Chưa thể xem</button>}
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
