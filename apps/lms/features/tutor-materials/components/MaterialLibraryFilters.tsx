"use client";

import { MagnifyingGlassIcon } from "@heroicons/react/20/solid";
import { Button } from "@workspace/ui/components/ui/button";
import { CLASS_STATUS_LABELS, type ClassKind } from "../types/class-materials.types";
import type { MaterialLibraryFilters as Filters } from "../types/material-library.types";
import { MaterialLibrarySelect } from "./MaterialLibrarySelect";
import { libraryInput, libraryLabel, libraryPanel } from "./material-library-ui";

const KINDS = [{ value: "individual", label: "Lớp 1:1" }, { value: "group", label: "Lớp nhóm" }] as const;
const STATUS_OPTIONS = [{ value: "all", label: "Tất cả trạng thái" }, ...Object.entries(CLASS_STATUS_LABELS).map(([value, label]) => ({ value, label }))];
const SORT_OPTIONS = [{ value: "newest", label: "Thêm mới nhất" }, { value: "oldest", label: "Thêm cũ nhất" }, { value: "status", label: "Theo trạng thái lớp" }];

export function MaterialLibraryFilters({ filters, counts, onChange }: {
  filters: Filters;
  counts: Readonly<Record<ClassKind, number>>;
  onChange: (patch: Partial<Filters>) => void;
}) {
  return (
    <section className={`${libraryPanel} space-y-5`} aria-label="Bộ lọc lớp học">
      <div role="group" aria-label="Loại lớp học" className="inline-flex max-w-full gap-1 rounded-full border border-border bg-card p-1">
        {KINDS.map((kind) => (
          <Button key={kind.value} type="button" variant={filters.kind === kind.value ? "default" : "ghost"} aria-pressed={filters.kind === kind.value} aria-label={`${kind.label}: ${counts[kind.value]} lớp`} onClick={() => onChange({ kind: kind.value })}
            className={`min-h-11 gap-2 rounded-full border px-4 text-sm font-bold transition-all active:scale-[0.98] motion-reduce:transition-none ${filters.kind === kind.value ? "border-primary bg-primary text-primary-foreground" : "border-transparent text-muted-foreground hover:bg-muted hover:text-primary"}`}>
            {kind.label}<span aria-hidden="true" className={`min-w-5 rounded-full px-1.5 py-0.5 text-xs tabular-nums ${filters.kind === kind.value ? "bg-card text-primary" : "border border-border bg-card text-muted-foreground"}`}>{counts[kind.value]}</span>
          </Button>
        ))}
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-[minmax(0,1fr)_220px_220px]">
        <label className="grid gap-2 md:col-span-2 xl:col-span-1">
          <span className={libraryLabel}>Tìm lớp hoặc học viên</span>
          <span className="relative">
            <MagnifyingGlassIcon className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
            <input type="search" value={filters.search} onChange={(event) => onChange({ search: event.target.value })} placeholder="Tên lớp, mã lớp, môn học, học viên..." className={`${libraryInput} pl-10`} />
          </span>
        </label>
        <div className="grid gap-2">
          <label htmlFor="class-status" className={libraryLabel}>Trạng thái lớp</label>
          <MaterialLibrarySelect id="class-status" label="Trạng thái lớp" value={filters.status} onChange={(value) => { if (value === "all" || value === "active" || value === "upcoming" || value === "completed") onChange({ status: value }); }} options={STATUS_OPTIONS} />
        </div>
        <div className="grid gap-2">
          <label htmlFor="class-sort" className={libraryLabel}>Sắp xếp</label>
          <MaterialLibrarySelect id="class-sort" label="Sắp xếp lớp" value={filters.sort} onChange={(value) => { if (value === "newest" || value === "oldest" || value === "status") onChange({ sort: value }); }} options={SORT_OPTIONS} />
        </div>
      </div>
    </section>
  );
}
