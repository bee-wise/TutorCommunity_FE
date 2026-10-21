"use client";

import { useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { useCentrifugoSubscription } from "@workspace/core/hooks/useCentrifugo";
import { useChatRooms } from "@workspace/core/hooks/useChatRooms";
import { useChatConnectionStatus } from "@workspace/core/hooks/useChatConnectionStatus";
import { useChatRoomListRealtime } from "@workspace/core/hooks/useChatRoomListRealtime";
import { useAuthStore } from "@workspace/core/store/useAuthStore";
import { queryKeys } from "@workspace/core/sys-libs/queryKeys";

const roomUpdatedEventSchema = z.object({
  eventId: z.string().min(1),
  type: z.literal("chat.room.updated"),
  room: z.object({ id: z.string().min(1) }),
});

export function useMessages(options?: { live?: boolean }) {
  const userId = useAuthStore((state) => state.user?.id) ?? "";
  const queryClient = useQueryClient();
  const seenEventIds = useRef(new Set<string>());
  const realtimeConnected = useChatConnectionStatus(userId);
  const { rooms: chatRooms, isPending, error, refetch } = useChatRooms({
    refetchIntervalMs: options?.live ? (realtimeConnected ? 30_000 : 15_000) : 30_000,
  });
  useChatRoomListRealtime(
    userId,
    options?.live ? chatRooms.map((room) => room.id) : [],
    queryKeys.chatRooms.listForUser,
  );
  useCentrifugoSubscription<unknown>(userId ? `chat:user:${userId}` : null, {
    enabled: Boolean(userId),
    subscriptionScope: "chat-user",
    onSubscribed: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.chatRooms.list });
    },
    onPublication: (data) => {
      const event = roomUpdatedEventSchema.safeParse(data);
      if (!event.success || seenEventIds.current.has(event.data.eventId)) return;
      seenEventIds.current.add(event.data.eventId);
      if (seenEventIds.current.size > 100) {
        const oldest = seenEventIds.current.values().next().value;
        if (oldest) seenEventIds.current.delete(oldest);
      }
      void queryClient.invalidateQueries({ queryKey: queryKeys.chatRooms.list });
      void queryClient.invalidateQueries({ queryKey: [queryKeys.authKey.getMe] });
    },
  });
  const rooms = chatRooms;
  return {
    rooms,
    chats: rooms,
    loading: isPending,
    error,
    refetch,
  };
}

export { useMessages as useTutorMessages };
