"use client";

import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "../store/useAuthStore";
import { chatRoomsService } from "../services/chat-rooms.service";
import { toChatRoom, type ParticipantRole } from "../services/chat-rooms.mapper";

export function useChatRooms() {
  const user = useAuthStore((state) => state.user);
  const authLoading = useAuthStore((state) => state.isAuthLoading);
  const role = user?.role?.toUpperCase();
  const participantRole: ParticipantRole = role === "LEARNER" || role === "TUTOR" || role === "CONSULTANT"
    ? role
    : "PARTICIPANT";

  const query = useQuery({
    queryKey: ["chat-rooms", "list", user?.id],
    enabled: Boolean(user?.id),
    queryFn: async () => {
      if (!user?.id) throw new Error("Bạn cần đăng nhập để xem tin nhắn.");
      const rooms = await chatRoomsService.listAllRooms();
      return rooms.map((room) => toChatRoom(room, user.id, participantRole));
    },
    staleTime: 15_000,
    refetchInterval: 30_000,
  });

  const rooms = [...(query.data ?? [])].sort((a, b) =>
    new Date(b.lastMessageAt ?? b.updatedAt).getTime() -
    new Date(a.lastMessageAt ?? a.updatedAt).getTime(),
  );
  return { ...query, isPending: authLoading || Boolean(user?.id && query.isPending), rooms };
}
