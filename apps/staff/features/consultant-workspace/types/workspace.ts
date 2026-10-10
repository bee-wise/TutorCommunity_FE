import type { ChatRoomRecord, ChatTeachingOffering } from "@workspace/core/services/chat-rooms.service";
import type { ChatBusinessMessage } from "@workspace/core/services/chat-business-message";

export type RoomStatus = "ACTIVE" | "CLOSED" | "CONVERTED_TO_CLASS";
export type ParticipantRole = "LEARNER" | "TUTOR" | "CONSULTANT";

export interface WorkspaceParticipant {
  id: string;
  name: string;
  role: ParticipantRole;
  teachingOfferings?: ChatTeachingOffering[];
}

export interface WorkspaceRoom {
  id: string;
  kind: "group" | "private";
  isMock: boolean;
  status: RoomStatus;
  connectRequestId?: string;
  participants: WorkspaceParticipant[];
  lastMessageAt?: string;
  updatedAt: string;
  createdAt: string;
  closedAt?: string;
  closeReason?: string;
  closeNote?: string;
  unreadCount?: number;
}

export interface WorkspaceMessage {
  id: string;
  senderId: string;
  content: string;
  createdAt: string;
  isSystem?: boolean;
  business?: ChatBusinessMessage | null;
}

export function toWorkspaceRoom(
  room: ChatRoomRecord,
  consultantId: string,
): WorkspaceRoom {
  const participants = (room.participants ?? []).map((person, index) => {
    const role = person.role?.toUpperCase();
    const resolvedRole: ParticipantRole =
      role === "LEARNER" || role === "TUTOR" || role === "CONSULTANT"
        ? role
        : person.userId === consultantId
          ? "CONSULTANT"
          : index === 0
            ? "LEARNER"
            : "TUTOR";
    const fallback =
      resolvedRole === "LEARNER"
        ? "Học viên"
        : resolvedRole === "TUTOR"
          ? "Gia sư"
          : "Tư vấn viên";
    return {
      id: person.userId,
      name: person.name?.trim() || fallback,
      role: resolvedRole,
      teachingOfferings: resolvedRole === "TUTOR"
        ? (person.teachingOfferings ?? []).filter((offering) => !offering.status || offering.status === "APPROVED")
        : undefined,
    };
  });

  return {
    id: room.id,
    kind: "group",
    isMock: false,
    status:
      room.status === "ACTIVE" || room.status === "CONVERTED_TO_CLASS"
        ? room.status
        : "CLOSED",
    connectRequestId: room.connectRequestId ?? undefined,
    participants,
    lastMessageAt: room.lastMessageAt ?? undefined,
    updatedAt:
      room.lastMessageAt ??
      room.updatedAt ??
      room.createdAt ??
      new Date().toISOString(),
    createdAt: room.createdAt ?? new Date().toISOString(),
    closedAt: room.closedAt ?? undefined,
    closeReason: room.closeReason ?? undefined,
    closeNote: room.closeNote ?? undefined,
    unreadCount:
      (room as { unreadCount?: number }).unreadCount ??
      (room as { unreadMessages?: number }).unreadMessages ??
      0,
  };
}

export function participantName(
  room: WorkspaceRoom,
  role: ParticipantRole,
): string {
  return (
    room.participants.find((person) => person.role === role)?.name ??
    (role === "LEARNER"
      ? "Học viên"
      : role === "TUTOR"
        ? "Gia sư"
        : "Tư vấn viên")
  );
}
