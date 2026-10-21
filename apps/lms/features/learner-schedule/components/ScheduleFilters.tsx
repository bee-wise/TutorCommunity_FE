import { LmsTabs } from "@/components/LmsTabNav";
import { LmsSelect } from "@/components/LmsSelect";
import type { LearnerScheduleFilters, LearnerScheduleView, LearnerSessionStatus } from "../types/learner-schedule.types";

interface ScheduleFiltersProps {
  filters: LearnerScheduleFilters;
  subjects: string[];
  view: LearnerScheduleView;
  onSubjectChange: (subject: string) => void;
  onStatusChange: (status: "all" | LearnerSessionStatus) => void;
  onViewChange: (view: LearnerScheduleView) => void;
}
const STATUS_OPTIONS = [
  { value: "all", label: "Tất cả trạng thái" },
  { value: "UPCOMING", label: "Sắp diễn ra" },
  { value: "COMPLETED", label: "Đã hoàn thành" },
  { value: "CANCELED", label: "Đã hủy" },
];

export function ScheduleFilters({ filters, subjects, view, onSubjectChange, onStatusChange, onViewChange }: ScheduleFiltersProps) {
  return (
    <section className="flex flex-col gap-4 rounded-3xl border border-border bg-card p-4 shadow-soft lg:flex-row lg:items-end" aria-label="Bộ lọc lịch học">
      <LmsTabs
        label="Kiểu hiển thị lịch học"
        className="mr-auto self-start"
        items={[{ value: "calendar", label: "Lịch tháng" }, { value: "list", label: "Danh sách" }]}
        value={view}
        onChange={onViewChange}
      />
      <div className="grid gap-3 sm:grid-cols-2 lg:w-[360px]">
        <div className="space-y-1.5"><label htmlFor="learner-schedule-subject" className="text-xs font-medium text-muted-foreground">Môn học</label><LmsSelect id="learner-schedule-subject" value={filters.subject} options={[{ value: "all", label: "Tất cả môn học" }, ...subjects.map((subject) => ({ value: subject, label: subject }))]} onValueChange={onSubjectChange} /></div>
        <div className="space-y-1.5"><label htmlFor="learner-schedule-status" className="text-xs font-medium text-muted-foreground">Trạng thái</label><LmsSelect id="learner-schedule-status" value={filters.status} options={STATUS_OPTIONS} onValueChange={(value) => { if (value === "all" || value === "UPCOMING" || value === "COMPLETED" || value === "CANCELED") onStatusChange(value); }} /></div>
      </div>
    </section>
  );
}
