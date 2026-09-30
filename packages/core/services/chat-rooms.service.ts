import { z } from "zod";
import { apiClient } from "../configs/client";

const uuid = z.string().uuid();
const paginationSchema = z.object({
  page: z.number().int(),
  pageSize: z.number().int(),
  totalItems: z.number().int(),
  totalPages: z.number().int(),
});

const roomSchema = z.object({
  id: uuid,
  connectRequestId: uuid,
  status: z.string().nullable().optional(),
  lastMessageAt: z.string().nullable().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
  participants: z.array(z.object({ userId: uuid, joinedAt: z.string() })).nullable().optional(),
});
const messageSchema = z.object({
  id: uuid,
  chatRoomId: uuid,
  senderId: uuid,
  content: z.string().nullable().optional(),
  createdAt: z.string(),
  messageType: z.string().nullable().optional(),
  businessType: z.string().nullable().optional(),
  businessReferenceId: uuid.nullable().optional(),
  businessPayload: z.unknown().optional(),
});
const roomListSchema = z.object({
  items: z.array(roomSchema).nullable(),
  pagination: paginationSchema,
});
const messageListSchema = z.object({
  items: z.array(messageSchema).nullable(),
  pagination: paginationSchema,
});
const centrifugoTokenSchema = z.object({
  token: z.string().min(1),
  expiresAt: z.string(),
  userId: uuid,
});
const centrifugoSubscriptionTokenSchema = z.object({
  token: z.string().min(1),
  channel: z.string().min(1),
  expiresAt: z.string(),
});

export type ChatRoomRecord = z.infer<typeof roomSchema>;
export type ChatMessageRecord = z.infer<typeof messageSchema>;
export type ChatMessagePage = z.infer<typeof messageListSchema>;

function dataOf<T extends z.ZodType>(schema: T, value: unknown): z.infer<T> {
  const envelope = z.object({ success: z.literal(true), data: z.unknown() }).safeParse(value);
  if (!envelope.success) throw new Error("Phản hồi từ máy chủ không hợp lệ. Vui lòng thử lại.");
  const parsed = schema.safeParse(envelope.data.data);
  if (!parsed.success) throw new Error("Dữ liệu chat chưa đúng định dạng. Vui lòng thử lại.");
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

  async listRooms(page = 1, pageSize = 100) {
    const response: unknown = await apiClient.get("/chat-rooms", {
      params: { page, pageSize },
    });
    return dataOf(roomListSchema, response);
  },

  async listAllRooms() {
    const first = await this.listRooms();
    const pages = await Promise.all(
      Array.from({ length: Math.max(0, first.pagination.totalPages - 1) }, (_, index) =>
        this.listRooms(index + 2),
      ),
    );
    return [...new Map(
      [first, ...pages].flatMap((page) => page.items ?? []).map((room) => [room.id, room]),
    ).values()];
  },

  async getRoom(id: string) {
    const response: unknown = await apiClient.get(`/chat-rooms/${encodeURIComponent(id)}`);
    return dataOf(roomSchema, response);
  },

  async listMessages(id: string, before?: string, pageSize = 50) {
    const response: unknown = await apiClient.get(
      `/chat-rooms/${encodeURIComponent(id)}/messages`,
      { params: { before, page: 1, pageSize } },
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
