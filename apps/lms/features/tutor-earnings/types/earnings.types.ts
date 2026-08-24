export type EarningsPeriod = "day" | "week" | "month" | "year";

export type SettlementStatus = "settled" | "pending" | "reviewing";

export type ReportStatus = "received" | "processing" | "resolved";

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

export interface EarningsSummary {
  total: number;
  settled: number;
  pending: number;
  sessionCount: number;
}

