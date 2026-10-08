"use client";

import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "../sys-libs/queryKeys";
import { useAuthStore } from "../store/useAuthStore";
import { subscribeToChatRoom } from "../sys-libs/centrifugo";

export function useChatRoomRealtime(roomId: string | null) {
  const userId = useAuthStore((state) => state.user?.id);
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!userId || !roomId) return;
    return subscribeToChatRoom(userId, roomId, () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.chatRooms.messages(roomId) });
      void queryClient.invalidateQueries({ queryKey: queryKeys.chatRooms.list });
    });
  }, [queryClient, roomId, userId]);
}
