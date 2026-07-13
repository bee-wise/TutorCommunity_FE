import { useQuery } from "@tanstack/react-query";
import { tutorListService } from "../services/tutor-list.service";
import type { ManualSearchQuery } from "../data/types";

export function useGetTutorsManual(params: ManualSearchQuery, enabled: boolean = true) {
  return useQuery({
    queryKey: ["tutors-manual", params],
    queryFn: () => tutorListService.searchManual(params),
    enabled,
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false,
  });
}
