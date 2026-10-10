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

const teachingOfferingSchema = z.object({
  id: z.string(),
  contextName: z.string(),
  teachingItemName: z.string(),
  status: z.string().nullish(),
}).passthrough();

const participantSchema = z.object({
  userId: z.string(),
  joinedAt: z.string().nullable().optional(),
  name: z.string().nullable().optional(),
  role: z.string().nullable().optional(),
  teachingOfferings: z.array(teachingOfferingSchema).nullish(),
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
  type: z.string().nullish(),
  referenceId: z.string().nullish(),
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
  type: z.string().nullable().optional(),
  widget: chatHistoryWidgetSchema.nullish(),
}).passthrough();

const requestListSchema = z.object({
  items: z.array(connectRequestSchema).nullable().optional(),
  pagination: paginationSchema,
}).passthrough();

const messageListSchema = z.object({
  items: z.array(messageSchema).nullish(),
  pagination: paginationSchema.nullish().default({
    page: 1,
    pageSize: 50,
    totalItems: 0,
    totalPages: 1,
  }),
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
export type ChatTeachingOffering = z.infer<typeof teachingOfferingSchema>;
export type ChatRoomRecord = z.infer<typeof roomSchema>;
export type ChatMessageRecord = z.infer<typeof messageSchema>;
export type ChatMessagePage = z.infer<typeof messageListSchema>;
export type ConnectionDirection = "outbound" | "inbound" | "consultant";

function dataOf<T extends z.ZodType>(schema: T, value: unknown): z.infer<T> {
  const envelope = z.object({ success: z.literal(true), data: z.unknown() }).safeParse(value);
  const targetData = envelope.success ? envelope.data.data : value;

  const parsed = schema.safeParse(targetData);
  if (parsed.success) {
    return parsed.data;
  }

  if (envelope.success) {
    const fallbackParsed = schema.safeParse(envelope.data);
    if (fallbackParsed.success) return fallbackParsed.data;
  }

  console.error("Chat rooms service parsing error:", parsed.error, "Payload:", targetData);

  if (targetData && typeof targetData === "object" && "items" in targetData && Array.isArray((targetData as Record<string, unknown>).items)) {
    const rawItems = (targetData as Record<string, unknown>).items as unknown[];
    const safeItems = rawItems.map((item) => {
      const itemParsed = messageSchema.safeParse(item);
      if (itemParsed.success) return itemParsed.data;
      const rec = (item && typeof item === "object" ? item : {}) as Record<string, unknown>;
      return {
        id: String(rec.id || (typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : `msg-${Date.now()}`)),
        chatRoomId: String(rec.chatRoomId || ""),
        senderId: String(rec.senderId || ""),
        content: typeof rec.content === "string" ? rec.content : null,
        createdAt: typeof rec.createdAt === "string" ? rec.createdAt : new Date().toISOString(),
        messageType: typeof rec.messageType === "string" ? rec.messageType : typeof rec.type === "string" ? rec.type : "TEXT",
        businessType: typeof rec.businessType === "string" ? rec.businessType : null,
        businessReferenceId: typeof rec.businessReferenceId === "string" ? rec.businessReferenceId : null,
        type: typeof rec.type === "string" ? rec.type : null,
        widget: (rec.widget as z.infer<typeof messageSchema>["widget"]) || null,
      };
    });

    const rawPagination = (targetData as Record<string, unknown>).pagination as Record<string, unknown> | undefined;
    return {
      items: safeItems,
      pagination: {
        page: typeof rawPagination?.page === "number" ? rawPagination.page : 1,
        pageSize: typeof rawPagination?.pageSize === "number" ? rawPagination.pageSize : 50,
        totalItems: typeof rawPagination?.totalItems === "number" ? rawPagination.totalItems : safeItems.length,
        totalPages: typeof rawPagination?.totalPages === "number" ? rawPagination.totalPages : 1,
      },
    } as z.infer<T>;
  }

  if (targetData && typeof targetData === "object" && "id" in targetData) {
    return targetData as z.infer<T>;
  }

  throw new Error("Dữ liệu chat chưa đúng định dạng. Vui lòng thử lại.");
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
