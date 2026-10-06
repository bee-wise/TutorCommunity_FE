"use client";

import { LmsSelect } from "@/components/LmsSelect";
import { actionClass, headingClass, inputClass, pageClass, panelClass, primaryActionClass } from "@/components/lms-page-ui";
import { TUTOR_CLASSES } from "../data/classes.mock";
import { useTutorClasses } from "../hooks/useTutorClasses";
import { useAttendanceStore } from "../store/attendance.store";
import { CLASS_LABELS } from "../types/classes.types";
import { TutorClassCard } from "./TutorClassCard";

export function TutorClassesScreen() {
  const library = useTutorClasses();
  const records = useAttendanceStore((state) => state.records);
  return (
    <div className={pageClass}>
      <header><h1 className={headingClass}>Quản lý lớp học</h1><p className="mt-1 text-sm leading-relaxed text-muted-foreground">Theo dõi lớp 1:1, lớp nhóm và điểm danh từng buổi học.</p></header>
      <section className={`${panelClass} space-y-4`} aria-label="Bộ lọc lớp học">
        <div role="group" aria-label="Loại lớp" className="flex flex-wrap gap-2">{(["individual", "group"] as const).map((kind) => <button key={kind} type="button" aria-pressed={library.filters.kind === kind} onClick={() => library.updateFilters({ kind })} className={library.filters.kind === kind ? primaryActionClass : actionClass}>{kind === "individual" ? "Lớp 1:1" : "Lớp nhóm"} ({TUTOR_CLASSES.filter((item) => item.kind === kind).length})</button>)}</div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-[minmax(0,1fr)_220px_180px]">
          <label className="grid gap-2 md:col-span-2 xl:col-span-1"><span className="text-sm font-bold">Tìm lớp / học viên</span><input type="search" className={inputClass} value={library.filters.search} onChange={(event) => library.updateFilters({ search: event.target.value })} placeholder="Tên lớp, mã lớp, môn học, học viên…" /></label>
          <div className="grid gap-2"><label htmlFor="classes-status" className="text-sm font-bold">Trạng thái lớp</label><LmsSelect id="classes-status" value={library.filters.status} options={[{ value: "all", label: "Tất cả trạng thái" }, ...Object.entries(CLASS_LABELS).map(([value, label]) => ({ value, label }))]} onValueChange={(value) => { if (value === "all" || value === "active" || value === "upcoming" || value === "completed") library.updateFilters({ status: value }); }} /></div>
          <div className="grid gap-2"><label htmlFor="classes-sort" className="text-sm font-bold">Sắp xếp</label><LmsSelect id="classes-sort" value={library.filters.sort} options={[{ value: "newest", label: "Mới nhất" }, { value: "oldest", label: "Cũ nhất" }, { value: "status", label: "Trạng thái lớp" }]} onValueChange={(value) => { if (value === "newest" || value === "oldest" || value === "status") library.updateFilters({ sort: value }); }} /></div>
        </div>
      </section>
      <p className="text-sm text-muted-foreground">{library.total} lớp phù hợp</p>
      {!library.total ? <section className={`${panelClass} space-y-3 py-8 text-center`}><h2 className="font-nunito text-lg font-extrabold text-primary">Không tìm thấy lớp phù hợp</h2><p className="text-sm text-muted-foreground">Thử thay đổi từ khóa hoặc trạng thái lớp.</p><button type="button" className={actionClass} onClick={library.resetFilters}>Đặt lại bộ lọc</button></section> : <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{library.classes.map((classInfo) => <TutorClassCard key={classInfo.id} classInfo={classInfo} records={records} />)}</div>}
      {library.pageCount > 1 && <nav aria-label="Phân trang lớp học" className="flex items-center justify-end gap-3"><button type="button" className={actionClass} disabled={!library.page} onClick={() => library.setPage(library.page - 1)}>Trước</button><span aria-live="polite" className="text-sm text-muted-foreground">{library.page + 1} / {library.pageCount}</span><button type="button" className={actionClass} disabled={library.page + 1 === library.pageCount} onClick={() => library.setPage(library.page + 1)}>Sau</button></nav>}
      <p className="text-xs leading-relaxed text-muted-foreground">Dữ liệu minh họa đồng bộ mã lớp với Quản lý tài liệu. Điểm danh chỉ lưu trong phiên trình duyệt, tải lại trang sẽ xóa thay đổi.</p>
    </div>
  );
}
