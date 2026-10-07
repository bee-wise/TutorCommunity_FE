"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { chatRoomsService } from "@workspace/core/services/chat-rooms.service";
import { useAuthStore } from "@workspace/core/store/useAuthStore";
import type { HistoryFilters } from "../types/history.types";
import { filterHistory, mapHistoryConnections } from "../utils/history.utils";

const DEFAULT_FILTERS: HistoryFilters = { search: "", status: "all", from: "", to: "", sort: "newest" };
const PAGE_SIZE = 6;

export function useConnectionHistory() {
  const user = useAuthStore((state) => state.user);
  const authLoading = useAuthStore((state) => state.isAuthLoading);
  const enabled = user?.role?.toUpperCase() === "TUTOR";
  const [filters, setFilters] = useState<HistoryFilters>(DEFAULT_FILTERS);
  const [page, setPage] = useState(0);
  const requests = useQuery({
    queryKey: ["chat-rooms", "connections", user?.id, "inbound"],
    queryFn: () => chatRoomsService.listAllConnections("inbound"), enabled,
    staleTime: 30_000, retry: false,
  });
  const rooms = useQuery({
    queryKey: ["chat-rooms", "list", user?.id],
    queryFn: () => chatRoomsService.listAllRooms(), enabled,
    staleTime: 30_000, retry: false,
  });
  const connections = useMemo(() => mapHistoryConnections(requests.data ?? [], rooms.data ?? []), [requests.data, rooms.data]);
  const filtered = useMemo(() => filterHistory(connections, filters), [connections, filters]);
  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount - 1);
  return {
    authorized: enabled, loading: authLoading || (enabled && (requests.isPending || rooms.isPending)),
    error: requests.error, roomsError: rooms.error,
    refresh: () => Promise.all([requests.refetch(), rooms.refetch()]),
    refreshing: requests.isFetching || rooms.isFetching,
    filters, total: filtered.length, page: currentPage, pageCount,
    connections: filtered.slice(currentPage * PAGE_SIZE, (currentPage + 1) * PAGE_SIZE),
    setPage,
    updateFilters(patch: Partial<HistoryFilters>) { setFilters((current) => ({ ...current, ...patch })); setPage(0); },
    resetFilters() { setFilters(DEFAULT_FILTERS); setPage(0); },
  };
}
