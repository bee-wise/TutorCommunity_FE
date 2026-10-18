import { BellIcon, BookOpenIcon, ClockIcon } from "@heroicons/react/24/outline";
import { LmsStatCard } from "@/components/LmsStatCard";

export function OverviewCards({ todayCount, totalActiveCount, pendingCount }: { todayCount: number; totalActiveCount: number; pendingCount: number }) {
  return (
    <section className="grid gap-4 sm:grid-cols-3" aria-label="Tổng quan lịch dạy">
      <LmsStatCard label="Buổi học hôm nay" value={todayCount} icon={<ClockIcon aria-hidden="true" />} />
      <LmsStatCard label="Lớp đang hoạt động" value={totalActiveCount} tone="secondary" icon={<BookOpenIcon aria-hidden="true" />} />
      <LmsStatCard label="Yêu cầu chờ xác nhận" value={pendingCount} tone="accent" icon={<BellIcon aria-hidden="true" />} />
    </section>
  );
}
