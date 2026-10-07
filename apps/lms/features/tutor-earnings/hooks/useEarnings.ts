"use client";

import { useMemo, useState } from "react";
import { EARNING_SESSIONS } from "../data/earnings.mock";
import type { EarningsPeriod, SettlementFilter } from "../types/earnings.types";
import { filterEarningSessions } from "../utils/earnings.utils";

const PAGE_SIZE = 6;
// Anchor the demo to its latest session rather than pretending mock data is live.
const REFERENCE_DATE = EARNING_SESSIONS[0]?.taughtAt.slice(0, 10) ?? "2026-08-22";

export function useEarnings() {
  const [period, updatePeriod] = useState<EarningsPeriod>("month");
  const [referenceDate, updateDate] = useState(REFERENCE_DATE);
  const [status, updateStatus] = useState<SettlementFilter>("all");
  const [search, updateSearch] = useState("");
  const [page, setPage] = useState(0);
  const filteredSessions = useMemo(() => filterEarningSessions(EARNING_SESSIONS, {
    period, referenceDate, status, search,
  }), [period, referenceDate, status, search]);
  const pageCount = Math.max(1, Math.ceil(filteredSessions.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount - 1);

  return {
    period, referenceDate, status, search, filteredSessions,
    pagedSessions: filteredSessions.slice(currentPage * PAGE_SIZE, (currentPage + 1) * PAGE_SIZE),
    totalFee: filteredSessions.reduce((total, session) => total + session.fee, 0),
    page: currentPage, pageCount, setPage,
    setPeriod(value: EarningsPeriod) { updatePeriod(value); setPage(0); },
    setReferenceDate(value: string) { updateDate(value); setPage(0); },
    setStatus(value: SettlementFilter) { updateStatus(value); setPage(0); },
    setSearch(value: string) { updateSearch(value); setPage(0); },
    resetFilters() {
      updatePeriod("month"); updateDate(REFERENCE_DATE); updateStatus("all"); updateSearch(""); setPage(0);
    },
  };
}
