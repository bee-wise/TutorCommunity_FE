"use client";

import { useChatRooms } from "@workspace/core/hooks/useChatRooms";

export function useMessages() {
  const { rooms, isPending, error, refetch } = useChatRooms();
  return {
    rooms,
    chats: rooms,
    loading: isPending,
    error,
    refetch,
  };
}

export { useMessages as useTutorMessages };
