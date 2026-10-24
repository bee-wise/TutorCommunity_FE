"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { Button } from "@workspace/ui/components/ui/button";
import { useTutorClasses } from "../hooks/useTutorClasses";
import { ClassFilters } from "./ClassFilters";
import { ClassPagination } from "./ClassPagination";
import { TutorClassCard } from "./TutorClassCard";
import { ClassesSkeleton } from "./ClassesSkeleton";
import { ClassQueryErrorState } from "./ClassQueryErrorState";
import {
  classHeading,
  classOutlineButton,
  classPage,
  classPanel,
} from "./classes-ui";
import { ClassCardGroups } from "./ClassCardGroups";
import { GroupDraftResumeBanner } from "./GroupDraftResumeBanner";
import type { GroupDto } from "@workspace/core/lms-classes/group.schemas";
const GroupClassWizard = dynamic(() => import("./GroupClassWizard").then(m => m.GroupClassWizard));

export function TutorClassesScreen() {
  const library = useTutorClasses();
  const [wizard,setWizard] = useState<{ initial?: GroupDto; step?: number } | null>(null);
  const hasFilters = Boolean(
    library.filters.search ||
    library.filters.status !== "all" ||
    library.filters.sort !== "newest",
  );
  return (
    <div className={classPage}>
      <header className="flex flex-wrap items-center justify-between gap-3">
        <h1 className={classHeading}>Quản lý lớp học</h1>
        {!library.loading && !library.error && library.filters.kind === "group" && <Button className="min-h-11 rounded-full transition-all active:scale-[0.98]" onClick={()=>setWizard({})}>Tạo lớp nhóm</Button>}
      </header>
      <GroupDraftResumeBanner onResume={(initial, step) => setWizard({ initial, step })} />

      <ClassFilters
        filters={library.filters}
        counts={library.classCounts}
        onChange={library.updateFilters}
      />
      <section aria-labelledby="classes-results-title" className="space-y-4">
        <h2 id="classes-results-title" className="sr-only">Danh sách lớp học</h2>
        <div className="flex flex-wrap items-center justify-between gap-3">
          {hasFilters && !library.loading && !library.error && library.total > 0 && (
            <Button
              type="button"
              variant="outline"
              className={classOutlineButton}
              onClick={library.resetFilters}
            >
              Đặt lại bộ lọc
            </Button>
          )}
        </div>
        {library.loading ? <ClassesSkeleton resultsOnly /> : library.error ? <ClassQueryErrorState error={library.error} onRetry={library.retry} /> : !library.cards.length ? (
          <div className={`${classPanel} space-y-3 py-10 text-center`}>
            <h3 className="font-lms text-lg font-extrabold text-foreground">
              {library.outOfRange ? "Trang hiện tại không còn lớp học" : "Không tìm thấy lớp phù hợp"}
            </h3>
            <p className="text-sm text-muted-foreground">
              {library.outOfRange ? "Danh sách có thể đã thay đổi. Quay về trang đầu để tải lại." : "Thử thay đổi từ khóa hoặc trạng thái lớp."}
            </p>
            <Button
              type="button"
              variant="outline"
              className={classOutlineButton}
              onClick={library.outOfRange ? () => library.setPage(1) : library.resetFilters}
            >
              {library.outOfRange ? "Về trang đầu" : "Đặt lại bộ lọc"}
            </Button>
          </div>
        ) : (
          <ClassCardGroups cards={library.cards} grouped={library.filters.kind === "group"} />
        )}
        {!library.loading && !library.error && !library.outOfRange && <ClassPagination
          page={library.page - 1}
          pageCount={library.pageCount}
          label="Phân trang lớp học"
          onPageChange={(page) => library.setPage(page + 1)}
        />}
      </section>
      {wizard && <GroupClassWizard mode="create" initial={wizard.initial} initialStep={wizard.step} onClose={()=>setWizard(null)} />}
    </div>
  );
}
