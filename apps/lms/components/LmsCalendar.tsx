"use client";

import { useState } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { cn } from "@workspace/core/helpers/utils";
import { parseVietnamDateTime } from "@workspace/core/lms-calendar";
import { Button } from "@workspace/ui/components/ui/button";
import { LmsResponsiveSheet } from "./LmsResponsiveSheet";
import { LMS_SESSION_STATUS, type LmsSessionStatus } from "./lms-session-status";
import { statusTone } from "./lms-status";

export type LmsCalendarStatus = LmsSessionStatus;

/** Minimum shape a session needs to appear on the calendar (learner and tutor sessions both satisfy it). */
export interface LmsCalendarItem {
  id: string;
  /** "YYYY-MM-DD" */
  date: string;
  startTime: string;
  endTime: string;
  subject: string;
  status: LmsCalendarStatus;
  source?: "SESSION" | "PLANNED";
}

interface LmsCalendarProps<T extends LmsCalendarItem> {
  sessions: T[];
  onSessionClick: (session: T) => void;
  viewYear: number;
  viewMonth: number;
  /** -1 for previous month, 1 for next month. */
  onMonthChange: (offset: number) => void;
  onToday: () => void;
  isLoading?: boolean;
  /** Extra line under the subject in the day list, e.g. topic or student. */
  getSecondaryLabel?: (session: T) => string | undefined;
}

const WEEKDAY_LABELS = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];
const MAX_CHIPS = 2;

const STATUS_STYLE: Record<LmsCalendarStatus, string> = {
  UPCOMING: statusTone[LMS_SESSION_STATUS.UPCOMING.tone],
  IN_PROGRESS: statusTone[LMS_SESSION_STATUS.IN_PROGRESS.tone],
  COMPLETED: statusTone[LMS_SESSION_STATUS.COMPLETED.tone],
  CANCELED: statusTone[LMS_SESSION_STATUS.CANCELED.tone],
  RESCHEDULED: statusTone[LMS_SESSION_STATUS.RESCHEDULED.tone],
};

const navButtonClass = "min-h-11 min-w-11 rounded-lg px-3 text-xs";

function toDateKey(year: number, month: number, day: number) {
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

function formatDayTitle(date: string) {
  const [year, month, day] = date.split("-");
  return `${day}/${month}/${year}`;
}

export function LmsCalendar<T extends LmsCalendarItem>({ sessions, onSessionClick, viewYear, viewMonth, onMonthChange, onToday, isLoading = false, getSecondaryLabel }: LmsCalendarProps<T>) {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const todayKey = parseVietnamDateTime(new Date().toISOString()).dateKey;
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const firstOffset = (new Date(viewYear, viewMonth, 1).getDay() + 6) % 7;
  const totalCells = Math.ceil((firstOffset + daysInMonth) / 7) * 7;

  const byDate = new Map<string, T[]>();
  for (const session of sessions) byDate.set(session.date, [...(byDate.get(session.date) ?? []), session]);
  const daySessions = selectedDate ? (byDate.get(selectedDate) ?? []) : [];

  return (
    <section className="overflow-hidden rounded-3xl border border-border bg-card shadow-soft" aria-label="Lịch theo tháng">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border px-4 py-3 sm:px-5">
        <div className="flex items-center gap-3">
          <h2 className="font-lms text-base font-extrabold">{`Tháng ${viewMonth + 1} năm ${viewYear}`}</h2>
          {isLoading && <span role="status" className="animate-pulse text-xs font-medium text-muted-foreground">Đang tải lịch...</span>}
        </div>
        <div className="flex items-center gap-1">
          <Button type="button" variant="outline" size="icon" className={navButtonClass} onClick={() => onMonthChange(-1)} aria-label="Tháng trước"><ChevronLeftIcon className="size-4" aria-hidden /></Button>
          <Button type="button" variant="outline" className={navButtonClass} onClick={onToday}>Hôm nay</Button>
          <Button type="button" variant="outline" size="icon" className={navButtonClass} onClick={() => onMonthChange(1)} aria-label="Tháng sau"><ChevronRightIcon className="size-4" aria-hidden /></Button>
        </div>
      </div>

      <div className="grid grid-cols-7 border-b border-border bg-muted">
        {WEEKDAY_LABELS.map((label) => <div key={label} className="py-2.5 text-center text-[11px] font-bold text-muted-foreground sm:text-xs">{label}</div>)}
      </div>

      <div className="grid grid-cols-7">
        {Array.from({ length: totalCells }, (_, index) => {
          const day = index - firstOffset + 1;
          const inMonth = day > 0 && day <= daysInMonth;
          const date = inMonth ? toDateKey(viewYear, viewMonth, day) : "";
          const items = date ? (byDate.get(date) ?? []) : [];
          const isToday = date === todayKey;
          const cellClass = cn("min-h-14 border-b border-r border-border p-1 sm:min-h-28 sm:p-1.5", index % 7 === 6 && "border-r-0", !inMonth && "bg-muted", inMonth && index % 7 >= 5 && "bg-muted/60");

          if (!inMonth) return <div key={`${viewYear}-${viewMonth}-${index}`} className={cellClass} />;
          return (
            <div key={`${viewYear}-${viewMonth}-${index}`} className={cellClass}>
              {/* Mobile: the whole cell opens the day list. */}
              <button type="button" disabled={!items.length} onClick={() => setSelectedDate(date)} aria-label={`Ngày ${day}, ${items.length} buổi`} className="flex min-h-11 w-full flex-col items-center gap-1 rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-default sm:hidden">
                <span className={cn("grid size-6 place-items-center rounded-full text-xs font-bold", isToday ? "bg-primary text-primary-foreground" : "text-foreground")}>{day}</span>
                {items.length > 0 && <span className="grid h-4 min-w-4 place-items-center rounded-full bg-primary px-1 text-[10px] font-extrabold text-primary-foreground">{items.length}</span>}
              </button>

              <div className="hidden sm:block">
                <div className="mb-1 flex justify-end">
                  <span className={cn("grid size-6 place-items-center rounded-full text-xs font-bold", isToday ? "bg-primary text-primary-foreground" : "text-foreground")}>{day}</span>
                </div>
                <div className="space-y-1">
                  {items.slice(0, MAX_CHIPS).map((session) => (
                    <button key={session.id} type="button" onClick={() => onSessionClick(session)} title={`${session.startTime} - ${session.subject}`} className={cn("w-full truncate rounded-lg border px-2 py-1 text-left text-[11px] font-bold outline-none transition-transform focus-visible:ring-2 focus-visible:ring-ring active:scale-[0.98]", session.source === "PLANNED" && "border-dashed", STATUS_STYLE[session.status])}>
                      {session.source === "PLANNED" ? "[Dự kiến] " : ""}{session.startTime} {session.subject}
                    </button>
                  ))}
                  {items.length > MAX_CHIPS && (
                    <button type="button" onClick={() => setSelectedDate(date)} className="block min-h-6 rounded-md px-1 text-left text-[10px] font-bold text-primary hover:bg-muted">+{items.length - MAX_CHIPS} buổi khác</button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <LmsResponsiveSheet open={Boolean(selectedDate)} onOpenChange={(open) => !open && setSelectedDate(null)} title={selectedDate ? `Các buổi ngày ${formatDayTitle(selectedDate)}` : "Các buổi trong ngày"}>
        <ul className="space-y-2">
          {daySessions.map((session) => {
            const secondary = getSecondaryLabel?.(session);
            return (
              <li key={session.id}>
                <button type="button" onClick={() => { setSelectedDate(null); onSessionClick(session); }} className={cn("block min-h-11 w-full rounded-2xl border p-3 text-left outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring", session.source === "PLANNED" && "border-dashed", STATUS_STYLE[session.status])}>
                  <span className="flex items-center justify-between gap-2 text-xs font-extrabold tabular-nums">
                    {session.startTime} - {session.endTime}
                    {session.source === "PLANNED" && <span className="rounded-lg border border-border bg-muted px-1.5 py-0.5 text-[10px] font-bold uppercase text-muted-foreground">Dự kiến</span>}
                  </span>
                  <span className="mt-1 block text-sm font-extrabold">{session.subject}</span>
                  {secondary && <span className="mt-0.5 block text-xs text-muted-foreground">{secondary}</span>}
                </button>
              </li>
            );
          })}
        </ul>
      </LmsResponsiveSheet>
    </section>
  );
}
