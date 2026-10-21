"use client";

import { useState } from "react";
import { useIsMobile } from "@workspace/core/hooks/use-mobile";
import { ArrowPathIcon, ExclamationCircleIcon } from "@heroicons/react/24/outline";
import { Button } from "@workspace/ui/components/ui/button";
import { parseVietnamDateTime } from "@workspace/core/lms-calendar";
import { useScheduleFilters } from "./hooks/useScheduleFilters";
import { OverviewCards } from "./components/OverviewCards";
import { ControlBar } from "./components/ControlBar";
import { LmsCalendar } from "@/components/LmsCalendar";
import { LmsPageHeader } from "@/components/LmsPageHeader";
import { ListView } from "./components/ListView";
import { SessionDetailSheet } from "./components/SessionDetailSheet";
import type { Session, ViewMode } from "./types/schedule.types";

const WEEKDAY_NAMES = [
  "Chủ nhật",
  "Thứ hai",
  "Thứ ba",
  "Thứ tư",
  "Thứ năm",
  "Thứ sáu",
  "Thứ bảy",
];

export function TutorSchedulePage() {
  const isMobile = useIsMobile();
  // Phones read a list more easily than a month grid; an explicit choice wins.
  const [chosenView, setViewMode] = useState<ViewMode | null>(null);
  const viewMode = chosenView ?? (isMobile ? "list" : "calendar");
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);

  const {
    filters,
    viewYear,
    viewMonth,
    handlePrevMonth,
    handleNextMonth,
    handleGoToday,
    filteredSessions,
    kpis,
    isLoading,
    isError,
    error,
    refetch,
    setSubjectFilter,
    setStatusFilter,
  } = useScheduleFilters();

  const now = new Date();
  const parsedNow = parseVietnamDateTime(now.toISOString());
  const dayOfWeek = WEEKDAY_NAMES[now.getDay()];
  const todayLabel = `${dayOfWeek}, ${String(parsedNow.day).padStart(2, "0")}/${String(parsedNow.month).padStart(2, "0")}/${parsedNow.year}`;

  function handleSessionClick(session: Session) {
    setSelectedSession(session);
    setSheetOpen(true);
  }

  function handleSheetClose() {
    setSheetOpen(false);
    setTimeout(() => setSelectedSession(null), 350);
  }

  return (
    <div className="min-h-full bg-muted">
      <div className="px-4 sm:px-6 lg:px-8 py-6 max-w-7xl mx-auto space-y-6">
        <LmsPageHeader
          title="Lịch dạy"
          actions={<div className="rounded-lg border border-border bg-card px-3.5 py-2 text-sm font-bold text-primary">{todayLabel}</div>}
        />

        {isError && (
          <div role="alert" className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-error bg-card p-4 text-destructive">
            <div className="flex items-center gap-3">
              <ExclamationCircleIcon className="size-5 shrink-0" />
              <p className="text-sm font-medium">
                {error instanceof Error
                  ? error.message
                  : "Không thể tải dữ liệu lịch. Vui lòng thử lại."}
              </p>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={refetch}
              className="gap-1.5"
            >
              <ArrowPathIcon className="size-3.5" />
              Tải lại
            </Button>
          </div>
        )}

        <OverviewCards
          todayCount={kpis?.sessionsToday ?? 0}
          totalActiveCount={kpis?.activeClasses ?? 0}
          pendingCount={kpis?.upcomingSessions ?? 0}
        />

        <ControlBar
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          filters={filters}
          onSubjectChange={setSubjectFilter}
          onStatusChange={setStatusFilter}
        />

        <div>
          {viewMode === "calendar" ? (
            <LmsCalendar
              getSecondaryLabel={(session) => session.studentFullName}
              sessions={filteredSessions}
              onSessionClick={handleSessionClick}
              viewYear={viewYear}
              viewMonth={viewMonth}
              onMonthChange={(offset) => (offset < 0 ? handlePrevMonth() : handleNextMonth())}
              onToday={handleGoToday}
              isLoading={isLoading}
            />
          ) : (
            <ListView
              sessions={filteredSessions}
              onSessionClick={handleSessionClick}
            />
          )}
        </div>
      </div>

      <SessionDetailSheet
        key={selectedSession?.id ?? "none"}
        session={selectedSession}
        open={sheetOpen}
        onClose={handleSheetClose}
      />
    </div>
  );
}
