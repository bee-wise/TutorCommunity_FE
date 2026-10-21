"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { lmsCalendarService, lmsCalendarKeys } from "@/features/lms-calendar";
import { mapLmsScheduleViewToTutorSession } from "@/features/tutor-schedule/types/schedule.types";
import { DashboardSchedule } from "./DashboardSchedule";
import type { Session } from "@/features/tutor-schedule/types/schedule.types";

export function LiveDashboardSchedule() {
  const { data: sessionsData } = useQuery({
    queryKey: lmsCalendarKeys.sessions("tutor", {
      status: "SCHEDULED",
      sort: "asc",
      pageSize: 10,
    }),
    queryFn: ({ signal }) =>
      lmsCalendarService.getSessions(
        {
          status: "SCHEDULED",
          sort: "asc",
          pageSize: 10,
        },
        signal,
      ),
  });

  const { data: upcomingData } = useQuery({
    queryKey: lmsCalendarKeys.upcoming("tutor"),
    queryFn: ({ signal }) => lmsCalendarService.getUpcoming(signal),
  });

  const sessions: readonly Session[] = useMemo(() => {
    if (sessionsData?.items && sessionsData.items.length > 0) {
      return sessionsData.items.map(mapLmsScheduleViewToTutorSession);
    }
    return [];
  }, [sessionsData]);

  const upcomingSession: Session | null = useMemo(() => {
    if (upcomingData && upcomingData.length > 0) {
      return mapLmsScheduleViewToTutorSession(upcomingData[0]);
    }
    if (sessions.length > 0) {
      return sessions[0];
    }
    return null;
  }, [upcomingData, sessions]);

  return (
    <DashboardSchedule
      sessions={sessions}
      upcomingSession={upcomingSession}
      isLive={true}
    />
  );
}
