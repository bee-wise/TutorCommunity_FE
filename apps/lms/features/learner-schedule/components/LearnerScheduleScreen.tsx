"use client";

import { useState } from "react";
import { useLearnerSchedule } from "../hooks/useLearnerSchedule";
import type { LearnerSession } from "../types/learner-schedule.types";
import { LearnerCalendar } from "./LearnerCalendar";
import { LearnerSessionSheet } from "./LearnerSessionSheet";
import { ScheduleFilters } from "./ScheduleFilters";
import { UpcomingClassesPanel } from "./UpcomingClassesPanel";

export function LearnerScheduleScreen() {
  const schedule = useLearnerSchedule();
  const [selectedSession, setSelectedSession] = useState<LearnerSession | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);

  function openSession(session: LearnerSession) {
    setSelectedSession(session);
    setSheetOpen(true);
  }

  return (
    <div className="min-h-full bg-[#F8FAFC]">
      <div className="mx-auto max-w-[1400px] space-y-5 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-extrabold leading-tight text-foreground sm:text-3xl">Lịch học của tôi</h1>
            <p className="mt-1.5 max-w-2xl text-sm text-muted-foreground">Theo dõi lịch học, gia sư phụ trách và thông tin chuẩn bị cho từng buổi.</p>
          </div>
          <div className="w-fit rounded-xl border border-border bg-white px-3.5 py-2 text-sm font-bold text-[#280F91] shadow-sm">Thứ Hai, 24/08/2026</div>
        </header>

        <ScheduleFilters
          filters={schedule.filters}
          subjects={schedule.subjects}
          onSubjectChange={schedule.setSubject}
          onStatusChange={schedule.setStatus}
        />

        <div className="grid grid-cols-1 items-start gap-5 xl:grid-cols-[minmax(0,1fr)_340px]">
          <LearnerCalendar sessions={schedule.filteredSessions} onSessionClick={openSession} />
          <UpcomingClassesPanel sessions={schedule.upcomingSessions} onSelect={openSession} />
        </div>
      </div>

      <LearnerSessionSheet session={selectedSession} open={sheetOpen} onOpenChange={setSheetOpen} />
    </div>
  );
}

