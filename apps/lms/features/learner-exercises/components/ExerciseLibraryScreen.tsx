"use client";

import Link from "next/link";
import { ArrowLeft, MagnifyingGlass, WarningCircle } from "@phosphor-icons/react";
import { useSessionExercises } from "../hooks/useLearnerExercises";
import type {
  ExerciseSource,
  ExerciseStatusFilter,
} from "../types/learner-exercises.types";
import { formatExerciseDate } from "../utils/learner-exercises.utils";
import { ExerciseList } from "./ExerciseList";

export function ExerciseLibraryScreen({ classId, sessionId }: { classId: string; sessionId: string }) {
  const library = useSessionExercises(classId, sessionId);

  if (!library.classInfo || !library.session) {
    return <MissingState classId={classId} />;
  }

  return (
    <div className="min-h-full bg-[#F8FAFC]">
      <div className="mx-auto max-w-[1200px] space-y-5 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <Link href={`/lms/learner/exercises/classes/${classId}`} className="inline-flex items-center gap-1.5 text-sm font-bold text-[#280F91] hover:underline"><ArrowLeft size={17} weight="bold" /> Danh sách buổi học</Link>
        <header>
          <p className="text-sm font-bold text-[#280F91]">{library.classInfo.name} | Buổi {library.session.sequence}</p>
          <h1 className="mt-1 text-2xl font-extrabold text-slate-950 sm:text-3xl">{library.session.topic}</h1>
          <p className="mt-1.5 text-sm text-slate-500">{formatExerciseDate(library.session.taughtAt)} | {library.session.durationMinutes} phút | {library.classInfo.tutorName}</p>
        </header>

        <section className="rounded-2xl border border-border bg-white p-3 shadow-sm sm:p-4" aria-label="Bộ lọc bài tập">
          <div className="grid gap-2 md:grid-cols-2 xl:grid-cols-[minmax(240px,1fr)_190px_190px]">
            <label className="relative block">
              <span className="sr-only">Tìm bài tập</span>
              <MagnifyingGlass className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              <input value={library.search} onChange={(event) => library.setSearch(event.target.value)} placeholder="Tìm bài tập..." className="h-10 w-full rounded-xl border border-input pl-10 pr-3 text-sm outline-none placeholder:text-slate-500 focus:border-[#280F91] focus:ring-2 focus:ring-[#280F91]/20" />
            </label>
            <FilterSelect label="Trạng thái" value={library.status} onChange={(value) => library.setStatus(value as ExerciseStatusFilter)} options={[{ value: "all", label: "Mọi trạng thái" }, { value: "not_started", label: "Chưa làm" }, { value: "in_progress", label: "Đang làm" }, { value: "submitted", label: "Đã nộp" }, { value: "reviewed", label: "Đã chấm" }, { value: "overdue", label: "Quá hạn" }]} />
            <FilterSelect label="Nguồn bài tập" value={library.source} onChange={(value) => library.setSource(value as "all" | ExerciseSource)} options={[{ value: "all", label: "Mọi nguồn" }, { value: "ai", label: "Tạo bằng AI" }, { value: "upload", label: "Gia sư tải lên" }]} />
          </div>
        </section>

        <ExerciseList exercises={library.filteredExercises} />
      </div>
    </div>
  );
}

function FilterSelect({ label, value, options, onChange }: { label: string; value: string; options: { value: string; label: string }[]; onChange: (value: string) => void }) {
  return <label><span className="sr-only">{label}</span><select value={value} onChange={(event) => onChange(event.target.value)} className="h-10 w-full rounded-xl border border-input bg-white px-3 text-sm font-semibold outline-none focus:border-[#280F91] focus:ring-2 focus:ring-[#280F91]/20">{options.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select></label>;
}

function MissingState({ classId }: { classId: string }) {
  return <div className="grid min-h-[60dvh] place-items-center bg-[#F8FAFC] p-6 text-center"><div><WarningCircle className="mx-auto text-[#905B0F]" size={36} weight="duotone" /><h1 className="mt-3 text-xl font-extrabold">Không tìm thấy buổi học</h1><Link href={`/lms/learner/exercises/classes/${classId}`} className="mt-4 inline-flex h-10 items-center rounded-xl bg-[#280F91] px-4 text-sm font-bold text-white">Quay lại danh sách buổi học</Link></div></div>;
}
