export type HistoryStatus = "waiting" | "active" | "converted" | "cancelled" | "timeout" | "closed" | "unknown";
export const HISTORY_STATUS_LABELS: Record<HistoryStatus, string> = {
  waiting: "Chờ gia sư phản hồi", active: "Đang trao đổi", converted: "Đã tạo lớp",
  cancelled: "Đã hủy", timeout: "Hết hạn", closed: "Đã đóng", unknown: "Chưa rõ trạng thái",
};
export interface HistoryConnection {
  id: string;
  learnerName: string;
  learnerId?: string;
  status: HistoryStatus;
  stage: string;
  createdAt: string;
  updatedAt: string;
  roomId?: string;
  closeReason?: string;
  closedAt?: string;
}
export interface HistoryFilters {
  search: string;
  status: "all" | HistoryStatus;
  from: string;
  to: string;
  sort: "newest" | "oldest";
}
