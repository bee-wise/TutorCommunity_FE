"use client";

import { useRef } from "react";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { useAuthStore } from "@workspace/core/store/useAuthStore";
import { useCentrifugoSubscription } from "@workspace/core/hooks/useCentrifugo";
import { mapChatRoom } from "../constants/messages.api-mapper";
import { chatRoomsService } from "../services/chat-rooms.service";
import { queryKeys } from "@workspace/core/sys-libs/queryKeys";

export const chatRoomKeys = queryKeys.saleChatRooms;
const roomUpdatedEventSchema = z.object({
  eventId: z.guid(),
  type: z.literal("chat.room.updated"),
  room: z.object({ id: z.guid() }),
});

export function useMessages() {
  const user = useAuthStore((state) => state.user);
  const authenticated = useAuthStore((state) => state.isAuthenticated);
  const queryClient = useQueryClient();
  const seenEventIds = useRef(new Set<string>());
  useCentrifugoSubscription<unknown>(user?.id ? `chat:user:${user.id}` : null, {
    enabled: authenticated && !!user?.id,
    subscriptionScope: "chat-user",
    onSubscribed: () => {
      void queryClient.invalidateQueries({ queryKey: chatRoomKeys.list });
    },
    onPublication: (data) => {
      const event = roomUpdatedEventSchema.safeParse(data);
      if (!event.success || seenEventIds.current.has(event.data.eventId)) return;
      seenEventIds.current.add(event.data.eventId);
      if (seenEventIds.current.size > 100) {
        const oldest = seenEventIds.current.values().next().value;
        if (oldest) seenEventIds.current.delete(oldest);
      }
      void queryClient.invalidateQueries({ queryKey: chatRoomKeys.list });
      void queryClient.invalidateQueries({ queryKey: chatRoomKeys.room(event.data.room.id) });
    },
  });
  const query = useInfiniteQuery({
    queryKey: [...chatRoomKeys.list, user?.id],
    queryFn: ({ pageParam }) => chatRoomsService.list(pageParam),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const page = lastPage.pagination?.page ?? 1;
      const totalPages = lastPage.pagination?.totalPages ?? 1;
      return page < totalPages ? page + 1 : undefined;
    },
    enabled: authenticated && !!user,
    staleTime: 15_000,
    refetchInterval: 30_000,
  });

  const role = user?.role?.toUpperCase();
  const currentRole = role === "TUTOR" || role === "CONSULTANT" ? role : "LEARNER";
  const rooms = query.data?.pages.flatMap((page) => (page?.items ?? []).map((room) =>
    mapChatRoom(room, user?.id ?? "", currentRole, user?.fullName || user?.displayName || "Bạn"),
  )) ?? [];

  return {
    rooms,
    chats: rooms,
    loading: query.isPending,
    error: query.error,
    refetch: query.refetch,
    fetchNextPage: query.fetchNextPage,
    hasNextPage: query.hasNextPage,
    fetchingNextPage: query.isFetchingNextPage,
    totalUnread: user?.unreadChatCount ?? 0,
  };
}

export { useMessages as useTutorMessages };
