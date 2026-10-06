"use client";

import { useMemo, useState } from "react";
import { CLASS_ROSTER, TUTOR_CLASSES } from "../data/classes.mock";
import type { ClassFilters } from "../types/classes.types";
import { filterTutorClasses } from "../utils/classes.utils";

const DEFAULT_FILTERS: ClassFilters = { kind: "individual", search: "", status: "all", sort: "newest" };
export function useTutorClasses() {
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [page, setPage] = useState(0);
  const filtered = useMemo(() => filterTutorClasses(TUTOR_CLASSES, CLASS_ROSTER, filters), [filters]);
  const pageCount = Math.max(1, Math.ceil(filtered.length / 6));
  const currentPage = Math.min(page, pageCount - 1);
  return {
    filters, page: currentPage, pageCount, total: filtered.length, classes: filtered.slice(currentPage * 6, (currentPage + 1) * 6), setPage,
    updateFilters(patch: Partial<ClassFilters>) { setFilters((current) => ({ ...current, ...patch })); setPage(0); },
    resetFilters() { setFilters({ ...DEFAULT_FILTERS, kind: filters.kind }); setPage(0); },
  };
}
