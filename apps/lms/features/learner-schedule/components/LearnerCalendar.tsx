"use client";

import { useState } from "react";
import { CaretLeft, CaretRight } from "@phosphor-icons/react";
import { cn } from "@workspace/core/helpers/utils";
import { LEARNER_TODAY } from "../data/learner-schedule.mock";
import type { LearnerSession } from "../types/learner-schedule.types";
import {
  getDaysInMonth,
  getMondayFirstOffset,
  getSessionsForDay,
  toCalendarDate,
  WEEKDAY_LABELS,
} from "../utils/calendar.utils";

interface LearnerCalendarProps {
  sessions: LearnerSession[];
  onSessionClick: (session: LearnerSession) => void;
}

const STATUS_STYLE = {
  UPCOMING: "border-[#FFC500]/45 bg-[#FFC500]/15 text-[#905B0F]",
  COMPLETED: "border-[#447353]/25 bg-[#447353]/10 text-[#447353]",
  CANCELED: "border-[#E1ABA7]/60 bg-[#E1ABA7]/18 text-[#9B5E5A]",
} as const;

export function LearnerCalendar({ sessions, onSessionClick }: LearnerCalendarProps) {
  const [view, setView] = useState({ year: 2026, month: 7 });
  const daysInMonth = getDaysInMonth(view.year, view.month);
  const firstDayOffset = getMondayFirstOffset(view.year, view.month);
  const totalCells = Math.ceil((firstDayOffset + daysInMonth) / 7) * 7;

  function changeMonth(offset: number) {
    setView((current) => {
      const date = new Date(current.year, current.month + offset, 1);
      return { year: date.getFullYear(), month: date.getMonth() };
    });
  }

  return (
    <section className="overflow-hidden rounded-2xl border border-border bg-white shadow-sm" aria-label="Lịch học theo tháng">
      <div className="flex items-center justify-between border-b border-border px-4 py-4 sm:px-5">
        <h2 className="font-nunito text-base font-extrabold capitalize">
          {new Intl.DateTimeFormat("vi-VN", { month: "long", year: "numeric" }).format(new Date(view.year, view.month, 1))}
        </h2>
        <div className="flex items-center gap-1">
          <button type="button" onClick={() => changeMonth(-1)} aria-label="Tháng trước" className="grid size-8 place-items-center rounded-lg border border-input text-muted-foreground hover:bg-muted"><CaretLeft size={16} weight="bold" /></button>
          <button type="button" onClick={() => setView({ year: 2026, month: 7 })} className="h-8 rounded-lg border border-input px-3 text-xs font-bold text-[#280F91] hover:bg-[#280F91]/5">Hôm nay</button>
          <button type="button" onClick={() => changeMonth(1)} aria-label="Tháng sau" className="grid size-8 place-items-center rounded-lg border border-input text-muted-foreground hover:bg-muted"><CaretRight size={16} weight="bold" /></button>
        </div>
      </div>

      <div className="grid grid-cols-7 border-b border-border bg-muted/35">
        {WEEKDAY_LABELS.map((label) => <div key={label} className="py-2.5 text-center text-[11px] font-bold text-muted-foreground sm:text-xs">{label}</div>)}
      </div>

      <div className="grid grid-cols-7">
        {Array.from({ length: totalCells }, (_, index) => {
          const day = index - firstDayOffset + 1;
          const inMonth = day > 0 && day <= daysInMonth;
          const date = inMonth ? toCalendarDate(view.year, view.month, day) : "";
          const daySessions = date ? getSessionsForDay(sessions, date) : [];
          const isToday = date === LEARNER_TODAY;
          const isWeekend = index % 7 >= 5;
          return (
            <div key={`${view.year}-${view.month}-${index}`} className={cn("min-h-20 border-b border-r border-border/60 p-1 sm:min-h-28 sm:p-1.5", index % 7 === 6 && "border-r-0", !inMonth && "bg-muted/20", isWeekend && inMonth && "bg-[#F8FAFC]")}>
              {inMonth && (
                <>
                  <div className="mb-1 flex justify-end"><span className={cn("grid size-6 place-items-center rounded-full text-xs font-bold", isToday ? "bg-[#280F91] text-white" : "text-foreground")}>{day}</span></div>
                  <div className="space-y-1">
                    {daySessions.slice(0, 2).map((session) => (
                      <button key={session.id} type="button" onClick={() => onSessionClick(session)} className={cn("w-full truncate rounded-md border px-1 py-1 text-left text-[9px] font-bold transition-transform active:scale-[0.98] sm:rounded-lg sm:px-2 sm:text-[11px]", STATUS_STYLE[session.status])} title={`${session.startTime} - ${session.subject}`}>
                        <span className="sm:hidden">{session.startTime}</span><span className="hidden sm:inline">{session.startTime} {session.subject}</span>
                      </button>
                    ))}
                    {daySessions.length > 2 && <p className="pl-1 text-[9px] font-semibold text-muted-foreground">+{daySessions.length - 2} buổi</p>}
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}

