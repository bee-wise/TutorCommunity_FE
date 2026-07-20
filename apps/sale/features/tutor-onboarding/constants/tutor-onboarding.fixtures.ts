import type {
  AvailabilitySlot,
  TutorOnboardingDataSource,
  TutorOnboardingMockState,
  TutorOnboardingScenario,
  TutorOnboardingStep,
  TutorPreviewSession,
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
    description: "Tài khoản Tutor đã được tạo.",
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
    id: "listing",
    order: 3,
    title: "Thanh toán",
    shortTitle: "Thanh toán",
    description: "Miễn phí thanh toán trong 6 tháng đầu.",
    statusLabel: "Miễn phí kỳ đầu",
    tasks: [
      "Xác nhận chương trình miễn phí kỳ đầu",
      "Không cần thực hiện thanh toán trong kỳ đầu",
    ],
  },
  {
    id: "interview",
    order: 4,
    title: "Phỏng vấn",
    shortTitle: "Phỏng vấn",
    description:
      "Trao đổi với BeeWise về chuyên môn và phương pháp giảng dạy.",
    statusLabel: "Đã lên lịch",
    tasks: [
      "Chuẩn bị giới thiệu ngắn về bản thân",
      "Kiểm tra camera, micro và kết nối Internet",
    ],
    primaryAction: "Xem lịch phỏng vấn",
  },
  {
    id: "verification",
    order: 5,
    title: "Xác thực",
    shortTitle: "Xác thực",
    description: "Consultant kiểm tra hồ sơ và kết quả phỏng vấn.",
    statusLabel: "Đang xét duyệt",
    tasks: ["Hồ sơ đã gửi", "Phỏng vấn đã hoàn tất", "Chờ Consultant xác thực"],
  },
  {
    id: "postApproval",
    order: 6,
    title: "Thông tin bổ sung",
    shortTitle: "Bổ sung",
    description: "Thiết lập lịch rảnh và tài khoản nhận thanh toán.",
    statusLabel: "Mở sau khi duyệt",
    tasks: ["Bổ sung tài khoản nhận thanh toán", "Thiết lập lịch rảnh"],
    primaryAction: "Bổ sung thông tin",
  },
  {
    id: "lms",
    order: 7,
    title: "Vào LMS",
    shortTitle: "Hoàn tất",
    description: "Bắt đầu quản lý lớp học và hoạt động giảng dạy.",
    statusLabel: "Mở khi hoàn tất",
    tasks: ["Hoàn tất toàn bộ onboarding", "Mở quyền Tutor LMS"],
    primaryAction: "Vào LMS",
  },
];

export const mockAvailabilitySlots: AvailabilitySlot[] = [
  { id: "mon", day: "Thứ Hai", startTime: "18:00", endTime: "21:00", mode: "Online" },
  {
    id: "wed",
    day: "Thứ Tư",
    startTime: "18:00",
    endTime: "21:00",
    mode: "Online và Offline",
  },
  { id: "sat", day: "Thứ Bảy", startTime: "08:00", endTime: "12:00", mode: "Offline" },
];

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
  availabilitySlots: mockAvailabilitySlots,
  bankInfo: {
    bankName: "Ngân hàng ABC",
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
