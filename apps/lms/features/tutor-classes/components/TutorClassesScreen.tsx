"use client";

import { Button } from "@workspace/ui/components/ui/button";
import { useTutorClasses } from "../hooks/useTutorClasses";
import { ClassFilters } from "./ClassFilters";
import { ClassPagination } from "./ClassPagination";
import { TutorClassCard } from "./TutorClassCard";
import { classHeading, classOutlineButton, classPage, classPanel } from "./classes-ui";

export function TutorClassesScreen() {
  const library = useTutorClasses();
  const hasFilters = Boolean(library.filters.search || library.filters.status !== "all" || library.filters.sort !== "newest");
  return (
    <div className={classPage}>
      <header className="space-y-2">
        <h1 className={classHeading}>Quản lý lớp học</h1>
        <p className="text-sm leading-relaxed text-muted-foreground">Các lớp bạn phụ trách, buổi học và điểm danh ở cùng một nơi.</p>
      </header>
      <ClassFilters filters={library.filters} counts={library.classCounts} onChange={library.updateFilters} />
      <section aria-labelledby="classes-results-title" className="space-y-4">
        <div className="flex min-h-11 flex-wrap items-center justify-between gap-3">
          <h2 id="classes-results-title" className="font-nunito text-base font-extrabold text-foreground">
            {library.filters.kind === "individual" ? "Lớp 1:1" : "Lớp nhóm"}
            <span aria-live="polite" aria-atomic="true" className="ml-2 text-sm font-medium text-muted-foreground">{library.total} lớp phù hợp</span>
          </h2>
          {hasFilters && library.total > 0 && <Button type="button" variant="outline" className={classOutlineButton} onClick={library.resetFilters}>Đặt lại bộ lọc</Button>}
        </div>
        {!library.total ? (
          <div className={`${classPanel} space-y-3 py-10 text-center`}>
            <h3 className="font-nunito text-lg font-extrabold text-primary">Không tìm thấy lớp phù hợp</h3>
            <p className="text-sm text-muted-foreground">Thử thay đổi từ khóa hoặc trạng thái lớp.</p>
            <Button type="button" variant="outline" className={classOutlineButton} onClick={library.resetFilters}>Đặt lại bộ lọc</Button>
          </div>
        ) : <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{library.cards.map((card) => <TutorClassCard key={card.classInfo.id} {...card} />)}</div>}
        <ClassPagination page={library.page} pageCount={library.pageCount} label="Phân trang lớp học" onPageChange={library.setPage} />
      </section>
      <p className="rounded-2xl border border-border bg-muted/40 px-4 py-3 text-xs leading-relaxed text-muted-foreground">Dữ liệu minh họa · Mã lớp đồng bộ với Quản lý tài liệu. Điểm danh chỉ lưu trong phiên hiện tại, tải lại trang sẽ xóa thay đổi.</p>
    </div>
  );
}
