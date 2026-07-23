"use client";

import { useEffect, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { authService } from "../services/auth.service";
import { useAuthStore } from "../store/useAuthStore";
import { handleApiError } from "../sys-libs/error-handler";
import { queryKeys } from "../sys-libs/queryKeys";

export function useAuthBootstrap({ enabled = true }: { enabled?: boolean } = {}) {
  const didRun = useRef(false);
  const queryClient = useQueryClient();
  const login = useAuthStore((s) => s.login);
  const logout = useAuthStore((s) => s.logout);
  const setAuthLoading = useAuthStore((s) => s.setAuthLoading);

  useEffect(() => {
    if (!enabled) return;
    if (didRun.current) return;
    didRun.current = true;

    let cancelled = false;

    const loadCurrentUser = async () => {
      setAuthLoading(true);

      try {
        const meResponse = await authService.getMe();
        if (cancelled) return;

        if (meResponse.success && meResponse.data) {
          login(meResponse.data);
          queryClient.setQueryData([queryKeys.authKey.getMe], meResponse.data);
          return;
        }

        logout();
      } catch (error) {
        const apiError = handleApiError(error);

        if (apiError.statusCode !== 401) {
          if (!cancelled) {
            queryClient.clear();
            logout();
          }
          return;
        }

        try {
          await authService.refresh();
          const retryMeResponse = await authService.getMe();
          if (cancelled) return;

          if (retryMeResponse.success && retryMeResponse.data) {
            login(retryMeResponse.data);
            queryClient.setQueryData(
              [queryKeys.authKey.getMe],
              retryMeResponse.data,
            );
            return;
          }

          queryClient.clear();
          logout();
        } catch {
          if (!cancelled) {
            queryClient.clear();
            logout();
          }
        }
      }
    };

    void loadCurrentUser();

    return () => {
      cancelled = true;
    };
  }, [enabled, login, logout, queryClient, setAuthLoading]);
}
