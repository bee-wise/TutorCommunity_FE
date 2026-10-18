"use client";

import { Button } from "@workspace/ui/components/ui/button";
import type { Session } from "@/features/tutor-schedule/types/schedule.types";
import { dashboardDateLabel } from "../utils/dashboard-schedule.utils";

export function DashboardNextSession({ session, onSelect }: { session: Session; onSelect: (session: Session, trigger: HTMLButtonElement) => void }) {
  return (
    <section className="flex min-w-0 flex-col rounded-3xl border border-border bg-card p-5 shadow-soft sm:p-6" aria-labelledby="dashboard-next-session">
      <div className="flex h-full flex-col">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-lg bg-accent/20 px-2.5 py-1 text-xs font-bold text-warning">Buổi dạy kế tiếp (mẫu)</span>
          <span className="text-xs text-muted-foreground tabular-nums">{dashboardDateLabel(session.date)}</span>
        </div>
        <h2 id="dashboard-next-session" className="mt-5 font-lms text-xl font-extrabold leading-snug text-foreground">{session.subject} {session.subjectLevel}</h2>
        <p className="mt-1 text-sm text-muted-foreground">{session.studentFullName}</p>
        <p className="mt-5 font-lms text-2xl font-extrabold text-primary tabular-nums">{session.startTime} - {session.endTime}</p>
        <p className="mt-2 break-all text-xs text-muted-foreground">Mã lớp {session.classId}</p>
        <div className="mt-auto pt-5"><Button type="button" onClick={(event) => onSelect(session, event.currentTarget)} className="min-h-11 rounded-xl px-5 font-bold shadow-lg shadow-primary/15 transition-all active:scale-[0.98] motion-reduce:transform-none">Xem buổi học</Button></div>
      </div>
    </section>
  );
}
