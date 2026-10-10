"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { useAuthStore } from "@workspace/core/store/useAuthStore";
import { mapChatRoom } from "../constants/messages.api-mapper";
import { chatRoomsService } from "../services/chat-rooms.service";
import { queryKeys } from "@workspace/core/sys-libs/queryKeys";

export const chatRoomKeys = queryKeys.saleChatRooms;

export function useMessages() {
  const user = useAuthStore((state) => state.user);
  const authenticated = useAuthStore((state) => state.isAuthenticated);
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
