import type { MeType } from "@workspace/core/types/auth.type";

export const tutorOnboardingScenarios = [
  "journey",
  "overview",
  "profile-draft",
  "listing-waived",
  "interview",
  "pending-review",
  "rejected",
  "approved",
  "post-approval",
  "completed",
] as const;

export type TutorOnboardingScenario =
  (typeof tutorOnboardingScenarios)[number];

export type TutorOnboardingScreen =
  | "JOURNEY"
  | "OVERVIEW"
  | "PROFILE_DRAFT"
  | "LISTING_WAIVED"
  | "INTERVIEW"
  | "PENDING_REVIEW"
  | "REJECTED"
  | "APPROVED"
  | "POST_APPROVAL"
  | "COMPLETED"
  | "UNKNOWN";

export type TutorOnboardingStepId =
  | "account"
  | "profile"
  | "listing"
  | "interview"
  | "verification"
  | "postApproval"
  | "lms";

export type TutorOnboardingStepStatus =
  | "COMPLETED"
  | "CURRENT"
  | "UPCOMING"
  | "BLOCKED"
  | "ACTION_REQUIRED";

export type TutorOnboardingNavbarVariant =
  | "TUTOR_ONBOARDING"
  | "TUTOR_APPROVED";

export type TutorOnboardingActionId =
  | "save-draft"
  | "preview-profile"
  | "submit-profile"
  | "continue-to-interview"
  | "join-mock-interview"
  | "request-mock-reschedule"
  | "complete-mock-interview"
  | "approve-mock-profile"
  | "edit-rejected-profile"
  | "resubmit-profile"
  | "open-post-approval-form"
  | "save-bank-information"
  | "save-availability"
  | "complete-onboarding"
  | "open-lms-preview"
  | "switch-journey-detail-step";

export type TutorOnboardingStep = {
  id: TutorOnboardingStepId;
  order: number;
  title: string;
  shortTitle: string;
  description: string;
  statusLabel: string;
  tasks: string[];
  primaryAction?: string;
  secondaryAction?: string;
};

export type TutorPreviewSession = {
  status: "authenticated";
  user: MeType;
  tutorProfileId: string;
  tutorProfileStatus: string;
  hasActiveTutorSubscription: boolean;
  canAccessTutorLms: boolean;
  hasActiveLearnerClass: boolean;
  canAccessLearnerLms: boolean;
  activeClassId: string | null;
  activeChatRoomCount: number;
};

export type TutorProfileDraft = {
  headline: string;
  subjects: string[];
  education: string;
  experience: string;
  teachingMethod: string;
  documents: string[];
};

export type AvailabilitySlot = {
  id: string;
  day: string;
  startTime: string;
  endTime: string;
  mode: "Online" | "Offline" | "Online và Offline";
};

export type TutorOnboardingMockState = {
  scenario: TutorOnboardingScenario | "unknown";
  selectedStepId: TutorOnboardingStepId;
  profile: TutorProfileDraft;
  availabilitySlots: AvailabilitySlot[];
  bankInfo: {
    bankName: string;
    accountNumber: string;
    accountHolder: string;
  };
  lastActionMessage?: string;
};

export type TutorOnboardingResolvedView = {
  currentScreen: TutorOnboardingScreen;
  stepStatuses: Record<TutorOnboardingStepId, TutorOnboardingStepStatus>;
  title: string;
  description: string;
  primaryAction?: string;
  secondaryAction?: string;
  navbarVariant: TutorOnboardingNavbarVariant;
  canAccessTutorLms: boolean;
  isReadOnly: boolean;
  progressValue: number;
  activeStep: TutorOnboardingStepId;
  availableActions: TutorOnboardingActionId[];
};

export type TutorOnboardingDataSource = {
  getSession: () => TutorPreviewSession;
  getInitialState: (
    scenario: TutorOnboardingScenario | "unknown",
  ) => TutorOnboardingMockState;
};
