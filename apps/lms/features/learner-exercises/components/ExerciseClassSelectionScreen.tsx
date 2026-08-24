"use client";

import { MagnifyingGlass } from "@phosphor-icons/react";
import { useExerciseClasses } from "../hooks/useLearnerExercises";
import { ExerciseClassList } from "./ExerciseClassList";

export function ExerciseClassSelectionScreen() {
  const library = useExerciseClasses();

  return (
    <div className="min-h-full bg-[#F8FAFC]">
      <div className="mx-auto max-w-[1250px] space-y-5 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <header>
          <h1 className="text-2xl font-extrabold text-slate-950 sm:text-3xl">Làm bài tập</h1>
          <p className="mt-1.5 max-w-2xl text-sm text-slate-500">Chọn lớp học để xem bài tập được giao theo từng buổi.</p>
        </header>

        <section className="rounded-2xl border border-border bg-white p-3 shadow-sm sm:p-4" aria-label="Bộ lọc lớp học">
          <div className="grid gap-2 sm:grid-cols-[minmax(240px,1fr)_220px]">
            <label className="relative block">
              <span className="sr-only">Tìm lớp học</span>
              <MagnifyingGlass className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              <input value={library.search} onChange={(event) => library.setSearch(event.target.value)} placeholder="Tìm lớp, môn học hoặc gia sư..." className="h-10 w-full rounded-xl border border-input pl-10 pr-3 text-sm outline-none placeholder:text-slate-500 focus:border-[#280F91] focus:ring-2 focus:ring-[#280F91]/20" />
            </label>
            <label>
              <span className="sr-only">Lọc theo môn học</span>
              <select value={library.subject} onChange={(event) => library.setSubject(event.target.value)} className="h-10 w-full rounded-xl border border-input bg-white px-3 text-sm font-semibold outline-none focus:border-[#280F91] focus:ring-2 focus:ring-[#280F91]/20">
                <option value="all">Tất cả môn học</option>
                {library.subjects.map((subject) => <option key={subject} value={subject}>{subject}</option>)}
              </select>
            </label>
          </div>
        </section>

        <ExerciseClassList classes={library.filteredClasses} />
      </div>
    </div>
  );
}
