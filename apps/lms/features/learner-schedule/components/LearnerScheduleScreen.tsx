"use client";

import { useState } from "react";
import { ArrowPathIcon, ExclamationCircleIcon } from "@heroicons/react/24/outline";
import { useIsMobile } from "@workspace/core/hooks/use-mobile";
import { Button } from "@workspace/ui/components/ui/button";
import { parseVietnamDateTime } from "@workspace/core/lms-calendar";
import { useLearnerSchedule } from "../hooks/useLearnerSchedule";
import type {
  LearnerScheduleView,
  LearnerSession,
} from "../types/learner-schedule.types";
import { LmsCalendar } from "@/components/LmsCalendar";
import { LmsPageHeader } from "@/components/LmsPageHeader";
import { LearnerScheduleList } from "./LearnerScheduleList";
import { LearnerSessionSheet } from "./LearnerSessionSheet";
import { ScheduleFilters } from "./ScheduleFilters";
import { UpcomingClassesPanel } from "./UpcomingClassesPanel";

const WEEKDAY_NAMES = [
  "Chủ nhật",
  "Thứ hai",
  "Thứ ba",
  "Thứ tư",
  "Thứ năm",
  "Thứ sáu",
  "Thứ bảy",
];

export function LearnerScheduleScreen() {
  const schedule = useLearnerSchedule();
  const [selectedSession, setSelectedSession] = useState<LearnerSession | null>(
    null,
  );
  const [sheetOpen, setSheetOpen] = useState(false);
  const isMobile = useIsMobile();
  // Phones read a day-by-day list more easily than a month grid; an explicit choice wins.
  const [chosenView, setView] = useState<LearnerScheduleView | null>(null);
  const view = chosenView ?? (isMobile ? "list" : "calendar");

  const now = new Date();
  const parsedNow = parseVietnamDateTime(now.toISOString());
  const dayOfWeek = WEEKDAY_NAMES[now.getDay()];
  const todayLabel = `${dayOfWeek}, ${String(parsedNow.day).padStart(2, "0")}/${String(parsedNow.month).padStart(2, "0")}/${parsedNow.year}`;

  function openSession(session: LearnerSession) {
    setSelectedSession(session);
    setSheetOpen(true);
  }

  function handleSheetClose(open: boolean) {
    setSheetOpen(open);
    if (!open) {
      setTimeout(() => setSelectedSession(null), 350);
    }
  }

  return (
    <div className="min-h-full bg-muted">
      <div className="mx-auto max-w-[1400px] space-y-5 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <LmsPageHeader
          title="Lịch học của tôi"
          actions={<div className="w-fit rounded-lg border border-border bg-card px-3.5 py-2 text-sm font-bold text-primary">{todayLabel}</div>}
        />

        {schedule.isError && (
          <div role="alert" className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-error bg-card p-4 text-destructive">
            <div className="flex items-center gap-3">
              <ExclamationCircleIcon className="size-5 shrink-0" />
              <p className="text-sm font-medium">
                {schedule.error instanceof Error
                  ? schedule.error.message
                  : "Không thể tải lịch học. Vui lòng thử lại."}
              </p>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={schedule.refetch}
              className="gap-1.5"
            >
              <ArrowPathIcon className="size-3.5" />
              Tải lại
            </Button>
          </div>
        )}

        <ScheduleFilters
          filters={schedule.filters}
          subjects={schedule.subjects}
          view={view}
          onSubjectChange={schedule.setSubject}
          onStatusChange={schedule.setStatus}
          onViewChange={setView}
        />

        <UpcomingClassesPanel
          sessions={schedule.upcomingSessions}
          onSelect={openSession}
        />

        {view === "calendar" ? (
          <LmsCalendar
            getSecondaryLabel={(session) => session.topic}
            sessions={schedule.filteredSessions}
            onSessionClick={openSession}
            viewYear={schedule.viewYear}
            viewMonth={schedule.viewMonth}
            onMonthChange={schedule.changeMonth}
            onToday={schedule.goToToday}
            isLoading={schedule.isLoading}
          />
        ) : (
          <LearnerScheduleList
            sessions={schedule.filteredListSessions}
            onSelect={openSession}
          />
        )}
      </div>

      <LearnerSessionSheet
        key={selectedSession?.id ?? "none"}
        session={selectedSession}
        open={sheetOpen}
        onOpenChange={handleSheetClose}
      />
    </div>
  );
}
