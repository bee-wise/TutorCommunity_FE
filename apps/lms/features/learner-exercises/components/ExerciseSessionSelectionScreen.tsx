"use client";

import Link from "next/link";
import { ArrowLeft, MagnifyingGlass, WarningCircle } from "@phosphor-icons/react";
import { useExerciseSessions } from "../hooks/useLearnerExercises";
import type { ExerciseAvailabilityFilter } from "../types/learner-exercises.types";
import { ExerciseSessionList } from "./ExerciseSessionList";

export function ExerciseSessionSelectionScreen({ classId }: { classId: string }) {
  const library = useExerciseSessions(classId);

  if (!library.classInfo) {
    return <MissingState />;
  }

  return (
    <div className="min-h-full bg-[#F8FAFC]">
      <div className="mx-auto max-w-[1150px] space-y-5 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <Link href="/lms/learner/exercises" className="inline-flex items-center gap-1.5 text-sm font-bold text-[#280F91] hover:underline"><ArrowLeft size={17} weight="bold" /> Danh sách lớp</Link>
        <header className="flex items-center gap-4 rounded-2xl border border-border bg-white p-5 shadow-sm">
          <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-[#CFE1FA] text-sm font-extrabold text-[#280F91]">{library.classInfo.tutorInitials}</span>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-[#280F91]">{library.classInfo.subject}</p>
            <h1 className="truncate text-xl font-extrabold text-slate-950 sm:text-2xl">{library.classInfo.name}</h1>
            <p className="mt-1 text-sm text-slate-500">{library.classInfo.tutorName} | {library.classInfo.scheduleLabel}</p>
          </div>
        </header>

        <section className="rounded-2xl border border-border bg-white p-3 shadow-sm sm:p-4" aria-label="Bộ lọc buổi học">
          <div className="grid gap-2 md:grid-cols-[minmax(240px,1fr)_220px]">
            <label className="relative block">
              <span className="sr-only">Tìm buổi học</span>
              <MagnifyingGlass className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              <input value={library.search} onChange={(event) => library.setSearch(event.target.value)} placeholder="Tìm chủ đề buổi học..." className="h-10 w-full rounded-xl border border-input pl-10 pr-3 text-sm outline-none placeholder:text-slate-500 focus:border-[#280F91] focus:ring-2 focus:ring-[#280F91]/20" />
            </label>
            <label>
              <span className="sr-only">Lọc theo tình trạng bài tập</span>
              <select value={library.availability} onChange={(event) => library.setAvailability(event.target.value as ExerciseAvailabilityFilter)} className="h-10 w-full rounded-xl border border-input bg-white px-3 text-sm font-semibold outline-none focus:border-[#280F91] focus:ring-2 focus:ring-[#280F91]/20">
                <option value="all">Tất cả buổi học</option>
                <option value="with_exercises">Đã có bài tập</option>
                <option value="without_exercises">Chưa có bài tập</option>
              </select>
            </label>
          </div>
        </section>

        <ExerciseSessionList classId={classId} sessions={library.filteredSessions} />
      </div>
    </div>
  );
}

function MissingState() {
  return <div className="grid min-h-[60dvh] place-items-center bg-[#F8FAFC] p-6 text-center"><div><WarningCircle className="mx-auto text-[#905B0F]" size={36} weight="duotone" /><h1 className="mt-3 text-xl font-extrabold">Không tìm thấy lớp học</h1><Link href="/lms/learner/exercises" className="mt-4 inline-flex h-10 items-center rounded-xl bg-[#280F91] px-4 text-sm font-bold text-white">Quay lại danh sách lớp</Link></div></div>;
}
