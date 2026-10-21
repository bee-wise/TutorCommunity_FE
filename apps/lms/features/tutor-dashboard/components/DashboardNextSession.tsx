"use client";

import { ClockIcon, UserIcon } from "@heroicons/react/24/outline";
import { Button } from "@workspace/ui/components/ui/button";
import type { Session } from "@/features/tutor-schedule/types/schedule.types";
import { dashboardDateLabel, dashboardWeekday } from "../utils/dashboard-schedule.utils";

export function DashboardNextSession({
  session,
  onSelect,
}: {
  session: Session;
  onSelect: (session: Session, trigger: HTMLButtonElement) => void;
}) {
  return (
    <section
      className="relative flex min-w-0 flex-col overflow-hidden rounded-3xl border border-border bg-card p-4 shadow-soft sm:p-5"
      aria-labelledby="dashboard-next-session"
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0 flex-1 space-y-1.5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-lg bg-accent/20 px-2.5 py-1 text-xs font-bold text-warning">
              Buổi dạy kế tiếp
            </span>
            <span className="text-xs font-semibold text-muted-foreground tabular-nums">
              {dashboardWeekday(session.date)}, {dashboardDateLabel(session.date)}
            </span>
          </div>
          <h2
            id="dashboard-next-session"
            className="font-lms text-lg font-extrabold leading-snug text-foreground sm:text-xl"
          >
            {session.subject} {session.subjectLevel}
          </h2>
          <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-1.5 font-semibold"><UserIcon className="size-4 text-primary" aria-hidden="true" />{session.studentFullName}</span>          </p>
        </div>

        <div className="flex shrink-0 flex-row items-center justify-between gap-4 border-t border-border pt-3 sm:flex-col sm:items-end sm:border-t-0 sm:pt-0">
          <div className="text-left sm:text-right">
            <span className="inline-flex items-center gap-1.5 font-lms text-xl font-extrabold text-primary tabular-nums sm:text-2xl">
              <ClockIcon className="size-5" aria-hidden="true" />
              {session.startTime} – {session.endTime}
            </span>
            <span className="block text-xs text-muted-foreground">Giờ học</span>
          </div>
          <Button
            type="button"
            onClick={(event) => onSelect(session, event.currentTarget)}
            className="min-h-11 rounded-xl px-6 font-bold shadow-soft transition-all active:scale-[0.98] motion-reduce:transform-none"
          >
            Xem buổi học
          </Button>
        </div>
      </div>
    </section>
  );
}
