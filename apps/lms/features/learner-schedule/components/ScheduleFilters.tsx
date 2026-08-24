import { CalendarDots, ListBullets } from "@phosphor-icons/react";
import type {
  LearnerScheduleFilters,
  LearnerScheduleView,
  LearnerSessionStatus,
} from "../types/learner-schedule.types";

interface ScheduleFiltersProps {
  filters: LearnerScheduleFilters;
  subjects: string[];
  view: LearnerScheduleView;
  onSubjectChange: (subject: string) => void;
  onStatusChange: (status: "all" | LearnerSessionStatus) => void;
  onViewChange: (view: LearnerScheduleView) => void;
}

export function ScheduleFilters({
  filters,
  subjects,
  view,
  onSubjectChange,
  onStatusChange,
  onViewChange,
}: ScheduleFiltersProps) {
  return (
    <section className="flex flex-col gap-2 rounded-2xl border border-border bg-white p-3 shadow-sm sm:flex-row sm:items-center" aria-label="Bộ lọc lịch học">
      <div className="mr-auto grid grid-cols-2 rounded-xl bg-muted p-1" aria-label="Kiểu hiển thị lịch học">
        <ViewButton active={view === "calendar"} onClick={() => onViewChange("calendar")} icon={<CalendarDots size={16} />} label="Lịch tháng" />
        <ViewButton active={view === "list"} onClick={() => onViewChange("list")} icon={<ListBullets size={16} />} label="Danh sách" />
      </div>
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

function ViewButton({ active, onClick, icon, label }: { active: boolean; onClick: () => void; icon: React.ReactNode; label: string }) {
  return <button type="button" onClick={onClick} aria-pressed={active} className={`inline-flex h-8 items-center justify-center gap-1.5 rounded-lg px-3 text-xs font-bold transition-colors ${active ? "bg-white text-[#280F91] shadow-sm" : "text-muted-foreground hover:text-foreground"}`}>{icon}{label}</button>;
}
