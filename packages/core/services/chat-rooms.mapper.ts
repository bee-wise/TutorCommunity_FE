import type {
  ChatMessageRecord,
  ChatRoomRecord,
  ConnectRequest,
} from "./chat-rooms.service";
import { toChatBusinessMessage } from "./chat-business-message";

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
type ConnectionStatus =
  | "ACTIVE"
  | "CLOSED"
  | "CANCELLED"
  | "TIMEOUT"
  | "CONVERTED_TO_CLASS";

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

function getInitials(name: string, fallback: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return fallback;
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function resolveParticipant(
  role: ParticipantRole,
  userId: string,
  participants?: ChatRoomRecord["participants"],
  fallbackName?: string | null,
): Participant {
  const match = participants?.find(
    (p) =>
      p.role?.trim().toUpperCase() === role ||
      (Boolean(userId) && p.userId === userId),
  );
  const matchedId = match?.userId || userId;
  const rawName = match?.name?.trim() || fallbackName?.trim();
  const defaultLabel =
    role === "LEARNER"
      ? "Học viên"
      : role === "TUTOR"
        ? "Gia sư"
        : "Tư vấn viên";
  const defaultInitials =
    role === "LEARNER" ? "HV" : role === "TUTOR" ? "GS" : "TV";

  if (rawName) {
    return {
      id: matchedId,
      name: rawName,
      initials: getInitials(rawName, defaultInitials),
      role,
    };
  }

  return {
    id: matchedId,
    name:
      role === "CONSULTANT"
        ? defaultLabel
        : matchedId
          ? `${defaultLabel} · ${matchedId.slice(0, 8)}`
          : defaultLabel,
    initials: defaultInitials,
    role,
  };
}

export function toChatRoom(
  request: ConnectRequest,
  room: ChatRoomRecord,
  viewerRole: "LEARNER" | "TUTOR" = "LEARNER",
): ChatRoomView {
  const status: RoomStatus =
    room.status === "ACTIVE" ||
    room.status === "CLOSED" ||
    room.status === "CONVERTED_TO_CLASS"
      ? room.status
      : "CLOSED";
  const stage: Stage =
    stages.find((value) => value === request.connectionStage) ?? "UNKNOWN";
  const connectionStatus: ConnectionStatus =
    request.status === "ACTIVE" ||
    request.status === "CLOSED" ||
    request.status === "CANCELLED" ||
    request.status === "TIMEOUT" ||
    request.status === "CONVERTED_TO_CLASS"
      ? request.status
      : "CLOSED";

  const learnerRecipientName =
    room.recipientUserId &&
    (room.recipientUserId === request.learnerId ||
      room.participants?.find(
        (p) =>
          p.userId === room.recipientUserId &&
          p.role?.toUpperCase() === "LEARNER",
      ))
      ? room.recipientName
      : undefined;

  const tutorRecipientName =
    room.recipientUserId &&
    (room.recipientUserId === request.tutorId ||
      room.participants?.find(
        (p) =>
          p.userId === room.recipientUserId &&
          p.role?.toUpperCase() === "TUTOR",
      ))
      ? room.recipientName
      : undefined;

  const learner = resolveParticipant(
    "LEARNER",
    request.learnerId ?? "",
    room.participants,
    learnerRecipientName,
  );
  const tutor = resolveParticipant(
    "TUTOR",
    request.tutorId ?? "",
    room.participants,
    tutorRecipientName,
  );

  const consultantParticipant = room.participants?.find(
    (item) =>
      item.role?.trim().toUpperCase() === "CONSULTANT" ||
      (item.userId !== learner.id &&
        item.userId !== tutor.id &&
        item.userId !== request.learnerId &&
        item.userId !== request.tutorId),
  );
  const consultant = resolveParticipant(
    "CONSULTANT",
    consultantParticipant?.userId ?? "",
    room.participants,
    consultantParticipant?.name ?? "Tư vấn viên BeeWise",
  );

  return {
    id: room.id,
    category: room.connectRequestId ? "CONNECTION" : "SUPPORT",
    supportFor: room.connectRequestId ? undefined : viewerRole,
    connectRequestId: request.id,
    status,
    connectionStage: stage,
    connectionStatus,
    learner,
    tutor,
    consultant,
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
  const business = toChatBusinessMessage(
    message.businessType || message.messageType,
    message.businessReferenceId,
    message.businessPayload,
  );
  return {
    id: message.id,
    chatRoomId: message.chatRoomId,
    senderId: message.senderId,
    senderRole: sender?.role ?? ("CONSULTANT" as const),
    senderName: sender?.name ?? "Người tham gia",
    type: business
      ? ("WIDGET" as const)
      : isSystem
        ? ("SYSTEM" as const)
        : ("TEXT" as const),
    business,
    text:
      message.content ??
      (business
        ? ""
        : message.businessType
          ? "Thông tin kết nối đã được cập nhật."
          : ""),
    createdAt: message.createdAt,
    isRead: true,
  };
}
