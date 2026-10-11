"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "@workspace/ui/components/ui/bee-toast/index";
import { authService } from "../services/auth.service";
import { useAuthStore } from "../store/useAuthStore";
import { ApiError, getApiErrorMessage, handleApiError } from "../sys-libs/error-handler";
import { queryKeys } from "../sys-libs/queryKeys";
import type { ApiResponse } from "../types/api-response.type";
import type { ResetPasswordRequest } from "../types/auth.type";
import { useCooldown } from "./useCooldown";

type Feedback = { kind: "error" | "info"; text: string };
type RequestError = { field?: string; general?: string };

function requireSuccess(response: ApiResponse<undefined>, fallback: string): void {
  if (response.success) return;
  throw new ApiError(response.error?.message || response.message || fallback, 400, response.error?.code);
}

export function usePasswordRecoveryFlow() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const clearAuth = useAuthStore((state) => state.logout);
  const [email, setEmail] = useState<string | null>(null);
  const [requestError, setRequestError] = useState<RequestError | null>(null);
  const [resetFeedback, setResetFeedback] = useState<Feedback | null>(null);
  const sendCooldown = useCooldown();
  const verifyCooldown = useCooldown();

  const requestMutation = useMutation({
    mutationKey: queryKeys.passwordRecovery.requestCode,
    mutationFn: async (address: string) => {
      const response = await authService.forgotPassword({ email: address });
      requireSuccess(response, "Không thể gửi mã xác minh. Vui lòng thử lại.");
    },
    retry: false,
  });

  const resetMutation = useMutation({
    mutationKey: queryKeys.passwordRecovery.reset,
    mutationFn: async (request: ResetPasswordRequest) => {
      const response = await authService.resetPassword(request);
      requireSuccess(response, "Không thể đặt lại mật khẩu. Vui lòng thử lại.");
    },
    retry: false,
  });

  const requestCode = async (address: string) => {
    if (requestMutation.isPending || sendCooldown.secondsLeft > 0) return;
    const normalizedEmail = address.trim();
    setRequestError(null);
    try {
      await requestMutation.mutateAsync(normalizedEmail);
      sendCooldown.start(60);
      setEmail(normalizedEmail);
    } catch (cause) {
      const error = handleApiError(cause);
      if (error.statusCode === 403) {
        setRequestError({ field: error.code === "AUTH_CSRF_REJECTED"
          ? "Yêu cầu không hợp lệ. Vui lòng tải lại trang và thử lại."
          : "Tài khoản không tồn tại trong hệ thống" });
        return;
      }
      if (error.statusCode === 429) sendCooldown.start(error.retryAfterSeconds ?? 60);
      setRequestError({ general: getApiErrorMessage(cause, "Không thể gửi mã. Vui lòng thử lại.") });
    }
  };

  const resendCode = async () => {
    if (!email || requestMutation.isPending || sendCooldown.secondsLeft > 0) return;
    setResetFeedback(null);
    try {
      await requestMutation.mutateAsync(email);
      sendCooldown.start(60);
      setResetFeedback({ kind: "info", text: "Nếu email đã đăng ký, mã mới sẽ được gửi. Mã trước đó không còn hiệu lực." });
      return true;
    } catch (cause) {
      const error = handleApiError(cause);
      if (error.statusCode === 429) sendCooldown.start(error.retryAfterSeconds ?? 60);
      setResetFeedback({ kind: "error", text: getApiErrorMessage(cause, "Không thể gửi lại mã.") });
      return false;
    }
  };

  const resetPassword = async (values: Omit<ResetPasswordRequest, "email">) => {
    if (!email || resetMutation.isPending || verifyCooldown.secondsLeft > 0) return;
    setResetFeedback(null);
    try {
      await resetMutation.mutateAsync({ ...values, email, otp: values.otp.trim() });
      queryClient.clear();
      clearAuth();
      toast.success("Đã đặt lại mật khẩu. Vui lòng đăng nhập lại.");
      router.replace(`/login?reset=1&email=${encodeURIComponent(email)}`);
    } catch (cause) {
      const error = handleApiError(cause);
      if (error.statusCode === 429) verifyCooldown.start(error.retryAfterSeconds ?? 60);
      setResetFeedback({ kind: "error", text: getApiErrorMessage(cause, "Không thể đặt lại mật khẩu.") });
    }
  };

  const changeEmail = () => {
    setEmail(null);
    setRequestError(null);
    setResetFeedback(null);
    sendCooldown.clear();
    verifyCooldown.clear();
  };

  return {
    email,
    requestError,
    resetFeedback,
    sendCooldownSeconds: sendCooldown.secondsLeft,
    verifyCooldownSeconds: verifyCooldown.secondsLeft,
    isRequestPending: requestMutation.isPending,
    isResetPending: resetMutation.isPending,
    requestCode,
    resendCode,
    resetPassword,
    changeEmail,
    clearRequestError: () => setRequestError(null),
    clearResetFeedback: () => setResetFeedback(null),
  };
}

export type PasswordRecoveryFlowState = ReturnType<typeof usePasswordRecoveryFlow>;
