"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "@workspace/ui/components/ui/bee-toast/index";
import { authService } from "@workspace/core/services/auth.service";
import type {
  ChangePasswordRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
} from "@workspace/core/types/auth.type";
import type { ApiResponse } from "@workspace/core/types/api-response.type";
import { ApiError } from "@workspace/core/sys-libs/error-handler";
import { useAuthStore } from "@workspace/core/store/useAuthStore";

function ensureSuccess(response: ApiResponse<undefined>, fallback: string) {
  if (response.success) return;
  throw new ApiError(
    response.error?.message || response.message || fallback,
    400,
    response.error?.code,
  );
}

export function useForgotPassword() {
  return useMutation({
    mutationKey: ["forgot-password"],
    mutationFn: async (request: ForgotPasswordRequest) => {
      const response = await authService.forgotPassword({ email: request.email.trim() });
      ensureSuccess(response, "Không thể gửi mã xác minh. Vui lòng thử lại.");
      return response;
    },
  });
}

export function useResetPassword() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const clearAuth = useAuthStore((state) => state.logout);

  return useMutation({
    mutationKey: ["reset-password"],
    mutationFn: async (request: ResetPasswordRequest) => {
      const response = await authService.resetPassword({
        ...request,
        email: request.email.trim(),
        otp: request.otp.trim(),
      });
      ensureSuccess(response, "Không thể đặt lại mật khẩu. Vui lòng thử lại.");
    },
    onSuccess: (_result, request) => {
      queryClient.clear();
      clearAuth();
      toast.success("Đã đặt lại mật khẩu. Vui lòng đăng nhập lại.");
      router.replace(`/login?email=${encodeURIComponent(request.email.trim())}`);
    },
  });
}

export function useChangePassword() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const clearAuth = useAuthStore((state) => state.logout);

  return useMutation({
    mutationKey: ["change-password"],
    mutationFn: async (request: ChangePasswordRequest) => {
      const response = await authService.changePassword(request);
      ensureSuccess(response, "Không thể đổi mật khẩu. Vui lòng thử lại.");
    },
    onSuccess: () => {
      queryClient.clear();
      clearAuth();
      toast.success("Đã đổi mật khẩu. Vui lòng đăng nhập lại.");
      router.replace("/login");
    },
  });
}
