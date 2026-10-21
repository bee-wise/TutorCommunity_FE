"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { getVietnamToday, lmsCalendarKeys, lmsCalendarService } from "@/features/lms-calendar";
import { getTutorReadiness, tutorReadinessQueryKey } from "@workspace/core/services/tutor-readiness.service";
import { useAuthStore } from "@workspace/core/store/useAuthStore";
import { buildWeekDays, getWeekDates, getWeekRangeIso } from "../utils/dashboard-overview.utils";

export function useTutorOverview() {
  const userId = useAuthStore((state) => state.user?.id);
  const today = getVietnamToday();
  const weekDates = useMemo(() => getWeekDates(today), [today]);
  const range = useMemo(() => getWeekRangeIso(weekDates), [weekDates]);

  const kpis = useQuery({
    queryKey: lmsCalendarKeys.kpis("tutor"),
    queryFn: ({ signal }) => lmsCalendarService.getKpis(signal),
    staleTime: 60_000,
  });
  const week = useQuery({
    queryKey: lmsCalendarKeys.calendar("tutor", range),
    queryFn: ({ signal }) => lmsCalendarService.getAllCalendar(range, signal),
    staleTime: 60_000,
  });
  const readiness = useQuery({
    queryKey: tutorReadinessQueryKey(userId),
    queryFn: getTutorReadiness,
    enabled: Boolean(userId),
    staleTime: 60_000,
  });

  const days = useMemo(() => buildWeekDays(week.data ?? [], weekDates, today), [week.data, weekDates, today]);
  const weekSessions = days.reduce((total, day) => total + day.sessionCount, 0);
  const weekMinutes = days.reduce((total, day) => total + day.minutes, 0);

  return { today, kpis, week, readiness, days, weekSessions, weekMinutes };
}
