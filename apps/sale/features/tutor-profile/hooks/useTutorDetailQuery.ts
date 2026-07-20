import { useQuery } from "@tanstack/react-query";
import { tutorProfileService } from "../services/tutor-profile.service";
import { tutorProfileQueryKeys } from "../queryKeys";

export function useTutorDetailQuery(tutorProfileId: string) {
  return useQuery({
    queryKey: tutorProfileQueryKeys.detail(tutorProfileId),
    queryFn: () => tutorProfileService.getTutorDetail(tutorProfileId),
    enabled: !!tutorProfileId,
  });
}
