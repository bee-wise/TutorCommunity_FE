"use client";

import { LibrarySearch, LibrarySelect } from "../../learner-materials/components/LibraryFilterControls";
import { useExerciseClasses } from "../hooks/useLearnerExercises";
import { ExerciseClassList } from "./ExerciseClassList";

export function ExerciseClassSelectionScreen() {
  const library = useExerciseClasses();

  return (
    <div className="min-h-full bg-background">
      <div className="mx-auto max-w-[1250px] space-y-5 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <header><h1 className="font-nunito text-2xl font-extrabold text-primary sm:text-3xl">Làm bài tập</h1></header>

        <section className="rounded-3xl border border-border bg-card p-4 shadow-soft sm:p-5" aria-label="Bộ lọc lớp học">
          <div className="grid gap-4 sm:grid-cols-[minmax(240px,1fr)_220px]">
            <LibrarySearch id="exercise-class-search" label="Tìm lớp học" value={library.search} placeholder="Lớp, môn học hoặc gia sư..." onChange={library.setSearch} />
            <LibrarySelect id="exercise-class-subject" label="Môn học" value={library.subject} options={[{ value: "all", label: "Tất cả môn học" }, ...library.subjects.map((subject) => ({ value: subject, label: subject }))]} onChange={library.setSubject} />
          </div>
        </section>

        <ExerciseClassList classes={library.filteredClasses} />
      </div>
    </div>
  );
}
