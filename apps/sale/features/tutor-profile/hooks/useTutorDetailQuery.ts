import { useQuery } from "@tanstack/react-query";
import { tutorProfileService } from "../services/tutor-profile.service";
import { tutorProfileQueryKeys } from "../queryKeys";

export function useTutorDetailQuery(
  tutorProfileId: string,
  options?: { enabled?: boolean },
) {
  return useQuery({
    queryKey: tutorProfileQueryKeys.detail(tutorProfileId),
    queryFn: () => tutorProfileService.getTutorDetail(tutorProfileId),
    enabled: !!tutorProfileId && (options?.enabled ?? true),
  });
}
