import type { ApiResponse } from "@workspace/core/types/api-response.type";

export type TeachingMode = "online" | "offline" | "both";

export type TutorLevel = "student" | "teacher" | "expert";

export type SortOption =
  | "best_match"
  | "rating"
  | "price_asc"
  | "price_desc";

export interface TutorFilters {
  programId: string | null;
  programVersionId: string | null;
  contextId: string | null;
  teachingItemId: string | null;
  hasContext: boolean | null;
  city: string;
  teachingMode: TeachingMode | "all";
  level: TutorLevel | "all";
  maxPricePerSession: number | null; // null = no limit
  minRating: number | null; // 1–5, null = no filter
  availableOnly: boolean;
  sortBy: SortOption;
}

export const DEFAULT_FILTERS: TutorFilters = {
  programId: null,
  programVersionId: null,
  contextId: null,
  teachingItemId: null,
  hasContext: null,
  city: "",
  teachingMode: "all",
  level: "all",
  maxPricePerSession: null,
  minRating: null,
  availableOnly: false,
  sortBy: "rating",
};

export const DEFAULT_AI_FILTERS: TutorFilters = {
  ...DEFAULT_FILTERS,
  sortBy: "best_match",
};

export type SearchMode = "manual" | "ai";

export interface TutorNamedItem {
  id: string;
  name: string;
  sortOrder?: number;
}

export interface TutorTeachingOfferingProposal {
  teachingItemName?: string;
  contextName?: string;
  contextType?: string;
}

export interface TutorTeachingOfferingItem {
  id: string;
  programId: string;
  programVersionId: string;
  programName: string;
  teachingItemId?: string | null;
  teachingItemName?: string | null;
  contextId?: string | null;
  contextName?: string | null;
  contextType?: string | null;
  teachingMode: string;
  basePrice: number;
  status: string;
  mappingId?: string | null;
  proposalId?: string | null;
  rejectionReason?: string | null;
  proposal?: TutorTeachingOfferingProposal | null;
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
  subjects: TutorNamedItem[];
  gradeLevels: TutorNamedItem[];
  specializations: TutorNamedItem[];
  teachingModes: string[];
  offlineCity: string;
  offlineDistrict: string;
  offlineWard: string;
  travelRadiusKm: number;
  hourlyRate: number;
  ratingAvg: number;
  isOnline: boolean;
  lastActiveAt: string;
  teachingOfferings?: TutorTeachingOfferingItem[];
  reason?: string;
}

export interface TutorPagination {
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

export interface TutorSearchResultData {
  items: ApiTutorProfile[];
  pagination: TutorPagination;
}

export type TutorSearchResponse = ApiResponse<TutorSearchResultData>;

export type AISearchQuery = {
  query: string;
};

export type ManualSearchQuery = {
  keyword?: string;
  programId?: string;
  programVersionId?: string;
  contextId?: string;
  teachingItemId?: string;
  hasContext?: boolean;
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
