export type EarningsPeriod = "day" | "week" | "month" | "year";

export type SettlementStatus = "settled" | "pending" | "reviewing";
export type SettlementFilter = "all" | SettlementStatus;

export const SETTLEMENT_LABELS = {
  settled: "Đã quyết toán",
  pending: "Chờ quyết toán",
  reviewing: "Đang kiểm tra",
} satisfies Record<SettlementStatus, string>;

export type ReportStatus = "received" | "processing" | "resolved";

export const REPORT_LABELS = {
  received: "Đã tiếp nhận",
  processing: "Đang xử lý",
  resolved: "Đã giải quyết",
} satisfies Record<ReportStatus, string>;

export interface EarningSession {
  id: string;
  sessionCode: string;
  learnerName: string;
  subject: string;
  className: string;
  taughtAt: string;
  durationMinutes: number;
  fee: number;
  settlementStatus: SettlementStatus;
  settlementDate?: string;
  settlementCode?: string;
}

export interface EarningsReport {
  id: string;
  reportCode: string;
  sessionId: string;
  title: string;
  description: string;
  createdAt: string;
  status: ReportStatus;
  adminResponse?: string;
}
