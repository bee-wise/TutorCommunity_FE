import { ApiResponse } from "./api-response.type";

export type LoginRequest = {
  email: string;
  password: string;
};

export type RegisterRequest = {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  role: "LEARNER" | "TUTOR";
  agreeTerms: true;
};

export type RegisterResponse = {
  userId: string;
  email: string;
  role: string;
};

export type MeType = {
  id: string;
  email: string | null;
  firstName: string | null;
  lastName: string | null;
  fullName: string | null;
  phoneNumber: string | null;
  role: string | null;
  status: string | null;
  permissions: string[] | null;
  tutorProfileId?: string | null;
  hasActiveTutorSubscription?: boolean;
  canAccessTutorLms?: boolean;
  hasActiveLearnerClass?: boolean;
  canAccessLearnerLms?: boolean;
  activeClassId?: string | null;
  activeChatRoomCount?: number;
  displayName?: string;
  avatarUrl?: string;
  tutorOnboardingStatus?: string | null;
  tutorProfileStatus?: string | null;
  onboardingStatus?: string | null;
  lmsAccessEnabled?: boolean | null;
  unreadNotificationCount?: number | null;
  unreadChatCount?: number | null;
};

export type GetMeReponseType = ApiResponse<MeType>;
