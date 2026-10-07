"use client";

import { useTutorClassLibrary } from "../hooks/useTutorClassLibrary";
import { MATERIAL_CLASSES } from "../data/classroom.mock";
import { CLASS_STATUS_LABELS } from "../types/class-materials.types";
import { MaterialClassCard } from "./MaterialClassCard";
import { MaterialsSelect } from "./MaterialsSelect";
import { ClassMaterialsSkeleton } from "./ClassMaterialsSkeleton";
import { inputClass, panelClass, outlineActionClass } from "./materials-ui";

export function TutorMaterialsScreen({ initialSearch = "" }: { initialSearch?: string }) {
  const library = useTutorClassLibrary(initialSearch);
  if (!library.ready) return <ClassMaterialsSkeleton />;
  return (
    <div className="mx-auto max-w-[1400px] space-y-6 px-4 py-6 text-foreground sm:px-6 lg:px-8">
      <header>
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-2xl leading-[1.25] text-primary sm:text-3xl">Quản lý tài liệu</h1>
          <span className="rounded-full border border-border px-3 py-1 text-xs font-semibold text-muted-foreground">Dữ liệu lớp minh họa</span>
        </div>
        <p className="mt-2 text-base text-muted-foreground">Một không gian tài liệu chung cho mỗi lớp 1:1 hoặc lớp nhóm.</p>
      </header>
      {library.storageError && <p role="alert" className="text-sm text-destructive">{library.storageError}</p>}
      <section className={panelClass} aria-label="Bộ lọc lớp học">
        <div className="flex flex-wrap gap-2" role="group" aria-label="Loại lớp học">
          {(["individual", "group"] as const).map((kind) => (
            <button key={kind} type="button" aria-pressed={library.kind === kind} onClick={() => library.setKind(kind)}
              className={`${outlineActionClass} ${library.kind === kind ? "!border-primary !bg-primary !text-primary-foreground" : ""}`}>
              {kind === "individual" ? "Lớp 1:1" : "Lớp nhóm"} ({MATERIAL_CLASSES.filter((item) => item.kind === kind).length})
            </button>
          ))}
        </div>
        <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-[minmax(0,1fr)_220px_220px]">
          <label className="grid gap-2 text-sm font-bold">
            Tìm lớp hoặc học viên
            <input value={library.search} onChange={(event) => library.setSearch(event.target.value)} placeholder="Tên lớp, mã lớp, môn học, học viên..." className={inputClass} />
          </label>
          <div className="grid gap-2">
            <label htmlFor="class-status" className="text-sm font-bold">Trạng thái lớp</label>
            <MaterialsSelect id="class-status" label="Trạng thái lớp" value={library.status} onChange={(value) => { if (value === "all" || value === "active" || value === "upcoming" || value === "completed") library.setStatus(value); }}
              options={[{ value: "all", label: "Tất cả trạng thái" }, ...Object.entries(CLASS_STATUS_LABELS).map(([value, label]) => ({ value, label }))]} />
          </div>
          <div className="grid gap-2">
            <label htmlFor="class-sort" className="text-sm font-bold">Sắp xếp</label>
            <MaterialsSelect id="class-sort" label="Sắp xếp lớp" value={library.sort} onChange={(value) => { if (value === "newest" || value === "oldest" || value === "status") library.setSort(value); }}
              options={[{ value: "newest", label: "Thêm mới nhất" }, { value: "oldest", label: "Thêm cũ nhất" }, { value: "status", label: "Theo trạng thái lớp" }]} />
          </div>
        </div>
      </section>
      <p className="text-sm text-muted-foreground" aria-live="polite">{library.classes.length} lớp phù hợp</p>
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {library.classes.map((classInfo) => <MaterialClassCard key={classInfo.id} classInfo={classInfo} materials={library.materials} />)}
      </div>
      {library.classes.length === 0 && <div className={`${panelClass} py-12 text-center`}><h2 className="text-xl text-primary">Không tìm thấy lớp học</h2><p className="mt-2 text-muted-foreground">Thử đổi tab, từ khóa hoặc trạng thái lớp.</p></div>}
    </div>
  );
}
