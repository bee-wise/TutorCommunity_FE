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

export type TutorLevel = "student" | "teacher" | "expert";

export type SortOption =
  | "best_match"
  | "rating"
  | "price_asc"
  | "price_desc"
  | "experience";

export interface TutorFilters {
  teachingMode: TeachingMode | "all";
  level: TutorLevel | "all";
  maxPricePerSession: number | null; // null = no limit
  minRating: number | null; // 1–5, null = no filter
  availableOnly: boolean;
  sortBy: SortOption;
}

export const DEFAULT_FILTERS: TutorFilters = {
  teachingMode: "all",
  level: "all",
  maxPricePerSession: null,
  minRating: null,
  availableOnly: false,
  sortBy: "rating",
};

export type SearchMode = "manual" | "ai";

export interface SearchResult {
  tutors: ApiTutorProfile[];
  mode: SearchMode;
  query: string;
  aiReason?: string; // AI-mode: brief explanation of matching logic
  totalCount: number;
}

export interface ApiTutorProfile {
  profileId: string;
  userId: string;
  displayName: string;
  avatarUrl: string | null;
  profileHeadline: string;
  bio: string;
  universityName: string;
  major: string;
  studentYear: string;
  subjects: { id: string; name: string; sortOrder?: number }[];
  gradeLevels: { id: string; name: string; sortOrder?: number }[];
  specializations: { id: string; name: string; sortOrder?: number }[];
  teachingModes: string[];
  offlineCity: string;
  offlineDistrict: string;
  offlineWard: string;
  travelRadiusKm: number;
  hourlyRate: number;
  ratingAvg: number;
  isOnline: boolean;
  lastActiveAt: string;
  reason?: string;
}

export type AISearchQuery = {
  query: string;
  limit?: number;
  thresold?: number;
};

export type ManualSearchQuery = {
  keyword?: string;
  subjectId?: string;
  gradeLevelId?: string;
  specializationId?: string;
  teachingMode?: string;
  city?: string;
  district?: string;
  ward?: string;
  minHourlyRate?: number;
  maxHourlyRate?: number;
  isOnline?: boolean;
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortDirection?: "asc" | "desc";
};
