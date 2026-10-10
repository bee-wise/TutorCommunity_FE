"use client";

import { Button } from "@workspace/ui/components/ui/button";
import { useLearnerClassDirectory } from "../hooks/useLearnerClassDirectory";
import { LearnerClassCard } from "./LearnerClassCard";
import { LearnerClassFilters } from "./LearnerClassFilters";

export function LearnerClassesScreen({ initialKind }: { initialKind?: string } = {}) {
  const directory = useLearnerClassDirectory(initialKind);

  return (
    <div className="mx-auto w-full max-w-[1400px] space-y-5 px-4 py-6 text-foreground sm:px-6 lg:px-8 lg:py-8">
      <header>
        <h1 className="font-nunito text-2xl font-extrabold leading-[1.25] text-primary sm:text-3xl">
          Lớp học
        </h1>
      </header>

      <LearnerClassFilters
        filters={directory.filters}
        subjects={directory.subjects}
        counts={directory.counts}
        resultCount={directory.filteredClasses.length}
        hasFilters={directory.hasFilters}
        onChange={directory.updateFilters}
        onReset={directory.resetFilters}
      />

      <section aria-label="Danh sách lớp học">
        {directory.filteredClasses.length ? (
          <div className="grid items-stretch gap-4 md:grid-cols-2 xl:grid-cols-3">
            {directory.filteredClasses.map((item) => (
              <LearnerClassCard key={item.classInfo.id} {...item} />
            ))}
          </div>
        ) : (
          <div className="rounded-3xl border border-border bg-card px-5 py-10 text-center shadow-soft">
            <h2 className="font-nunito text-lg font-extrabold text-primary">
              Không tìm thấy lớp phù hợp
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Thử thay đổi từ khóa, môn học hoặc trạng thái.
            </p>
            {directory.hasFilters && (
              <Button
                type="button"
                variant="outline"
                onClick={directory.resetFilters}
                className="mt-4 min-h-11 rounded-full border-border px-5 font-bold text-primary transition-all active:scale-[0.98]"
              >
                Xóa lọc
              </Button>
            )}
          </div>
        )}
      </section>

      <p className="text-xs text-muted-foreground">
        Dữ liệu lớp học đang hiển thị là dữ liệu minh họa.
      </p>
    </div>
  );
}
