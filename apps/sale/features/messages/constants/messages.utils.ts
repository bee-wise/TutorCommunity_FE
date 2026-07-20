export function formatMessageTime(iso: string): string {
  const date = new Date(iso);
  const now = new Date();
  const isToday = date.toDateString() === now.toDateString();
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  const isYesterday = date.toDateString() === yesterday.toDateString();

  const hhmm = date.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" });
  if (isToday) return hhmm;
  if (isYesterday) return `Hôm qua ${hhmm}`;
  return date.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit" }) + " " + hhmm;
}

export function formatRelativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "vừa xong";
  if (mins < 60) return `${mins} phút trước`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} giờ trước`;
  const days = Math.floor(hrs / 24);
  return `${days} ngày trước`;
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export const STAGE_LABELS: Record<string, string> = {
  WAITING_FOR_TUTOR: "Chờ gia sư phản hồi",
  DISCUSSING: "Đang thảo luận",
  TRIAL_SCHEDULED: "Đã lên lịch học thử",
  AWAITING_DECISION: "Chờ quyết định",
};

export const STAGE_COLORS: Record<string, string> = {
  WAITING_FOR_TUTOR: "bg-amber-100 text-amber-800 border-amber-200",
  DISCUSSING: "bg-blue-100 text-blue-800 border-blue-200",
  TRIAL_SCHEDULED: "bg-[#447353]/15 text-[#447353] border-[#447353]/30",
  AWAITING_DECISION: "bg-purple-100 text-purple-800 border-purple-200",
};

export const CLOSE_REASON_LABELS: Record<string, string> = {
  LEARNER_NOT_INTERESTED: "Học viên không còn quan tâm",
  TUTOR_UNAVAILABLE: "Gia sư không có thời gian",
  SCHEDULE_MISMATCH: "Lịch không phù hợp",
  LEARNING_MODE_MISMATCH: "Hình thức học không phù hợp",
  FEE_NOT_AGREED: "Chưa thống nhất học phí",
  TRIAL_UNSUCCESSFUL: "Học thử không thành công",
  LEARNER_WITHDREW: "Học viên rút lui",
  TUTOR_NO_RESPONSE: "Gia sư không phản hồi",
  DUPLICATE_CONNECTION: "Kết nối trùng lặp",
  POLICY_VIOLATION: "Vi phạm chính sách",
  OTHER: "Lý do khác",
};
