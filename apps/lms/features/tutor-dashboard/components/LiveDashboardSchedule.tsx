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

  const sessions: readonly Session[] = useMemo(() => {
    if (sessionsData?.items && sessionsData.items.length > 0) {
      return sessionsData.items.map(mapLmsScheduleViewToTutorSession);
    }
    return [];
  }, [sessionsData]);

  return (
    <DashboardSchedule
      sessions={sessions}
      isLive={true}
    />
  );
}
