"use client";

import { ArrowRightIcon } from "@heroicons/react/24/outline";
import { Button } from "@workspace/ui/components/ui/button";
import { Dialog } from "@workspace/ui/components/ui/dialog";
import type { Session } from "@/features/tutor-schedule/types/schedule.types";
import { useDashboardSchedule } from "../hooks/useDashboardSchedule";
import { dashboardDateLabel, dashboardWeekday } from "../utils/dashboard-schedule.utils";
import { DashboardLink } from "./DashboardLink";
import { DashboardNextSession } from "./DashboardNextSession";
import { DashboardSessionDialog } from "./DashboardSessionDialog";

export function DashboardSchedule({ sessions }: { sessions: readonly Session[] }) {
  const schedule = useDashboardSchedule(sessions);
  return (
    <Dialog open={schedule.open} onOpenChange={schedule.setOpen}>
      <div className="min-w-0 space-y-5">
        {schedule.upcoming[0] && <DashboardNextSession session={schedule.upcoming[0]} onSelect={schedule.selectSession} />}
        <section className="rounded-3xl border border-border bg-card p-5 shadow-soft sm:p-6" aria-labelledby="dashboard-schedule">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 id="dashboard-schedule" className="font-nunito text-xl font-extrabold leading-[1.3] text-primary">Lịch dạy sắp tới</h2>
            <DashboardLink href="/lms/tutor/schedule" variant="outline">Mở lịch dạy</DashboardLink>
          </div>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">Dữ liệu minh họa tháng 7/2026, không phải lịch thực tế.</p>
          <div className="mt-5 flex flex-wrap gap-2" role="group" aria-label="Lọc lịch dạy theo ngày">
            <Button type="button" variant={schedule.filter === "all" ? "default" : "outline"} aria-pressed={schedule.filter === "all"} onClick={() => schedule.setFilter("all")} className="min-h-11 rounded-full px-4 font-bold transition-all active:scale-[0.98] motion-reduce:transform-none">Tất cả</Button>
            {schedule.dates.map((date) => <Button key={date} type="button" variant={schedule.filter === date ? "default" : "outline"} aria-pressed={schedule.filter === date} onClick={() => schedule.setFilter(date)} className="min-h-11 rounded-full px-4 font-bold transition-all active:scale-[0.98] motion-reduce:transform-none">{dashboardWeekday(date)} {dashboardDateLabel(date).slice(0, 5)}</Button>)}
          </div>
          <ul className="mt-4 divide-y divide-border" aria-live="polite" aria-label="Các buổi học">
            {schedule.visibleSessions.map((session) => <li key={session.id} className="py-2 first:pt-0 last:pb-0">
              <Button type="button" variant="ghost" onClick={(event) => schedule.selectSession(session, event.currentTarget)} className="h-auto min-h-24 w-full justify-start gap-4 whitespace-normal rounded-2xl px-2 py-4 text-left transition-all hover:bg-muted/40 active:scale-[0.98] motion-reduce:transform-none" aria-label={`Chi tiết ${session.subject} ${session.subjectLevel}, ${session.studentFullName}, ${dashboardDateLabel(session.date)}, ${session.startTime}`}>
                <span className="flex w-16 shrink-0 flex-col gap-1">
                  <span className="font-nunito text-lg font-extrabold tabular-nums text-primary">{session.startTime}</span>
                  <span className="text-xs tabular-nums text-muted-foreground">{dashboardDateLabel(session.date).slice(0, 5)}</span>
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block font-nunito text-base font-extrabold leading-relaxed text-foreground">{session.subject} {session.subjectLevel}</span>
                  <span className="mt-1 block text-sm font-normal leading-relaxed text-muted-foreground">{session.studentFullName}</span>
                  <span className="mt-1 block break-all text-xs font-normal text-muted-foreground">{session.classId} · {session.startTime} - {session.endTime}</span>
                </span>
                <ArrowRightIcon className="size-4 shrink-0 text-primary" aria-hidden="true" />
              </Button>
            </li>)}
          </ul>
          {!schedule.visibleSessions.length && <div className="py-10 text-center"><p className="font-bold text-primary">Chưa có buổi học trong danh sách</p><p className="mt-2 text-sm text-muted-foreground">Chọn ngày khác hoặc mở lịch dạy để kiểm tra.</p></div>}
          <p className="mt-4 text-xs leading-relaxed text-muted-foreground">Hiển thị tối đa 5 buổi mẫu theo trạng thái sắp diễn ra.</p>
        </section>
      </div>
      {schedule.selected && <DashboardSessionDialog session={schedule.selected} returnFocusRef={schedule.returnFocusRef} />}
    </Dialog>
  );
}
