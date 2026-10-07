import { z } from "zod";
import type { ConnectRequest, ChatRoomRecord } from "@workspace/core/services/chat-rooms.service";
import type { HistoryConnection, HistoryFilters, HistoryStatus } from "../types/history.types";

const enrichmentSchema = z.object({ learnerName: z.string().nullish() });
const formatter = new Intl.DateTimeFormat("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit", timeZone: "Asia/Ho_Chi_Minh" });

export function formatHistoryDate(value: string) {
  const date = new Date(value);
  return Number.isFinite(date.getTime()) ? formatter.format(date) : "Chưa có thời gian";
}

export function connectionStatus(request: ConnectRequest): HistoryStatus {
  const status = request.status?.toUpperCase();
  if (status === "CONVERTED_TO_CLASS") return "converted";
  if (status === "CANCELLED") return "cancelled";
  if (status === "TIMEOUT") return "timeout";
  if (status === "CLOSED") return "closed";
  if (status === "ACTIVE" || status === "PENDING" || status === "WAITING_FOR_TUTOR") {
    return request.connectionStage === "WAITING_FOR_TUTOR" || status !== "ACTIVE" ? "waiting" : "active";
  }
  return "unknown";
}

export function mapHistoryConnections(requests: readonly ConnectRequest[], rooms: readonly ChatRoomRecord[]): HistoryConnection[] {
  const byRequest = new Map(rooms.filter((room) => room.connectRequestId).map((room) => [room.connectRequestId, room]));
  const byId = new Map(rooms.map((room) => [room.id, room]));
  return requests.map((request) => {
    const room = byRequest.get(request.id) ?? (request.chatRoomId ? byId.get(request.chatRoomId) : undefined);
    const participant = room?.participants?.find((person) => person.userId === request.learnerId || person.role?.toUpperCase() === "LEARNER");
    const enrichment = enrichmentSchema.safeParse(request);
    const learnerName = participant?.name?.trim()
      || (request.learnerId && room?.recipientUserId === request.learnerId ? room?.recipientName?.trim() : undefined)
      || (enrichment.success ? enrichment.data.learnerName?.trim() : undefined)
      || "Học viên chưa có tên";
    return {
      id: request.id, learnerId: request.learnerId ?? undefined, learnerName,
      status: connectionStatus(request), stage: request.connectionStage ?? "UNKNOWN",
      createdAt: request.createdAt, updatedAt: request.updatedAt,
      roomId: room?.id, closeReason: room?.closeNote ?? room?.closeReason ?? undefined,
      closedAt: room?.closedAt ?? undefined,
    };
  });
}

function normalized(value: string) {
  return value.trim().toLocaleLowerCase("vi").normalize("NFD").replace(/[\u0300-\u036f]/g, "").replaceAll("đ", "d");
}

export function filterHistory(connections: readonly HistoryConnection[], filters: HistoryFilters) {
  if (filters.from && filters.to && filters.from > filters.to) return [];
  const from = filters.from ? new Date(`${filters.from}T00:00:00+07:00`).getTime() : -Infinity;
  const to = filters.to ? new Date(`${filters.to}T00:00:00+07:00`).getTime() + 86_400_000 : Infinity;
  const search = normalized(filters.search);
  return connections.filter((connection) => {
    const date = new Date(connection.createdAt).getTime();
    return (filters.status === "all" || connection.status === filters.status)
      && normalized(`${connection.id} ${connection.learnerName} ${connection.learnerId ?? ""}`).includes(search)
      && ((!filters.from && !filters.to) || (date >= from && date < to));
  }).sort((a, b) => {
    const left = new Date(a.createdAt).getTime() || 0;
    const right = new Date(b.createdAt).getTime() || 0;
    return filters.sort === "newest" ? right - left : left - right;
  });
}
