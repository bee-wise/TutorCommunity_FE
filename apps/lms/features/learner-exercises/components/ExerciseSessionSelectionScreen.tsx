"use client";

import Link from "next/link";
import { WarningCircle } from "@phosphor-icons/react";
import { Button } from "@workspace/ui/components/ui/button";
import { LibrarySearch, LibrarySelect } from "../../learner-materials/components/LibraryFilterControls";
import { useExerciseSessions } from "../hooks/useLearnerExercises";
import type { ExerciseAvailabilityFilter } from "../types/learner-exercises.types";
import { ExerciseSessionList } from "./ExerciseSessionList";

export function ExerciseSessionSelectionScreen({ classId }: { classId: string }) {
  const library = useExerciseSessions(classId);

  if (!library.classInfo) {
    return <MissingState />;
  }

  return (
    <div className="min-h-full bg-background">
      <div className="mx-auto max-w-[1150px] space-y-5 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <header className="flex flex-wrap items-center justify-between gap-3"><h1 className="font-nunito text-2xl font-extrabold text-primary sm:text-3xl">Bài tập theo buổi</h1><Button asChild variant="outline" className="min-h-11 rounded-xl transition-all active:scale-[0.98]"><Link href={`/lms/learner/classes/${encodeURIComponent(classId)}`}>Thông tin lớp</Link></Button></header>

        <section className="rounded-3xl border border-border bg-card p-4 shadow-soft sm:p-5" aria-label="Bộ lọc buổi học">
          <div className="grid gap-4 md:grid-cols-[minmax(240px,1fr)_220px]">
            <LibrarySearch id="exercise-session-search" label="Tìm buổi học" value={library.search} placeholder="Chủ đề buổi học..." onChange={library.setSearch} />
            <LibrarySelect id="exercise-session-availability" label="Tình trạng bài tập" value={library.availability} options={AVAILABILITY_OPTIONS} onChange={library.setAvailability} />
          </div>
        </section>

        <ExerciseSessionList classId={classId} sessions={library.filteredSessions} />
      </div>
    </div>
  );
}

const AVAILABILITY_OPTIONS: readonly { value: ExerciseAvailabilityFilter; label: string }[] = [
  { value: "all", label: "Tất cả buổi học" },
  { value: "with_exercises", label: "Đã có bài tập" },
  { value: "without_exercises", label: "Chưa có bài tập" },
];

function MissingState() {
  return <div className="grid min-h-[60dvh] place-items-center bg-[#F8FAFC] p-6 text-center"><div><WarningCircle className="mx-auto text-[#905B0F]" size={36} weight="duotone" /><h1 className="mt-3 text-xl font-extrabold">Không tìm thấy lớp học</h1><Button asChild variant="outline" className="mt-4 min-h-11 rounded-xl transition-all active:scale-[0.98]"><Link href="/lms/learner/classes">Quay lại danh sách lớp</Link></Button></div></div>;
}
