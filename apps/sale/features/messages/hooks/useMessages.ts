"use client";

import { useState } from "react";
import type { ChatRoom } from "../types/messages.types";
import { mockChatRooms } from "../constants/messages.fixtures";

export function useMessages() {
  const [rooms, setRooms] = useState<ChatRoom[]>(mockChatRooms);
  const [loading] = useState(false);

  const totalUnread = rooms.reduce((sum, r) => sum + r.unreadCount, 0);

  const markRoomAsRead = (roomId: string) => {
    setRooms((prev) =>
      prev.map((r) => (r.id === roomId ? { ...r, unreadCount: 0 } : r))
    );
  };

  return {
    rooms,
    loading,
    totalUnread,
    markRoomAsRead,
    // legacy compat
    chats: rooms,
  };
}

// Legacy export for backward compat
export { useMessages as useTutorMessages };
