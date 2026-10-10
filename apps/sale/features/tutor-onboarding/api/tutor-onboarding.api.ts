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
      return {
        ...state,
        scenario: "pending-review",
        selectedStepId: "verification",
        lastActionMessage: "Hồ sơ đã được gửi và đang chờ phê duyệt.",
      };
    case "complete-mock-interview":
      if (state.scenario !== "interview") return state;
      return {
        ...state,
        scenario: "post-approval",
        selectedStepId: "postApproval",
      };
    case "approve-mock-profile":
      if (state.scenario !== "pending-review") return state;
      return {
        ...state,
        scenario: "approved",
        selectedStepId: "interview",
        lastActionMessage: "Hồ sơ đã được phê duyệt.",
      };
    case "open-approved-interview":
      if (state.scenario !== "approved") return state;
      return { ...state, scenario: "interview", selectedStepId: "interview" };
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
    case "request-mock-reschedule":
    case "save-bank-information":
    case "save-availability":
    case "open-lms-preview":
      return {
        ...state,
        lastActionMessage: "Thao tác đã được ghi nhận.",
      };
    case "join-mock-interview":
      if (state.scenario !== "interview") return state;
      return { ...state, lastActionMessage: "Thao tác đã được ghi nhận." };
    default:
      return state;
  }
}

