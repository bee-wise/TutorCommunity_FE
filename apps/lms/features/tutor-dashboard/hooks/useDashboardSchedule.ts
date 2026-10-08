"use client";

import { useRef, useState } from "react";
import type { Session } from "@/features/tutor-schedule/types/schedule.types";
import { getUpcomingDashboardSessions } from "../utils/dashboard-schedule.utils";

export function useDashboardSchedule(sessions: readonly Session[]) {
  const [filter, setFilter] = useState("all");
  const [selected, setSelected] = useState<Session | null>(null);
  const [open, setOpen] = useState(false);
  const returnFocusRef = useRef<HTMLButtonElement | null>(null);
  const upcoming = getUpcomingDashboardSessions(sessions);
  const dates = [...new Set(upcoming.map((session) => session.date))];
  const visibleSessions = upcoming.filter((session) => filter === "all" || session.date === filter);

  function selectSession(session: Session, trigger: HTMLButtonElement) {
    returnFocusRef.current = trigger;
    setSelected(session);
    setOpen(true);
  }

  return { filter, setFilter, selected, open, setOpen, returnFocusRef, dates, upcoming, visibleSessions, selectSession };
}
