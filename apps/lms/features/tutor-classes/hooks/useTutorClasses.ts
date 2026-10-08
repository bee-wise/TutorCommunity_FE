"use client";

import { useMemo, useState } from "react";
import { CLASS_ROSTER, TUTOR_CLASSES, TUTOR_CLASS_SESSIONS } from "../data/classes.mock";
import { useAttendanceStore } from "../store/attendance.store";
import type { ClassFilters } from "../types/classes.types";
import { filterTutorClasses, getTutorClassCardModel } from "../utils/classes.utils";

const DEFAULT_FILTERS: ClassFilters = { kind: "individual", search: "", status: "all", sort: "newest" };
const CLASS_COUNTS = { individual: TUTOR_CLASSES.filter((item) => item.kind === "individual").length, group: TUTOR_CLASSES.filter((item) => item.kind === "group").length };
export function useTutorClasses() {
  const records = useAttendanceStore((state) => state.records);
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [page, setPage] = useState(0);
  const filtered = useMemo(() => filterTutorClasses(TUTOR_CLASSES, CLASS_ROSTER, filters), [filters]);
  const pageCount = Math.max(1, Math.ceil(filtered.length / 6));
  const currentPage = Math.min(page, pageCount - 1);
  const cards = useMemo(() => filtered.slice(currentPage * 6, (currentPage + 1) * 6).map((classInfo) => getTutorClassCardModel(classInfo, CLASS_ROSTER, TUTOR_CLASS_SESSIONS, records)), [filtered, currentPage, records]);
  return {
    filters, page: currentPage, pageCount, total: filtered.length, cards, classCounts: CLASS_COUNTS, setPage,
    updateFilters(patch: Partial<ClassFilters>) { setFilters((current) => ({ ...current, ...patch })); setPage(0); },
    resetFilters() { setFilters({ ...DEFAULT_FILTERS, kind: filters.kind }); setPage(0); },
  };
}
