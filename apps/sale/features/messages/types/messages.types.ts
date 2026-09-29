// ============================================================
// DOMAIN TYPES: Connection & Chat Room
// ============================================================

export type ConnectionStatus = "ACTIVE" | "CLOSED" | "CANCELLED" | "TIMEOUT" | "CONVERTED_TO_CLASS";
export type ConnectionStage =
  | "WAITING_FOR_TUTOR"
  | "DISCUSSING"
  | "TRIAL_SCHEDULED"
  | "AWAITING_DECISION"
  | "CONVERTED_TO_CLASS";
export type ChatRoomStatus = "ACTIVE" | "CLOSED" | "CONVERTED_TO_CLASS";
export type ChatRoomCategory = "CONNECTION" | "SUPPORT";
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
// WIDGET TYPES — mock contract for the future Connection Chat API
// ============================================================

export interface TrialSession {
  id: string;
  connectionId: string;
  tutorId: string;
  learnerId: string;
  startAt: string;
  endAt: string;
  teachingMode: "ONLINE" | "OFFLINE";
  location?: string | null;
  meetingInfo?: string | null;
  status: "PROPOSED" | "CONFIRMED" | "REJECTED" | "CANCELLED" | "COMPLETED";
  proposedBy: string;
  confirmedByTutorAt?: string | null;
  confirmedByLearnerAt?: string | null;
}

export interface ClassConfirmation {
  id: string;
  connectionId: string;
  tutorId: string;
  learnerId: string;
  tutorOfferingId: string;
  subject: string;
  teachingMode: "ONLINE" | "OFFLINE";
  pricePerSession: number;
  sessionDurationMinutes: number;
  numberOfSessions: number;
  totalAmount: number;
  proposedSchedule?: string | null;
  status: "DRAFT" | "WAITING_CONFIRMATION" | "CONFIRMED" | "CANCELLED";
  learnerConfirmedAt?: string | null;
  tutorConfirmedAt?: string | null;
  createdBy: string;
  classId?: string | null;
}

export interface PaymentRequest {
  id: string;
  classId: string;
  learnerId: string;
  orderCode: string;
  provider: "PAYOS";
  amount: number;
  currency: "VND";
  paymentLinkId?: string | null;
  checkoutUrl?: string | null;
  status: "PENDING" | "PAID" | "FAILED" | "EXPIRED" | "CANCELLED";
  expiredAt: string;
  paidAt?: string | null;
  providerTransactionId?: string | null;
  createdAt: string;
  tutorName: string;
  subject: string;
  numberOfSessions: number;
}

export interface ClassSession {
  id: string;
  classId: string;
  tutorId: string;
  learnerId: string;
  startAt: string;
  endAt: string;
  teachingMode: "ONLINE" | "OFFLINE";
  location?: string | null;
  meetingInfo?: string | null;
  status: "SCHEDULED" | "COMPLETED" | "CANCELLED" | "RESCHEDULED";
  createdBy: string;
  replacesSessionId?: string | null;
}

export interface ScheduleClassesData {
  classId: string;
  tutorId: string;
  learnerId: string;
  numberOfSessions: number;
  sessions: ClassSession[];
  status: "AWAITING_TUTOR" | "PARTIALLY_SCHEDULED" | "SCHEDULED";
}

export interface CloseConnectionData {
  reason: CloseReason;
  note?: string;
}

export type ChatWidget =
  | { widgetType: "TRIAL_SESSION"; data: TrialSession }
  | { widgetType: "CLASS_CONFIRMATION"; data: ClassConfirmation }
  | { widgetType: "PAYMENT_REQUEST"; data: PaymentRequest }
  | { widgetType: "SCHEDULE_CLASSES"; data: ScheduleClassesData }
  | { widgetType: "CLOSE_CONNECTION"; data: CloseConnectionData };

// ============================================================
// CHAT ROOM
// ============================================================

export interface ChatRoom {
  id: string;
  category: ChatRoomCategory;
  supportFor?: "LEARNER" | "TUTOR";
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
