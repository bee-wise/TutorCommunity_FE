"use client";

import { MagnifyingGlassIcon } from "@heroicons/react/20/solid";
import { Button } from "@workspace/ui/components/ui/button";
import { useClassSessions } from "../hooks/useClassSessions";
import { SESSION_LABELS, type TutorClass, type TutorClassSession } from "../types/classes.types";
import { ClassFilterSelect } from "./ClassFilterSelect";
import { ClassPagination } from "./ClassPagination";
import { ClassSessionCard } from "./ClassSessionCard";
import { classInput, classLabel, classOutlineButton, classPanel, classSessionFiltersGrid, classToolbar } from "./classes-ui";

const STATUS_OPTIONS = [{ value: "all", label: "Tất cả buổi học" }, ...Object.entries(SESSION_LABELS).map(([value, label]) => ({ value, label }))];
const ATTENDANCE_OPTIONS = [{ value: "all", label: "Tất cả điểm danh" }, { value: "unmarked", label: "Chưa điểm danh" }, { value: "draft", label: "Bản nháp" }, { value: "confirmed", label: "Đã xác nhận" }];

export function ClassSessionList({ classInfo, onAttendance }: {
  classInfo: TutorClass;
  onAttendance: (session: TutorClassSession, trigger: HTMLButtonElement) => void;
}) {
  const list = useClassSessions(classInfo.id);
  return (
    <section className="space-y-4" aria-label="Danh sách buổi học">
      <div className={`${classToolbar} ${classSessionFiltersGrid}`}>
        <label className="col-span-2 grid min-w-0 gap-1 lg:col-span-1">
          <span className={classLabel}>Tìm buổi học</span>
          <span className="relative">
            <MagnifyingGlassIcon className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
            <input type="search" className={`${classInput} pl-10`} value={list.search} onChange={(event) => list.updateSearch(event.target.value)} placeholder="Nội dung hoặc mã buổi học…" />
          </span>
        </label>
        <div className="grid min-w-0 gap-1">
          <label htmlFor="class-session-status" className={classLabel}>Trạng thái buổi</label>
          <ClassFilterSelect id="class-session-status" value={list.status} options={STATUS_OPTIONS} onValueChange={list.updateStatus} />
        </div>
        <div className="grid min-w-0 gap-1">
          <label htmlFor="class-attendance-state" className={classLabel}>Điểm danh</label>
          <ClassFilterSelect id="class-attendance-state" value={list.attendance} options={ATTENDANCE_OPTIONS} onValueChange={list.updateAttendance} />
        </div>
      </div>
      <p aria-live="polite" className="text-xs leading-5 text-muted-foreground">{list.total} buổi phù hợp · Giờ Việt Nam</p>
      {!list.total ? (
        <div className={`${classPanel} space-y-3 border-dashed px-4 py-8 text-center`}>
          <p className="text-sm text-muted-foreground">Không có buổi học phù hợp.</p>
          <Button type="button" variant="outline" className={classOutlineButton} onClick={list.resetFilters}>Đặt lại bộ lọc</Button>
        </div>
      ) : (
        <div className="space-y-3">
          {list.sessions.map((session) => <ClassSessionCard key={session.id} classInfo={classInfo} session={session} record={list.records[session.id]} onAttendance={onAttendance} />)}
        </div>
      )}
      <ClassPagination page={list.page} pageCount={list.pageCount} label="Phân trang buổi học" onPageChange={list.setPage} />
    </section>
  );
}
