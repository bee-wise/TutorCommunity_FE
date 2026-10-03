"use client";

import { useCallback, useEffect, useRef } from "react";
import { SubscriptionState } from "centrifuge";
import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@workspace/core/store/useAuthStore";
import { useCentrifugoSubscription } from "@workspace/core/hooks/useCentrifugo";
import { toast } from "@workspace/ui/components/ui/bee-toast/useToastStore";
import { mapChatMessage, mapChatRoom } from "../constants/messages.api-mapper";
import { chatRoomsService } from "../services/chat-rooms.service";
import { chatRoomKeys } from "./useMessages";
import type { ChatParticipantRole } from "../types/messages.types";

export function useChatRoom(roomId: string) {
  const user = useAuthStore((state) => state.user);
  const authenticated = useAuthStore((state) => state.isAuthenticated);
  const queryClient = useQueryClient();
  const role = user?.role?.toUpperCase();
  const currentUserRole: ChatParticipantRole = role === "TUTOR" || role === "CONSULTANT" ? role : "LEARNER";
  const currentUserId = user?.id ?? "";
  const roomQuery = useQuery({
    queryKey: [...chatRoomKeys.room(roomId), currentUserId],
    queryFn: () => chatRoomsService.get(roomId),
    enabled: authenticated && !!user && !!roomId,
  });
  const realtime = useCentrifugoSubscription(`chat:room:${roomId}`, {
    enabled: authenticated && !!roomQuery.data,
    chatRoomId: roomId,
    onPublication: () => {
      void queryClient.invalidateQueries({ queryKey: chatRoomKeys.messages(roomId) });
      void queryClient.invalidateQueries({ queryKey: chatRoomKeys.room(roomId) });
      void queryClient.invalidateQueries({ queryKey: chatRoomKeys.list });
    },
  });
  const isRealtimeSubscribed = realtime.state === SubscriptionState.Subscribed;
  useEffect(() => {
    if (!isRealtimeSubscribed) return;
    void queryClient.invalidateQueries({ queryKey: chatRoomKeys.messages(roomId) });
    void queryClient.invalidateQueries({ queryKey: chatRoomKeys.list });
  }, [isRealtimeSubscribed, queryClient, roomId]);
  const messageQuery = useInfiniteQuery({
    queryKey: [...chatRoomKeys.messages(roomId), currentUserId],
    queryFn: ({ pageParam }) => chatRoomsService.messages(roomId, pageParam),
    initialPageParam: "",
    getNextPageParam: (lastPage) => {
      const items = lastPage.items ?? [];
      return items.length === 50 ? items[items.length - 1]?.createdAt : undefined;
    },
    enabled: authenticated && !!user && !!roomQuery.data,
    staleTime: 10_000,
    refetchInterval: isRealtimeSubscribed ? false : 5_000,
  });
  const room = roomQuery.data && user
    ? mapChatRoom(roomQuery.data, currentUserId, currentUserRole, user.fullName || user.displayName || "Bạn")
    : null;
  const messages = room
    ? (messageQuery.data?.pages.flatMap((page) => page.items ?? []).reverse() ?? [])
      .map((message) => mapChatMessage(message, room, currentUserId, currentUserRole))
    : [];

  const sendMutation = useMutation({
    mutationFn: (content: string) => chatRoomsService.send(roomId, content),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: chatRoomKeys.messages(roomId) }),
        queryClient.invalidateQueries({ queryKey: chatRoomKeys.list }),
      ]);
    },
    onError: () => toast.error("Không gửi được tin nhắn. Vui lòng thử lại."),
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const latestId = messages.at(-1)?.id;
  useEffect(() => {
    if (latestId) messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [latestId]);

  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim() || room?.status !== "ACTIVE") return false;
    try {
      await sendMutation.mutateAsync(text.trim());
      return true;
    } catch {
      return false;
    }
  }, [room?.status, sendMutation]);

  return {
    room,
    messages,
    loading: roomQuery.isPending || messageQuery.isPending,
    error: roomQuery.error || messageQuery.error,
    refetch: () => Promise.all([roomQuery.refetch(), messageQuery.refetch()]),
    sending: sendMutation.isPending,
    isReadOnly: room?.status !== "ACTIVE",
    isRealtimeSubscribed,
    realtimeError: realtime.error,
    currentUserId,
    currentUserRole,
    sendMessage,
    messagesEndRef,
    loadOlder: messageQuery.fetchNextPage,
    hasOlder: messageQuery.hasNextPage,
    loadingOlder: messageQuery.isFetchingNextPage,
  };
}
