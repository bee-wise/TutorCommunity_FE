import { useQueries } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { tutorProfileService } from "../../tutor-profile/services/tutor-profile.service";
import { tutorProfileQueryKeys } from "../../tutor-profile/queryKeys";
import type { ApiTutorProfile } from "../../tutor-list/data/types";

export function useFavoriteTutors() {
  const [savedIds, setSavedIds] = useState<string[]>([]);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("savedTutors") || "[]");
      if (Array.isArray(saved)) {
        setSavedIds(saved);
      }
    } catch (e) {
      console.error("Failed to parse savedTutors from localStorage", e);
    }
  }, []);

  const queryResults = useQueries({
    queries: savedIds.map((id) => ({
      queryKey: tutorProfileQueryKeys.detail(id),
      queryFn: () => tutorProfileService.getTutorDetail(id),
      enabled: !!id,
      staleTime: 5 * 60 * 1000,
    })),
  });

  const isLoading = queryResults.some((q) => q.isLoading);
  const isError = queryResults.some((q) => q.isError);

  const favoriteTutors: ApiTutorProfile[] = queryResults
    .map((q) => {
      const data = q.data?.data;
      if (!data) return null;
      return {
        profileId: data.id,
        userId: data.id,
        displayName: data.displayName,
        avatarUrl: data.avatarUrl,
        profileHeadline: data.headline,
        bio: data.shortIntro,
        universityName: data.university,
        major: data.major,
        studentYear: data.studentYear,
        subjects: data.subjects.map((s, idx) => ({ id: `${idx}`, name: s })),
        gradeLevels: [],
        specializations: data.specializations.map((s, idx) => ({
          id: `${idx}`,
          name: s,
        })),
        teachingModes: data.teachingModes,
        offlineCity: data.area,
        offlineDistrict: "",
        offlineWard: "",
        travelRadiusKm: 0,
        hourlyRate: parseInt(data.hourlyRate.replace(/[^0-9]/g, ""), 10) || 0,
        ratingAvg: data.rating,
        isOnline: data.onlineStatus === "Đang hoạt động",
        lastActiveAt: new Date().toISOString(),
      } as ApiTutorProfile;
    })
    .filter((t): t is ApiTutorProfile => t !== null);

  return {
    savedIds,
    favoriteTutors,
    isLoading,
    isError,
  };
}
