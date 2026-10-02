"use client";

import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  connectCentrifugo,
  disconnectCentrifugo,
} from "@workspace/core/configs/centrifugo";
import { useAuthStore } from "@workspace/core/store/useAuthStore";
import { useNotificationDrawerStore } from "@workspace/core/store/useNotificationDrawerStore";
import { useCentrifugoSubscription } from "@workspace/core/hooks/useCentrifugo";
import { notificationKeys } from "@workspace/core/hooks/useNotifications";
import { centrifugoService } from "@workspace/core/services/centrifugo.service";
import { useCentrifugoStore } from "@workspace/core/store/useCentrifugoStore";
import { ApiError } from "@workspace/core/sys-libs/error-handler";
import { queryKeys } from "@workspace/core/sys-libs/queryKeys";

interface RealtimeNotificationPayload {
  type?: string;
  title?: string;
  message?: string;
  unreadCount?: number;
  [key: string]: unknown;
}

export function CentrifugoBootstrap() {
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isAuthLoading = useAuthStore((state) => state.isAuthLoading);
  const setConnectionError = useCentrifugoStore((state) => state.setError);
  const queryClient = useQueryClient();
  const setUnreadCount = useNotificationDrawerStore(
    (state) => state.setUnreadCount,
  );

  useEffect(() => {
    if (typeof window === "undefined" || isAuthLoading) return;

    if (!isAuthenticated || !user?.id) {
      disconnectCentrifugo();
      return;
    }

    let active = true;
    let retryTimer: ReturnType<typeof setTimeout> | undefined;
    const start = async () => {
      try {
        const response = await centrifugoService.getConnectionToken();
        if (!active) return;
        const credentials = response.success ? response.data : undefined;
        if (!credentials?.token) {
          setConnectionError("Không thể lấy token kết nối realtime.");
          return;
        }
        if (credentials.userId && credentials.userId !== user.id) {
          setConnectionError("Token realtime không khớp với tài khoản hiện tại.");
          return;
        }
        connectCentrifugo(credentials.token, credentials.webSocketUrl);
      } catch (error: unknown) {
        if (!active) return;
        setConnectionError(error instanceof Error ? error.message : "Không thể kết nối realtime.");
        if (error instanceof ApiError && (error.statusCode === 0 || error.statusCode >= 500)) {
          retryTimer = setTimeout(() => void start(), 10_000);
        }
      }
    };
    void start();

    return () => {
      active = false;
      if (retryTimer) clearTimeout(retryTimer);
      disconnectCentrifugo();
    };
  }, [isAuthenticated, isAuthLoading, user?.id, setConnectionError]);

  // Lắng nghe realtime notifications cho kênh cá nhân của user: notification:{userId}
  const userChannel = user?.id ? `notification:${user.id}` : null;

  useCentrifugoSubscription<RealtimeNotificationPayload>(userChannel, {
    enabled: Boolean(isAuthenticated && userChannel),
    onPublication: (data) => {
      if (typeof data?.unreadCount === "number") {
        setUnreadCount(data.unreadCount);
      }
      if (user?.id) {
        void queryClient.invalidateQueries({ queryKey: notificationKeys.user(user.id) });
      }
      void queryClient.invalidateQueries({
        queryKey: [queryKeys.authKey.getMe],
      });
    },
  });

  return null;
}
