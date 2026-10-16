import { CalendarDaysIcon, ListBulletIcon } from "@heroicons/react/24/outline";
import { Button } from "@workspace/ui/components/ui/button";
import { LmsSelect } from "@/components/LmsSelect";
import type { ViewMode, FilterState } from "../types/schedule.types";
import { SUBJECT_OPTIONS, STATUS_OPTIONS } from "../types/schedule.types";

interface ControlBarProps {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  filters: FilterState;
  onSubjectChange: (value: string) => void;
  onStatusChange: (value: string) => void;
}

export function ControlBar({ viewMode, onViewModeChange, filters, onSubjectChange, onStatusChange }: ControlBarProps) {
  return (
    <section className="flex flex-col gap-4 rounded-3xl border border-border bg-card p-4 shadow-soft lg:flex-row lg:items-end" aria-label="Bộ lọc lịch dạy">
      <div className="mr-auto flex gap-1 self-start rounded-xl bg-muted p-1" role="group" aria-label="Kiểu hiển thị lịch dạy">
        <Button variant="ghost" aria-pressed={viewMode === "calendar"} onClick={() => onViewModeChange("calendar")} className={viewMode === "calendar" ? "min-h-11 bg-card text-primary shadow-sm hover:bg-card" : "min-h-11 text-muted-foreground hover:bg-card"}><CalendarDaysIcon className="size-4" aria-hidden="true" />Lịch tháng</Button>
        <Button variant="ghost" aria-pressed={viewMode === "list"} onClick={() => onViewModeChange("list")} className={viewMode === "list" ? "min-h-11 bg-card text-primary shadow-sm hover:bg-card" : "min-h-11 text-muted-foreground hover:bg-card"}><ListBulletIcon className="size-4" aria-hidden="true" />Danh sách</Button>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:w-[360px]">
        <div className="space-y-1.5"><label htmlFor="tutor-schedule-subject" className="text-xs font-medium text-muted-foreground">Môn học</label><LmsSelect id="tutor-schedule-subject" options={SUBJECT_OPTIONS} value={filters.subject} onValueChange={onSubjectChange} /></div>
        <div className="space-y-1.5"><label htmlFor="tutor-schedule-status" className="text-xs font-medium text-muted-foreground">Trạng thái</label><LmsSelect id="tutor-schedule-status" options={STATUS_OPTIONS} value={filters.status} onValueChange={onStatusChange} /></div>
      </div>
    </section>
  );
}
