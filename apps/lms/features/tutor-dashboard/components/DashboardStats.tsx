import { BookOpenIcon, CalendarDaysIcon, ClockIcon } from "@heroicons/react/24/outline";
import { LmsStatCard } from "@/components/LmsStatCard";
import type { Session } from "@/features/tutor-schedule/types/schedule.types";

export function DashboardStats({ sessions }: { sessions: readonly Session[] }) {
  return (
    <div className="grid gap-3 sm:grid-cols-3 xl:grid-cols-1" aria-label="Tổng quan lịch minh họa">
      <LmsStatCard label="Buổi sắp tới (mẫu)" value={sessions.length} icon={<CalendarDaysIcon aria-hidden="true" />} />
      <LmsStatCard label="Môn có lịch (mẫu)" value={new Set(sessions.map((session) => session.subject)).size} tone="accent" icon={<BookOpenIcon aria-hidden="true" />} />
      <LmsStatCard label="Ngày có lịch (mẫu)" value={new Set(sessions.map((session) => session.date)).size} tone="secondary" icon={<ClockIcon aria-hidden="true" />} />
    </div>
  );
}
