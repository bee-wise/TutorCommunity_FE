"use client";

import { useEffect } from "react";
import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useAuthStore } from "@workspace/core/store/useAuthStore";
import { useChatRoomListRealtime } from "@workspace/core/hooks/useChatRoomListRealtime";
import { chatRoomsService } from "@workspace/core/services/chat-rooms.service";
import { toChatHistoryBusinessMessage } from "@workspace/core/services/chat-business-message";
import { queryKeys } from "@workspace/core/sys-libs/queryKeys";
import { subscribeToChatRoom } from "@workspace/core/sys-libs/centrifugo";
import { toWorkspaceRoom, type WorkspaceMessage } from "../types/workspace";

const MESSAGE_PAGE_SIZE = 50;

export function useConsultantRooms() {
  const userId = useAuthStore((state) => state.user?.id);
  const authLoading = useAuthStore((state) => state.isAuthLoading);
  const query = useQuery({
    queryKey: queryKeys.consultantWorkspace.rooms(userId ?? ""),
    enabled: Boolean(userId),
    queryFn: async () => (await chatRoomsService.listAllRooms())
      .map((room) => toWorkspaceRoom(room, userId ?? "")),
    staleTime: 15_000,
    refetchInterval: 30_000,
  });
  useChatRoomListRealtime(
    userId,
    (query.data ?? []).map((room) => room.id),
    queryKeys.consultantWorkspace.rooms,
  );

  return {
    ...query,
    rooms: query.data ?? [],
    isLoading: authLoading || query.isLoading,
  };
}

export function useConsultantConversation(roomId: string | null) {
  const queryClient = useQueryClient();
  const userId = useAuthStore((state) => state.user?.id);
  useEffect(() => {
    if (!userId || !roomId) return;
    return subscribeToChatRoom(userId, roomId, () => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.consultantWorkspace.messages(roomId),
      });
    });
  }, [userId, roomId, queryClient]);
  const history = useInfiniteQuery({
    queryKey: queryKeys.consultantWorkspace.messages(roomId),
    enabled: Boolean(roomId),
    initialPageParam: 1,
    queryFn: ({ pageParam }) =>
      chatRoomsService.listMessages(roomId!, pageParam, MESSAGE_PAGE_SIZE),
    getNextPageParam: (page) => page.pagination && page.pagination.page < page.pagination.totalPages
      ? page.pagination.page + 1
      : undefined,
    refetchInterval: 10_000,
  });
  const send = useMutation({
    mutationFn: (content: string) =>
      chatRoomsService.sendMessage(roomId!, content.trim()),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: queryKeys.consultantWorkspace.messages(roomId),
        }),
        queryClient.invalidateQueries({
          queryKey: queryKeys.consultantWorkspace.rooms(userId ?? ""),
        }),
      ]);
    },
  });
  const close = useMutation({
    mutationFn: ({ reason, note }: { reason: string; note?: string }) =>
      chatRoomsService.closeRoom(roomId!, reason, note),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: queryKeys.consultantWorkspace.rooms(userId ?? ""),
      });
    },
  });
  const messages: WorkspaceMessage[] = [
    ...new Map(
      (history.data?.pages.flatMap((page) => page?.items ?? []) ?? []).map(
        (item) => [
          item.id,
          {
            id: item.id,
            senderId: item.senderId ?? "",
            content: item.content ?? "",
            createdAt: item.createdAt ?? new Date().toISOString(),
            isSystem: item.type === "SYSTEM" || (!item.type && item.messageType?.toUpperCase() === "SYSTEM" && !item.businessType),
            business: toChatHistoryBusinessMessage(item),
          },
        ],
      ),
    ).values(),
  ].sort((a, b) => (a.createdAt ?? "").localeCompare(b.createdAt ?? ""));

  return {
    messages,
    history,
    sendMessage: send.mutateAsync,
    sending: send.isPending,
    closeRoom: close.mutateAsync,
    closing: close.isPending,
  };
}
