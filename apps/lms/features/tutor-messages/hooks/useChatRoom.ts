"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import type { ChatMessage, ChatRoom, ChatParticipantRole } from "../types/messages.types";
import { mockMessages, mockChatRooms } from "../constants/messages.fixtures";

import { useAuthStore } from "@workspace/core/store/useAuthStore";

export function useChatRoom(roomId: string) {
  const user = useAuthStore((state) => state.user);
  const currentUserId = user?.id || "UNKNOWN";
  const currentUserRole = (user?.role?.toUpperCase() || "LEARNER") as ChatParticipantRole;
  const currentUserName = user?.fullName || "Người dùng ẩn danh";

  const [room, setRoom] = useState<ChatRoom | null>(
    mockChatRooms.find((r) => r.id === roomId) ?? null
  );
  const [messages, setMessages] = useState<ChatMessage[]>(
    mockMessages[roomId] ?? []
  );
  const [sending, setSending] = useState(false);
  const [uploadingFile, setUploadingFile] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const isReadOnly =
    room?.status === "CLOSED" || room?.status === "CONVERTED_TO_CLASS";

  const sendMessage = useCallback(
    async (text: string) => {
      if (!text.trim() || isReadOnly) return;
      setSending(true);
      // Optimistic update
      const newMsg: ChatMessage = {
        id: `MSG-${Date.now()}`,
        chatRoomId: roomId,
        senderId: currentUserId,
        senderRole: currentUserRole,
        senderName: currentUserName,
        type: "TEXT",
        text: text.trim(),
        createdAt: new Date().toISOString(),
        isRead: false,
      };
      setMessages((prev) => [...prev, newMsg]);
      // Simulate network delay
      await new Promise((r) => setTimeout(r, 350));
      setSending(false);
    },
    [roomId, isReadOnly, currentUserId, currentUserName, currentUserRole]
  );

  const sendFile = useCallback(
    async (file: File) => {
      if (isReadOnly) return;
      setUploadingFile(true);
      await new Promise((r) => setTimeout(r, 800));
      const newMsg: ChatMessage = {
        id: `MSG-${Date.now()}`,
        chatRoomId: roomId,
        senderId: currentUserId,
        senderRole: currentUserRole,
        senderName: currentUserName,
        type: file.type.startsWith("image/") ? "IMAGE" : "FILE",
        text: undefined,
        attachment: {
          id: `ATT-${Date.now()}`,
          name: file.name,
          url: URL.createObjectURL(file),
          size: file.size,
          mimeType: file.type,
        },
        createdAt: new Date().toISOString(),
        isRead: false,
      };
      setMessages((prev) => [...prev, newMsg]);
      setUploadingFile(false);
    },
    [roomId, isReadOnly, currentUserId, currentUserName, currentUserRole]
  );

  return {
    room,
    messages,
    sending,
    uploadingFile,
    isReadOnly,
    currentUserId,
    currentUserRole,
    sendMessage,
    sendFile,
    messagesEndRef,
    setRoom,
  };
}
