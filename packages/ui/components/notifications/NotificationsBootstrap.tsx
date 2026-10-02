"use client";

import { useEffect } from "react";
import { useUnreadNotificationCount } from "@workspace/core/hooks/useNotifications";
import { useAuthStore } from "@workspace/core/store/useAuthStore";
import { useNotificationDrawerStore } from "@workspace/core/store/useNotificationDrawerStore";

export function NotificationsBootstrap() {
  const userId = useAuthStore((state) => state.user?.id);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isAuthLoading = useAuthStore((state) => state.isAuthLoading);
  const setUnreadCount = useNotificationDrawerStore((state) => state.setUnreadCount);
  const count = useUnreadNotificationCount(userId, isAuthenticated && !isAuthLoading);

  useEffect(() => {
    setUnreadCount(isAuthenticated && userId ? (count.data ?? null) : null);
  }, [isAuthenticated, userId, count.data, setUnreadCount]);

  return null;
}
