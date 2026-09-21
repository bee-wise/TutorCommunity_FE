import type {
  TutorOnboardingActionId,
  TutorOnboardingMockState,
  TutorOnboardingStepId,
} from "../types";

export function applyTutorOnboardingAction(
  state: TutorOnboardingMockState,
  action: TutorOnboardingActionId,
  payload?: { stepId?: TutorOnboardingStepId },
): TutorOnboardingMockState {
  switch (action) {
    case "switch-journey-detail-step":
      return {
        ...state,
        selectedStepId: payload?.stepId ?? state.selectedStepId,
      };
    case "submit-profile":
      // Submit goes directly to interview (no listing-waived step)
      return {
        ...state,
        scenario: "interview",
        selectedStepId: "interview",
        lastActionMessage: "Hồ sơ đã được gửi thành công.",
      };
    case "complete-mock-interview":
      return {
        ...state,
        scenario: "pending-review",
        selectedStepId: "verification",
      };
    case "approve-mock-profile":
      return {
        ...state,
        scenario: "approved",
        selectedStepId: "postApproval",
        lastActionMessage: "Hồ sơ đã được phê duyệt.",
      };
    case "edit-rejected-profile":
      return {
        ...state,
        scenario: "profile-draft",
        selectedStepId: "profile",
        lastActionMessage: "Đã mở lại hồ sơ với các mục cần chỉnh sửa.",
      };
    case "resubmit-profile":
      return {
        ...state,
        scenario: "pending-review",
        selectedStepId: "verification",
        lastActionMessage: "Hồ sơ đã được gửi lại thành công.",
      };
    case "open-post-approval-form":
      return {
        ...state,
        scenario: "post-approval",
        selectedStepId: "postApproval",
      };
    case "complete-onboarding":
      return { ...state, scenario: "completed", selectedStepId: "lms" };
    case "save-draft":
    case "preview-profile":
    case "join-mock-interview":
    case "request-mock-reschedule":
    case "save-bank-information":
    case "save-availability":
    case "open-lms-preview":
      return {
        ...state,
        lastActionMessage: "Thao tác đã được ghi nhận.",
      };
    default:
      return state;
  }
}

