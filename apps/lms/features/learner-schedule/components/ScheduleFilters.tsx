import type {
  LearnerScheduleFilters,
  LearnerSessionStatus,
} from "../types/learner-schedule.types";

interface ScheduleFiltersProps {
  filters: LearnerScheduleFilters;
  subjects: string[];
  onSubjectChange: (subject: string) => void;
  onStatusChange: (status: "all" | LearnerSessionStatus) => void;
}

export function ScheduleFilters({
  filters,
  subjects,
  onSubjectChange,
  onStatusChange,
}: ScheduleFiltersProps) {
  return (
    <section className="flex flex-col gap-2 rounded-2xl border border-border bg-white p-3 shadow-sm sm:flex-row sm:items-center" aria-label="Bộ lọc lịch học">
      <p className="mr-auto px-1 text-sm font-semibold text-muted-foreground">Hiển thị lịch theo</p>
      <label>
        <span className="sr-only">Môn học</span>
        <select
          value={filters.subject}
          onChange={(event) => onSubjectChange(event.target.value)}
          className="h-10 w-full rounded-xl border border-input bg-white px-3 text-sm font-semibold outline-none focus:ring-2 focus:ring-[#280F91]/25 sm:w-44"
        >
          <option value="all">Tất cả môn học</option>
          {subjects.map((subject) => (
            <option key={subject} value={subject}>{subject}</option>
          ))}
        </select>
      </label>
      <label>
        <span className="sr-only">Trạng thái buổi học</span>
        <select
          value={filters.status}
          onChange={(event) => onStatusChange(event.target.value as "all" | LearnerSessionStatus)}
          className="h-10 w-full rounded-xl border border-input bg-white px-3 text-sm font-semibold outline-none focus:ring-2 focus:ring-[#280F91]/25 sm:w-44"
        >
          <option value="all">Tất cả trạng thái</option>
          <option value="UPCOMING">Sắp diễn ra</option>
          <option value="COMPLETED">Đã hoàn thành</option>
          <option value="CANCELED">Đã hủy</option>
        </select>
      </label>
    </section>
  );
}

