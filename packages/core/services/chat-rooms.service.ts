import { z } from "zod";
import { apiClient } from "../configs/client";
import {
  classConfirmationSchema,
  classScheduleSchema,
  paymentRequestSchema,
  trialSessionSchema,
} from "./connection-widgets.service";

const paginationSchema = z.object({
  page: z.number().int().optional().default(1),
  pageSize: z.number().int().optional().default(50),
  totalItems: z.number().int().optional().default(0),
  totalPages: z.number().int().optional().default(1),
}).passthrough();

const participantSchema = z.object({
  userId: z.string(),
  joinedAt: z.string().nullable().optional(),
  name: z.string().nullable().optional(),
  role: z.string().nullable().optional(),
}).passthrough();

const connectRequestSchema = z.object({
  id: z.string(),
  learnerId: z.string().nullable().optional(),
  tutorId: z.string().nullable().optional(),
  status: z.string().nullable().optional(),
  chatRoomId: z.string().nullable().optional(),
  connectionStage: z.string().nullable().optional(),
  createdAt: z.string().default(() => new Date().toISOString()),
  updatedAt: z.string().default(() => new Date().toISOString()),
}).passthrough();

const roomSchema = z.object({
  id: z.string(),
  connectRequestId: z.string().nullable().optional(),
  status: z.string().nullable().optional(),
  lastMessageAt: z.string().nullable().optional(),
  closedAt: z.string().nullable().optional(),
  closeReason: z.string().nullable().optional(),
  closeNote: z.string().nullable().optional(),
  closedBy: z.string().nullable().optional(),
  recipientUserId: z.string().nullable().optional(),
  recipientName: z.string().nullable().optional(),
  createdAt: z.string().default(() => new Date().toISOString()),
  updatedAt: z.string().default(() => new Date().toISOString()),
  participants: z.array(participantSchema).nullable().optional(),
}).passthrough();

const roomListSchema = z.object({
  items: z.array(roomSchema).nullable().optional(),
  pagination: paginationSchema,
}).passthrough();

export const chatHistoryWidgetSchema = z.object({
  type: z.string(),
  referenceId: z.string(),
  trialSession: trialSessionSchema.nullish(),
  classConfirmation: classConfirmationSchema.nullish(),
  payment: paymentRequestSchema.nullish(),
  schedule: classScheduleSchema.nullish(),
}).passthrough();

export const messageSchema = z.object({
  id: z.string(),
  chatRoomId: z.string().default(""),
  senderId: z.string().default(""),
  content: z.string().nullable().optional(),
  createdAt: z.string().default(() => new Date().toISOString()),
  messageType: z.string().nullable().optional(),
  businessType: z.string().nullable().optional(),
  businessReferenceId: z.string().nullable().optional(),
  businessPayload: z.unknown().optional(),
  type: z.enum(["TEXT", "WIDGET", "SYSTEM"]).optional(),
  widget: chatHistoryWidgetSchema.nullish(),
}).passthrough();

const requestListSchema = z.object({
  items: z.array(connectRequestSchema).nullable().optional(),
  pagination: paginationSchema,
}).passthrough();

const messageListSchema = z.object({
  items: z.array(messageSchema).nullable().optional(),
  pagination: paginationSchema,
}).passthrough();

const centrifugoTokenSchema = z.object({
  token: z.string().min(1),
  expiresAt: z.string(),
  userId: z.string(),
}).passthrough();

const centrifugoSubscriptionTokenSchema = z.object({
  token: z.string().min(1),
  channel: z.string().min(1),
  expiresAt: z.string(),
}).passthrough();

export type ConnectRequest = z.infer<typeof connectRequestSchema>;
export type ChatRoomRecord = z.infer<typeof roomSchema>;
export type ChatMessageRecord = z.infer<typeof messageSchema>;
export type ChatMessagePage = z.infer<typeof messageListSchema>;
export type ConnectionDirection = "outbound" | "inbound" | "consultant";

function dataOf<T extends z.ZodType>(schema: T, value: unknown): z.infer<T> {
  const envelope = z.object({ success: z.literal(true), data: z.unknown() }).safeParse(value);
  if (!envelope.success) {
    const directParsed = schema.safeParse(value);
    if (directParsed.success) return directParsed.data;
    throw new Error("Phản hồi từ máy chủ không hợp lệ. Vui lòng thử lại.");
  }
  const parsed = schema.safeParse(envelope.data.data);
  if (!parsed.success) {
    console.error("Chat rooms service parsing error:", parsed.error);
    const fallbackParsed = schema.safeParse(envelope.data);
    if (fallbackParsed.success) return fallbackParsed.data;
    throw new Error("Dữ liệu chat chưa đúng định dạng. Vui lòng thử lại.");
  }
  return parsed.data;
}

export const chatRoomsService = {
  async getCentrifugoToken() {
    const response: unknown = await apiClient.get("/realtime/centrifugo/token");
    return dataOf(centrifugoTokenSchema, response);
  },

  async getCentrifugoSubscriptionToken(chatRoomId: string) {
    const response: unknown = await apiClient.get("/realtime/centrifugo/subscription-token", {
      params: { chatRoomId },
    });
    return dataOf(centrifugoSubscriptionTokenSchema, response);
  },

  async listConnections(direction: ConnectionDirection, page = 1, pageSize = 50) {
    const response: unknown = await apiClient.get("/connect-requests", {
      params: { direction, page, pageSize },
    });
    return dataOf(requestListSchema, response);
  },

  async listAllConnections(direction: ConnectionDirection) {
    const first = await this.listConnections(direction);
    const totalPages = first.pagination?.totalPages ?? 1;
    const pages = await Promise.all(
      Array.from({ length: Math.max(0, totalPages - 1) }, (_, index) =>
        this.listConnections(direction, index + 2),
      ),
    );
    return [first, ...pages].flatMap((page) => page.items ?? []);
  },

  async getRoom(id: string) {
    const response: unknown = await apiClient.get(`/chat-rooms/${encodeURIComponent(id)}`);
    return dataOf(roomSchema, response);
  },

  async listRooms(page = 1, pageSize = 100) {
    const response: unknown = await apiClient.get("/chat-rooms", {
      params: { page, pageSize },
    });
    return dataOf(roomListSchema, response);
  },

  async listAllRooms() {
    const first = await this.listRooms();
    const rest = await Promise.all(
      Array.from({ length: Math.max(0, first.pagination.totalPages - 1) }, (_, index) =>
        this.listRooms(index + 2),
      ),
    );
    return [first, ...rest].flatMap((page) => page.items ?? []);
  },

  async listMessages(id: string, page = 1, pageSize = 50, before?: string) {
    const response: unknown = await apiClient.get(
      `/chat-rooms/${encodeURIComponent(id)}/messages`,
      { params: { before, page, pageSize } },
    );
    return dataOf(messageListSchema, response);
  },

  async sendMessage(id: string, content: string) {
    const response: unknown = await apiClient.post(
      `/chat-rooms/${encodeURIComponent(id)}/messages`,
      { content },
    );
    return dataOf(messageSchema, response);
  },

  async closeRoom(id: string, closeReason: string, closeNote?: string) {
    const response: unknown = await apiClient.post(
      `/chat-rooms/${encodeURIComponent(id)}/close`,
      { closeReason, closeNote: closeNote || null },
    );
    return dataOf(roomSchema, response);
  },
};
