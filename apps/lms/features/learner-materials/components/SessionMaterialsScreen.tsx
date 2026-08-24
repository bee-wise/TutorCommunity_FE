"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, MagnifyingGlass, WarningCircle } from "@phosphor-icons/react";
import { useSessionMaterials } from "../hooks/useLearnerMaterials";
import type {
  LearnerMaterialFileType,
  LearnerMaterialSource,
  LearnerSharedMaterial,
} from "../types/learner-materials.types";
import { formatLibraryDate } from "../utils/learner-materials.utils";
import { MaterialDetailDialog } from "./MaterialDetailDialog";
import { SharedMaterialList } from "./SharedMaterialList";

export function SessionMaterialsScreen({ classId, sessionId }: { classId: string; sessionId: string }) {
  const library = useSessionMaterials(classId, sessionId);
  const [selectedMaterial, setSelectedMaterial] = useState<LearnerSharedMaterial>();

  if (!library.classInfo || !library.session) {
    return <MissingState href={`/lms/learner/materials/classes/${classId}`} />;
  }

  return (
    <div className="min-h-full bg-[#F8FAFC]">
      <div className="mx-auto max-w-[1100px] space-y-5 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <Link href={`/lms/learner/materials/classes/${classId}`} className="inline-flex items-center gap-1.5 text-sm font-bold text-[#280F91] hover:underline">
          <ArrowLeft size={17} weight="bold" /> Danh sách buổi học
        </Link>
        <header className="rounded-2xl border border-border bg-white p-5 shadow-sm sm:p-6">
          <p className="text-sm font-bold text-[#280F91]">Buổi {library.session.sequence} • {library.classInfo.subject} {library.classInfo.level}</p>
          <h1 className="mt-1 text-2xl font-extrabold text-slate-950">{library.session.topic}</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {formatLibraryDate(library.session.taughtAt)} • {library.session.durationMinutes} phút • {library.classInfo.tutorName}
          </p>
        </header>

        <section className="rounded-2xl border border-border bg-white p-3 shadow-sm sm:p-4" aria-label="Bộ lọc tài liệu">
          <div className="grid grid-cols-1 gap-2 md:grid-cols-[minmax(220px,1fr)_190px_170px]">
            <label className="relative block">
              <span className="sr-only">Tìm tài liệu</span>
              <MagnifyingGlass className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
              <input value={library.search} onChange={(event) => library.setSearch(event.target.value)} placeholder="Tìm tên hoặc nội dung..." className="h-10 w-full rounded-xl border border-input pl-10 pr-3 text-sm outline-none focus:ring-2 focus:ring-[#280F91]/25" />
            </label>
            <FilterSelect label="Nguồn tài liệu" value={library.source} onChange={(value) => library.setSource(value as "all" | LearnerMaterialSource)} options={[{ value: "all", label: "Mọi nguồn" }, { value: "ai", label: "Tạo bằng AI" }, { value: "upload", label: "Gia sư tải lên" }]} />
            <FilterSelect label="Loại tệp" value={library.fileType} onChange={(value) => library.setFileType(value as "all" | LearnerMaterialFileType)} options={[{ value: "all", label: "Mọi loại tệp" }, { value: "BEEWISE", label: "BeeWise" }, { value: "PDF", label: "PDF" }, { value: "DOCX", label: "DOCX" }, { value: "PPTX", label: "PPTX" }]} />
          </div>
        </section>

        <SharedMaterialList materials={library.filteredMaterials} onView={setSelectedMaterial} />
      </div>
      <MaterialDetailDialog material={selectedMaterial} onClose={() => setSelectedMaterial(undefined)} />
    </div>
  );
}

function FilterSelect({ label, value, options, onChange }: { label: string; value: string; options: { value: string; label: string }[]; onChange: (value: string) => void }) {
  return <label><span className="sr-only">{label}</span><select value={value} onChange={(event) => onChange(event.target.value)} className="h-10 w-full rounded-xl border border-input bg-white px-3 text-sm font-semibold outline-none focus:ring-2 focus:ring-[#280F91]/25">{options.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select></label>;
}

function MissingState({ href }: { href: string }) {
  return <div className="grid min-h-[60dvh] place-items-center bg-[#F8FAFC] p-6 text-center"><div><WarningCircle size={36} weight="duotone" className="mx-auto text-[#905B0F]" /><h1 className="mt-3 text-xl font-extrabold">Không tìm thấy buổi học</h1><Link href={href} className="mt-4 inline-flex h-10 items-center rounded-xl bg-[#280F91] px-4 text-sm font-bold text-white">Quay lại</Link></div></div>;
}
