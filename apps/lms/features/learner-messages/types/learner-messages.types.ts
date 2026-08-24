export type LearnerConversationStatus = "ACTIVE" | "CLOSED";
export type ConversationCloseReason = "CLASS_ENDED" | "ENROLLMENT_ENDED";
export type LearnerMessageSender = "LEARNER" | "TUTOR" | "SYSTEM";

export interface ConversationTutor {
  id: string;
  name: string;
  initials: string;
  isOnline: boolean;
}

export interface LearnerConversation {
  id: string;
  classId: string;
  className: string;
  subject: string;
  level: string;
  tutor: ConversationTutor;
  status: LearnerConversationStatus;
  closeReason?: ConversationCloseReason;
  lastMessage: string;
  lastMessageAt: string;
  unreadCount: number;
}

export interface LearnerMessage {
  id: string;
  conversationId: string;
  sender: LearnerMessageSender;
  senderName: string;
  text: string;
  sentAt: string;
  isRead: boolean;
}
