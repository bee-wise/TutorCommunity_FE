"use client";

import { useAuthStore } from "@workspace/core/store/useAuthStore";
import { ApiError } from "@workspace/core/sys-libs/error-handler";

export function useTutorClassAccess() {
  const user = useAuthStore((state) => state.user);
  const checking = useAuthStore((state) => state.isAuthLoading);
  const allowed = !checking && Boolean(user?.id) && user?.role?.toUpperCase() === "TUTOR";
  const error = checking || allowed ? null : !user
    ? new ApiError("Bạn cần đăng nhập để xem lớp học.", 401)
    : new ApiError("Trang quản lý lớp học chỉ dành cho gia sư.", 403);
  return { actorId: user?.id ?? "", checking, allowed, error };
}
