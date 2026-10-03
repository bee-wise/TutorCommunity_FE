"use client";

import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { notificationsService } from "../services/notifications.service";

const PAGE_SIZE = 20;

export const notificationKeys = {
  all: ["notifications"] as const,
  user: (userId: string) => ["notifications", userId] as const,
  list: (userId: string, unreadOnly: boolean) =>
    ["notifications", userId, "list", unreadOnly] as const,
  unreadCount: (userId: string) => ["notifications", userId, "unread-count"] as const,
};

export function useNotificationList(userId: string | undefined, unreadOnly: boolean, enabled: boolean) {
  return useInfiniteQuery({
    queryKey: notificationKeys.list(userId ?? "", unreadOnly),
    enabled: enabled && Boolean(userId),
    staleTime: 0,
    initialPageParam: 1,
    queryFn: ({ pageParam }) => notificationsService.list({ unreadOnly, page: pageParam, pageSize: PAGE_SIZE }),
    getNextPageParam: (lastPage) =>
      lastPage.pagination.page < lastPage.pagination.totalPages
        ? lastPage.pagination.page + 1
        : undefined,
  });
}

export function useUnreadNotificationCount(userId: string | undefined, enabled: boolean) {
  return useQuery({
    queryKey: notificationKeys.unreadCount(userId ?? ""),
    enabled: enabled && Boolean(userId),
    queryFn: async () => {
      const page = await notificationsService.list({ unreadOnly: true, page: 1, pageSize: 1 });
      return page.pagination.totalItems;
    },
    refetchInterval: 60_000,
  });
}

function useInvalidateNotifications(userId: string) {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: notificationKeys.user(userId) });
}

export function useMarkNotificationRead(userId: string) {
  const invalidate = useInvalidateNotifications(userId);
  return useMutation({
    mutationFn: notificationsService.markRead,
    onSettled: invalidate,
  });
}

export function useMarkAllNotificationsRead(userId: string) {
  const invalidate = useInvalidateNotifications(userId);
  return useMutation({
    mutationFn: async () => {
      const firstPage = await notificationsService.list({ unreadOnly: true, page: 1, pageSize: 100 });
      const ids = new Set((firstPage.items ?? []).map((item) => item.id));
      for (let page = 2; page <= firstPage.pagination.totalPages; page += 1) {
        const nextPage = await notificationsService.list({ unreadOnly: true, page, pageSize: 100 });
        for (const item of nextPage.items ?? []) ids.add(item.id);
      }
      const notificationIds = [...ids];

      for (let index = 0; index < notificationIds.length; index += 10) {
        const results = await Promise.allSettled(
          notificationIds.slice(index, index + 10).map((id) => notificationsService.markRead(id)),
        );
        const failure = results.find((result) => result.status === "rejected");
        if (failure?.status === "rejected") throw failure.reason;
      }
    },
    onSettled: invalidate,
  });
}
