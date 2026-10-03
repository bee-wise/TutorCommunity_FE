export type RoleFeature = {
  id: string;
  title: string;
  body: string;
  imageSrc: string | null;
  imageAlt: string;
};

// Replace imageSrc with the supplied LMS screenshots, one image per benefit.
export const learnerFeatures: readonly RoleFeature[] = [
  {
    id: "learner-schedule",
    title: "Quản lý lịch học",
    body: "Theo dõi buổi học sắp tới và toàn bộ lịch trong tuần.",
    imageSrc: null,
    imageAlt: "Lịch học của học viên trong BeeWise LMS",
  },
  {
    id: "learner-materials",
    title: "Quản lý tài liệu",
    body: "Xem tài liệu và bài tập được gia sư chuẩn bị cho từng buổi học.",
    imageSrc: null,
    imageAlt: "Kho tài liệu theo buổi học của học viên",
  },
  {
    id: "learner-progress",
    title: "Theo dõi tiến độ học tập",
    body: "Nắm được số buổi đã hoàn thành và nội dung cần tiếp tục ôn luyện.",
    imageSrc: null,
    imageAlt: "Tiến độ học tập của học viên",
  },
];

export const tutorFeatures: readonly RoleFeature[] = [
  {
    id: "tutor-learners",
    title: "Quản lý nhiều học viên",
    body: "Theo dõi lớp học, lịch dạy và tài liệu của từng học viên.",
    imageSrc: null,
    imageAlt: "Danh sách lớp học và học viên của gia sư",
  },
  {
    id: "tutor-ai",
    title: "Tạo bài tập với BeeWise AI",
    body: "Soạn bài tập và tóm tắt nội dung sau buổi học với sự hỗ trợ của AI.",
    imageSrc: null,
    imageAlt: "Gia sư tạo bài tập và tóm tắt buổi học với BeeWise AI",
  },
  {
    id: "tutor-progress",
    title: "Theo dõi tiến độ và thu nhập",
    body: "Xem kết quả học tập và khoản thu theo từng buổi đã dạy.",
    imageSrc: null,
    imageAlt: "Tiến độ học tập và thu nhập của gia sư",
  },
];
