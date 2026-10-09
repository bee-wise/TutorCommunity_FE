import { z } from "zod";

export const classChatMessageSchema = z.object({
  content: z.string().trim().min(1, "Nhập nội dung tin nhắn.").max(2000, "Tin nhắn tối đa 2.000 ký tự."),
});
export type ClassChatMessageInput = z.infer<typeof classChatMessageSchema>;
