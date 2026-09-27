import type {
  TutorOnboardingDataSource,
  TutorOnboardingMockState,
  TutorOnboardingScenario,
  TutorOnboardingStep,
  TutorPreviewSession,
  WeeklyAvailability,
} from "../types";

export const previewTutorSession: TutorPreviewSession = {
  status: "authenticated",
  user: {
    id: "preview-tutor-id",
    email: "minh.anh@beewise.test",
    firstName: "Minh",
    lastName: "Anh",
    fullName: "Nguyễn Minh Anh",
    phoneNumber: "0912345678",
    role: "TUTOR",
    status: "DRAFT",
    permissions: [],
    tutorProfileId: "preview-tutor-profile-id",
    tutorProfileStatus: "DRAFT",
    hasActiveTutorSubscription: true,
    canAccessTutorLms: false,
    hasActiveLearnerClass: false,
    canAccessLearnerLms: false,
    activeClassId: null,
    activeChatRoomCount: 0,
  },
  tutorProfileId: "preview-tutor-profile-id",
  tutorProfileStatus: "DRAFT",
  hasActiveTutorSubscription: true,
  canAccessTutorLms: false,
  hasActiveLearnerClass: false,
  canAccessLearnerLms: false,
  activeClassId: null,
  activeChatRoomCount: 0,
};

export const onboardingSteps: TutorOnboardingStep[] = [
  {
    id: "account",
    order: 1,
    title: "Tạo tài khoản",
    shortTitle: "Tài khoản",
    description: "Tài khoản Tutor đã được tạo thành công.",
    statusLabel: "Hoàn tất",
    tasks: ["Xác nhận email", "Hoàn tất thông tin đăng nhập"],
  },
  {
    id: "profile",
    order: 2,
    title: "Hồ sơ gia sư",
    shortTitle: "Hồ sơ",
    description: "Bổ sung học vấn, môn dạy, kinh nghiệm và minh chứng.",
    statusLabel: "Đang thực hiện",
    tasks: [
      "Bổ sung thông tin học vấn",
      "Chọn môn dạy và khu vực dạy",
      "Tải minh chứng phù hợp",
    ],
    primaryAction: "Hoàn thiện hồ sơ",
  },
  {
    id: "interview",
    order: 3,
    title: "Phỏng vấn AI",
    shortTitle: "Phỏng vấn AI",
    description:
      "Tham gia phỏng vấn tự động cùng trợ lý AI 24/7 để đánh giá chuyên môn và phương pháp giảng dạy.",
    statusLabel: "Mở 24/7",
    tasks: [
      "Kiểm tra camera, micro và kết nối Internet",
      "Trả lời câu hỏi tình huống từ trợ lý AI",
      "Kết quả phỏng vấn được tự động ghi nhận ngay sau khi hoàn thành",
    ],
    primaryAction: "Bắt đầu phỏng vấn AI",
  },
  {
    id: "verification",
    order: 4,
    title: "Xác thực hồ sơ",
    shortTitle: "Xác thực",
    description:
      "Hệ thống và đội ngũ BeeWise đánh giá hồ sơ cùng kết quả phỏng vấn AI.",
    statusLabel: "Đang xét duyệt",
    tasks: [
      "Hồ sơ đã gửi thành công",
      "Phỏng vấn AI đã hoàn tất",
      "Chờ hệ thống phê duyệt",
    ],
  },
  {
    id: "postApproval",
    order: 5,
    title: "Thông tin bổ sung",
    shortTitle: "Bổ sung",
    description: "Thiết lập lịch rảnh và tài khoản ngân hàng nhận thanh toán.",
    statusLabel: "Mở sau khi duyệt",
    tasks: ["Bổ sung tài khoản nhận thanh toán", "Thiết lập lịch rảnh nhận lớp"],
    primaryAction: "Bổ sung thông tin",
  },
  {
    id: "lms",
    order: 6,
    title: "Vào LMS",
    shortTitle: "Hoàn tất",
    description: "Bắt đầu quản lý lớp học và hoạt động giảng dạy trên BeeWise.",
    statusLabel: "Mở khi hoàn tất",
    tasks: ["Hoàn tất toàn bộ onboarding", "Mở quyền truy cập Tutor LMS"],
    primaryAction: "Vào LMS",
  },
];

export const mockWeeklyAvailability: WeeklyAvailability = {
  mon: ["evening"],
  wed: ["evening"],
  sat: ["morning", "afternoon"],
};

export const createInitialTutorOnboardingState = (
  scenario: TutorOnboardingScenario | "unknown",
): TutorOnboardingMockState => ({
  scenario,
  selectedStepId: scenario === "completed" ? "lms" : "profile",
  profile: {
    headline: "Gia sư Toán - Lý đồng hành cùng học sinh THCS và THPT",
    subjects: ["Toán", "Vật lý", "Luyện thi vào 10"],
    education: "Sinh viên năm 3, Đại học Sư phạm TP.HCM",
    experience:
      "2 năm hỗ trợ học sinh mất gốc lấy lại nền tảng và luyện đề theo mục tiêu.",
    teachingMethod:
      "Chẩn đoán lỗ hổng kiến thức, cá nhân hóa lộ trình và phản hồi sau mỗi buổi học.",
    documents: ["Thẻ sinh viên", "Bảng điểm học kỳ gần nhất"],
  },
  weeklyAvailability: mockWeeklyAvailability,
  bankInfo: {
    bankName: "Vietcombank",
    accountNumber: "0123456789",
    accountHolder: "NGUYEN MINH ANH",
  },
});

export const MockTutorOnboardingDataSource: TutorOnboardingDataSource = {
  getSession: () => previewTutorSession,
  getInitialState: createInitialTutorOnboardingState,
};

export class ApiTutorOnboardingDataSource {
  // TODO: Replace the mock data source with real tutor onboarding APIs later.
}

