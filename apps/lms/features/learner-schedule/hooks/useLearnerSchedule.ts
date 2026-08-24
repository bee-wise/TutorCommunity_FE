"use client";

import { useMemo, useState } from "react";
import { LEARNER_SESSIONS, LEARNER_TODAY } from "../data/learner-schedule.mock";
import type {
  LearnerScheduleFilters,
  LearnerSessionStatus,
} from "../types/learner-schedule.types";

export function useLearnerSchedule() {
  const [filters, setFilters] = useState<LearnerScheduleFilters>({
    subject: "all",
    status: "all",
  });

  const subjects = useMemo(
    () => [...new Set(LEARNER_SESSIONS.map((session) => session.subject))],
    [],
  );
  const filteredSessions = useMemo(
    () =>
      LEARNER_SESSIONS.filter((session) => {
        const matchesSubject = filters.subject === "all" || session.subject === filters.subject;
        const matchesStatus = filters.status === "all" || session.status === filters.status;
        return matchesSubject && matchesStatus;
      }),
    [filters],
  );
  const upcomingSessions = useMemo(
    () =>
      LEARNER_SESSIONS.filter(
        (session) => session.status === "UPCOMING" && session.date >= LEARNER_TODAY,
      )
        .sort((a, b) => `${a.date}${a.startTime}`.localeCompare(`${b.date}${b.startTime}`))
        .slice(0, 5),
    [],
  );

  function setSubject(subject: string) {
    setFilters((current) => ({ ...current, subject }));
  }

  function setStatus(status: "all" | LearnerSessionStatus) {
    setFilters((current) => ({ ...current, status }));
  }

  return {
    filters,
    subjects,
    filteredSessions,
    upcomingSessions,
    setSubject,
    setStatus,
  };
}
