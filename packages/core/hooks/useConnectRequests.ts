"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { connectRequestsApi } from "../api/connect-requests.api";
import { useAuthStore } from "../store/useAuthStore";
import { queryKeys } from "../sys-libs/queryKeys";

export function useConnectRequestEligibility(enabled: boolean) {
  const user = useAuthStore((state) => state.user);
  return useQuery({
    queryKey: queryKeys.connectRequests.eligibility(user?.id ?? ""),
    queryFn: connectRequestsApi.getEligibility,
    enabled: enabled && !!user?.id && user.role?.toUpperCase() === "LEARNER",
    retry: 1,
    staleTime: 0,
  });
}

export function useCreateConnectRequest() {
  const user = useAuthStore((state) => state.user);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: connectRequestsApi.create,
    onSuccess: () => {
      if (!user?.id) return;
      void Promise.all([
        queryClient.invalidateQueries({ queryKey: queryKeys.connectRequests.eligibility(user.id) }),
        queryClient.invalidateQueries({ queryKey: queryKeys.connectRequests.outbound(user.id) }),
        queryClient.invalidateQueries({ queryKey: queryKeys.saleChatRooms.list }),
      ]);
    },
  });
}
