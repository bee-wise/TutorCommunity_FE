"use client";

import { useEffect } from "react";
import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useAuthStore } from "@workspace/core/store/useAuthStore";
import { chatRoomsService } from "@workspace/core/services/chat-rooms.service";
import { toChatBusinessMessage } from "@workspace/core/services/chat-business-message";
import { subscribeToChatRoom } from "@workspace/core/sys-libs/centrifugo";
import { toWorkspaceRoom, type WorkspaceMessage } from "../types/workspace";

const MESSAGE_PAGE_SIZE = 50;

export function useConsultantRooms() {
  const userId = useAuthStore((state) => state.user?.id);
  const authLoading = useAuthStore((state) => state.isAuthLoading);
  const query = useQuery({
    queryKey: ["consultant-workspace", "rooms", userId],
    enabled: Boolean(userId),
    queryFn: async () => (await chatRoomsService.listAllRooms())
      .map((room) => toWorkspaceRoom(room, userId ?? "")),
    staleTime: 15_000,
    refetchInterval: 30_000,
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
  useEffect(() => {
    if (!userId || !roomId) return;
    return subscribeToChatRoom(userId, roomId, () => {
      void queryClient.invalidateQueries({
        queryKey: ["consultant-workspace", "messages", roomId],
      });
      void queryClient.invalidateQueries({
        queryKey: ["consultant-workspace", "rooms"],
      });
    });
  }, [userId, roomId, queryClient]);
  const history = useInfiniteQuery({
    queryKey: ["consultant-workspace", "messages", roomId],
    enabled: Boolean(roomId),
    initialPageParam: undefined as string | undefined,
    queryFn: ({ pageParam }) =>
      chatRoomsService.listMessages(roomId!, pageParam, MESSAGE_PAGE_SIZE),
    getNextPageParam: (page) => {
      const items = page.items ?? [];
      return items.length === MESSAGE_PAGE_SIZE
        ? items.at(-1)?.createdAt
        : undefined;
    },
    refetchInterval: 10_000,
  });
  const send = useMutation({
    mutationFn: (content: string) =>
      chatRoomsService.sendMessage(roomId!, content.trim()),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["consultant-workspace", "messages", roomId],
        }),
        queryClient.invalidateQueries({
          queryKey: ["consultant-workspace", "rooms"],
        }),
      ]);
    },
  });
  const close = useMutation({
    mutationFn: ({ reason, note }: { reason: string; note?: string }) =>
      chatRoomsService.closeRoom(roomId!, reason, note),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["consultant-workspace", "rooms"],
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
            isSystem: item.messageType?.toUpperCase() === "SYSTEM" && !item.businessType,
            business: toChatBusinessMessage(item.businessType || item.messageType, item.businessReferenceId, item.businessPayload),
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
