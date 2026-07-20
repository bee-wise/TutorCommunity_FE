export interface TutorReviewItem {
  author: string;
  relationship: string;
  rating: number;
  quote: string;
}

export interface TutorAvailabilitySlot {
  day: string;
  time: string;
}

export interface TeachingMethod {
  title: string;
  description: string;
}

export interface TeachingHistoryItem {
  title: string;
  detail: string;
  outcome: string;
}

export interface CertificateItem {
  title: string;
  type: string;
  status: string;
  description: string;
}

export interface TutorProfileData {
  id: string;
  displayName: string;
  avatarUrl: string;
  headline: string;
  shortIntro: string;
  university: string;
  major: string;
  studentYear: string;
  rating: number;
  reviewCount: number;
  responseTime: string;
  teachingHours: string;
  onlineStatus: string;
  subjects: string[];
  specializations: string[];
  teachingModes: string[];
  area: string;
  hourlyRate: string;
  availability: TutorAvailabilitySlot[];
  experienceYears: string;
  achievements: string[];
  introduction: string[];
  teachingMethods: TeachingMethod[];
  education: string[];
  teachingHistory: TeachingHistoryItem[];
  certificates: CertificateItem[];
  reviews: TutorReviewItem[];
}

export const mockTutorProfile: TutorProfileData = {
  id: "nguyen-minh-anh",
  displayName: "Nguyễn Minh Anh",
  avatarUrl: "/images/Tutor/1.png",
  headline: "Gia sư Toán lớp 6-12, tập trung nền tảng và sự tự tin khi làm bài",
  shortIntro:
    "Giúp học sinh hiểu bản chất, sửa lỗi sai thường gặp và có lộ trình ôn tập rõ ràng sau mỗi buổi học.",
  university: "Đại học FPT",
  major: "Kỹ thuật phần mềm",
  studentYear: "Sinh viên năm 3",
  rating: 4.8,
  reviewCount: 24,
  responseTime: "Thường phản hồi trong 15 phút",
  teachingHours: "350+ giờ dạy đã duyệt",
  onlineStatus: "Đang nhận học sinh mới",
  subjects: ["Toán 6-9", "Toán 10-12"],
  specializations: ["Củng cố mất gốc", "Luyện thi vào 10"],
  teachingModes: ["Online", "Tại nhà"],
  area: "Thủ Đức, TP. Hồ Chí Minh",
  hourlyRate: "120.000đ/giờ",
  availability: [
    { day: "Thứ 2, 4, 6", time: "19:00 - 21:00" },
    { day: "Chủ nhật", time: "08:00 - 11:00" },
  ],
  experienceYears: "3 năm",
  achievements: [
    "Điểm thi THPT Quốc gia môn Toán: 9.2",
    "Giải Ba học sinh giỏi Toán cấp tỉnh",
    "GPA hiện tại: 3.4/4.0",
  ],
  introduction: [
    "Minh Anh phù hợp với học sinh mất gốc hoặc thiếu tự tin với môn Toán. Buổi học đi từ kiểm tra nhanh, giải thích trọng tâm đến luyện bài theo mức độ.",
    "Sau mỗi buổi, học sinh có phần cần ôn lại và phụ huynh nắm được tiến độ chính.",
  ],
  teachingMethods: [
    {
      title: "Lộ trình cá nhân hóa",
      description:
        "Đánh giá điểm yếu trước, sau đó chia mục tiêu học theo từng tuần.",
    },
    {
      title: "Giải thích từ bản chất",
      description:
        "Ưu tiên hiểu cách làm trước khi ghi nhớ công thức hoặc mẹo giải nhanh.",
    },
    {
      title: "Luyện tập có đo lường",
      description:
        "Theo dõi lỗi sai và tăng dần độ khó để học sinh thấy tiến bộ rõ ràng.",
    },
  ],
  education: [
    "Ngành Kỹ thuật phần mềm, Đại học FPT",
    "Nền tảng tốt về Toán học, tư duy logic và giải quyết vấn đề",
  ],
  teachingHistory: [
    {
      title: "Củng cố nền tảng lớp 9",
      detail: "Hỗ trợ học sinh cải thiện từ 4.5 lên 7.8 sau 8 tuần.",
      outcome: "Đã duyệt",
    },
    {
      title: "Luyện thi vào lớp 10",
      detail: "Hỗ trợ 12 học sinh đạt từ 8.0 trở lên trong môn Toán.",
      outcome: "Đã rà soát",
    },
    {
      title: "Ôn tập kiểm tra học kỳ",
      detail: "Chuẩn bị bài tập theo chuyên đề và kiểm tra ngắn định kỳ.",
      outcome: "Đã xác minh",
    },
  ],
  certificates: [
    {
      title: "Thông tin sinh viên",
      type: "Xác minh học vấn",
      status: "Đã xác minh",
      description: "BeeWise đã kiểm tra trạng thái học tập ở mức công khai.",
    },
    {
      title: "Thành tích Toán học",
      type: "Minh chứng thành tích",
      status: "Đã duyệt",
      description: "Tóm tắt thành tích học thuật, không hiển thị tài liệu gốc.",
    },
    {
      title: "Kết quả học tập",
      type: "Tóm tắt học tập",
      status: "Đã duyệt",
      description: "Thông tin học tập được trình bày ở dạng an toàn công khai.",
    },
    {
      title: "Kinh nghiệm gia sư",
      type: "Xác nhận hoạt động",
      status: "Đã duyệt",
      description: "Hoạt động giảng dạy được rà soát và tóm tắt ngắn gọn.",
    },
  ],
  reviews: [
    {
      author: "Chị Hạnh",
      relationship: "Phụ huynh học sinh lớp 8",
      rating: 5,
      quote:
        "Con mình hiểu bài nhanh hơn và không còn sợ môn Toán. Anh giảng dễ hiểu và rất kiên nhẫn.",
    },
    {
      author: "Minh",
      relationship: "Học sinh lớp 10",
      rating: 5,
      quote:
        "Sau một tháng học, mình tự làm bài tốt hơn và điểm kiểm tra cải thiện rõ.",
    },
  ],
};
