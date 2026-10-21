"use client";

import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "../sys-libs/queryKeys";
import { useAuthStore } from "../store/useAuthStore";
import { subscribeToChatRoom } from "../sys-libs/centrifugo";

/** Bursts (connect, subscribed, publication) collapse into one refetch of the messages and the room list. */
const REFRESH_DEBOUNCE_MS = 250;

export function useChatRoomRealtime(roomId: string | null) {
  const userId = useAuthStore((state) => state.user?.id);
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!userId || !roomId) return;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const unsubscribe = subscribeToChatRoom(userId, roomId, () => {
      if (timer) return;
      timer = setTimeout(() => {
        timer = undefined;
        void queryClient.invalidateQueries({ queryKey: queryKeys.chatRooms.messages(roomId) });
        void queryClient.invalidateQueries({ queryKey: queryKeys.chatRooms.list });
      }, REFRESH_DEBOUNCE_MS);
    });
    return () => {
      if (timer) clearTimeout(timer);
      unsubscribe();
    };
  }, [queryClient, roomId, userId]);
}
