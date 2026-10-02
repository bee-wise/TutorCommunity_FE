import { z } from "zod";
import { apiClient } from "../configs/client";

const notificationSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid().optional(),
  title: z.string().nullable().optional(),
  content: z.string().nullable().optional(),
  isRead: z.boolean(),
  readAt: z.string().nullable().optional(),
  createdAt: z.string(),
});

const notificationPageSchema = z.object({
  items: z.array(notificationSchema).nullable(),
  pagination: z.object({
    page: z.number().int(),
    pageSize: z.number().int(),
    totalItems: z.number().int(),
    totalPages: z.number().int(),
  }),
});

const notificationListResponseSchema = z.object({
  success: z.literal(true),
  data: notificationPageSchema,
});

const successResponseSchema = z.object({ success: z.literal(true) });

export type Notification = z.infer<typeof notificationSchema>;
export type NotificationPage = z.infer<typeof notificationPageSchema>;

export interface ListNotificationsParams {
  unreadOnly?: boolean;
  page?: number;
  pageSize?: number;
}

export const notificationsService = {
  async list(params: ListNotificationsParams = {}): Promise<NotificationPage> {
    const response: unknown = await apiClient.get("/notifications", { params });
    const parsed = notificationListResponseSchema.safeParse(response);
    if (!parsed.success) {
      throw new Error("Dữ liệu thông báo từ máy chủ không hợp lệ.");
    }
    return parsed.data.data;
  },

  async markRead(id: string): Promise<void> {
    const response: unknown = await apiClient.put(`/notifications/${encodeURIComponent(id)}/read`);
    if (!successResponseSchema.safeParse(response).success) {
      throw new Error("Không thể đánh dấu thông báo đã đọc.");
    }
  },
};
