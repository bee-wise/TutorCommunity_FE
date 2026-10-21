"use client";

import { useState } from "react";
import { statusTone } from "../../../components/lms-status";
import {
  ChevronLeftIcon as CaretLeft,
  ChevronRightIcon as CaretRight,
} from "@heroicons/react/24/outline";
import { cn } from "@workspace/core/helpers/utils";
import { parseVietnamDateTime } from "@workspace/core/lms-calendar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@workspace/ui/components/ui/dialog";
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
  viewYear: number;
  viewMonth: number;
  onMonthChange: (offset: number) => void;
  onToday: () => void;
  isLoading?: boolean;
}

const STATUS_STYLE = {
  UPCOMING: statusTone.pending,
  IN_PROGRESS: statusTone.active,
  COMPLETED: statusTone.done,
  CANCELED: statusTone.cancelled,
  RESCHEDULED: statusTone.planned,
} as const;

export function LearnerCalendar({
  sessions,
  onSessionClick,
  viewYear,
  viewMonth,
  onMonthChange,
  onToday,
  isLoading = false,
}: LearnerCalendarProps) {
  const [selectedDayDate, setSelectedDayDate] = useState<string | null>(null);

  const todayStr = parseVietnamDateTime(new Date().toISOString()).dateKey;
  const daysInMonth = getDaysInMonth(viewYear, viewMonth);
  const firstDayOffset = getMondayFirstOffset(viewYear, viewMonth);
  const totalCells = Math.ceil((firstDayOffset + daysInMonth) / 7) * 7;

  const dayModalSessions = selectedDayDate
    ? getSessionsForDay(sessions, selectedDayDate)
    : [];

  return (
    <section
      className="overflow-hidden rounded-3xl border border-border bg-card shadow-soft"
      aria-label="Lịch học theo tháng"
    >
      <div className="flex items-center justify-between border-b border-border px-4 py-4 sm:px-5">
        <div className="flex items-center gap-3">
          <h2 className="font-lms text-base font-extrabold capitalize">
            {`Tháng ${viewMonth + 1} năm ${viewYear}`}
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
            onClick={() => onMonthChange(-1)}
            aria-label="Tháng trước"
            className="grid size-8 place-items-center rounded-lg border border-input text-muted-foreground hover:bg-muted"
          >
            <CaretLeft width={16} height={16} />
          </button>
          <button
            type="button"
            onClick={onToday}
            className="min-h-11 rounded-lg border border-input bg-card px-3 text-xs font-bold text-primary transition-colors hover:bg-muted active:scale-[0.98]"
          >
            Hôm nay
          </button>
          <button
            type="button"
            onClick={() => onMonthChange(1)}
            aria-label="Tháng sau"
            className="grid size-8 place-items-center rounded-lg border border-input text-muted-foreground hover:bg-muted"
          >
            <CaretRight width={16} height={16} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 border-b border-border bg-muted/35">
        {WEEKDAY_LABELS.map((label) => (
          <div
            key={label}
            className="py-2.5 text-center text-[11px] font-bold text-muted-foreground sm:text-xs"
          >
            {label}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7">
        {Array.from({ length: totalCells }, (_, index) => {
          const day = index - firstDayOffset + 1;
          const inMonth = day > 0 && day <= daysInMonth;
          const date = inMonth ? toCalendarDate(viewYear, viewMonth, day) : "";
          const daySessions = date ? getSessionsForDay(sessions, date) : [];
          const isToday = date === todayStr;
          const isWeekend = index % 7 >= 5;

          return (
            <div
              key={`${viewYear}-${viewMonth}-${index}`}
              className={cn(
                "min-h-20 border-b border-r border-border/60 p-1 sm:min-h-28 sm:p-1.5",
                index % 7 === 6 && "border-r-0",
                !inMonth && "bg-muted/20",
                isWeekend && inMonth && "bg-muted",
              )}
            >
              {inMonth && (
                <>
                  <div className="mb-1 flex justify-end">
                    <span
                      className={cn(
                        "grid size-6 place-items-center rounded-full text-xs font-bold",
                        isToday
                          ? "bg-primary text-primary-foreground"
                          : "text-foreground",
                      )}
                    >
                      {day}
                    </span>
                  </div>
                  <div className="space-y-1">
                    {daySessions.slice(0, 2).map((session) => (
                      <button
                        key={session.id}
                        type="button"
                        onClick={() => onSessionClick(session)}
                        className={cn(
                          "w-full truncate rounded-md border px-1 py-1 text-left text-[9px] font-bold transition-transform active:scale-[0.98] sm:rounded-lg sm:px-2 sm:text-[11px]",
                          session.source === "PLANNED" && "border-dashed opacity-85",
                          STATUS_STYLE[session.status],
                        )}
                        title={`${session.startTime} - ${session.subject}`}
                      >
                        <span className="sm:hidden">
                          {session.source === "PLANNED" ? "[Dự kiến] " : ""}
                          {session.startTime}
                        </span>
                        <span className="hidden sm:inline">
                          {session.source === "PLANNED" ? "[Dự kiến] " : ""}
                          {session.startTime} {session.subject}
                        </span>
                      </button>
                    ))}
                    {daySessions.length > 2 && (
                      <button
                        type="button"
                        onClick={() => setSelectedDayDate(date)}
                        className="block rounded-md px-1 text-left text-[10px] font-bold text-primary transition-colors hover:bg-muted"
                      >
                        +{daySessions.length - 2} buổi khác
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
          <DialogHeader className="px-5 py-4 border-b border-border/50">
            <DialogTitle className="text-base font-extrabold font-lms text-foreground">
              Các buổi học ngày {selectedDayDate}
            </DialogTitle>
          </DialogHeader>
          <div className="p-4 space-y-2 max-h-[60vh] overflow-y-auto">
            {dayModalSessions.map((session) => (
              <button
                key={session.id}
                type="button"
                onClick={() => {
                  setSelectedDayDate(null);
                  onSessionClick(session);
                }}
                className={cn(
                  "w-full text-left rounded-xl border p-3 transition-colors hover:border-primary/40 block",
                  STATUS_STYLE[session.status],
                )}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold">
                    {session.startTime} - {session.endTime}
                  </span>
                  {session.source === "PLANNED" && (
                    <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-muted text-muted-foreground border border-border">
                      Dự kiến
                    </span>
                  )}
                </div>
                <p className="font-extrabold text-sm mt-1">{session.subject}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {session.topic}
                </p>
              </button>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}
