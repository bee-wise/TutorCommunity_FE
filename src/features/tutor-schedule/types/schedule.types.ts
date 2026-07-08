export type SessionStatus = "UPCOMING" | "COMPLETED" | "CANCELED";

export type ViewMode = "calendar" | "list";

export interface Session {
  id: string;
  classId: string;
  subject: string;
  subjectLevel: string; // e.g. "12", "B2", "11"
  studentName: string; // first name only (for badge)
  studentFullName: string;
  consultantName: string;
  date: string; // ISO date string: "2026-07-10"
  startTime: string; // "14:00"
  endTime: string; // "15:30"
  classroomLink: string;
  status: SessionStatus;
  feeVnd: number; // e.g. 200000
  notes?: string;
}

export interface FilterState {
  subject: string; // "all" | "Math" | "English" | "Physics"
  status: string; // "all" | "UPCOMING" | "COMPLETED" | "CANCELED"
}

export const STATUS_LABELS: Record<SessionStatus, string> = {
  UPCOMING: "Sắp diễn ra",
  COMPLETED: "Đã hoàn thành",
  CANCELED: "Đã hủy",
};

export const STATUS_COLORS: Record<
  SessionStatus,
  { bg: string; text: string; border: string; dot: string }
> = {
  UPCOMING: {
    bg: "bg-amber-50",
    text: "text-[#905b0f]",
    border: "border-[#905b0f]/30",
    dot: "bg-[#905b0f]",
  },
  COMPLETED: {
    bg: "bg-emerald-50",
    text: "text-[#447353]",
    border: "border-[#447353]/30",
    dot: "bg-[#447353]",
  },
  CANCELED: {
    bg: "bg-red-50",
    text: "text-[#c07070]",
    border: "border-[#e1aba7]/60",
    dot: "bg-[#e1aba7]",
  },
};

export const SUBJECT_OPTIONS = [
  { value: "all", label: "Tất cả môn" },
  { value: "Toán", label: "Toán" },
  { value: "Tiếng Anh", label: "Tiếng Anh" },
  { value: "Vật Lý", label: "Vật Lý" },
  { value: "Hóa Học", label: "Hóa Học" },
];

export const STATUS_OPTIONS = [
  { value: "all", label: "Tất cả trạng thái" },
  { value: "UPCOMING", label: "Sắp diễn ra" },
  { value: "COMPLETED", label: "Đã hoàn thành" },
  { value: "CANCELED", label: "Đã hủy" },
];
