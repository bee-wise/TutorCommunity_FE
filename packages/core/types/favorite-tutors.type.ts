import { ApiResponse } from "./api-response.type";

export interface FavoriteTutorProfile {
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

export interface FavoriteTutorsListParams {
  page?: number;
  pageSize?: number;
}

export interface FavoriteTutorsPaginatedData {
  items: FavoriteTutorProfile[];
  pagination?: {
    page: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
  };
}

export type FavoriteTutorsListResponse = ApiResponse<
  FavoriteTutorsPaginatedData | FavoriteTutorProfile[]
>;

export type FavoriteTutorIdsResponse = ApiResponse<string[] | { ids: string[] }>;
