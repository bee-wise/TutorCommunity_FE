import { useQuery } from "@tanstack/react-query";
import { AISearchQuery } from "../data/types";
import { tutorListService } from "../services/tutor-list.service";

export const useGetTutorByAI = (
  params: AISearchQuery,
  enabled: boolean = true,
) => {
  return useQuery({
    queryKey: ["search-tutor-ai", params],
    queryFn: async () => {
      try {
        const res = await tutorListService.searchAI(params);
        return res.data?.items || [];
      } catch (error) {
        throw error;
      }
    },
    enabled,
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000,
  });
};
