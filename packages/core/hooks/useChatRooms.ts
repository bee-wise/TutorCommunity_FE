"use client";

import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "../store/useAuthStore";
import { chatRoomsService, type ConnectRequest, type ConnectionDirection } from "../services/chat-rooms.service";
import { toChatRoom } from "../services/chat-rooms.mapper";

export function useChatRooms() {
  const user = useAuthStore((state) => state.user);
  const authLoading = useAuthStore((state) => state.isAuthLoading);
  const direction: ConnectionDirection = user?.role?.toUpperCase() === "TUTOR"
    ? "inbound"
    : user?.role?.toUpperCase() === "CONSULTANT"
      ? "consultant"
      : "outbound";

  const query = useQuery({
    queryKey: ["chat-rooms", "list", user?.id, direction],
    enabled: Boolean(user?.id),
    queryFn: async () => {
      const requests = await chatRoomsService.listAllConnections(direction);
      const withRooms = requests.filter(
        (request): request is ConnectRequest & { chatRoomId: string } => Boolean(request.chatRoomId),
      );
      const results = await Promise.allSettled(withRooms.map(async (request) =>
        toChatRoom(request, await chatRoomsService.getRoom(request.chatRoomId)),
      ));
      const available = results.flatMap((result) => result.status === "fulfilled" ? [result.value] : []);
      if (available.length === 0 && results.length > 0) {
        const failure = results.find((result) => result.status === "rejected");
        if (failure?.status === "rejected") throw failure.reason;
      }
      return available;
    },
    staleTime: 15_000,
    refetchInterval: 30_000,
  });

  const rooms = [...(query.data ?? [])].sort((a, b) =>
    new Date(b.lastMessageAt ?? b.updatedAt).getTime() -
    new Date(a.lastMessageAt ?? a.updatedAt).getTime(),
  );
  return { ...query, isPending: authLoading || Boolean(user?.id && query.isPending), rooms, direction };
}
