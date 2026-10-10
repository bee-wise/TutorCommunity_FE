"use client";

import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { subscribeToChatRoom } from "../sys-libs/centrifugo";

export function useChatRoomListRealtime(
  userId: string | undefined,
  roomIds: readonly string[],
  queryKeyForUser: (userId: string) => readonly unknown[],
) {
  const queryClient = useQueryClient();
  const subscribedIds = [...new Set(roomIds)].sort().join(",");

  useEffect(() => {
    if (!userId || !subscribedIds) return;
    let refreshTimer: ReturnType<typeof setTimeout> | undefined;
    const refreshRooms = () => {
      if (refreshTimer) return;
      refreshTimer = setTimeout(() => {
        refreshTimer = undefined;
        void queryClient.invalidateQueries({ queryKey: queryKeyForUser(userId) });
      }, 100);
    };
    const unsubscribe = subscribedIds.split(",").map((roomId) =>
      subscribeToChatRoom(userId, roomId, refreshRooms),
    );
    return () => {
      if (refreshTimer) clearTimeout(refreshTimer);
      unsubscribe.forEach((stop) => stop());
    };
  }, [queryClient, queryKeyForUser, subscribedIds, userId]);
}
