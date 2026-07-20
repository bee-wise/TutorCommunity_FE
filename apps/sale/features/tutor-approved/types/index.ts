export const tutorApprovedScenarios = [
  "ready",
  "active-chats",
  "no-connections",
  "listing-expiring",
  "listing-expired",
  "profile-edit",
  "notifications",
  "subscription-renewal",
] as const;

export type TutorApprovedScenario = (typeof tutorApprovedScenarios)[number];
export type TutorApprovedScreen =
  | "home"
  | "profile"
  | "profile-edit"
  | "messages"
  | "chat-room"
  | "notifications"
  | "availability"
  | "subscription";
export type ListingStatus = "WAIVED_ACTIVE" | "ACTIVE" | "EXPIRING_SOON" | "EXPIRED";

export type TutorApprovedPermissions = {
  isProfileApproved: boolean;
  isListingActive: boolean;
  isProfilePublic: boolean;
  canReceiveNewConnections: boolean;
  postApprovalCompleted: boolean;
  canAccessTutorLms: boolean;
};

export type TutorApprovedProfile = {
  fullName: string;
  firstName: string;
  email: string;
  avatarUrl: string;
  title: string;
  introduction: string;
  description: string;
  university: string;
  major: string;
  subjects: string[];
  gradeLevels: string[];
  teachingMode: string;
  offlineAreas: string[];
  rate: string;
  teachingMethod: string;
  experience: string;
  certificates: string[];
  awards: string[];
  rating: number;
  reviewCount: number;
};

export type TutorChat = {
  id: string;
  learnerName: string;
  learnerInitials: string;
  subject: string;
  gradeLevel: string;
  mode: string;
  consultantName: string;
  lastMessage: string;
  time: string;
  unread: number;
  status: string;
};

export type TutorNotification = {
  id: string;
  type: "connection" | "message" | "consultant" | "profile" | "listing" | "class" | "availability";
  title: string;
  description: string;
  time: string;
  read: boolean;
  actionLabel?: string;
};

export type AvailabilitySlot = {
  id: string;
  day: string;
  start: string;
  end: string;
  mode: "Online" | "Offline" | "Online và Offline";
};

export type TutorApprovedState = {
  scenario: TutorApprovedScenario;
  permissions: TutorApprovedPermissions;
  listingStatus: ListingStatus;
  listingStart: string;
  listingEnd: string;
  daysRemaining: number;
  profile: TutorApprovedProfile;
  draftProfile: TutorApprovedProfile;
  chats: TutorChat[];
  notifications: TutorNotification[];
  availability: AvailabilitySlot[];
  renewalOpen: boolean;
  renewalConfirmed: boolean;
  profileSubmitted: boolean;
};
