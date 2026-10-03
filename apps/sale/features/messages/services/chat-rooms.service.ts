import { z } from "zod";
import { apiClient } from "@workspace/core/configs/client";

const paginationSchema = z.object({
  page: z.number().int(),
  pageSize: z.number().int(),
  totalItems: z.number().int(),
  totalPages: z.number().int(),
});

const participantSchema = z.object({
  userId: z.string(),
  name: z.string().nullable().optional(),
  role: z.string().nullable().optional(),
});

const roomSchema = z.object({
  id: z.string(),
  connectRequestId: z.string().nullable().optional(),
  status: z.string().nullable().optional(),
  lastMessageAt: z.string().nullable().optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
  recipientUserId: z.string().nullable().optional(),
  recipientName: z.string().nullable().optional(),
  participants: z.array(participantSchema).nullable().optional(),
});

const messageSchema = z.object({
  id: z.string(),
  chatRoomId: z.string(),
  senderId: z.string(),
  content: z.string().nullable().optional(),
  createdAt: z.string(),
  messageType: z.string().nullable().optional(),
  businessType: z.string().nullable().optional(),
  businessReferenceId: z.string().nullable().optional(),
  businessPayload: z.unknown().optional(),
});

const pageSchema = <T extends z.ZodType>(item: T) => z.object({
  items: z.array(item).nullable(),
  pagination: paginationSchema,
});

export type ApiChatRoom = z.infer<typeof roomSchema>;
export type ApiChatMessage = z.infer<typeof messageSchema>;
const roomPageSchema = pageSchema(roomSchema);
const messagePageSchema = pageSchema(messageSchema);
export type ChatRoomPage = z.infer<typeof roomPageSchema>;
export type ChatMessagePage = z.infer<typeof messagePageSchema>;

function parseResponse<T extends z.ZodType>(raw: unknown, schema: T): z.infer<T> {
  const parsed = z.object({ success: z.literal(true), data: z.unknown() }).safeParse(raw);
  if (!parsed.success) throw new Error("Dữ liệu phòng chat từ máy chủ không hợp lệ.");
  const data = schema.safeParse(parsed.data.data);
  if (!data.success) throw new Error("Dữ liệu phòng chat từ máy chủ không hợp lệ.");
  return data.data;
}

export const chatRoomsService = {
  async list(page = 1): Promise<ChatRoomPage> {
    const raw: unknown = await apiClient.get("/chat-rooms", { params: { page, pageSize: 50 } });
    return parseResponse(raw, roomPageSchema);
  },

  async get(id: string): Promise<ApiChatRoom> {
    const raw: unknown = await apiClient.get(`/chat-rooms/${encodeURIComponent(id)}`);
    return parseResponse(raw, roomSchema);
  },

  async messages(id: string, before?: string): Promise<ChatMessagePage> {
    const raw: unknown = await apiClient.get(`/chat-rooms/${encodeURIComponent(id)}/messages`, {
      params: { page: 1, pageSize: 50, ...(before ? { before } : {}) },
    });
    return parseResponse(raw, messagePageSchema);
  },

  async send(id: string, content: string): Promise<ApiChatMessage> {
    const raw: unknown = await apiClient.post(`/chat-rooms/${encodeURIComponent(id)}/messages`, { content });
    return parseResponse(raw, messageSchema);
  },
};
