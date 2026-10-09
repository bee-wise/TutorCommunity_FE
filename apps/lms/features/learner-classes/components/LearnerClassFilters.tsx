"use client";

import { Button } from "@workspace/ui/components/ui/button";
import { LibrarySearch, LibrarySelect } from "../../learner-materials/components/LibraryFilterControls";
import type {
  ClassLibraryFilters,
  LearnerClassKind,
  LearnerClassSort,
  LearnerClassStatus,
} from "../../learner-materials/types/learner-materials.types";

const CLASS_KINDS = [
  { value: "individual", label: "Lớp 1:1" },
  { value: "group", label: "Lớp nhóm" },
] as const;

const STATUS_OPTIONS: readonly { value: "all" | LearnerClassStatus; label: string }[] = [
  { value: "all", label: "Tất cả trạng thái" },
  { value: "active", label: "Đang học" },
  { value: "upcoming", label: "Sắp khai giảng" },
  { value: "completed", label: "Đã kết thúc" },
];

const SORT_OPTIONS: readonly { value: LearnerClassSort; label: string }[] = [
  { value: "newest", label: "Mới nhất" },
  { value: "oldest", label: "Cũ nhất" },
  { value: "status", label: "Theo trạng thái" },
];

interface LearnerClassFiltersProps {
  filters: ClassLibraryFilters;
  subjects: readonly string[];
  counts: Readonly<Record<LearnerClassKind, number>>;
  resultCount: number;
  hasFilters: boolean;
  onChange: (patch: Partial<ClassLibraryFilters>) => void;
  onReset: () => void;
}

export function LearnerClassFilters({
  filters,
  subjects,
  counts,
  resultCount,
  hasFilters,
  onChange,
  onReset,
}: LearnerClassFiltersProps) {
  const subjectOptions = [
    { value: "all", label: "Tất cả môn học" },
    ...subjects.map((subject) => ({ value: subject, label: subject })),
  ];

  return (
    <section
      aria-label="Bộ lọc lớp học"
      className="rounded-3xl border border-border bg-card p-4 shadow-soft sm:p-5"
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div
          role="group"
          aria-label="Loại lớp học"
          className="grid w-full grid-cols-2 gap-1 rounded-full border border-border bg-card p-1 sm:w-auto"
        >
          {CLASS_KINDS.map((kind) => {
            const selected = filters.kind === kind.value;
            return (
              <Button
                key={kind.value}
                type="button"
                variant={selected ? "default" : "ghost"}
                aria-pressed={selected}
                aria-label={`${kind.label}: ${counts[kind.value]} lớp`}
                onClick={() => onChange({ kind: kind.value })}
                className={`min-h-11 rounded-full px-4 text-sm font-bold transition-all active:scale-[0.98] motion-reduce:transform-none ${selected ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-card hover:text-primary"}`}
              >
                {kind.label}
                <span
                  aria-hidden="true"
                  className={`rounded-full px-1.5 py-0.5 text-xs tabular-nums ${selected ? "bg-card text-primary" : "border border-border bg-card text-muted-foreground"}`}
                >
                  {counts[kind.value]}
                </span>
              </Button>
            );
          })}
        </div>
        <div className="flex items-center justify-between gap-3 sm:justify-end">
          <p role="status" aria-live="polite" className="text-sm font-semibold text-muted-foreground">
            {resultCount} lớp phù hợp
          </p>
          {hasFilters && resultCount > 0 && (
            <Button
              type="button"
              variant="outline"
              onClick={onReset}
              className="min-h-11 rounded-full border-border px-4 font-bold text-primary transition-all active:scale-[0.98]"
            >
              Xóa lọc
            </Button>
          )}
        </div>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-[minmax(220px,1.6fr)_repeat(3,minmax(140px,1fr))]">
        <LibrarySearch
          id="learner-class-search"
          label="Tìm lớp hoặc gia sư"
          value={filters.search}
          placeholder="Tên lớp, mã lớp hoặc gia sư"
          onChange={(search) => onChange({ search })}
        />
        <LibrarySelect
          id="learner-class-subject"
          label="Môn học"
          value={filters.subject}
          options={subjectOptions}
          onChange={(subject) => onChange({ subject })}
        />
        <LibrarySelect
          id="learner-class-status"
          label="Trạng thái"
          value={filters.status}
          options={STATUS_OPTIONS}
          onChange={(status) => onChange({ status })}
        />
        <LibrarySelect
          id="learner-class-sort"
          label="Sắp xếp"
          value={filters.sort}
          options={SORT_OPTIONS}
          onChange={(sort) => onChange({ sort })}
        />
      </div>
    </section>
  );
}
