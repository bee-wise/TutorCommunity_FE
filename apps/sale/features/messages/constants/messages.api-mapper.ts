import type { ApiChatMessage, ApiChatRoom } from "../services/chat-rooms.service";
import { toChatBusinessMessage } from "@workspace/core/services/chat-business-message";
import type { ChatMessage, ChatParticipant, ChatParticipantRole, ChatRoom } from "../types/messages.types";

function participant(id: string, name: string, role: ChatParticipantRole): ChatParticipant {
  const initials = name.split(/\s+/).filter(Boolean).slice(-2).map((part) => part[0]).join("").toUpperCase();
  return { id, name, initials: initials || "BW", role };
}

function roleOf(value?: string | null): ChatParticipantRole | null {
  const role = value?.toUpperCase();
  return role === "LEARNER" || role === "TUTOR" || role === "CONSULTANT" ? role : null;
}

export function mapChatRoom(raw: ApiChatRoom, userId: string, userRole: ChatParticipantRole, userName: string): ChatRoom {
  const members = raw.participants ?? [];
  const find = (role: ChatParticipantRole) => members.find((member) => roleOf(member.role) === role);
  const learner = find("LEARNER");
  const tutor = find("TUTOR");
  const consultant = find("CONSULTANT");
  const peer = members.find((member) => member.userId === raw.recipientUserId)
    ?? members.find((member) => member.userId !== userId && roleOf(member.role) !== "CONSULTANT")
    ?? members.find((member) => member.userId !== userId);
  const peerName = raw.recipientName?.trim() || peer?.name?.trim() || "Người tham gia";
  const learnerName = userRole === "LEARNER" ? userName : learner?.name?.trim() || peerName;
  const tutorName = userRole === "TUTOR" ? userName : tutor?.name?.trim() || peerName;
  const status = raw.status === "ACTIVE" ? "ACTIVE" : raw.status === "CONVERTED_TO_CLASS" ? "CONVERTED_TO_CLASS" : "CLOSED";

  return {
    id: raw.id,
    category: "CONNECTION",
    connectRequestId: raw.connectRequestId ?? "",
    status,
    connectionStage: "DISCUSSING",
    connectionStatus: status === "ACTIVE" ? "ACTIVE" : status === "CONVERTED_TO_CLASS" ? "CONVERTED_TO_CLASS" : "CLOSED",
    learner: participant(learner?.userId ?? (userRole === "LEARNER" ? userId : peer?.userId ?? ""), learnerName, "LEARNER"),
    tutor: participant(tutor?.userId ?? (userRole === "TUTOR" ? userId : peer?.userId ?? ""), tutorName, "TUTOR"),
    consultant: participant(consultant?.userId ?? "", consultant?.name?.trim() || "Tư vấn viên BeeWise", "CONSULTANT"),
    subject: "",
    gradeLevel: "",
    teachingMode: "BOTH",
    lastMessageAt: raw.lastMessageAt ?? undefined,
    unreadCount: 0,
    createdAt: raw.createdAt ?? raw.updatedAt ?? "",
    updatedAt: raw.updatedAt ?? raw.createdAt ?? "",
    hasConnectionDetails: false,
    recipientName: peerName,
  };
}

export function mapChatMessage(raw: ApiChatMessage, room: ChatRoom, userId: string, userRole: ChatParticipantRole): ChatMessage {
  const sender = [room.learner, room.tutor, room.consultant].find((item) => item.id === raw.senderId);
  const senderRole = sender?.role ?? (raw.senderId === userId ? userRole : userRole === "LEARNER" ? "TUTOR" : "LEARNER");
  const isSystem = raw.messageType?.toUpperCase() === "SYSTEM" || raw.senderId === "00000000-0000-0000-0000-000000000000";
  const business = toChatBusinessMessage(raw.businessType || raw.messageType, raw.businessReferenceId, raw.businessPayload);
  return {
    id: raw.id,
    chatRoomId: raw.chatRoomId,
    senderId: raw.senderId,
    senderRole,
    senderName: sender?.name ?? (raw.senderId === userId ? "Bạn" : room.recipientName ?? "Người tham gia"),
    type: business ? "WIDGET" : isSystem ? "SYSTEM" : "TEXT",
    business,
    text: raw.content?.trim() || (business ? "" : raw.businessType ? "Thông tin kết nối đã được cập nhật." : "Tin nhắn hệ thống"),
    createdAt: raw.createdAt,
    isRead: true,
  };
}
