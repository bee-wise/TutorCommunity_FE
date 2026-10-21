"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  lmsCalendarService,
  lmsCalendarKeys,
  getMonthRangeIso,
  parseVietnamDateTime,
} from "@workspace/core/lms-calendar";
import type {
  LearnerScheduleFilters,
  LearnerSession,
  LearnerSessionStatus,
} from "../types/learner-schedule.types";
import { mapLmsScheduleViewToLearnerSession } from "../types/learner-schedule.types";

export function useLearnerSchedule() {
  const todayParsed = useMemo(
    () => parseVietnamDateTime(new Date().toISOString()),
    [],
  );

  const [viewYear, setViewYear] = useState<number>(todayParsed.year);
  const [viewMonth, setViewMonth] = useState<number>(todayParsed.monthIndex);

  const [filters, setFilters] = useState<LearnerScheduleFilters>({
    subject: "all",
    status: "all",
  });

  const monthRange = useMemo(
    () => getMonthRangeIso(viewYear, viewMonth),
    [viewYear, viewMonth],
  );

  const calendarQuery = useQuery({
    queryKey: lmsCalendarKeys.calendar("learner", {
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

  const upcomingQuery = useQuery({
    queryKey: lmsCalendarKeys.upcoming("learner"),
    queryFn: ({ signal }) => lmsCalendarService.getUpcoming(signal),
  });

  const sessionsListQuery = useQuery({
    queryKey: lmsCalendarKeys.sessions("learner", {
      status: filters.status,
    }),
    queryFn: ({ signal }) =>
      lmsCalendarService.getSessions(
        {
          status: filters.status === "all" ? undefined : filters.status,
          pageSize: 50,
        },
        signal,
      ),
  });

  const sessions: LearnerSession[] = useMemo(() => {
    if (!calendarQuery.data) return [];
    return calendarQuery.data.map(mapLmsScheduleViewToLearnerSession);
  }, [calendarQuery.data]);

  const listSessions: LearnerSession[] = useMemo(() => {
    if (!sessionsListQuery.data?.items) return sessions;
    return sessionsListQuery.data.items.map(mapLmsScheduleViewToLearnerSession);
  }, [sessionsListQuery.data, sessions]);

  const upcomingSessions: LearnerSession[] = useMemo(() => {
    if (!upcomingQuery.data) return [];
    return upcomingQuery.data.map(mapLmsScheduleViewToLearnerSession);
  }, [upcomingQuery.data]);

  const subjects = useMemo(() => {
    const set = new Set<string>();
    for (const s of sessions) {
      if (s.subject) set.add(s.subject);
    }
    return Array.from(set);
  }, [sessions]);

  const filteredSessions = useMemo(() => {
    return sessions.filter((session) => {
      const matchesSubject =
        filters.subject === "all" || session.subject === filters.subject;
      return matchesSubject;
    });
  }, [filters.subject, sessions]);

  const filteredListSessions = useMemo(() => {
    return listSessions.filter((session) => {
      const matchesSubject =
        filters.subject === "all" || session.subject === filters.subject;
      return matchesSubject;
    });
  }, [filters.subject, listSessions]);

  function changeMonth(offset: number) {
    if (offset < 0) {
      if (viewMonth === 0) {
        setViewYear((y) => y - 1);
        setViewMonth(11);
      } else {
        setViewMonth((m) => m - 1);
      }
    } else {
      if (viewMonth === 11) {
        setViewYear((y) => y + 1);
        setViewMonth(0);
      } else {
        setViewMonth((m) => m + 1);
      }
    }
  }

  function goToToday() {
    const current = parseVietnamDateTime(new Date().toISOString());
    setViewYear(current.year);
    setViewMonth(current.monthIndex);
  }

  function setSubject(subject: string) {
    setFilters((current) => ({ ...current, subject }));
  }

  function setStatus(status: "all" | LearnerSessionStatus) {
    setFilters((current) => ({ ...current, status }));
  }

  return {
    viewYear,
    viewMonth,
    changeMonth,
    goToToday,
    sessions,
    filters,
    subjects,
    filteredSessions,
    filteredListSessions,
    upcomingSessions,
    isLoading: calendarQuery.isLoading || upcomingQuery.isLoading,
    isError: calendarQuery.isError,
    error: calendarQuery.error,
    refetch: () => {
      calendarQuery.refetch();
      upcomingQuery.refetch();
      sessionsListQuery.refetch();
    },
    setSubject,
    setStatus,
  };
}
