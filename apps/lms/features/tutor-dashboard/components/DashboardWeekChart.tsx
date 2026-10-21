"use client";

import { cn } from "@workspace/core/helpers/utils";
import { formatDuration } from "../utils/dashboard-overview.utils";
import { useTutorOverview } from "../hooks/useTutorOverview";
import { DashboardLink } from "./DashboardLink";

export function DashboardWeekChart() {
  const { days, week, weekMinutes, weekSessions } = useTutorOverview();
  const peak = Math.max(...days.map((day) => day.minutes), 60);

  return (
    <section className="rounded-3xl border border-border bg-card p-4 shadow-soft sm:p-5" aria-labelledby="dashboard-week">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h2 id="dashboard-week" className="font-lms text-lg font-extrabold leading-[1.3] text-foreground">Khối lượng dạy trong tuần</h2>
          <p className="mt-0.5 text-xs text-muted-foreground tabular-nums">
            {week.isError ? "Không tải được dữ liệu tuần này." : `${weekSessions} buổi · ${formatDuration(weekMinutes)}`}
          </p>
        </div>
        <DashboardLink href="/lms/tutor/schedule" variant="outline" className="min-h-9 px-3 text-xs">Xem lịch tuần</DashboardLink>
      </div>
      <div role="group" aria-label="Giờ dạy từng ngày trong tuần" className="mt-4 flex h-36 items-end justify-between gap-2 border-b border-border">
        {days.map((day) => (
          <div key={day.date} className="flex h-full flex-1 flex-col items-center justify-end">
            <button
              type="button"
              aria-label={`${day.weekday} ${day.day}: ${day.sessionCount} buổi, ${formatDuration(day.minutes)}`}
              style={{ height: `${day.minutes ? Math.max(8, (day.minutes / peak) * 100) : 4}%` }}
              className={cn(
                "group relative w-full max-w-9 rounded-t-xl rounded-b-md transition-transform hover:-translate-y-0.5 focus-visible:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-ring motion-reduce:transition-none",
                day.isToday ? "bg-primary" : day.minutes ? "bg-accent" : "bg-border",
              )}
            >
              <span className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-2 -translate-x-1/2 whitespace-nowrap rounded-lg bg-foreground px-2 py-1.5 text-[11px] font-extrabold text-background opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
                {day.sessionCount} buổi · {formatDuration(day.minutes)}
              </span>
            </button>
          </div>
        ))}
      </div>
      <div className="mt-2 flex justify-between gap-2" aria-hidden="true">
        {days.map((day) => (
          <div key={day.date} className={cn("flex-1 text-center text-xs", day.isToday ? "font-extrabold text-foreground" : "text-muted-foreground")}>
            <span className="block">{day.weekday}</span>
            <span className="block tabular-nums">{day.day}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
