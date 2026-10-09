import { Button } from "@workspace/ui/components/ui/button";
import type { ClassLibraryFilters as Filters, LearnerClassKind, LearnerClassSort, LearnerClassStatus } from "../types/learner-materials.types";
import { LibrarySearch, LibrarySelect } from "./LibraryFilterControls";
import { libraryPanel } from "./learner-materials-ui";

const KINDS = [{ value: "individual", label: "Lớp 1:1" }, { value: "group", label: "Lớp nhóm" }] as const;
const STATUS_OPTIONS: readonly { value: "all" | LearnerClassStatus; label: string }[] = [
  { value: "all", label: "Tất cả trạng thái" }, { value: "active", label: "Đang học" }, { value: "upcoming", label: "Sắp khai giảng" }, { value: "completed", label: "Đã kết thúc" },
];
const SORT_OPTIONS: readonly { value: LearnerClassSort; label: string }[] = [
  { value: "newest", label: "Thêm mới nhất" }, { value: "oldest", label: "Thêm cũ nhất" }, { value: "status", label: "Theo trạng thái lớp" },
];

export function ClassLibraryFilters({ filters, subjects, counts, onChange }: {
  filters: Filters; subjects: readonly string[]; counts: Readonly<Record<LearnerClassKind, number>>; onChange: (patch: Partial<Filters>) => void;
}) {
  return (
    <section className={`${libraryPanel} space-y-5`} aria-label="Bộ lọc lớp học">
      <div role="group" aria-label="Loại lớp học" className="inline-flex max-w-full gap-1 rounded-full border border-border bg-card p-1">
        {KINDS.map((kind) => <Button key={kind.value} type="button" variant={filters.kind === kind.value ? "default" : "ghost"} aria-pressed={filters.kind === kind.value} aria-label={`${kind.label}: ${counts[kind.value]} lớp`} onClick={() => onChange({ kind: kind.value })}
          className={`min-h-11 gap-2 rounded-full border px-4 font-bold transition-all active:scale-[0.98] motion-reduce:transition-none ${filters.kind === kind.value ? "border-primary bg-primary text-primary-foreground" : "border-transparent text-muted-foreground hover:bg-muted hover:text-primary"}`}>
          {kind.label}<span aria-hidden="true" className={`min-w-5 rounded-full bg-card px-1.5 py-0.5 text-xs tabular-nums ${filters.kind === kind.value ? "text-primary" : "border border-border text-muted-foreground"}`}>{counts[kind.value]}</span>
        </Button>)}
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-[minmax(0,1fr)_170px_190px_190px]">
        <LibrarySearch id="class-search" label="Tìm lớp hoặc gia sư" value={filters.search} placeholder="Tên lớp, mã lớp, môn học, gia sư..." onChange={(search) => onChange({ search })} />
        <LibrarySelect id="class-subject" label="Môn học" value={filters.subject} options={[{ value: "all", label: "Tất cả môn học" }, ...subjects.map((subject) => ({ value: subject, label: subject }))]} onChange={(subject) => onChange({ subject })} />
        <LibrarySelect id="class-status" label="Trạng thái lớp" value={filters.status} options={STATUS_OPTIONS} onChange={(status) => onChange({ status })} />
        <LibrarySelect id="class-sort" label="Sắp xếp" value={filters.sort} options={SORT_OPTIONS} onChange={(sort) => onChange({ sort })} />
      </div>
    </section>
  );
}
