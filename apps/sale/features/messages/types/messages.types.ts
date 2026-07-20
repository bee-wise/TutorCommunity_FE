// ============================================================
// DOMAIN TYPES: Connection & Chat Room
// ============================================================

export type ConnectionStatus = "ACTIVE" | "CLOSED" | "CANCELLED" | "TIMEOUT" | "CONVERTED_TO_CLASS";
export type ConnectionStage =
  | "WAITING_FOR_TUTOR"
  | "DISCUSSING"
  | "TRIAL_SCHEDULED"
  | "AWAITING_DECISION";
export type ChatRoomStatus = "ACTIVE" | "CLOSED" | "CONVERTED_TO_CLASS";
export type ChatParticipantRole = "LEARNER" | "TUTOR" | "CONSULTANT";

export type CloseReason =
  | "LEARNER_NOT_INTERESTED"
  | "TUTOR_UNAVAILABLE"
  | "SCHEDULE_MISMATCH"
  | "LEARNING_MODE_MISMATCH"
  | "FEE_NOT_AGREED"
  | "TRIAL_UNSUCCESSFUL"
  | "LEARNER_WITHDREW"
  | "TUTOR_NO_RESPONSE"
  | "DUPLICATE_CONNECTION"
  | "POLICY_VIOLATION"
  | "OTHER";

// ============================================================
// MESSAGE TYPES
// ============================================================

export type MessageType = "TEXT" | "IMAGE" | "FILE" | "SYSTEM" | "WIDGET";

export interface ChatParticipant {
  id: string;
  name: string;
  initials: string;
  role: ChatParticipantRole;
  avatarUrl?: string;
  isOnline?: boolean;
}

export interface FileAttachment {
  id: string;
  name: string;
  url: string;
  size: number; // bytes
  mimeType: string;
}

export interface ChatMessage {
  id: string;
  chatRoomId: string;
  senderId: string;
  senderRole: ChatParticipantRole;
  senderName: string;
  type: MessageType;
  text?: string;
  attachment?: FileAttachment;
  widget?: ChatWidget;
  createdAt: string; // ISO string
  isRead: boolean;
}

// ============================================================
// WIDGET TYPES (Consultant-only)
// ============================================================

export type WidgetType =
  | "TRIAL_SCHEDULE"
  | "CONFIRM_CLASS"
  | "CLOSE_CONNECTION"
  | "PAYMENT_REQUEST";

export interface TrialScheduleData {
  proposedDate: string; // e.g. "2026-07-25"
  proposedTime: string; // e.g. "18:00"
  durationMinutes: number;
  teachingMode: "ONLINE" | "OFFLINE";
  note?: string;
}

export interface ConfirmClassData {
  subject: string;
  gradeLevel: string;
  teachingMode: "ONLINE" | "OFFLINE";
  sessionsPerWeek: number;
  feePerSession: number;
  startDate: string;
}

export interface CloseConnectionData {
  reason: CloseReason;
  note?: string;
}

export type ChatWidgetData =
  | TrialScheduleData
  | ConfirmClassData
  | CloseConnectionData;

export type WidgetStatus = "PENDING" | "ACCEPTED" | "DECLINED" | "EXPIRED";

export interface ChatWidget {
  widgetType: WidgetType;
  status: WidgetStatus;
  data: ChatWidgetData;
  createdBy: string; // consultantId
  respondedBy?: string;
  respondedAt?: string;
}

// ============================================================
// CHAT ROOM
// ============================================================

export interface ChatRoom {
  id: string;
  connectRequestId: string;
  status: ChatRoomStatus;
  connectionStage: ConnectionStage;
  connectionStatus: ConnectionStatus;

  // Participants
  learner: ChatParticipant;
  tutor: ChatParticipant;
  consultant: ChatParticipant;

  // Content info
  subject: string;
  gradeLevel: string;
  teachingMode: "ONLINE" | "OFFLINE" | "BOTH";
  feeProposal?: number; // VND per session

  // Chat state
  lastMessage?: string;
  lastMessageAt?: string;
  unreadCount: number;

  createdAt: string;
  updatedAt: string;
}

// ============================================================
// AUTO MESSAGE TEMPLATES (Consultant only)
// ============================================================

export type TemplateCategory =
  | "GREETING"
  | "SCHEDULE"
  | "CONFIRM"
  | "CLOSE"
  | "GENERAL";

export interface AutoMessageTemplate {
  id: string;
  category: TemplateCategory;
  title: string;
  content: string; // Supports {learnerName}, {tutorName}, {subject}
}
