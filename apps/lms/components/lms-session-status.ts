import type { StatusTone } from "./lms-status";

export type LmsSessionStatus = "UPCOMING" | "IN_PROGRESS" | "COMPLETED" | "CANCELED" | "RESCHEDULED";

export const LMS_SESSION_STATUS: Record<LmsSessionStatus, { tone: StatusTone; label: string }> = {
  UPCOMING: { tone: "pending", label: "Sắp diễn ra" },
  IN_PROGRESS: { tone: "active", label: "Đang diễn ra" },
  COMPLETED: { tone: "done", label: "Đã hoàn thành" },
  CANCELED: { tone: "cancelled", label: "Đã hủy" },
  RESCHEDULED: { tone: "planned", label: "Đã đổi lịch" },
};
