"use client";

import { MagnifyingGlassIcon } from "@heroicons/react/20/solid";
import { Button } from "@workspace/ui/components/ui/button";
import { CLASS_LABELS, type ClassKind, type ClassFilters as Filters } from "../types/classes.types";
import { ClassFilterSelect } from "./ClassFilterSelect";
import { classFiltersGrid, classInput, classLabel, classToolbar } from "./classes-ui";

const CLASS_KINDS = [{ value: "individual", label: "Lớp 1:1" }, { value: "group", label: "Lớp nhóm" }] as const;
const STATUS_OPTIONS = [{ value: "all", label: "Tất cả trạng thái" }, ...Object.entries(CLASS_LABELS).map(([value, label]) => ({ value, label }))];
const SORT_OPTIONS = [{ value: "newest", label: "Mới nhất" }, { value: "oldest", label: "Cũ nhất" }, { value: "status", label: "Trạng thái lớp" }];

export function ClassFilters({ filters, counts, onChange }: { filters: Filters; counts: Readonly<Record<ClassKind, number>>; onChange: (patch: Partial<Filters>) => void }) {
  return (
    <section className={`${classToolbar} ${classFiltersGrid}`} aria-label="Bộ lọc lớp học">
      <div role="group" aria-label="Loại lớp" className="col-span-2 inline-flex w-fit max-w-full gap-1 md:col-span-3 xl:col-span-1">
        {CLASS_KINDS.map((kind) => (
          <Button key={kind.value} type="button" variant="ghost" aria-pressed={filters.kind === kind.value} onClick={() => onChange({ kind: kind.value })}
            className={`min-h-11 gap-2 rounded-full border px-3 text-sm font-bold transition-all active:scale-[0.98] motion-reduce:transition-none ${filters.kind === kind.value ? "border-primary bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground" : "border-border bg-card text-muted-foreground hover:bg-muted"}`}>
            {kind.label}
            <span className="text-xs tabular-nums">{counts[kind.value]}</span>
          </Button>
        ))}
      </div>
        <label className="col-span-2 grid min-w-0 gap-1 md:col-span-1">
          <span className={classLabel}>Tìm lớp hoặc học viên</span>
          <span className="relative">
            <MagnifyingGlassIcon className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
            <input type="search" className={`${classInput} pl-10`} value={filters.search} onChange={(event) => onChange({ search: event.target.value })} placeholder="Tên lớp, mã lớp, môn học, học viên…" />
          </span>
        </label>
        <div className="grid min-w-0 gap-1">
          <label htmlFor="classes-status" className={classLabel}>Trạng thái lớp</label>
          <ClassFilterSelect id="classes-status" value={filters.status} options={STATUS_OPTIONS} onValueChange={(value) => { if (value === "all" || value === "active" || value === "upcoming" || value === "completed") onChange({ status: value }); }} />
        </div>
        <div className="grid min-w-0 gap-1">
          <label htmlFor="classes-sort" className={classLabel}>Sắp xếp</label>
          <ClassFilterSelect id="classes-sort" value={filters.sort} options={SORT_OPTIONS} onValueChange={(value) => { if (value === "newest" || value === "oldest" || value === "status") onChange({ sort: value }); }} />
        </div>
    </section>
  );
}
