"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@workspace/core/store/useAuthStore";
import { ChangePasswordForm } from "./ChangePasswordForm";

export function ChangePasswordScreen() {
  const router = useRouter();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isAuthLoading = useAuthStore((state) => state.isAuthLoading);

  useEffect(() => {
    if (!isAuthLoading && !isAuthenticated) {
      router.replace("/login");
    }
  }, [isAuthLoading, isAuthenticated, router]);

  if (isAuthLoading || !isAuthenticated) {
    return <div className="mx-auto h-80 w-full max-w-[460px] animate-pulse rounded-2xl bg-muted" role="status" aria-label="Đang tải trang đổi mật khẩu" />;
  }

  return <ChangePasswordForm />;
}
