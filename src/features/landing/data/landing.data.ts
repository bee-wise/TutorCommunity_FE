import type {
  FaqItem,
  HowItWorksStep,
  PainPoint,
  SolutionFeature,
  TutorBenefit,
} from "../types";

export const PAIN_POINTS: PainPoint[] = [
  {
    id: "time",
    icon: "Clock",
    text: "Mất nhiều thời gian nhắn tin cho nhiều nơi nhưng vẫn chưa tìm được người phù hợp.",
  },
  {
    id: "trust",
    icon: "ShieldWarning",
    text: "Không biết hồ sơ gia sư có đáng tin hay không, bằng cấp và kinh nghiệm khó kiểm chứng.",
  },
  {
    id: "support",
    icon: "ChatCircleDots",
    text: "Sau khi kết nối thì gia sư phản hồi chậm hoặc ngừng liên lạc, không biết liên hệ ai để được hỗ trợ.",
  },
  {
    id: "choice",
    icon: "MagnifyingGlass",
    text: "Có quá nhiều lựa chọn nhưng lại không biết ai mới thật sự phù hợp với nhu cầu của mình.",
  },
];

export const SOLUTION_FEATURES: SolutionFeature[] = [
  {
    id: "ai-search",
    title: "AI Gợi Ý Gia Sư Phù Hợp",
    description:
      "Nhập nhu cầu tìm gia sư của bạn. Hệ thống AI phân tích và gợi ý gia sư phù hợp nhất chỉ trong giây lát.",
    variant: "primary",
  },
  {
    id: "verified",
    title: "Hồ Sơ Được Xác Thực",
    description:
      "Thông tin cá nhân, bằng cấp và chứng chỉ đều được hệ thống kiểm tra trước khi hiển thị trên nền tảng.",
    variant: "secondary",
  },
  {
    id: "advisor-chat",
    title: "Phòng Chat Hỗ Trợ",
    description:
      "Sau khi kết nối, BeeWise tạo phòng chat gồm bạn, gia sư và cố vấn BeeWise để hỗ trợ xuyên suốt quá trình trao đổi.",
    variant: "neutral",
  },
  {
    id: "no-wait",
    title: "Không Để Bạn Phải Chờ",
    description:
      "Nếu gia sư phản hồi quá chậm, BeeWise chủ động nhắc nhở và gợi ý gia sư khác phù hợp để bạn tiếp tục ngay.",
    variant: "accent",
  },
];

export const HOW_IT_WORKS_STEPS: HowItWorksStep[] = [
  {
    step: 1,
    title: "Tìm kiếm",
    description:
      "Tìm kiếm theo nhu cầu hoặc dùng bộ lọc gia sư theo môn học, khu vực, học phí và hình thức học.",
  },
  {
    step: 2,
    title: "Chọn Gia Sư",
    description:
      "Chọn gia sư phù hợp và bấm kết nối. Nếu chưa có tài khoản, BeeWise hỗ trợ đăng ký nhanh chỉ trong vài bước.",
  },
  {
    step: 3,
    title: "Bắt Đầu Học",
    description:
      "Trao đổi cùng gia sư và cố vấn để thống nhất mục tiêu, lịch học và bắt đầu buổi học đầu tiên.",
  },
];

export const TUTOR_BENEFITS: TutorBenefit[] = [
  { id: "reach", text: "Tiếp cận nhiều học viên phù hợp hơn nhờ AI" },
  {
    id: "manage",
    text: "Quản lý lịch dạy và kết nối thuận tiện trên một nền tảng duy nhất.",
  },
  {
    id: "support",
    text: "Được đội ngũ nền tảng hỗ trợ khi làm việc với phụ huynh và học viên.",
  },
  {
    id: "credibility",
    text: "Xây dựng uy tín với hồ sơ đã được xác thực.",
  },
  {
    id: "price",
    text: "Học phí do bạn tự quyết định",
  },
];

export const FAQ_ITEMS: FaqItem[] = [
  {
    id: "pricing",
    question: "Sử dụng tính năng tìm kiếm AI có mất phí không?",
    answer:
      "Không. Bạn có thể sử dụng tính năng tìm kiếm bằng AI và bộ lọc gia sư hoàn toàn miễn phí, không cần đăng nhập.",
  },
  {
    id: "multiple-tutors",
    question: "Tôi có thể kết nối với nhiều gia sư cùng lúc không?",
    answer:
      "Để đảm bảo việc trao đổi được hiệu quả, mỗi tài khoản người học chỉ có thể mở một phòng chat với một gia sư tại một thời điểm. Bạn có thể chuyển sang gia sư khác bất cứ khi nào kết thúc hoặc đóng cuộc trò chuyện hiện tại.",
  },
  {
    id: "verification",
    question: "Làm sao để biết gia sư là thật?",
    answer:
      "Tất cả hồ sơ gia sư trên BeeWise đều trải qua quy trình xác thực trước khi được công khai. Đội ngũ cố vấn kiểm tra thông tin cá nhân, bằng cấp và các giấy tờ liên quan nhằm hạn chế tối đa hồ sơ không chính xác.",
  },
];
