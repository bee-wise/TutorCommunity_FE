"use client";

import { useEffect, useRef } from "react";
import { z } from "zod";
import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useAuthStore } from "@workspace/core/store/useAuthStore";
import { useCentrifugoSubscription } from "@workspace/core/hooks/useCentrifugo";
import { useChatRoomListRealtime } from "@workspace/core/hooks/useChatRoomListRealtime";
import { useChatConnectionStatus } from "@workspace/core/hooks/useChatConnectionStatus";
import { chatRoomsService } from "@workspace/core/services/chat-rooms.service";
import { toChatHistoryBusinessMessage } from "@workspace/core/services/chat-business-message";
import { queryKeys } from "@workspace/core/sys-libs/queryKeys";
import { subscribeToChatRoom } from "@workspace/core/sys-libs/centrifugo";
import { toWorkspaceRoom, type WorkspaceMessage, type WorkspaceRoom } from "../types/workspace";

const MESSAGE_PAGE_SIZE = 50;
const roomUpdatedEventSchema = z.object({
  eventId: z.string().min(1),
  type: z.literal("chat.room.updated"),
  room: z.object({ id: z.string().min(1) }),
});

export function useConsultantRooms() {
  const userId = useAuthStore((state) => state.user?.id);
  const authLoading = useAuthStore((state) => state.isAuthLoading);
  const queryClient = useQueryClient();
  const seenEventIds = useRef(new Set<string>());
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
  useCentrifugoSubscription<unknown>(userId ? `chat:user:${userId}` : null, {
    enabled: Boolean(userId),
    subscriptionScope: "chat-user",
    onSubscribed: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.consultantWorkspace.rooms(userId ?? "") });
    },
    onPublication: (data) => {
      const event = roomUpdatedEventSchema.safeParse(data);
      if (!event.success || seenEventIds.current.has(event.data.eventId)) return;
      seenEventIds.current.add(event.data.eventId);
      if (seenEventIds.current.size > 100) {
        const oldest = seenEventIds.current.values().next().value;
        if (oldest) seenEventIds.current.delete(oldest);
      }
      void queryClient.invalidateQueries({ queryKey: queryKeys.consultantWorkspace.rooms(userId ?? "") });
    },
  });

  return {
    ...query,
    rooms: query.data ?? [],
    isLoading: authLoading || query.isLoading,
  };
}

export function useConsultantConversation(roomId: string | null) {
  const queryClient = useQueryClient();
  const userId = useAuthStore((state) => state.user?.id);
  const realtimeConnected = useChatConnectionStatus(userId);
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
    refetchInterval: realtimeConnected ? false : 10_000,
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
  const markRead = useMutation({
    mutationFn: (messageId: string) => chatRoomsService.markRead(roomId!, messageId),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.consultantWorkspace.rooms(userId ?? ""),
      });
    },
  });
  const close = useMutation({
    mutationFn: ({ reason, note }: { reason: string; note?: string }) =>
      chatRoomsService.closeRoom(roomId!, reason, note),
    onSuccess: (closedRoom) => {
      const roomsKey = queryKeys.consultantWorkspace.rooms(userId ?? "");
      queryClient.setQueryData<WorkspaceRoom[]>(roomsKey, (rooms) => rooms?.map((room) =>
        room.id === closedRoom.id
          ? {
              ...room,
              status: "CLOSED",
              closedAt: closedRoom.closedAt ?? room.closedAt,
              closeReason: closedRoom.closeReason ?? room.closeReason,
              closeNote: closedRoom.closeNote ?? room.closeNote,
            }
          : room,
      ));
      void queryClient.invalidateQueries({ queryKey: roomsKey });
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
    markRead: markRead.mutate,
    closeRoom: close.mutateAsync,
    closing: close.isPending,
  };
}
