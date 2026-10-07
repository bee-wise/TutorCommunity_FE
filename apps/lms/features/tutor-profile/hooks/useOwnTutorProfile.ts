"use client";

import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@workspace/core/store/useAuthStore";
import { getOwnTutorProfile } from "../services/profile.service";

export function useOwnTutorProfile() {
  const user = useAuthStore((state) => state.user);
  const authLoading = useAuthStore((state) => state.isAuthLoading);
  const authorized = user?.role?.toUpperCase() === "TUTOR";
  const id = user?.tutorProfileId;
  const query = useQuery({
    queryKey: ["tutor-profile", "own", user?.id, id],
    queryFn: ({ signal }) => {
      if (!id) throw new Error("Tài khoản chưa có mã hồ sơ gia sư.");
      return getOwnTutorProfile(id, signal);
    },
    enabled: authorized && !!id, staleTime: 60_000, retry: false,
  });
  return { ...query, user, authorized, loading: authLoading || (authorized && !!id && query.isPending) };
}
