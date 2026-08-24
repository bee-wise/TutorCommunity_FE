export type TuitionClassStatus = "ACTIVE" | "COMPLETED";
export type TuitionSessionStatus = "COMPLETED" | "UPCOMING" | "CANCELED";
export type TuitionChargeStatus = "RECORDED" | "RESERVED" | "NO_CHARGE";
export type TuitionSessionFilter = "all" | TuitionSessionStatus;

export interface LearnerTuitionClass {
  id: string;
  className: string;
  subject: string;
  level: string;
  tutorName: string;
  tutorInitials: string;
  packageName: string;
  feePerSession: number;
  purchasedSessionCount: number;
  totalPaid: number;
  paidAt: string;
  saleOrderCode: string;
  invoiceNumber: string;
  invoiceIssuedAt: string;
  status: TuitionClassStatus;
}

export interface TuitionSession {
  id: string;
  classId: string;
  sequence: number;
  topic: string;
  scheduledAt: string;
  durationMinutes: number;
  sessionStatus: TuitionSessionStatus;
  chargeStatus: TuitionChargeStatus;
  amount: number;
}

export interface TuitionClassSummary {
  classInfo: LearnerTuitionClass;
  recordedSessionCount: number;
  reservedSessionCount: number;
  remainingSessionCount: number;
}
