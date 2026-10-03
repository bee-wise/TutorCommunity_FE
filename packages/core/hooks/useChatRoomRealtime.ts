"use client";

import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "../store/useAuthStore";
import { subscribeToChatRoom } from "../sys-libs/centrifugo";

export function useChatRoomRealtime(roomId: string | null) {
  const userId = useAuthStore((state) => state.user?.id);
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!userId || !roomId) return;
    return subscribeToChatRoom(userId, roomId, () => {
      void queryClient.invalidateQueries({ queryKey: ["chat-rooms", roomId, "messages"] });
      void queryClient.invalidateQueries({ queryKey: ["chat-rooms", "list"] });
    });
  }, [queryClient, roomId, userId]);
}
