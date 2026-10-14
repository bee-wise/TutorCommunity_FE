"use client";

import { useEffect, useState } from "react";
import { useQueries, useQuery } from "@tanstack/react-query";
import { tutorClassQueryKeys } from "../query-keys";
import { getTutorClasses } from "../services/classes.service";
import type { ClassFilters } from "../types/classes.types";
import { shouldRetryClassQuery, toClassQuery, toTutorClassCard } from "../utils/class-api.utils";
import { useTutorClassAccess } from "./useTutorClassAccess";

const DEFAULT_FILTERS: ClassFilters = { kind: "individual", search: "", status: "all", sort: "newest" };
export function useTutorClasses() {
  const access = useTutorClassAccess();
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  useEffect(() => {
    const timer = window.setTimeout(() => setSearch(filters.search.trim()), 300);
    return () => window.clearTimeout(timer);
  }, [filters.search]);
  const searchPending = search !== filters.search.trim();
  const params = toClassQuery({ ...filters, search }, page);
  const query = useQuery({
    queryKey: tutorClassQueryKeys.list(access.actorId, params),
    queryFn: ({ signal }) => getTutorClasses(params, signal),
    enabled: access.allowed && !searchPending,
    staleTime: 30_000, retry: shouldRetryClassQuery,
  });
  // The contract exposes total, not aggregate counts. Request one row per type
  // and use server total, never count/filter the returned page on the client.
  const counts = useQueries({ queries: (["INDIVIDUAL", "GROUP"] as const).map((type) => {
    const countParams = { type, page: 1, pageSize: 1, sort: "NEWEST" as const };
    return {
      queryKey: tutorClassQueryKeys.list(access.actorId, countParams),
      queryFn: ({ signal }: { signal: AbortSignal }) => getTutorClasses(countParams, signal),
      enabled: access.allowed, staleTime: 60_000, retry: shouldRetryClassQuery,
    };
  }) });
  const data = access.allowed && !query.isError && !searchPending ? query.data : undefined;
  return {
    filters, page: data?.page ?? page,
    pageCount: Math.max(1, Math.ceil((data?.total ?? 0) / (data?.pageSize ?? 6))),
    total: data?.total ?? 0, cards: data?.items.map(toTutorClassCard) ?? [],
    outOfRange: Boolean(data && data.page > 1 && !data.items.length),
    classCounts: {
      individual: access.allowed && !counts[0].isError ? counts[0].data?.total : undefined,
      group: access.allowed && !counts[1].isError ? counts[1].data?.total : undefined,
    },
    loading: access.checking || (access.allowed && (searchPending || query.isPending)),
    error: access.error ?? (searchPending ? null : query.error),
    retry() { if (access.allowed && !searchPending) { void query.refetch(); counts.forEach((count) => { void count.refetch(); }); } },
    setPage,
    updateFilters(patch: Partial<ClassFilters>) { setFilters((current) => ({ ...current, ...patch })); setPage(1); },
    resetFilters() { setFilters({ ...DEFAULT_FILTERS, kind: filters.kind }); setPage(1); },
  };
}
