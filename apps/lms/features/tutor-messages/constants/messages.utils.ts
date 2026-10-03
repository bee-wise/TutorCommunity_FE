export function formatMessageTime(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleTimeString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatFullDateTime(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  const timeStr = date.toLocaleTimeString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
  const dateStr = date.toLocaleDateString("vi-VN", {
    weekday: "long",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
  return `${timeStr} - ${dateStr}`;
}

export function formatSessionTime(iso: string): string {

  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  const now = new Date();
  const isToday = date.toDateString() === now.toDateString();
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  const isYesterday = date.toDateString() === yesterday.toDateString();

  const hhmm = date.toLocaleTimeString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
  });

  if (isToday) return `${hhmm} Hôm nay`;
  if (isYesterday) return `${hhmm} Hôm qua`;
  const isSameYear = date.getFullYear() === now.getFullYear();
  const dayMonth = date.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
  });
  if (isSameYear) return `${hhmm} ${dayMonth}`;
  return `${hhmm} ${dayMonth}/${date.getFullYear()}`;
}

export function isSameMinute(aIso?: string | null, bIso?: string | null): boolean {
  if (!aIso || !bIso) return false;
  const dateA = new Date(aIso);
  const dateB = new Date(bIso);
  if (Number.isNaN(dateA.getTime()) || Number.isNaN(dateB.getTime())) return false;
  return (
    dateA.getFullYear() === dateB.getFullYear() &&
    dateA.getMonth() === dateB.getMonth() &&
    dateA.getDate() === dateB.getDate() &&
    dateA.getHours() === dateB.getHours() &&
    dateA.getMinutes() === dateB.getMinutes()
  );
}

export function shouldShowSessionDivider(
  currentCreatedAt: string,
  prevCreatedAt?: string | null,
  thresholdHours: number = 2
): boolean {
  if (!prevCreatedAt) return true;
  const curr = new Date(currentCreatedAt).getTime();
  const prev = new Date(prevCreatedAt).getTime();
  if (Number.isNaN(curr) || Number.isNaN(prev)) return false;
  return Math.abs(curr - prev) >= thresholdHours * 60 * 60 * 1000;
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
  UNKNOWN: "Đang kết nối",
  WAITING_FOR_TUTOR: "Chờ gia sư phản hồi",
  DISCUSSING: "Đang thảo luận",
  TRIAL_SCHEDULED: "Đã lên lịch học thử",
  AWAITING_DECISION: "Chờ quyết định",
  CONVERTED_TO_CLASS: "Lớp học đã tạo",
};

export const STAGE_COLORS: Record<string, string> = {
  WAITING_FOR_TUTOR: "bg-amber-100 text-amber-800 border-amber-200",
  DISCUSSING: "bg-blue-100 text-blue-800 border-blue-200",
  TRIAL_SCHEDULED: "bg-[#447353]/15 text-[#447353] border-[#447353]/30",
  AWAITING_DECISION: "bg-purple-100 text-purple-800 border-purple-200",
  CONVERTED_TO_CLASS: "bg-secondary text-secondary-foreground border-secondary",
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
