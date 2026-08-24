import type { ConversationCloseReason } from "../types/learner-messages.types";

export const CLOSE_REASON_LABELS: Record<ConversationCloseReason, string> = {
  CLASS_ENDED: "Lớp học đã kết thúc",
  ENROLLMENT_ENDED: "Bạn không còn tham gia lớp học này",
};

export function formatConversationTime(value: string) {
  const date = new Date(value);
  const now = new Date("2026-08-24T18:00:00+07:00");
  const isToday = date.toDateString() === now.toDateString();

  if (isToday) {
    return new Intl.DateTimeFormat("vi-VN", { hour: "2-digit", minute: "2-digit" }).format(date);
  }

  return new Intl.DateTimeFormat("vi-VN", { day: "2-digit", month: "2-digit" }).format(date);
}

export function formatMessageTime(value: string) {
  return new Intl.DateTimeFormat("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}
