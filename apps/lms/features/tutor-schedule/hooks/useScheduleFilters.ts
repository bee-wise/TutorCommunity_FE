"use client";

import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  lmsCalendarService,
  lmsCalendarKeys,
  getMonthRangeIso,
  parseVietnamDateTime,
} from "@workspace/core/lms-calendar";
import type { Session, FilterState } from "../types/schedule.types";
import { mapLmsScheduleViewToTutorSession } from "../types/schedule.types";

export function useScheduleFilters() {
  const todayParsed = useMemo(
    () => parseVietnamDateTime(new Date().toISOString()),
    [],
  );

  const [viewYear, setViewYear] = useState<number>(todayParsed.year);
  const [viewMonth, setViewMonth] = useState<number>(todayParsed.monthIndex);

  const [filters, setFilters] = useState<FilterState>({
    subject: "all",
    status: "all",
  });

  const monthRange = useMemo(
    () => getMonthRangeIso(viewYear, viewMonth),
    [viewYear, viewMonth],
  );

  const calendarQuery = useQuery({
    queryKey: lmsCalendarKeys.calendar("tutor", {
      from: monthRange.from,
      to: monthRange.to,
      status: filters.status,
    }),
    queryFn: ({ signal }) =>
      lmsCalendarService.getAllCalendar(
        {
          from: monthRange.from,
          to: monthRange.to,
          status: filters.status === "all" ? undefined : filters.status,
        },
        signal,
      ),
  });

  const kpisQuery = useQuery({
    queryKey: lmsCalendarKeys.kpis("tutor"),
    queryFn: ({ signal }) => lmsCalendarService.getKpis(signal),
  });

  const sessions: Session[] = useMemo(() => {
    if (!calendarQuery.data) return [];
    return calendarQuery.data.map(mapLmsScheduleViewToTutorSession);
  }, [calendarQuery.data]);

  const subjects = useMemo(() => {
    const set = new Set<string>();
    for (const s of sessions) {
      if (s.subject) set.add(s.subject);
    }
    return Array.from(set);
  }, [sessions]);

  const filteredSessions = useMemo(() => {
    return sessions.filter((s) => {
      const subjectMatch =
        filters.subject === "all" || s.subject === filters.subject;
      return subjectMatch;
    });
  }, [sessions, filters.subject]);

  const handlePrevMonth = () => {
    if (viewMonth === 0) {
      setViewYear((y) => y - 1);
      setViewMonth(11);
    } else {
      setViewMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (viewMonth === 11) {
      setViewYear((y) => y + 1);
      setViewMonth(0);
    } else {
      setViewMonth((m) => m + 1);
    }
  };

  const handleGoToday = () => {
    const current = parseVietnamDateTime(new Date().toISOString());
    setViewYear(current.year);
    setViewMonth(current.monthIndex);
  };

  const setSubjectFilter = (value: string) =>
    setFilters((prev) => ({ ...prev, subject: value }));

  const setStatusFilter = (value: string) =>
    setFilters((prev) => ({ ...prev, status: value }));

  return {
    filters,
    viewYear,
    viewMonth,
    handlePrevMonth,
    handleNextMonth,
    handleGoToday,
    sessions,
    filteredSessions,
    subjects,
    kpis: kpisQuery.data,
    isLoading: calendarQuery.isLoading,
    isKpiLoading: kpisQuery.isLoading,
    isError: calendarQuery.isError,
    error: calendarQuery.error,
    refetch: () => {
      calendarQuery.refetch();
      kpisQuery.refetch();
    },
    setSubjectFilter,
    setStatusFilter,
  };
}

export function getSessionsForDate(sessions: Session[], date: string): Session[] {
  return sessions.filter((s) => s.date === date);
}
