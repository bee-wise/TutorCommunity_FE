"use client";

import { useMemo, useState } from "react";
import { EARNING_SESSIONS } from "../data/earnings.mock";
import type {
  EarningsPeriod,
  SettlementStatus,
} from "../types/earnings.types";
import { isInPeriod } from "../utils/earnings.utils";

export type SettlementFilter = "all" | SettlementStatus;

export function useEarnings() {
  const [period, setPeriod] = useState<EarningsPeriod>("month");
  const [referenceDate, setReferenceDate] = useState("2026-08-22");
  const [status, setStatus] = useState<SettlementFilter>("all");
  const [search, setSearch] = useState("");

  const filteredSessions = useMemo(() => {
    const normalizedSearch = search.trim().toLocaleLowerCase("vi");
    const reference = new Date(`${referenceDate}T12:00:00+07:00`);

    return EARNING_SESSIONS.filter((session) => {
      const matchesPeriod = isInPeriod(session.taughtAt, period, reference);
      const matchesStatus = status === "all" || session.settlementStatus === status;
      const searchable = `${session.sessionCode} ${session.learnerName} ${session.className}`.toLocaleLowerCase("vi");
      return matchesPeriod && matchesStatus && searchable.includes(normalizedSearch);
    });
  }, [period, referenceDate, search, status]);

  const summary = useMemo(
    () =>
      filteredSessions.reduce(
        (result, session) => {
          result.total += session.fee;
          result.sessionCount += 1;
          if (session.settlementStatus === "settled") {
            result.settled += session.fee;
          } else {
            result.pending += session.fee;
          }
          return result;
        },
        { total: 0, settled: 0, pending: 0, sessionCount: 0 },
      ),
    [filteredSessions],
  );

  return {
    period,
    referenceDate,
    status,
    search,
    filteredSessions,
    summary,
    setPeriod,
    setReferenceDate,
    setStatus,
    setSearch,
  };
}
