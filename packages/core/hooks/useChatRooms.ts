"use client";

import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "../sys-libs/queryKeys";
import { useAuthStore } from "../store/useAuthStore";
import { chatRoomsService, type ConnectRequest, type ConnectionDirection } from "../services/chat-rooms.service";
import { toChatRoom } from "../services/chat-rooms.mapper";

export function useChatRooms(options?: { refetchIntervalMs?: number }) {
  const user = useAuthStore((state) => state.user);
  const authLoading = useAuthStore((state) => state.isAuthLoading);
  const direction: ConnectionDirection = user?.role?.toUpperCase() === "TUTOR"
    ? "inbound"
    : user?.role?.toUpperCase() === "CONSULTANT"
      ? "consultant"
      : "outbound";

  // GET /chat-rooms is the source of truth for rooms the user participates in.
  const query = useQuery({
    queryKey: queryKeys.chatRooms.listForUser(user?.id ?? ""),
    enabled: Boolean(user?.id),
    queryFn: () => chatRoomsService.listAllRooms(),
    staleTime: 15_000,
    refetchInterval: options?.refetchIntervalMs ?? 30_000,
    refetchOnWindowFocus: "always",
  });
  // Connection details enrich the list; lack of CONNECT_REQUEST_READ cannot hide chats.
  const connections = useQuery({
    queryKey: ["chat-rooms", "connections", user?.id, direction],
    enabled: Boolean(user?.id && query.data?.some((room) => room.connectRequestId)),
    queryFn: () => chatRoomsService.listAllConnections(direction),
    staleTime: 30_000,
    retry: false,
  });
  const requestsByRoomId = new Map(
    (connections.data ?? [])
      .filter((request) => request.chatRoomId)
      .map((request) => [request.chatRoomId, request]),
  );
  const rooms = (query.data ?? []).map((room) => {
    const request = requestsByRoomId.get(room.id) ??
      (connections.data ?? []).find((item) => item.id === room.connectRequestId);
    const fallback: ConnectRequest = {
      id: room.connectRequestId ?? "",
      learnerId: room.participants?.find((person) => person.role?.toUpperCase() === "LEARNER")?.userId,
      tutorId: room.participants?.find((person) => person.role?.toUpperCase() === "TUTOR")?.userId,
      chatRoomId: room.id,
      status: room.status,
      createdAt: room.createdAt,
      updatedAt: room.updatedAt,
    };
    return toChatRoom(request ?? fallback, room, user?.role?.toUpperCase() === "TUTOR" ? "TUTOR" : "LEARNER");
  }).sort((a, b) =>
    new Date(b.lastMessageAt ?? b.updatedAt).getTime() -
    new Date(a.lastMessageAt ?? a.updatedAt).getTime(),
  );
  return { ...query, isPending: authLoading || Boolean(user?.id && query.isPending), rooms, direction };
}
