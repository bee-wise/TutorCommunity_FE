"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ArrowLeft,
  FileArrowUp,
  MagnifyingGlass,
  WarningCircle,
} from "@phosphor-icons/react";
import { toast } from "@workspace/ui/components/ui/bee-toast";
import { useMaterialsLibrary } from "../hooks/useMaterialsLibrary";
import type {
  LibraryMaterialStatus,
  LibraryMaterialStatusFilter,
  MaterialSourceFilter,
  TutorMaterial,
} from "../types";
import { EditMaterialDialog } from "./EditMaterialDialog";
import { MaterialLibraryList } from "./MaterialLibraryList";
import { SessionCoveragePanel } from "./SessionCoveragePanel";
import { UploadMaterialDialog } from "./UploadMaterialDialog";

export function LearnerMaterialsScreen({ learnerId }: { learnerId: string }) {
  const library = useMaterialsLibrary(learnerId);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState<TutorMaterial | null>(null);

  if (!library.learner) {
    return (
      <div className="grid min-h-[60dvh] place-items-center bg-[#F8FAFC] p-6 text-center">
        <div><WarningCircle size={38} weight="duotone" className="mx-auto text-[#905B0F]" /><h1 className="mt-3 text-xl font-extrabold">Không tìm thấy học viên</h1><Link href="/lms/tutor/materials" className="mt-4 inline-flex h-10 items-center rounded-xl bg-[#280F91] px-4 text-sm font-bold text-white">Quay lại danh sách</Link></div>
      </div>
    );
  }

  const learnerMaterials = library.materials.filter((item) => item.learnerId === learnerId);
  const coveredSessionIds = new Set(learnerMaterials.map((item) => item.sessionId));
  const missingCount = library.learnerSessions.filter((session) => !coveredSessionIds.has(session.id)).length;

  function updateStatus(material: TutorMaterial, status: LibraryMaterialStatus) {
    library.setMaterialStatus(material.id, status);
    const message = status === "hidden" ? "Đã ẩn tài liệu" : status === "draft" ? "Đã lưu bản nháp" : "Đã chia sẻ tài liệu";
    toast.success(message, { description: material.title });
  }

  function saveEdit(id: string, title: string, status: LibraryMaterialStatus) {
    library.updateMaterial(id, { title, status });
    toast.success("Đã cập nhật tài liệu", { description: title });
  }

  return (
    <div className="min-h-full bg-[#F8FAFC]">
      <div className="mx-auto max-w-[1400px] space-y-5 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <Link href="/lms/tutor/materials" className="inline-flex items-center gap-1.5 text-sm font-bold text-[#280F91] hover:underline"><ArrowLeft size={17} weight="bold" /> Danh sách học viên</Link>

        <header className="flex flex-col gap-4 rounded-2xl border border-[#DCE8FB] bg-white p-5 shadow-sm md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <span className="grid size-14 shrink-0 place-items-center rounded-2xl bg-[#CFE1FA] font-nunito text-lg font-extrabold text-[#280F91]">{library.learner.initials}</span>
            <div><p className="text-sm font-medium text-muted-foreground">Thư viện học viên</p><h1 className="text-2xl font-extrabold">{library.learner.fullName}</h1><p className="mt-1 text-sm text-muted-foreground">{library.learner.gradeLevel} • {library.learnerSessions.length} buổi học • {learnerMaterials.length} tài liệu</p></div>
          </div>
          <button type="button" onClick={() => setUploadOpen(true)} className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-[#280F91] px-4 text-sm font-bold text-white hover:bg-[#280F91]/90"><FileArrowUp size={18} weight="bold" /> Tải tài liệu</button>
        </header>

        {missingCount > 0 && (
          <div className="flex items-start gap-2 rounded-xl border border-[#FFC500]/35 bg-[#FFC500]/10 px-3.5 py-3 text-sm text-[#905B0F]"><WarningCircle className="mt-0.5 shrink-0" size={18} weight="bold" /><p><strong>{missingCount} buổi học</strong> chưa được tạo hoặc tải tài liệu. Kiểm tra danh sách buổi học bên dưới.</p></div>
        )}

        <div className="grid grid-cols-1 items-start gap-5 xl:grid-cols-[minmax(0,1fr)_350px]">
          <section className="rounded-2xl border border-border bg-white p-4 shadow-sm sm:p-5" aria-labelledby="material-library-title">
            <div><h2 id="material-library-title" className="text-lg font-extrabold">Danh sách tài liệu</h2><p className="mt-1 text-xs text-muted-foreground">Lọc theo nguồn tạo, môn học và trạng thái hiển thị.</p></div>

            <div className="mt-4 grid grid-cols-1 gap-2 md:grid-cols-2 xl:grid-cols-[minmax(180px,1fr)_150px_160px_155px]">
              <label className="relative block"><span className="sr-only">Tìm tài liệu</span><MagnifyingGlass className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={17} /><input value={library.search} onChange={(event) => library.setSearch(event.target.value)} placeholder="Tìm tài liệu..." className="h-10 w-full rounded-xl border border-input pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-[#280F91]/25" /></label>
              <FilterSelect label="Nguồn tài liệu" value={library.source} onChange={(value) => library.setSource(value as MaterialSourceFilter)} options={[{ value: "all", label: "Mọi nguồn" }, { value: "ai", label: "Tạo bằng AI" }, { value: "upload", label: "Tải lên" }]} />
              <FilterSelect label="Môn học" value={library.subject} onChange={library.setSubject} options={[{ value: "all", label: "Tất cả môn" }, ...library.subjects.map((item) => ({ value: item, label: item }))]} />
              <FilterSelect label="Trạng thái" value={library.status} onChange={(value) => library.setStatus(value as LibraryMaterialStatusFilter)} options={[{ value: "all", label: "Mọi trạng thái" }, { value: "published", label: "Đã chia sẻ" }, { value: "draft", label: "Bản nháp" }, { value: "hidden", label: "Đang ẩn" }]} />
            </div>

            <div className="mt-4">
              <MaterialLibraryList
                materials={library.filteredMaterials}
                sessions={library.learnerSessions}
                onEdit={(material) => { setEditingMaterial(material); setEditOpen(true); }}
                onToggleHidden={(material) => updateStatus(material, material.status === "hidden" ? "published" : "hidden")}
                onToggleDraft={(material) => updateStatus(material, material.status === "draft" ? "published" : "draft")}
              />
            </div>
          </section>

          <SessionCoveragePanel sessions={library.learnerSessions} materials={learnerMaterials} />
        </div>
      </div>

      <UploadMaterialDialog learner={library.learner} sessions={library.learnerSessions} open={uploadOpen} onOpenChange={setUploadOpen} onUpload={(sessionId, file, title, saveAsDraft) => { library.uploadMaterial(learnerId, sessionId, file, title, saveAsDraft); toast.success(saveAsDraft ? "Đã lưu bản nháp" : "Đã tải tài liệu", { description: title }); }} />
      {editingMaterial && (
        <EditMaterialDialog
          key={editingMaterial.id}
          material={editingMaterial}
          open={editOpen}
          onOpenChange={setEditOpen}
          onSave={saveEdit}
        />
      )}
    </div>
  );
}

function FilterSelect({ label, value, options, onChange }: { label: string; value: string; options: { value: string; label: string }[]; onChange: (value: string) => void }) {
  return <label><span className="sr-only">{label}</span><select value={value} onChange={(event) => onChange(event.target.value)} className="h-10 w-full rounded-xl border border-input bg-white px-3 text-sm font-medium outline-none focus:ring-2 focus:ring-[#280F91]/25">{options.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select></label>;
}
