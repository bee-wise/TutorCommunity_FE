"use client";

import { useCallback, useEffect, useState } from "react";
import { useQueries } from "@tanstack/react-query";
import { z } from "zod";
import { chatRoomsService } from "../services/chat-rooms.service";
import { countUnreadMessages, type UnreadMessage } from "../services/chat-unread";
import { queryKeys } from "../sys-libs/queryKeys";

const READ_STORAGE_KEY = "beewise_chat_last_read_v1";
const LEGACY_STAFF_READ_KEY = "beewise_consultant_last_read_v2";
const readMarkersSchema = z.record(z.string(), z.string().refine((value) => Number.isFinite(Date.parse(value))));

export interface UnreadRoomActivity {
  id: string;
  createdAt: string;
  lastMessageAt?: string;
}

export interface LocalUnreadRoom extends UnreadRoomActivity {
  messages: readonly UnreadMessage[];
  viewerId: string;
}

function parseReadMarkers(value: string | null): Record<string, string> {
  try {
    const parsed = readMarkersSchema.safeParse(JSON.parse(value ?? "{}"));
    return parsed.success ? parsed.data : {};
  } catch {
    return {};
  }
}

function storedReadMarkers(): Record<string, string> {
  if (typeof window === "undefined") return {};
  try {
    return {
      ...parseReadMarkers(localStorage.getItem(LEGACY_STAFF_READ_KEY)),
      ...parseReadMarkers(localStorage.getItem(READ_STORAGE_KEY)),
    };
  } catch {
    return {};
  }
}

function markerKey(userId: string, roomId: string): string {
  return `${userId}:${roomId}`;
}

async function countRoomUnread(roomId: string, readAt: string, viewerId: string): Promise<number> {
  let count = 0;
  let totalPages = 1;
  const cutoff = Date.parse(readAt);

  for (let pageNumber = 1; pageNumber <= totalPages; pageNumber += 1) {
    const page = await chatRoomsService.listMessages(roomId, pageNumber, 100);
    const messages = page.items ?? [];
    count += countUnreadMessages(messages, readAt, viewerId);
    if (count >= 100) return 100;
    totalPages = page.pagination?.totalPages ?? 1;

    const timestamps = messages.map((message) => Date.parse(message.createdAt));
    const newestFirst = timestamps.every((time, index) => index === 0 || timestamps[index - 1] >= time);
    if (messages.length === 0 || (newestFirst && timestamps.some((time) => time <= cutoff))) break;
  }

  return count;
}

export function useChatUnread(
  userId: string,
  rooms: readonly UnreadRoomActivity[],
  localRooms: readonly LocalUnreadRoom[] = [],
) {
  const [savedReadAt, setSavedReadAt] = useState<Record<string, string>>(storedReadMarkers);
  const readAt = { ...savedReadAt };

  for (const room of rooms) {
    readAt[markerKey(userId, room.id)] ??= room.createdAt;
  }
  for (const room of localRooms) {
    readAt[markerKey(userId, room.id)] ??= room.messages.at(-1)?.createdAt ?? room.createdAt;
  }

  const serializedReadAt = JSON.stringify(readAt);
  useEffect(() => {
    try {
      localStorage.setItem(READ_STORAGE_KEY, serializedReadAt);
    } catch {
      // Keep read markers in the current tab if storage is unavailable.
    }
  }, [serializedReadAt]);

  useEffect(() => {
    const syncReadMarkers = (event: StorageEvent) => {
      if (event.key === READ_STORAGE_KEY) setSavedReadAt(storedReadMarkers());
    };
    window.addEventListener("storage", syncReadMarkers);
    return () => window.removeEventListener("storage", syncReadMarkers);
  }, []);

  const unreadQueries = useQueries({
    queries: rooms.map((room) => {
      const roomReadAt = readAt[markerKey(userId, room.id)];
      const hasNewMessage = Boolean(
        room.lastMessageAt && roomReadAt && Date.parse(room.lastMessageAt) > Date.parse(roomReadAt),
      );
      return {
        queryKey: queryKeys.chatRooms.unread(userId, room.id, room.lastMessageAt, roomReadAt),
        queryFn: () => countRoomUnread(room.id, roomReadAt, userId),
        enabled: Boolean(userId && hasNewMessage),
        staleTime: 60_000,
      };
    }),
  });

  const unreadCounts: Record<string, number> = {};
  rooms.forEach((room, index) => {
    unreadCounts[room.id] = unreadQueries[index]?.data ?? 0;
  });
  localRooms.forEach((room) => {
    unreadCounts[room.id] = countUnreadMessages(
      room.messages,
      readAt[markerKey(userId, room.id)],
      room.viewerId,
    );
  });

  const markRead = useCallback((roomId: string, throughAt: string) => {
    const timestamp = Date.parse(throughAt);
    if (!userId || !Number.isFinite(timestamp)) return;
    const key = markerKey(userId, roomId);
    setSavedReadAt((previous) => {
      if (Date.parse(previous[key] ?? "") >= timestamp) return previous;
      return { ...previous, [key]: throughAt };
    });
  }, [userId]);

  return { unreadCounts, markRead };
}
