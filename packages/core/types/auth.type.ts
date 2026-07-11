import { ApiResponse } from "./api-response.type";

export type LoginRequest = {
  email: string;
  password: string;
};

export type MeType = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  fullName: string;
  phoneNumber: string;
  role: string;
  status: string;
  permissions: string[];
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
