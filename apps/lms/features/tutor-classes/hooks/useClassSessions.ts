"use client";

import { useMemo, useState } from "react";
import { TUTOR_CLASS_SESSIONS } from "../data/classes.mock";
import { useAttendanceStore } from "../store/attendance.store";
import { normalizeClassSearch } from "../utils/classes.utils";

export function useClassSessions(classId: string) {
  const records = useAttendanceStore((state) => state.records);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [attendance, setAttendance] = useState("all");
  const [page, setPage] = useState(0);
  const filtered = useMemo(() => TUTOR_CLASS_SESSIONS.filter((session) => session.classId === classId
    && normalizeClassSearch(`${session.topic} ${session.id}`).includes(normalizeClassSearch(search))
    && (status === "all" || session.status === status)
    && (attendance === "all" || (attendance === "unmarked" ? !records[session.id] : records[session.id]?.state === attendance)))
    .sort((a, b) => b.taughtAt.localeCompare(a.taughtAt)), [classId, search, status, attendance, records]);
  const pageCount = Math.max(1, Math.ceil(filtered.length / 6));
  const currentPage = Math.min(page, pageCount - 1);
  return {
    search, status, attendance, records, page: currentPage, pageCount, total: filtered.length,
    sessions: filtered.slice(currentPage * 6, (currentPage + 1) * 6), setPage,
    updateSearch(value: string) { setSearch(value); setPage(0); },
    updateStatus(value: string) { setStatus(value); setPage(0); },
    updateAttendance(value: string) { setAttendance(value); setPage(0); },
    resetFilters() { setSearch(""); setStatus("all"); setAttendance("all"); setPage(0); },
  };
}
