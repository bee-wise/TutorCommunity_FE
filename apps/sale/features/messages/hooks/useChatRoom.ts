"use client";

import { useCallback, useEffect, useRef } from "react";
import { SubscriptionState } from "centrifuge";
import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useAuthStore } from "@workspace/core/store/useAuthStore";
import { useCentrifugoSubscription } from "@workspace/core/hooks/useCentrifugo";
import { toast } from "@workspace/ui/components/ui/bee-toast/useToastStore";
import { isDraftWidgetMessage } from "@workspace/core/services/chat-business-message";
import { mapChatMessage, mapChatRoom } from "../constants/messages.api-mapper";
import { chatRoomsService } from "../services/chat-rooms.service";
import { chatRoomKeys } from "./useMessages";
import type { ChatParticipantRole } from "../types/messages.types";

export function useChatRoom(roomId: string) {
  const user = useAuthStore((state) => state.user);
  const authenticated = useAuthStore((state) => state.isAuthenticated);
  const queryClient = useQueryClient();
  const role = user?.role?.toUpperCase();
  const currentUserRole: ChatParticipantRole =
    role === "TUTOR" || role === "CONSULTANT" ? role : "LEARNER";
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
      void queryClient.invalidateQueries({
        queryKey: chatRoomKeys.messages(roomId),
      });
      void queryClient.invalidateQueries({
        queryKey: chatRoomKeys.room(roomId),
      });
      void queryClient.invalidateQueries({ queryKey: chatRoomKeys.list });
    },
  });
  const isRealtimeSubscribed = realtime.state === SubscriptionState.Subscribed;
  useEffect(() => {
    if (!isRealtimeSubscribed) return;
    void queryClient.invalidateQueries({
      queryKey: chatRoomKeys.messages(roomId),
    });
    void queryClient.invalidateQueries({ queryKey: chatRoomKeys.list });
  }, [isRealtimeSubscribed, queryClient, roomId]);
  const messageQuery = useInfiniteQuery({
    queryKey: [...chatRoomKeys.messages(roomId), currentUserId],
    queryFn: ({ pageParam }) => chatRoomsService.messages(roomId, pageParam),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const page = lastPage.pagination?.page ?? 1;
      const totalPages = lastPage.pagination?.totalPages ?? 1;
      return page < totalPages ? page + 1 : undefined;
    },
    enabled: authenticated && !!user && !!roomQuery.data,
    staleTime: 10_000,
    refetchInterval: isRealtimeSubscribed ? false : 5_000,
  });
  const room =
    roomQuery.data && user
      ? mapChatRoom(
          roomQuery.data,
          currentUserId,
          currentUserRole,
          user.fullName || user.displayName || "Bạn",
        )
      : null;
  const messages = room
    ? [
        ...new Map(
          (
            messageQuery.data?.pages.flatMap((page) => page?.items ?? []) ?? []
          ).map(
            (message) =>
              [
                message.id,
                mapChatMessage(message, room, currentUserId, currentUserRole),
              ] as const,
          ),
        ).values(),
      ]
        .filter((message) => {
          if (currentUserRole === "CONSULTANT") return true;
          return !message.isDraft && !isDraftWidgetMessage(message);
        })
        .sort((a, b) => a.createdAt.localeCompare(b.createdAt))
    : [];

  const sendMutation = useMutation({
    mutationFn: (content: string) => chatRoomsService.send(roomId, content),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: chatRoomKeys.messages(roomId),
        }),
        queryClient.invalidateQueries({ queryKey: chatRoomKeys.list }),
      ]);
    },
    onError: () => toast.error("Không gửi được tin nhắn. Vui lòng thử lại."),
  });

  const initialScrollDoneRef = useRef<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const latestId = messages.at(-1)?.id;

  const scrollToBottom = useCallback((behavior: ScrollBehavior = "smooth") => {
    const el = messagesEndRef.current;
    if (!el) return;
    const container = el.closest(".overflow-y-auto") as HTMLElement | null;
    if (container && behavior === "auto") {
      container.scrollTop = container.scrollHeight;
    }
    el.scrollIntoView({ behavior });
  }, []);

  useEffect(() => {
    if (!latestId) return;
    const isInitialForRoom = initialScrollDoneRef.current !== roomId;
    if (isInitialForRoom) {
      initialScrollDoneRef.current = roomId;
      scrollToBottom("auto");
      requestAnimationFrame(() => {
        scrollToBottom("auto");
      });
    } else {
      scrollToBottom("smooth");
    }
  }, [latestId, roomId, scrollToBottom]);

  const sendMessage = useCallback(
    async (text: string) => {
      if (!text.trim() || room?.status !== "ACTIVE") return false;
      try {
        await sendMutation.mutateAsync(text.trim());
        return true;
      } catch {
        return false;
      }
    },
    [room?.status, sendMutation],
  );

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
    scrollToBottom,
    loadOlder: messageQuery.fetchNextPage,
    hasOlder: messageQuery.hasNextPage,
    loadingOlder: messageQuery.isFetchingNextPage,
  };
}
