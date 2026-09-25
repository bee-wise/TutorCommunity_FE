import type {
  TutorOnboardingActionId,
  TutorOnboardingMockState,
  TutorOnboardingResolvedView,
  TutorOnboardingScenario,
  TutorOnboardingScreen,
  TutorOnboardingStepId,
  TutorOnboardingStepStatus,
} from "../types";

const scenarioScreenMap: Record<
  TutorOnboardingScenario,
  TutorOnboardingScreen
> = {
  journey: "JOURNEY",
  overview: "OVERVIEW",
  "profile-draft": "PROFILE_DRAFT",
  interview: "INTERVIEW",
  "pending-review": "PENDING_REVIEW",
  rejected: "REJECTED",
  approved: "APPROVED",
  "post-approval": "POST_APPROVAL",
  completed: "COMPLETED",
};

const stepOrder: TutorOnboardingStepId[] = [
  "account",
  "profile",
  "interview",
  "verification",
  "postApproval",
  "lms",
];

const scenarioActiveStep: Record<
  TutorOnboardingScenario,
  TutorOnboardingStepId
> = {
  journey: "profile",
  overview: "profile",
  "profile-draft": "profile",
  interview: "interview",
  "pending-review": "verification",
  rejected: "verification",
  approved: "postApproval",
  "post-approval": "postApproval",
  completed: "lms",
};

const titleMap: Record<TutorOnboardingScreen, string> = {
  JOURNEY: "Hành trình trở thành gia sư BeeWise",
  OVERVIEW: "Tổng quan onboarding gia sư",
  PROFILE_DRAFT: "Hoàn thiện hồ sơ gia sư",
  INTERVIEW: "Phỏng vấn AI cùng BeeWise",
  PENDING_REVIEW: "Hồ sơ đang được xét duyệt",
  REJECTED: "Hồ sơ cần được chỉnh sửa",
  APPROVED: "Hồ sơ đã được phê duyệt",
  POST_APPROVAL: "Hoàn tất thông tin để bắt đầu nhận lớp",
  COMPLETED: "Bạn đã sẵn sàng nhận lớp cùng BeeWise",
  UNKNOWN: "Kịch bản preview chưa được hỗ trợ",
};

const descriptionMap: Record<TutorOnboardingScreen, string> = {
  JOURNEY: "Tổng quan 6 giai đoạn onboarding để trở thành gia sư BeeWise.",
  OVERVIEW: "Theo dõi tiến độ và bắt đầu hoàn thiện hồ sơ gia sư của bạn.",
  PROFILE_DRAFT:
    "Bổ sung học vấn, môn dạy, kinh nghiệm và minh chứng trước khi gửi xét duyệt.",
  INTERVIEW:
    "Tham gia phỏng vấn tự động cùng trợ lý AI 24/7 bất kỳ lúc nào bạn sẵn sàng để đánh giá phương pháp giảng dạy.",
  PENDING_REVIEW:
    "BeeWise đang kiểm tra hồ sơ và kết quả phỏng vấn AI của bạn. Vui lòng chờ trong 1–3 ngày làm việc.",
  REJECTED:
    "Cập nhật các phần cần chỉnh sửa theo phản hồi rồi gửi lại hồ sơ để được xét duyệt.",
  APPROVED: "Chúc mừng! Hồ sơ gia sư đã đạt yêu cầu xác thực của BeeWise.",
  POST_APPROVAL:
    "Bổ sung tài khoản ngân hàng nhận thanh toán và lịch rảnh để bắt đầu nhận lớp.",
  COMPLETED:
    "Hồ sơ đã được duyệt, thông tin bổ sung đã hoàn tất và Tutor LMS đã được mở.",
  UNKNOWN: "Fallback an toàn. LMS không được mở cho kịch bản chưa hợp lệ.",
};

const primaryActionMap: Partial<Record<TutorOnboardingScreen, string>> = {
  JOURNEY: "Hoàn thiện hồ sơ",
  OVERVIEW: "Bắt đầu hồ sơ",
  PROFILE_DRAFT: "Gửi hồ sơ",
  INTERVIEW: "Bắt đầu phỏng vấn AI",
  PENDING_REVIEW: "Liên hệ hỗ trợ",
  REJECTED: "Chỉnh sửa hồ sơ",
  APPROVED: "Bổ sung thông tin",
  POST_APPROVAL: "Hoàn tất onboarding",
  COMPLETED: "Vào LMS",
  UNKNOWN: "Về tổng quan",
};

const secondaryActionMap: Partial<Record<TutorOnboardingScreen, string>> = {
  PROFILE_DRAFT: "Xem trước hồ sơ",
  REJECTED: "Liên hệ BeeWise",
  COMPLETED: "Xem hồ sơ công khai",
};

const actionsMap: Record<TutorOnboardingScreen, TutorOnboardingActionId[]> = {
  JOURNEY: ["switch-journey-detail-step", "preview-profile"],
  OVERVIEW: ["submit-profile", "preview-profile"],
  PROFILE_DRAFT: ["save-draft", "preview-profile", "submit-profile"],
  INTERVIEW: [
    "join-mock-interview",
    "request-mock-reschedule",
    "complete-mock-interview",
  ],
  PENDING_REVIEW: [],
  REJECTED: ["edit-rejected-profile", "resubmit-profile"],
  APPROVED: ["open-post-approval-form"],
  POST_APPROVAL: [
    "save-bank-information",
    "save-availability",
    "complete-onboarding",
  ],
  COMPLETED: ["open-lms-preview"],
  UNKNOWN: [],
};

function createStepStatuses(
  activeStep: TutorOnboardingStepId,
  scenario: TutorOnboardingScenario | "unknown",
) {
  const statuses = Object.fromEntries(
    stepOrder.map((step) => [
      step,
      "UPCOMING" satisfies TutorOnboardingStepStatus,
    ]),
  ) as Record<TutorOnboardingStepId, TutorOnboardingStepStatus>;

  if (scenario === "unknown") {
    statuses.account = "COMPLETED";
    statuses.profile = "CURRENT";
    statuses.interview = "BLOCKED";
    statuses.verification = "BLOCKED";
    statuses.postApproval = "BLOCKED";
    statuses.lms = "BLOCKED";
    return statuses;
  }

  const activeIndex = stepOrder.indexOf(activeStep);
  stepOrder.forEach((step, index) => {
    if (index < activeIndex) statuses[step] = "COMPLETED";
    if (index === activeIndex) statuses[step] = "CURRENT";
    if (index > activeIndex) statuses[step] = "BLOCKED";
  });

  if (scenario === "journey") {
    statuses.account = "COMPLETED";
    statuses.profile = "CURRENT";
    statuses.interview = "UPCOMING";
    statuses.verification = "UPCOMING";
    statuses.postApproval = "BLOCKED";
    statuses.lms = "BLOCKED";
  }

  if (scenario === "pending-review") {
    statuses.interview = "COMPLETED";
    statuses.verification = "CURRENT";
  }

  if (scenario === "rejected") {
    statuses.verification = "ACTION_REQUIRED";
    statuses.postApproval = "BLOCKED";
    statuses.lms = "BLOCKED";
  }

  if (scenario === "approved") {
    statuses.verification = "COMPLETED";
    statuses.postApproval = "CURRENT";
    statuses.lms = "BLOCKED";
  }

  if (scenario === "post-approval") {
    statuses.verification = "COMPLETED";
    statuses.postApproval = "CURRENT";
    statuses.lms = "BLOCKED";
  }

  if (scenario === "completed") {
    stepOrder.forEach((step) => {
      statuses[step] = "COMPLETED";
    });
  }

  return statuses;
}

export function resolveTutorOnboardingView(
  mockState: TutorOnboardingMockState,
): TutorOnboardingResolvedView {
  const scenario = mockState.scenario;
  const currentScreen =
    scenario === "unknown" ? "UNKNOWN" : scenarioScreenMap[scenario];
  const activeStep =
    scenario === "unknown" ? "profile" : scenarioActiveStep[scenario];
  const stepStatuses = createStepStatuses(activeStep, scenario);
  const completedSteps = Object.values(stepStatuses).filter(
    (status) => status === "COMPLETED",
  ).length;
  const canAccessTutorLms = currentScreen === "COMPLETED";

  return {
    currentScreen,
    stepStatuses,
    title: titleMap[currentScreen],
    description: descriptionMap[currentScreen],
    primaryAction: primaryActionMap[currentScreen],
    secondaryAction: secondaryActionMap[currentScreen],
    navbarVariant: canAccessTutorLms ? "TUTOR_APPROVED" : "TUTOR_ONBOARDING",
    canAccessTutorLms,
    isReadOnly: currentScreen === "PENDING_REVIEW",
    progressValue:
      currentScreen === "JOURNEY"
        ? 20
        : Math.round((completedSteps / stepOrder.length) * 100),
    activeStep,
    availableActions: actionsMap[currentScreen],
  };
}

export function parseTutorOnboardingScenario(
  scenario?: string | null,
): TutorOnboardingScenario | "unknown" {
  if (!scenario) return "journey";
  const validScenarios = Object.keys(scenarioScreenMap);
  return validScenarios.includes(scenario)
    ? (scenario as TutorOnboardingScenario)
    : "unknown";
}
