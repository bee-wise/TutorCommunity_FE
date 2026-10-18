"use client";

import { Button } from "@workspace/ui/components/ui/button";
import { Input } from "@workspace/ui/components/ui/input";
import { ClassFilterSelect } from "../../tutor-classes/components/ClassFilterSelect";
import type { LearnerClassFilters } from "../services/learner-classes.service";
import { learnerAction } from "./LearnerApiClassCard";

export function LearnerApiClassFilters({
  filters,
  counts,
  onChange,
  onReset,
}: {
  filters: LearnerClassFilters;
  counts: { INDIVIDUAL?: number; GROUP?: number };
  onChange: (v: Partial<LearnerClassFilters>) => void;
  onReset: () => void;
}) {
  return (
    <section
      aria-label="Bộ lọc lớp học"
      className="space-y-4 rounded-3xl border border-border bg-card p-4 shadow-soft"
    >
      <div
        role="group"
        aria-label="Loại lớp học"
        className="flex flex-wrap gap-2"
      >
        {(["INDIVIDUAL", "GROUP"] as const).map((kind) => (
          <Button
            key={kind}
            variant={filters.kind === kind ? "default" : "outline"}
            className={learnerAction}
            aria-pressed={filters.kind === kind}
            onClick={() => onChange({ kind })}
          >
            {kind === "GROUP" ? "Lớp nhóm" : "Lớp 1:1"}
            {counts[kind] != null ? ` (${counts[kind]})` : ""}
          </Button>
        ))}
      </div>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-[minmax(200px,1fr)_200px_190px_auto]">
        <label className="grid gap-1.5 text-xs font-bold">
          Tìm lớp học
          <Input
            className="min-h-11 rounded-2xl"
            maxLength={100}
            value={filters.search}
            onChange={(e) => onChange({ search: e.target.value })}
            placeholder="Tên lớp, mã lớp hoặc môn học"
          />
        </label>
        <label className="grid gap-1.5 text-xs font-bold">
          Trạng thái
          <ClassFilterSelect
            value={filters.status}
            onValueChange={(v) =>
              onChange({
                status: v === "ACTIVE" || v === "COMPLETED" ? v : "all",
              })
            }
            options={[
              { value: "all", label: "Tất cả trạng thái" },
              { value: "ACTIVE", label: "Đang học" },
              { value: "COMPLETED", label: "Đã kết thúc" },
            ]}
          />
        </label>
        <label className="grid gap-1.5 text-xs font-bold">
          Sắp xếp
          <ClassFilterSelect
            value={filters.sort}
            onValueChange={(v) =>
              onChange({
                sort: v === "OLDEST" || v === "STATUS" ? v : "NEWEST",
              })
            }
            options={[
              { value: "NEWEST", label: "Mới nhất" },
              { value: "OLDEST", label: "Cũ nhất" },
              { value: "STATUS", label: "Theo trạng thái" },
            ]}
          />
        </label>
        {(filters.search ||
          filters.status !== "all" ||
          filters.sort !== "NEWEST") && (
          <Button
            variant="outline"
            className={`${learnerAction} self-end`}
            onClick={onReset}
          >
            Xóa lọc
          </Button>
        )}
      </div>
    </section>
  );
}
