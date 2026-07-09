"use client";

import { useState, useMemo } from "react";
import type { Session, FilterState } from "../types/schedule.types";
import { MOCK_SESSIONS } from "../data/mock-sessions";

const TODAY = "2026-07-08"; // Reference date matching mock data

export function useScheduleFilters() {
  const [filters, setFilters] = useState<FilterState>({
    subject: "all",
    status: "all",
  });

  const sessions = MOCK_SESSIONS;

  const filteredSessions = useMemo(() => {
    return sessions.filter((s) => {
      const subjectMatch =
        filters.subject === "all" || s.subject === filters.subject;
      const statusMatch =
        filters.status === "all" || s.status === filters.status;
      return subjectMatch && statusMatch;
    });
  }, [sessions, filters]);

  const todaySessions = useMemo(
    () => sessions.filter((s) => s.date === TODAY && s.status === "UPCOMING"),
    [sessions],
  );

  const totalActiveSessions = useMemo(
    () => sessions.filter((s) => s.status !== "CANCELED").length,
    [sessions],
  );

  const pendingRequests = useMemo(
    () => sessions.filter((s) => s.status === "UPCOMING").length,
    [sessions],
  );

  const setSubjectFilter = (value: string) =>
    setFilters((prev) => ({ ...prev, subject: value }));

  const setStatusFilter = (value: string) =>
    setFilters((prev) => ({ ...prev, status: value }));

  return {
    filters,
    filteredSessions,
    todaySessions,
    totalActiveSessions,
    pendingRequests,
    setSubjectFilter,
    setStatusFilter,
  };
}

export function getSessionsForDate(sessions: Session[], date: string): Session[] {
  return sessions.filter((s) => s.date === date);
}
