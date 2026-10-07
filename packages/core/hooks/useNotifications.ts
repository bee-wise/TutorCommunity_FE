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
    mutationFn: notificationsService.markAllRead,
    onSettled: invalidate,
  });
}

export function useDeleteNotification(userId: string) {
  const invalidate = useInvalidateNotifications(userId);
  return useMutation({
    mutationFn: notificationsService.deleteOne,
    onSettled: invalidate,
  });
}

export function useDeleteNotificationsBatch(userId: string) {
  const invalidate = useInvalidateNotifications(userId);
  return useMutation({
    mutationFn: async (ids: string[]) => {
      let affectedCount = 0;
      for (let index = 0; index < ids.length; index += 100) {
        affectedCount += await notificationsService.deleteBatch(ids.slice(index, index + 100));
      }
      return affectedCount;
    },
    onSettled: invalidate,
  });
}

export function useDeleteAllNotifications(userId: string) {
  const invalidate = useInvalidateNotifications(userId);
  return useMutation({
    mutationFn: notificationsService.deleteAll,
    onSettled: invalidate,
  });
}
