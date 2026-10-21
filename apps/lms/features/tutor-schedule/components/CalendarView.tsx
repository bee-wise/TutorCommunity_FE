"use client";

import { useState } from "react";
import {
  ChevronLeftIcon as ChevronLeft,
  ChevronRightIcon as ChevronRight,
} from "@heroicons/react/24/outline";
import { cn } from "@workspace/core/helpers/utils";
import { parseVietnamDateTime } from "@workspace/core/lms-calendar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@workspace/ui/components/ui/dialog";
import type { Session } from "../types/schedule.types";
import { getSessionsForDate } from "../hooks/useScheduleFilters";
import { SessionBadge } from "./SessionBadge";

interface CalendarViewProps {
  sessions: Session[];
  onSessionClick: (session: Session) => void;
  viewYear: number;
  viewMonth: number;
  onPrev: () => void;
  onNext: () => void;
  onToday: () => void;
  isLoading?: boolean;
}

const DAY_NAMES = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];
const MONTH_NAMES = [
  "Tháng 1",
  "Tháng 2",
  "Tháng 3",
  "Tháng 4",
  "Tháng 5",
  "Tháng 6",
  "Tháng 7",
  "Tháng 8",
  "Tháng 9",
  "Tháng 10",
  "Tháng 11",
  "Tháng 12",
];

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number): number {
  const day = new Date(year, month, 1).getDay();
  return (day + 6) % 7;
}

function toDateString(year: number, month: number, day: number): string {
  const m = String(month + 1).padStart(2, "0");
  const d = String(day).padStart(2, "0");
  return `${year}-${m}-${d}`;
}

export function CalendarView({
  sessions,
  onSessionClick,
  viewYear,
  viewMonth,
  onPrev,
  onNext,
  onToday,
  isLoading = false,
}: CalendarViewProps) {
  const [selectedDayDate, setSelectedDayDate] = useState<string | null>(null);

  const todayStr = parseVietnamDateTime(new Date().toISOString()).dateKey;
  const daysInMonth = getDaysInMonth(viewYear, viewMonth);
  const firstDayOffset = getFirstDayOfMonth(viewYear, viewMonth);
  const totalCells = Math.ceil((firstDayOffset + daysInMonth) / 7) * 7;

  const dayModalSessions = selectedDayDate
    ? getSessionsForDate(sessions, selectedDayDate)
    : [];

  return (
    <div className="rounded-2xl border border-border/60 bg-card shadow-sm overflow-hidden">
      <div className="flex items-center justify-between px-6 py-4 border-b border-border/40">
        <div className="flex items-center gap-3">
          <h2 className="text-base font-bold font-lms text-foreground">
            {MONTH_NAMES[viewMonth]}, {viewYear}
          </h2>
          {isLoading && (
            <span className="text-xs text-muted-foreground animate-pulse font-medium">
              Đang tải lịch...
            </span>
          )}
        </div>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={onPrev}
            className="flex items-center justify-center size-11 rounded-lg border border-border/50 text-muted-foreground hover:bg-muted/60 hover:text-foreground transition-colors"
            title="Tháng trước"
          >
            <ChevronLeft className="size-4" />
          </button>
          <button
            type="button"
            onClick={onToday}
            className="px-3 min-h-11 rounded-lg border border-border/50 text-xs font-semibold text-muted-foreground hover:bg-muted/60 hover:text-foreground transition-colors"
          >
            Hôm nay
          </button>
          <button
            type="button"
            onClick={onNext}
            className="flex items-center justify-center size-11 rounded-lg border border-border/50 text-muted-foreground hover:bg-muted/60 hover:text-foreground transition-colors"
            title="Tháng sau"
          >
            <ChevronRight className="size-4" />
          </button>
        </div>
      </div>

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

      <div className="grid grid-cols-7 relative">
        {Array.from({ length: totalCells }, (_, i) => {
          const dayNumber = i - firstDayOffset + 1;
          const isCurrentMonth = dayNumber >= 1 && dayNumber <= daysInMonth;
          const dateStr = isCurrentMonth
            ? toDateString(viewYear, viewMonth, dayNumber)
            : null;
          const isToday = dateStr === todayStr;
          const isWeekend = i % 7 >= 5;
          const daySessions = dateStr
            ? getSessionsForDate(sessions, dateStr)
            : [];
          const isLastRow = i >= totalCells - 7;

          return (
            <div
              key={i}
              className={cn(
                "min-h-[110px] p-1.5 border-b border-r border-border/30 transition-colors",
                !isLastRow && "border-b",
                i % 7 === 6 && "border-r-0",
                isWeekend && isCurrentMonth && "bg-muted/60",
                !isCurrentMonth && "bg-muted/20",
              )}
            >
              {isCurrentMonth && (
                <>
                  <div className="flex justify-end mb-1">
                    <span
                      className={cn(
                        "flex items-center justify-center size-6 rounded-full text-xs font-semibold leading-none",
                        isToday
                          ? "bg-primary text-primary-foreground"
                          : isWeekend
                            ? "text-muted-foreground/60"
                            : "text-foreground",
                      )}
                    >
                      {dayNumber}
                    </span>
                  </div>
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
                      <button
                        type="button"
                        onClick={() => setSelectedDayDate(dateStr)}
                        className="mt-0.5 rounded-md px-1 text-left text-[10px] font-bold text-primary transition-colors hover:bg-muted"
                      >
                        +{daySessions.length - 3} buổi khác
                      </button>
                    )}
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>

      <Dialog
        open={Boolean(selectedDayDate)}
        onOpenChange={(open) => !open && setSelectedDayDate(null)}
      >
        <DialogContent className="max-w-md p-0 overflow-hidden bg-card">
          <DialogHeader className="px-5 py-4 border-b border-border/50 flex flex-row items-center justify-between">
            <DialogTitle className="text-base font-extrabold font-lms text-foreground">
              Các buổi học ngày {selectedDayDate}
            </DialogTitle>
          </DialogHeader>
          <div className="p-4 space-y-2 max-h-[60vh] overflow-y-auto">
            {dayModalSessions.map((session) => (
              <SessionBadge
                key={session.id}
                session={session}
                onClick={(s) => {
                  setSelectedDayDate(null);
                  onSessionClick(s);
                }}
              />
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
