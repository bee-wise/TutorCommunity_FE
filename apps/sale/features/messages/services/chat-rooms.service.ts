import { z } from "zod";
import { apiClient } from "@workspace/core/configs/client";
import { messageSchema } from "@workspace/core/services/chat-rooms.service";

const paginationSchema = z
  .object({
    page: z.number().int().optional().default(1),
    pageSize: z.number().int().optional().default(50),
    totalItems: z.number().int().optional().default(0),
    totalPages: z.number().int().optional().default(1),
  })
  .passthrough();

const participantSchema = z
  .object({
    userId: z.string(),
    name: z.string().nullable().optional(),
    role: z.string().nullable().optional(),
  })
  .passthrough();

const roomSchema = z
  .object({
    id: z.string(),
    connectRequestId: z.string().nullable().optional(),
    status: z.string().nullable().optional(),
    lastMessageAt: z.string().nullable().optional(),
    createdAt: z.string().optional(),
    updatedAt: z.string().optional(),
    recipientUserId: z.string().nullable().optional(),
    recipientName: z.string().nullable().optional(),
    participants: z.array(participantSchema).nullable().optional(),
  })
  .passthrough();

const pageSchema = <T extends z.ZodType>(item: T) =>
  z
    .object({
      items: z.array(item).nullish().default([]),
      pagination: paginationSchema.nullish().default({
        page: 1,
        pageSize: 50,
        totalItems: 0,
        totalPages: 1,
      }),
    })
    .passthrough();

export type ApiChatRoom = z.infer<typeof roomSchema>;
export type ApiChatMessage = z.infer<typeof messageSchema>;
const roomPageSchema = pageSchema(roomSchema);
const messagePageSchema = pageSchema(messageSchema);
export type ChatRoomPage = z.infer<typeof roomPageSchema>;
export type ChatMessagePage = z.infer<typeof messagePageSchema>;

function parseResponse<T extends z.ZodType>(raw: unknown, schema: T): z.infer<T> {
  const envelope = z.object({ success: z.literal(true), data: z.unknown() }).safeParse(raw);
  const targetData = envelope.success ? envelope.data.data : raw;

  const data = schema.safeParse(targetData);
  if (data.success) {
    return data.data;
  }

  if (envelope.success) {
    const directData = schema.safeParse(envelope.data);
    if (directData.success) return directData.data;
  }

  console.error("Chat API data schema parse error:", data.error, "Payload:", targetData);

  // Resilient fallback for paginated message/room lists
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

  throw new Error("Dữ liệu phòng chat từ máy chủ không hợp lệ.");
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

  async messages(id: string, page = 1, before?: string): Promise<ChatMessagePage> {
    const raw: unknown = await apiClient.get(`/chat-rooms/${encodeURIComponent(id)}/messages`, {
      params: { page, pageSize: 50, ...(before ? { before } : {}) },
    });
    return parseResponse(raw, messagePageSchema);
  },

  async send(id: string, content: string): Promise<ApiChatMessage> {
    const raw: unknown = await apiClient.post(`/chat-rooms/${encodeURIComponent(id)}/messages`, { content });
    return parseResponse(raw, messageSchema);
  },
};
