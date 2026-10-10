"use client";

import { useChatRooms } from "@workspace/core/hooks/useChatRooms";
import { useChatConnectionStatus } from "@workspace/core/hooks/useChatConnectionStatus";
import { useChatRoomListRealtime } from "@workspace/core/hooks/useChatRoomListRealtime";
import { useChatUnread } from "@workspace/core/hooks/useChatUnread";
import { useAuthStore } from "@workspace/core/store/useAuthStore";
import { queryKeys } from "@workspace/core/sys-libs/queryKeys";

export function useMessages(options?: { live?: boolean }) {
  const userId = useAuthStore((state) => state.user?.id) ?? "";
  const realtimeConnected = useChatConnectionStatus(userId);
  const { rooms: chatRooms, isPending, error, refetch } = useChatRooms({
    refetchIntervalMs: options?.live ? (realtimeConnected ? 30_000 : 15_000) : 30_000,
  });
  useChatRoomListRealtime(
    userId,
    options?.live ? chatRooms.map((room) => room.id) : [],
    queryKeys.chatRooms.listForUser,
  );
  const { unreadCounts, markRead } = useChatUnread(userId, chatRooms);
  const rooms = chatRooms.map((room) => ({
    ...room,
    unreadCount: unreadCounts[room.id] ?? 0,
  }));
  return {
    rooms,
    chats: rooms,
    markRead,
    loading: isPending,
    error,
    refetch,
  };
}

export { useMessages as useTutorMessages };
