"use client";

import { useCallback, useEffect, useRef } from "react";
import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "../store/useAuthStore";
import { chatRoomsService } from "../services/chat-rooms.service";
import { toChatMessage, type ParticipantRole } from "../services/chat-rooms.mapper";
import { useChatRooms } from "./useChatRooms";
import { useChatRoomRealtime } from "./useChatRoomRealtime";
import { queryKeys } from "../sys-libs/queryKeys";

const PAGE_SIZE = 50;

export function useChatRoom(roomId: string) {
  const user = useAuthStore((state) => state.user);
  const currentUserRole: ParticipantRole = user?.role?.toUpperCase() === "TUTOR" ? "TUTOR" :
    user?.role?.toUpperCase() === "CONSULTANT" ? "CONSULTANT" : "LEARNER";
  const { rooms, isPending: roomsPending, error: roomsError } = useChatRooms();
  const room = rooms.find((item) => item.id === roomId) ?? null;
  useChatRoomRealtime(room?.id ?? null);
  const queryClient = useQueryClient();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const history = useInfiniteQuery({
    queryKey: queryKeys.chatRooms.messages(roomId),
    enabled: Boolean(room),
    initialPageParam: 1,
    queryFn: ({ pageParam }) => chatRoomsService.listMessages(roomId, pageParam, PAGE_SIZE),
    getNextPageParam: (lastPage) => {
      const page = lastPage.pagination?.page ?? 1;
      const totalPages = lastPage.pagination?.totalPages ?? 1;
      return page < totalPages ? page + 1 : undefined;
    },
    refetchInterval: 10_000,
  });

  const send = useMutation({
    mutationFn: (content: string) => chatRoomsService.sendMessage(roomId, content.trim()),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.chatRooms.messages(roomId) });
      await queryClient.invalidateQueries({ queryKey: queryKeys.chatRooms.list });
    },
  });

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);
  const messages = room
    ? [...new Map(
        (history.data?.pages.flatMap((page) => page?.items ?? []) ?? [])
          .map((message) => [message.id, toChatMessage(message, room)]),
      ).values()].sort((a, b) => a.createdAt.localeCompare(b.createdAt))
    : [];

  const latestMessageId = messages.at(-1)?.id;
  useEffect(() => {
    if (latestMessageId) scrollToBottom();
  }, [latestMessageId, scrollToBottom]);

  return {
    room,
    messages,
    currentUserId: user?.id ?? "",
    currentUserRole,
    isPending: roomsPending || history.isPending,
    loading: roomsPending || history.isPending,
    error: roomsError || history.error,
    sendMessage: send.mutateAsync,
    isSending: send.isPending,
    sending: send.isPending,
    isReadOnly: Boolean(room?.status && room.status !== "ACTIVE"),
    hasOlderMessages: Boolean(history.hasNextPage),
    hasOlder: Boolean(history.hasNextPage),
    loadingOlderMessages: history.isFetchingNextPage,
    loadingOlder: history.isFetchingNextPage,
    loadOlderMessages: history.fetchNextPage,
    loadOlder: history.fetchNextPage,
    messagesEndRef,
    scrollToBottom,
    refetch: () => history.refetch(),
  };
}
