"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { authService } from "@workspace/core/services/auth.service";
import { useAuthStore } from "@workspace/core/store/useAuthStore";
import { getApiErrorMessage } from "@workspace/core/sys-libs/error-handler";
import { toast } from "@workspace/ui/components/ui/bee-toast/index";
import { resolveLiveTutorOnboardingScenario } from "../schemas/live-tutor-onboarding";

export function useRefreshTutorProfileStatus() {
  const router = useRouter();
  const login = useAuthStore((state) => state.login);
  return useMutation({
    mutationFn: async () => {
      const response = await authService.getMe();
      if (!response.success || !response.data) {
        throw new Error(response.message || "Không lấy được trạng thái hồ sơ.");
      }
      return response.data;
    },
    onSuccess: (user) => {
      login(user);
      if (resolveLiveTutorOnboardingScenario(user) === "rejected") {
        toast.error("Hồ sơ cần chỉnh sửa", {
          description: "Xem phản hồi của BeeWise để cập nhật và gửi lại.",
          position: "top-right",
        });
        router.push("/tutor/onboarding/profile-register");
      } else if (user.tutorProfileStatus?.trim().toUpperCase() === "PENDING_REVIEW") {
        toast.success("Hồ sơ vẫn đang được xét duyệt", { position: "top-right" });
      }
    },
    onError: (error) => toast.error("Chưa thể cập nhật trạng thái", {
      description: getApiErrorMessage(error),
      position: "top-right",
    }),
  });
}
