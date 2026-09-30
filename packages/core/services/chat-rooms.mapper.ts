import type { ChatMessageRecord, ChatRoomRecord } from "./chat-rooms.service";

export type ParticipantRole = "LEARNER" | "TUTOR" | "CONSULTANT" | "PARTICIPANT";
type Participant = {
  id: string;
  name: string;
  initials: string;
  role: ParticipantRole;
};

const stages = [
  "WAITING_FOR_TUTOR",
  "DISCUSSING",
  "TRIAL_SCHEDULED",
  "AWAITING_DECISION",
  "CONVERTED_TO_CLASS",
] as const;
type Stage = (typeof stages)[number] | "UNKNOWN";
type RoomStatus = "ACTIVE" | "CLOSED" | "CONVERTED_TO_CLASS";
type ConnectionStatus = "ACTIVE" | "CLOSED" | "CANCELLED" | "TIMEOUT" | "CONVERTED_TO_CLASS";

export interface ChatRoomView {
  id: string;
  category: "CONNECTION" | "SUPPORT";
  supportFor?: "LEARNER" | "TUTOR";
  connectRequestId: string;
  status: RoomStatus;
  connectionStage: Stage;
  connectionStatus: ConnectionStatus;
  learner: Participant;
  tutor: Participant;
  consultant: Participant;
  subject: string;
  gradeLevel: string;
  teachingMode: "ONLINE" | "OFFLINE" | "BOTH";
  hasLearningDetails?: boolean;
  hasParticipantDetails?: boolean;
  feeProposal?: number;
  lastMessage?: string;
  lastMessageAt?: string;
  unreadCount: number;
  createdAt: string;
  updatedAt: string;
}

function participant(id: string, role: ParticipantRole): Participant {
  const label = role === "LEARNER" ? "Học viên" : role === "TUTOR" ? "Gia sư" : role === "CONSULTANT" ? "Tư vấn viên" : "Người tham gia";
  return {
    id,
    name: id ? `${label} · ${id.slice(0, 8)}` : label,
    initials: role === "LEARNER" ? "HV" : role === "TUTOR" ? "GS" : role === "CONSULTANT" ? "TV" : "NT",
    role,
  };
}

export function toChatRoom(room: ChatRoomRecord, userId: string, userRole: ParticipantRole): ChatRoomView {
  const otherIds = room.participants?.map((item) => item.userId).filter((id) => id !== userId) ?? [];
  const self = participant(userId, userRole);
  const firstPeer = participant(otherIds[0] ?? "", "PARTICIPANT");
  const secondPeer = participant(otherIds[1] ?? "", "PARTICIPANT");
  const status: RoomStatus = room.status === "ACTIVE" || room.status === "CLOSED" || room.status === "CONVERTED_TO_CLASS"
    ? room.status
    : "CLOSED";

  return {
    id: room.id,
    category: "CONNECTION",
    connectRequestId: room.connectRequestId,
    status,
    connectionStage: "UNKNOWN",
    connectionStatus: status,
    learner: userRole === "LEARNER" ? self : firstPeer,
    tutor: userRole === "TUTOR" ? self : userRole === "LEARNER" ? firstPeer : secondPeer,
    consultant: userRole === "CONSULTANT" ? self : secondPeer,
    subject: "",
    gradeLevel: "",
    teachingMode: "BOTH" as const,
    hasLearningDetails: false,
    hasParticipantDetails: false,
    lastMessageAt: room.lastMessageAt ?? undefined,
    unreadCount: 0,
    createdAt: room.createdAt,
    updatedAt: room.updatedAt,
  };
}

export function toChatMessage(
  message: ChatMessageRecord,
  room: ReturnType<typeof toChatRoom>,
) {
  const sender = [room.learner, room.tutor, room.consultant].find(
    (item) => item.id === message.senderId,
  );
  const isSystem = message.messageType?.toUpperCase() === "SYSTEM";
  return {
    id: message.id,
    chatRoomId: message.chatRoomId,
    senderId: message.senderId,
    senderRole: sender?.role ?? ("PARTICIPANT" as const),
    senderName: sender?.name ?? "Người tham gia",
    type: isSystem ? ("SYSTEM" as const) : ("TEXT" as const),
    text: message.content ?? (message.businessType ? "Thông tin kết nối đã được cập nhật." : ""),
    createdAt: message.createdAt,
    isRead: true,
  };
}
