import { useQuery } from "@tanstack/react-query";
import { tutorProfileService } from "../services/tutor-profile.service";
import { tutorProfileQueryKeys } from "../queryKeys";

export function useTutorViewsQuery(
  tutorProfileId: string,
  options?: { enabled?: boolean },
) {
  return useQuery({
    queryKey: tutorProfileQueryKeys.views(tutorProfileId),
    queryFn: ({ signal }) =>
      tutorProfileService.getTutorViews(tutorProfileId, signal),
    enabled: Boolean(tutorProfileId) && (options?.enabled ?? true),
    staleTime: 60_000,
  });
}
