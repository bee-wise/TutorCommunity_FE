"use client";

import { useCallback, useEffect, useRef } from "react";
import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "../store/useAuthStore";
import { chatRoomsService } from "../services/chat-rooms.service";
import { toChatMessage, type ParticipantRole } from "../services/chat-rooms.mapper";
import { useChatRooms } from "./useChatRooms";
import { useChatRoomRealtime } from "./useChatRoomRealtime";

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
    queryKey: ["chat-rooms", roomId, "messages"],
    enabled: Boolean(room),
    initialPageParam: undefined as string | undefined,
    queryFn: ({ pageParam }) => chatRoomsService.listMessages(roomId, pageParam, PAGE_SIZE),
    getNextPageParam: (lastPage) => {
      const items = lastPage.items ?? [];
      return items.length === PAGE_SIZE ? items[items.length - 1]?.createdAt : undefined;
    },
    refetchInterval: 10_000,
  });

  const send = useMutation({
    mutationFn: (content: string) => chatRoomsService.sendMessage(roomId, content.trim()),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["chat-rooms", roomId, "messages"] });
      await queryClient.invalidateQueries({ queryKey: ["chat-rooms", "list"] });
    },
  });

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);
  const messages = room
    ? [...new Map(
        (history.data?.pages.flatMap((page) => page.items ?? []) ?? [])
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
    sending: send.isPending,
    isReadOnly: room?.status !== "ACTIVE",
    currentUserId: user?.id ?? "",
    currentUserRole,
    sendMessage: send.mutateAsync,
    messagesEndRef,
    error: roomsError ?? history.error ?? send.error,
    loading: roomsPending || Boolean(room && history.isPending),
    hasOlderMessages: history.hasNextPage,
    loadingOlderMessages: history.isFetchingNextPage,
    loadOlderMessages: history.fetchNextPage,
  };
}
