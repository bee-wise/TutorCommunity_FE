"use client";

import { MagnifyingGlass } from "@phosphor-icons/react";
import { useClassLibrary } from "../hooks/useLearnerMaterials";
import { ClassLibraryList } from "./ClassLibraryList";

export function ClassLibraryScreen() {
  const library = useClassLibrary();

  return (
    <div className="min-h-full bg-[#F8FAFC]">
      <div className="mx-auto max-w-[1400px] space-y-5 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <header><h1 className="text-2xl font-extrabold leading-tight sm:text-3xl">Kho tài liệu</h1><p className="mt-1.5 max-w-2xl text-sm text-muted-foreground">Xem tài liệu được gia sư tạo bằng AI hoặc tải lên theo từng lớp và buổi học.</p></header>

        <section className="rounded-2xl border border-border bg-white p-3 shadow-sm sm:p-4" aria-label="Bộ lọc lớp học">
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-[minmax(240px,1fr)_200px]">
            <label className="relative block"><span className="sr-only">Tìm lớp học</span><MagnifyingGlass className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} /><input value={library.search} onChange={(event) => library.setSearch(event.target.value)} placeholder="Tìm môn học hoặc gia sư..." className="h-10 w-full rounded-xl border border-input bg-white pl-10 pr-3 text-sm outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-[#280F91]/25" /></label>
            <label><span className="sr-only">Lọc theo môn học</span><select value={library.subject} onChange={(event) => library.setSubject(event.target.value)} className="h-10 w-full rounded-xl border border-input bg-white px-3 text-sm font-semibold outline-none focus:ring-2 focus:ring-[#280F91]/25"><option value="all">Tất cả môn học</option>{library.subjects.map((subject) => <option key={subject} value={subject}>{subject}</option>)}</select></label>
          </div>
        </section>

        <ClassLibraryList classes={library.filteredClasses} />
      </div>
    </div>
  );
}

