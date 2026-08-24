"use client";

import Link from "next/link";
import { ArrowLeft, MagnifyingGlass, WarningCircle } from "@phosphor-icons/react";
import { useClassSessions } from "../hooks/useLearnerMaterials";
import type {
  LearnerClassSessionStatus,
  SessionMaterialAvailability,
} from "../types/learner-materials.types";
import { ClassSessionList } from "./ClassSessionList";

export function ClassSessionsScreen({ classId }: { classId: string }) {
  const library = useClassSessions(classId);

  if (!library.classInfo) {
    return <MissingState message="Không tìm thấy lớp học" href="/lms/learner/materials" />;
  }

  return (
    <div className="min-h-full bg-[#F8FAFC]">
      <div className="mx-auto max-w-[1200px] space-y-5 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <Link href="/lms/learner/materials" className="inline-flex items-center gap-1.5 text-sm font-bold text-[#280F91] hover:underline"><ArrowLeft size={17} weight="bold" /> Kho tài liệu</Link>
        <header className="flex items-center gap-4 rounded-2xl border border-border bg-white p-5 shadow-sm">
          <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-[#CFE1FA] text-sm font-extrabold text-[#280F91]">{library.classInfo.tutorInitials}</span>
          <div><p className="text-sm font-medium text-muted-foreground">{library.classInfo.level}</p><h1 className="text-2xl font-extrabold">{library.classInfo.subject}</h1><p className="mt-1 text-sm text-muted-foreground">{library.classInfo.tutorName} • {library.classInfo.scheduleLabel}</p></div>
        </header>

        <section className="rounded-2xl border border-border bg-white p-3 shadow-sm sm:p-4" aria-label="Bộ lọc buổi học">
          <div className="grid grid-cols-1 gap-2 md:grid-cols-[minmax(220px,1fr)_180px_200px]">
            <label className="relative block"><span className="sr-only">Tìm chủ đề buổi học</span><MagnifyingGlass className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} /><input value={library.search} onChange={(event) => library.setSearch(event.target.value)} placeholder="Tìm chủ đề buổi học..." className="h-10 w-full rounded-xl border border-input pl-10 pr-3 text-sm outline-none focus:ring-2 focus:ring-[#280F91]/25" /></label>
            <FilterSelect label="Trạng thái" value={library.status} onChange={(value) => library.setStatus(value as "all" | LearnerClassSessionStatus)} options={[{ value: "all", label: "Mọi trạng thái" }, { value: "COMPLETED", label: "Đã hoàn thành" }, { value: "UPCOMING", label: "Sắp diễn ra" }, { value: "CANCELED", label: "Đã hủy" }]} />
            <FilterSelect label="Tình trạng tài liệu" value={library.availability} onChange={(value) => library.setAvailability(value as SessionMaterialAvailability)} options={[{ value: "all", label: "Mọi tình trạng" }, { value: "available", label: "Đã có tài liệu" }, { value: "empty", label: "Chưa có tài liệu" }]} />
          </div>
        </section>

        <ClassSessionList classId={classId} sessions={library.filteredSessions} materials={library.materials} />
      </div>
    </div>
  );
}

function FilterSelect({ label, value, options, onChange }: { label: string; value: string; options: { value: string; label: string }[]; onChange: (value: string) => void }) {
  return <label><span className="sr-only">{label}</span><select value={value} onChange={(event) => onChange(event.target.value)} className="h-10 w-full rounded-xl border border-input bg-white px-3 text-sm font-semibold outline-none focus:ring-2 focus:ring-[#280F91]/25">{options.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select></label>;
}

function MissingState({ message, href }: { message: string; href: string }) {
  return <div className="grid min-h-[60dvh] place-items-center bg-[#F8FAFC] p-6 text-center"><div><WarningCircle size={36} weight="duotone" className="mx-auto text-[#905B0F]" /><h1 className="mt-3 text-xl font-extrabold">{message}</h1><Link href={href} className="mt-4 inline-flex h-10 items-center rounded-xl bg-[#280F91] px-4 text-sm font-bold text-white">Quay lại</Link></div></div>;
}

