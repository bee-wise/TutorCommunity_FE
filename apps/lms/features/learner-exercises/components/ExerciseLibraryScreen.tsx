"use client";

import Link from "next/link";
import { WarningCircle } from "@phosphor-icons/react";
import { Button } from "@workspace/ui/components/ui/button";
import { LibrarySearch, LibrarySelect } from "../../learner-materials/components/LibraryFilterControls";
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
    <div className="min-h-full bg-background">
      <div className="mx-auto max-w-[1200px] space-y-5 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <Button asChild variant="outline" className="min-h-11 rounded-xl transition-all active:scale-[0.98]"><Link href={`/lms/learner/exercises/classes/${encodeURIComponent(classId)}`}>Danh sách buổi học</Link></Button>
        <header>
          <p className="text-sm font-bold text-primary">Buổi {library.session.sequence}</p>
          <h1 className="mt-1 font-nunito text-2xl font-extrabold text-primary sm:text-3xl">{library.session.topic}</h1>
          <p className="mt-1.5 text-sm text-muted-foreground">{formatExerciseDate(library.session.taughtAt)} · {library.session.durationMinutes} phút</p>
        </header>

        <section className="rounded-3xl border border-border bg-card p-4 shadow-soft sm:p-5" aria-label="Bộ lọc bài tập">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-[minmax(240px,1fr)_190px_190px]">
            <div className="md:col-span-2 xl:col-span-1"><LibrarySearch id="exercise-search" label="Tìm bài tập" value={library.search} placeholder="Tên hoặc nội dung bài tập..." onChange={library.setSearch} /></div>
            <LibrarySelect id="exercise-status" label="Trạng thái" value={library.status} options={STATUS_OPTIONS} onChange={library.setStatus} />
            <LibrarySelect id="exercise-source" label="Nguồn bài tập" value={library.source} options={SOURCE_OPTIONS} onChange={library.setSource} />
          </div>
        </section>

        <ExerciseList exercises={library.filteredExercises} />
      </div>
    </div>
  );
}

const STATUS_OPTIONS: readonly { value: ExerciseStatusFilter; label: string }[] = [
  { value: "all", label: "Mọi trạng thái" }, { value: "not_started", label: "Chưa làm" },
  { value: "in_progress", label: "Đang làm" }, { value: "submitted", label: "Đã nộp" },
  { value: "reviewed", label: "Đã chấm" }, { value: "overdue", label: "Quá hạn" },
];
const SOURCE_OPTIONS: readonly { value: "all" | ExerciseSource; label: string }[] = [
  { value: "all", label: "Mọi nguồn" }, { value: "ai", label: "Tạo bằng AI" }, { value: "upload", label: "Gia sư tải lên" },
];

function MissingState({ classId }: { classId: string }) {
  return <div className="grid min-h-[60dvh] place-items-center bg-[#F8FAFC] p-6 text-center"><div><WarningCircle className="mx-auto text-[#905B0F]" size={36} weight="duotone" /><h1 className="mt-3 text-xl font-extrabold">Không tìm thấy buổi học</h1><Button asChild variant="outline" className="mt-4 min-h-11 rounded-xl transition-all active:scale-[0.98]"><Link href={`/lms/learner/exercises/classes/${encodeURIComponent(classId)}`}>Quay lại danh sách buổi học</Link></Button></div></div>;
}
