"use client";

import { MagnifyingGlassIcon, XMarkIcon } from "@heroicons/react/20/solid";
import { Button } from "@workspace/ui/components/ui/button";
import { CLASS_LABELS, type ClassKind, type ClassFilters as Filters } from "../types/classes.types";
import { ClassFilterSelect } from "./ClassFilterSelect";
import { classInput, classLabel, classToolbar } from "./classes-ui";

const CLASS_KINDS = [{ value: "individual", label: "Lớp 1:1" }, { value: "group", label: "Lớp nhóm" }] as const;
const STATUS_OPTIONS = [{ value: "all", label: "Tất cả trạng thái" }, ...Object.entries(CLASS_LABELS).filter(([value]) => value !== "unknown").map(([value, label]) => ({ value, label }))];
const SORT_OPTIONS = [{ value: "newest", label: "Mới nhất" }, { value: "oldest", label: "Cũ nhất" }, { value: "status", label: "Trạng thái lớp" }];

export function ClassFilters({ filters, counts, onChange }: { filters: Filters; counts: Readonly<Partial<Record<ClassKind, number | undefined>>>; onChange: (patch: Partial<Filters>) => void }) {
  return (
    <section className={`${classToolbar} space-y-4 p-4 sm:p-5`} aria-label="Bộ lọc lớp học">
      <div role="group" aria-label="Loại lớp" className="flex flex-wrap gap-2 border-b border-border pb-4">
        {CLASS_KINDS.map((kind) => (
          <Button key={kind.value} type="button" variant={filters.kind === kind.value ? "default" : "outline"} aria-pressed={filters.kind === kind.value} onClick={() => onChange({ kind: kind.value })}
            className="min-h-10 gap-2 rounded-xl px-4 text-sm font-bold transition-all active:scale-[0.98]">
            {kind.label}
            {counts[kind.value] !== undefined && <span className={`rounded-md px-1.5 py-0.5 text-[11px] tabular-nums ${filters.kind === kind.value ? "bg-primary-foreground/15" : "bg-muted"}`}>{counts[kind.value]}</span>}
          </Button>
        ))}
      </div>
      <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_190px_170px] lg:items-end">
        <label className="grid min-w-0 gap-1.5">
          <span className={classLabel}>Tìm lớp học</span>
          <span className="relative">
            <MagnifyingGlassIcon className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
            <input type="search" maxLength={100} className={`${classInput} pr-11 pl-10`} value={filters.search} onChange={(event) => onChange({ search: event.target.value })} placeholder="Tên lớp, mã lớp hoặc môn học" />
            {filters.search && <button type="button" aria-label="Xóa từ khóa" onClick={() => onChange({ search: "" })} className="absolute right-2 top-1/2 grid size-8 -translate-y-1/2 place-items-center rounded-lg text-muted-foreground transition-all hover:bg-muted hover:text-primary active:scale-95"><XMarkIcon className="size-4" /></button>}
          </span>
        </label>
        <div className="grid min-w-0 gap-1.5">
          <label htmlFor="classes-status" className={classLabel}>Trạng thái</label>
          <ClassFilterSelect id="classes-status" value={filters.status} options={STATUS_OPTIONS} onValueChange={(value) => { if (value === "all" || value === "active" || value === "upcoming" || value === "completed" || value === "pending_payment" || value === "cancelled") onChange({ status: value }); }} />
        </div>
        <div className="grid min-w-0 gap-1.5">
          <label htmlFor="classes-sort" className={classLabel}>Sắp xếp</label>
          <ClassFilterSelect id="classes-sort" value={filters.sort} options={SORT_OPTIONS} onValueChange={(value) => { if (value === "newest" || value === "oldest" || value === "status") onChange({ sort: value }); }} />
        </div>
      </div>
    </section>
  );
}
