// ─── Tutor Domain Types ──────────────────────────────────────────────────────

export type Subject =
  | "Toán"
  | "Vật Lý"
  | "Hóa Học"
  | "Sinh Học"
  | "Ngữ Văn"
  | "Tiếng Anh"
  | "Tiếng Nhật"
  | "Lịch Sử"
  | "Địa Lý"
  | "Tin Học"
  | "Lập Trình";

export type TeachingMode = "online" | "offline" | "both";

export type VerificationStatus = "verified" | "pending" | "unverified";

export type TutorLevel = "student" | "teacher" | "expert";

export interface TutorReview {
  count: number;
  average: number; // 1 – 5
}

export interface TutorPricing {
  perSession: number; // VND
  sessionDurationMin: number; // minutes
}

export interface Tutor {
  id: string;
  name: string;
  avatarUrl: string;
  headline: string; // short 1-line descriptor
  subjects: Subject[];
  teachingMode: TeachingMode;
  level: TutorLevel;
  verification: VerificationStatus;
  pricing: TutorPricing;
  review: TutorReview;
  location: string; // district/city
  experience: number; // years
  availableNow: boolean;
  tags: string[]; // free-form skill tags, max 4
}

// ─── Filter / Search Types ─────────────────────────────────────────────────

export type SortOption = "rating" | "price_asc" | "price_desc" | "experience";

export interface TutorFilters {
  subjects: Subject[];
  teachingMode: TeachingMode | "all";
  level: TutorLevel | "all";
  maxPricePerSession: number | null; // null = no limit
  minRating: number | null; // 1–5, null = no filter
  availableOnly: boolean;
  sortBy: SortOption;
}

export const DEFAULT_FILTERS: TutorFilters = {
  subjects: [],
  teachingMode: "all",
  level: "all",
  maxPricePerSession: null,
  minRating: null,
  availableOnly: false,
  sortBy: "rating",
};

// ─── Search Result Types ───────────────────────────────────────────────────

export type SearchMode = "manual" | "ai";

export interface SearchResult {
  tutors: Tutor[];
  mode: SearchMode;
  query: string;
  aiReason?: string; // AI-mode: brief explanation of matching logic
  totalCount: number;
}
