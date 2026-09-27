"use client";

import { useQuery } from "@tanstack/react-query";
import { getAdminDashboard } from "../api/dashboard.api";
import type { DashboardRange } from "../data/dashboardRange";

export function useAdminDashboard(range: DashboardRange | null) {
  return useQuery({
    queryKey: ["admin", "dashboard", range?.from.toISOString(), range?.to.toISOString()],
    queryFn: () => {
      if (!range) throw new Error("Khoảng thời gian không hợp lệ.");
      return getAdminDashboard(range);
    },
    enabled: range !== null,
    staleTime: 60_000,
    refetchInterval: 5 * 60_000,
  });
}
