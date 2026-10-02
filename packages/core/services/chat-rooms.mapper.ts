import type { ChatMessageRecord, ChatRoomRecord, ConnectRequest } from "./chat-rooms.service";

export type ParticipantRole = "LEARNER" | "TUTOR" | "CONSULTANT";
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
  feeProposal?: number;
  lastMessage?: string;
  lastMessageAt?: string;
  unreadCount: number;
  createdAt: string;
  updatedAt: string;
}

function participant(id: string, role: ParticipantRole): Participant {
  const label = role === "LEARNER" ? "Học viên" : role === "TUTOR" ? "Gia sư" : "Tư vấn viên";
  return {
    id,
    name: role === "CONSULTANT" ? label : `${label} · ${id.slice(0, 8)}`,
    initials: role === "LEARNER" ? "HV" : role === "TUTOR" ? "GS" : "TV",
    role,
  };
}

export function toChatRoom(request: ConnectRequest, room: ChatRoomRecord): ChatRoomView {
  const consultantId = room.participants?.find(
    (item) => item.userId !== request.learnerId && item.userId !== request.tutorId,
  )?.userId ?? "";
  const status: RoomStatus = room.status === "ACTIVE" || room.status === "CLOSED" || room.status === "CONVERTED_TO_CLASS"
    ? room.status
    : "CLOSED";
  const stage: Stage = stages.find((value) => value === request.connectionStage) ?? "UNKNOWN";
  const connectionStatus: ConnectionStatus = request.status === "ACTIVE" || request.status === "CLOSED" || request.status === "CANCELLED" || request.status === "TIMEOUT" || request.status === "CONVERTED_TO_CLASS"
    ? request.status
    : "CLOSED";

  return {
    id: room.id,
    category: "CONNECTION" as const,
    connectRequestId: request.id,
    status,
    connectionStage: stage,
    connectionStatus,
    learner: participant(request.learnerId, "LEARNER"),
    tutor: participant(request.tutorId, "TUTOR"),
    consultant: participant(consultantId, "CONSULTANT"),
    subject: "",
    gradeLevel: "",
    teachingMode: "BOTH" as const,
    hasLearningDetails: false,
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
    senderRole: sender?.role ?? ("CONSULTANT" as const),
    senderName: sender?.name ?? "Người tham gia",
    type: isSystem ? ("SYSTEM" as const) : ("TEXT" as const),
    text: message.content ?? (message.businessType ? "Thông tin kết nối đã được cập nhật." : ""),
    createdAt: message.createdAt,
    isRead: true,
  };
}
