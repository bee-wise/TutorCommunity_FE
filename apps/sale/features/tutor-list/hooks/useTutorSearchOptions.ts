import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@workspace/core/configs/client";
import type { ApiResponse } from "@workspace/core/types/api-response.type";
import { vietnamAdministrativeService } from "../../tutor-profile-registration/services/vietnam-administrative.service";

type CatalogOption = {
  id: string;
  name: string;
  isApproved?: boolean;
  sortOrder?: number | null;
};

async function listCatalog(resource: "subjects" | "grade_levels") {
  const response = await apiClient.get<never, ApiResponse<CatalogOption[]>>(
    `/${resource}`,
    { params: { limit: 100 } },
  );

  return (response.data ?? [])
    .filter((item) => item.isApproved !== false)
    .sort((a, b) =>
      (a.sortOrder ?? Number.MAX_SAFE_INTEGER) -
        (b.sortOrder ?? Number.MAX_SAFE_INTEGER) ||
      a.name.localeCompare(b.name, "vi"),
    );
}

export function useTutorSearchOptions(enabled: boolean) {
  const subjects = useQuery({
    queryKey: ["tutor-search-options", "subjects"],
    queryFn: () => listCatalog("subjects"),
    enabled,
    staleTime: 24 * 60 * 60 * 1000,
  });

  const gradeLevels = useQuery({
    queryKey: ["tutor-search-options", "grade-levels"],
    queryFn: () => listCatalog("grade_levels"),
    enabled,
    staleTime: 24 * 60 * 60 * 1000,
  });

  const provinces = useQuery({
    queryKey: ["vietnam-administrative", "v2", "provinces"],
    queryFn: ({ signal }) => vietnamAdministrativeService.listProvinces(signal),
    enabled,
    staleTime: 24 * 60 * 60 * 1000,
  });

  return { subjects, gradeLevels, provinces };
}
