"use client";

import { useMemo, useState } from "react";
import { LEARNER_SESSIONS, LEARNER_TODAY } from "../data/learner-schedule.mock";
import type {
  LearnerCancellationRequest,
  LearnerScheduleFilters,
  LearnerSessionStatus,
} from "../types/learner-schedule.types";

export function useLearnerSchedule() {
  const [sessions, setSessions] = useState(LEARNER_SESSIONS);
  const [filters, setFilters] = useState<LearnerScheduleFilters>({
    subject: "all",
    status: "all",
  });

  const subjects = useMemo(
    () => [...new Set(sessions.map((session) => session.subject))],
    [sessions],
  );
  const filteredSessions = useMemo(
    () =>
      sessions.filter((session) => {
        const matchesSubject = filters.subject === "all" || session.subject === filters.subject;
        const matchesStatus = filters.status === "all" || session.status === filters.status;
        return matchesSubject && matchesStatus;
      }),
    [filters, sessions],
  );
  const upcomingSessions = useMemo(
    () =>
      filteredSessions.filter(
        (session) => session.status === "UPCOMING" && session.date >= LEARNER_TODAY,
      )
        .sort((a, b) => `${a.date}${a.startTime}`.localeCompare(`${b.date}${b.startTime}`))
        .slice(0, 3),
    [filteredSessions],
  );

  function setSubject(subject: string) {
    setFilters((current) => ({ ...current, subject }));
  }

  function setStatus(status: "all" | LearnerSessionStatus) {
    setFilters((current) => ({ ...current, status }));
  }

  function cancelSession(sessionId: string, request: LearnerCancellationRequest) {
    setSessions((current) => current.map((session) => session.id === sessionId && session.status === "UPCOMING"
      ? {
          ...session,
          status: "CANCELED",
          cancellation: {
            ...request,
            canceledAt: new Date().toISOString(),
            canceledBy: "LEARNER",
          },
        }
      : session));
  }

  return {
    sessions,
    filters,
    subjects,
    filteredSessions,
    upcomingSessions,
    setSubject,
    setStatus,
    cancelSession,
  };
}
