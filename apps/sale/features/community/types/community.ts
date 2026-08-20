import { MeType } from "@workspace/core/types/auth.type";

export type UserRole = "GUEST" | "LEARNER" | "TUTOR";
export type TeachingMode = "ONLINE" | "OFFLINE" | "HYBRID" | "ALL";
export type PostStatus = "OPEN" | "IN_SESSION" | "FULFILLED" | "CLOSED";
export type ApplicationStatus = "PENDING" | "ACCEPTED" | "DECLINED";

// Re-using MeType for user profile in the community context
export type UserProfile = MeType;

export interface TutorApplication {
  id: string;
  postId: string;
  tutor: UserProfile;
  pitchNote: string;
  proposedRate: number;
  availableSlots: string[];
  createdAt: string;
  status: ApplicationStatus;
}

export interface CommunityPost {
  id: string;
  author: UserProfile;
  content: string;
  imageUrls: string[];
  subject: string;
  gradeLevel: string;
  teachingMode: TeachingMode;
  city?: string;
  district?: string;
  budgetPerSession: number;
  status: PostStatus;
  createdAt: string;
  applicationsCount: number;
  applications: TutorApplication[];
}

export interface CommunityFilters {
  searchQuery: string;
  subject?: string;
  gradeLevel?: string;
  teachingMode?: TeachingMode;
  district?: string;
  minBudget?: number;
  maxBudget?: number;
}

export interface CreatePostInput {
  content: string;
  imageUrls: string[];
  subject: string;
  gradeLevel: string;
  teachingMode: TeachingMode;
  city?: string;
  district?: string;
  budgetPerSession: number;
}
