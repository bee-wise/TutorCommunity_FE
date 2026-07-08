"use client";

import { useState } from "react";
import { CalendarDays } from "lucide-react";
import { useScheduleFilters } from "./hooks/useScheduleFilters";
import { OverviewCards } from "./components/OverviewCards";
import { ControlBar } from "./components/ControlBar";
import { CalendarView } from "./components/CalendarView";
import { ListView } from "./components/ListView";
import { SessionDetailSheet } from "./components/SessionDetailSheet";
import type { Session, ViewMode } from "./types/schedule.types";

export function TutorSchedulePage() {
  const [viewMode, setViewMode] = useState<ViewMode>("calendar");
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);

  const {
    filters,
    filteredSessions,
    todaySessions,
    totalActiveSessions,
    pendingRequests,
    setSubjectFilter,
    setStatusFilter,
  } = useScheduleFilters();

  function handleSessionClick(session: Session) {
    setSelectedSession(session);
    setSheetOpen(true);
  }

  function handleSheetClose() {
    setSheetOpen(false);
    // Keep selectedSession mounted briefly for exit animation
    setTimeout(() => setSelectedSession(null), 350);
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <div className="px-4 sm:px-6 lg:px-8 py-6 max-w-7xl mx-auto space-y-6">
        {/* ── Page Header ── */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <div className="flex items-center gap-2.5 mb-1">
              <h1 className="text-2xl font-extrabold font-montserrat text-foreground leading-tight">
                Lịch Dạy
              </h1>
            </div>
            <p className="text-sm text-muted-foreground">
              Quản lý và theo dõi toàn bộ lịch giảng dạy của bạn.
            </p>
          </div>

          {/* Date indicator */}
          <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-border/60 shadow-xs self-start sm:self-auto">
            <div className="size-2 rounded-full bg-[#447353] animate-pulse" />
            <span className="text-sm font-semibold text-foreground">
              Thứ Ba, 08/07/2026
            </span>
          </div>
        </div>

        {/* ── Layer 1: KPI Cards ── */}
        <OverviewCards
          todayCount={todaySessions.length}
          totalActiveCount={totalActiveSessions}
          pendingCount={pendingRequests}
        />

        {/* ── Layer 2: Control Bar ── */}
        <ControlBar
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          filters={filters}
          onSubjectChange={setSubjectFilter}
          onStatusChange={setStatusFilter}
        />

        {/* ── Layer 3: Schedule View ── */}
        <div>
          {viewMode === "calendar" ? (
            <CalendarView
              sessions={filteredSessions}
              onSessionClick={handleSessionClick}
            />
          ) : (
            <ListView
              sessions={filteredSessions}
              onSessionClick={handleSessionClick}
            />
          )}
        </div>
      </div>

      {/* ── Session Detail Sheet ── */}
      <SessionDetailSheet
        key={selectedSession?.id ?? "none"}
        session={selectedSession}
        open={sheetOpen}
        onClose={handleSheetClose}
      />
    </div>
  );
}
