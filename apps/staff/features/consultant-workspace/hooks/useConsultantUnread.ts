"use client";

import { useChatUnread } from "@workspace/core/hooks/useChatUnread";
import type { WorkspaceMessage, WorkspaceRoom } from "../types/workspace";

export function useConsultantUnread(
  userId: string,
  rooms: WorkspaceRoom[],
  previewRooms: WorkspaceRoom[],
  previewMessages: Record<string, WorkspaceMessage[]>,
) {
  const localRooms = previewRooms.map((room) => ({
    id: room.id,
    createdAt: room.createdAt,
    lastMessageAt: room.lastMessageAt,
    messages: previewMessages[room.id] ?? [],
    viewerId: "preview-consultant",
  }));
  return useChatUnread(userId, rooms, localRooms);
}
