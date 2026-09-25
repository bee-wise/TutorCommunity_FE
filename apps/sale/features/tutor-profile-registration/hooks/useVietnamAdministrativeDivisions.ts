"use client";

import { useQuery } from "@tanstack/react-query";
import { vietnamAdministrativeService } from "../services/vietnam-administrative.service";

const ONE_DAY = 24 * 60 * 60 * 1000;

export function useVietnamProvinces() {
  return useQuery({
    queryKey: ["vietnam-administrative", "v2", "provinces"],
    queryFn: ({ signal }) =>
      vietnamAdministrativeService.listProvinces(signal),
    staleTime: ONE_DAY,
    retry: 1,
  });
}

export function useVietnamProvince(provinceCode?: number) {
  return useQuery({
    queryKey: ["vietnam-administrative", "v2", "province", provinceCode],
    queryFn: ({ signal }) =>
      vietnamAdministrativeService.getProvince(provinceCode ?? 0, signal),
    enabled: provinceCode !== undefined,
    staleTime: ONE_DAY,
    retry: 1,
  });
}
