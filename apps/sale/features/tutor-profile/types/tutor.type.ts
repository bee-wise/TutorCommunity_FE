import { ApiResponse } from "@workspace/core/types/api-response.type";

export interface TutorReviewItem {
  author: string;
  relationship: string;
  rating: number;
  quote: string;
}

export interface TutorAvailabilitySlot {
  day: string;
  time: string;
}

export interface TeachingMethod {
  title: string;
  description: string;
}

export interface TeachingHistoryItem {
  title: string;
  detail: string;
  outcome: string;
}

export interface CertificateItem {
  title: string;
  type: string;
  status: string;
  description: string;
}

export interface TutorAchievementImgItem {
  id: string;
  url: string;
}

export interface TutorVideoItem {
  id: string;
  url: string;
  description: string;
}

export interface TutorProfileData {
  id: string;
  displayName: string;
  avatarUrl: string;
  headline: string;
  shortIntro: string;
  university: string;
  major: string;
  studentYear: string;
  rating: number;
  reviewCount: number;
  responseTime: string;
  teachingHours: string;
  onlineStatus: string;
  subjects: string[];
  specializations: string[];
  teachingModes: string[];
  area: string;
  hourlyRate: string;
  availability: TutorAvailabilitySlot[];
  experienceYears: string;
  achievements: string[];
  introduction: string[];
  teachingMethods: TeachingMethod[];
  education: string[];
  teachingHistory: TeachingHistoryItem[];
  certificates: CertificateItem[];
  reviews: TutorReviewItem[];
  videos: TutorVideoItem[];
  achievementImgs: TutorAchievementImgItem[];
}

export type GetTutorDetailResponse = ApiResponse<TutorProfileData>;
