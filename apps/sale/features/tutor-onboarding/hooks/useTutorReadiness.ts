"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { authService } from "@workspace/core/services/auth.service";
import { tutorReadinessQueryKey } from "@workspace/core/services/tutor-readiness.service";
import { getApiErrorMessage } from "@workspace/core/sys-libs/error-handler";
import { useAuthStore } from "@workspace/core/store/useAuthStore";
import { toast } from "@workspace/ui/components/ui/bee-toast/index";
import {
  tutorReadinessApi,
  type ReadinessDetails,
} from "../api/tutor-readiness.api";

export function useTutorReadiness(enabled: boolean) {
  const queryClient = useQueryClient();
  const login = useAuthStore((state) => state.login);
  const userId = useAuthStore((state) => state.user?.id);
  const queryKey = tutorReadinessQueryKey(userId);
  const readiness = useQuery({
    queryKey,
    queryFn: tutorReadinessApi.get,
    enabled: enabled && Boolean(userId),
    retry: false,
  });

  const save = useMutation({
    mutationFn: async (details: ReadinessDetails) => {
      const current = await queryClient.fetchQuery({
        queryKey,
        queryFn: tutorReadinessApi.get,
        staleTime: 0,
      });
      if (!current.bankInformationCompleted && !current.availabilityTimeCompleted) {
        if (!details.bank || !details.availability) {
          throw new Error("Vui lòng nhập cả tài khoản ngân hàng và lịch rảnh.");
        }
        await tutorReadinessApi.create({ bank: details.bank, availability: details.availability });
      } else {
        await tutorReadinessApi.update(details);
      }
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey });
      try {
        const me = await authService.getMe();
        if (me.success && me.data) login(me.data);
      } catch {
        // The readiness request succeeded; auth refresh can be retried on navigation.
      }
      toast.success("Đã lưu thông tin bổ sung", { position: "top-right" });
    },
    onError: (error) => toast.error("Chưa thể lưu thông tin", {
      description: getApiErrorMessage(error),
      position: "top-right",
    }),
  });

  return { readiness, save };
}
