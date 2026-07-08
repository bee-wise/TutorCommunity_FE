"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/src/helpers/utils";
import type { Session } from "../types/schedule.types";
import { getSessionsForDate } from "../hooks/useScheduleFilters";
import { SessionBadge } from "./SessionBadge";

interface CalendarViewProps {
  sessions: Session[];
  onSessionClick: (session: Session) => void;
}

const DAY_NAMES = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];
const MONTH_NAMES = [
  "Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4",
  "Tháng 5", "Tháng 6", "Tháng 7", "Tháng 8",
  "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12",
];

// Reference today
const TODAY_STR = "2026-07-08";
const TODAY = new Date(TODAY_STR);

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

// Returns 0=Mon...6=Sun for the first day of month
function getFirstDayOfMonth(year: number, month: number): number {
  const day = new Date(year, month, 1).getDay(); // 0=Sun...6=Sat
  return (day + 6) % 7; // Convert to Mon-first: 0=Mon
}

function toDateString(year: number, month: number, day: number): string {
  const m = String(month + 1).padStart(2, "0");
  const d = String(day).padStart(2, "0");
  return `${year}-${m}-${d}`;
}

export function CalendarView({ sessions, onSessionClick }: CalendarViewProps) {
  const [viewYear, setViewYear] = useState(2026);
  const [viewMonth, setViewMonth] = useState(6); // July = index 6

  const daysInMonth = getDaysInMonth(viewYear, viewMonth);
  const firstDayOffset = getFirstDayOfMonth(viewYear, viewMonth);

  // Total cells needed (pad to complete 6 rows)
  const totalCells = Math.ceil((firstDayOffset + daysInMonth) / 7) * 7;

  const handlePrev = () => {
    if (viewMonth === 0) {
      setViewYear((y) => y - 1);
      setViewMonth(11);
    } else {
      setViewMonth((m) => m - 1);
    }
  };

  const handleNext = () => {
    if (viewMonth === 11) {
      setViewYear((y) => y + 1);
      setViewMonth(0);
    } else {
      setViewMonth((m) => m + 1);
    }
  };

  return (
    <div className="rounded-2xl border border-border/60 bg-white shadow-sm overflow-hidden">
      {/* Calendar Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-border/40">
        <h2 className="text-base font-bold font-montserrat text-foreground">
          {MONTH_NAMES[viewMonth]}, {viewYear}
        </h2>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={handlePrev}
            className="flex items-center justify-center size-8 rounded-lg border border-border/50 text-muted-foreground hover:bg-muted/60 hover:text-foreground transition-colors"
          >
            <ChevronLeft className="size-4" strokeWidth={1.75} />
          </button>
          <button
            type="button"
            onClick={() => {
              setViewYear(2026);
              setViewMonth(6);
            }}
            className="px-3 h-8 rounded-lg border border-border/50 text-xs font-semibold text-muted-foreground hover:bg-muted/60 hover:text-foreground transition-colors"
          >
            Hôm nay
          </button>
          <button
            type="button"
            onClick={handleNext}
            className="flex items-center justify-center size-8 rounded-lg border border-border/50 text-muted-foreground hover:bg-muted/60 hover:text-foreground transition-colors"
          >
            <ChevronRight className="size-4" strokeWidth={1.75} />
          </button>
        </div>
      </div>

      {/* Day name headers */}
      <div className="grid grid-cols-7 border-b border-border/40">
        {DAY_NAMES.map((name, i) => (
          <div
            key={name}
            className={cn(
              "py-2.5 text-center text-xs font-semibold uppercase tracking-wide",
              i >= 5 ? "text-muted-foreground/50" : "text-muted-foreground",
            )}
          >
            {name}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7">
        {Array.from({ length: totalCells }, (_, i) => {
          const dayNumber = i - firstDayOffset + 1;
          const isCurrentMonth = dayNumber >= 1 && dayNumber <= daysInMonth;
          const dateStr = isCurrentMonth
            ? toDateString(viewYear, viewMonth, dayNumber)
            : null;
          const isToday = dateStr === TODAY_STR;
          const isWeekend = i % 7 >= 5;
          const daySessions = dateStr ? getSessionsForDate(sessions, dateStr) : [];
          const isLastRow = i >= totalCells - 7;

          return (
            <div
              key={i}
              className={cn(
                "min-h-[100px] p-1.5 border-b border-r border-border/30 transition-colors",
                !isLastRow && "border-b",
                i % 7 === 6 && "border-r-0",
                isWeekend && isCurrentMonth && "bg-slate-50/60",
                !isCurrentMonth && "bg-muted/20",
              )}
            >
              {isCurrentMonth && (
                <>
                  {/* Day number */}
                  <div className="flex justify-end mb-1">
                    <span
                      className={cn(
                        "flex items-center justify-center size-6 rounded-full text-xs font-semibold leading-none",
                        isToday
                          ? "bg-[#280f91] text-white"
                          : isWeekend
                            ? "text-muted-foreground/60"
                            : "text-foreground",
                      )}
                    >
                      {dayNumber}
                    </span>
                  </div>
                  {/* Session badges */}
                  <div className="flex flex-col gap-0.5">
                    {daySessions.slice(0, 3).map((session) => (
                      <SessionBadge
                        key={session.id}
                        session={session}
                        onClick={onSessionClick}
                        compact={daySessions.length > 2}
                      />
                    ))}
                    {daySessions.length > 3 && (
                      <span className="text-[10px] text-muted-foreground pl-1 font-medium">
                        +{daySessions.length - 3} khác
                      </span>
                    )}
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
