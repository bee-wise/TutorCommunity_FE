import type {
  LearnerClass,
  LearnerClassSession,
  LearnerSharedMaterial,
} from "../types/learner-materials.types";

export const LEARNER_CLASSES: LearnerClass[] = [
  {
    id: "class-math-10",
    subject: "Toán",
    level: "Lớp 10",
    tutorName: "Cô Nguyễn Thu Hà",
    tutorInitials: "TH",
    scheduleLabel: "Thứ Hai và Thứ Bảy",
    startedAt: "2026-06-02T09:00:00+07:00",
  },
  {
    id: "class-physics-10",
    subject: "Vật lý",
    level: "Lớp 10",
    tutorName: "Thầy Lê Minh Đức",
    tutorInitials: "MĐ",
    scheduleLabel: "Thứ Ba hằng tuần",
    startedAt: "2026-07-05T09:00:00+07:00",
  },
  {
    id: "class-ielts-65",
    subject: "Tiếng Anh",
    level: "IELTS 6.5",
    tutorName: "Cô Phạm Anh Thư",
    tutorInitials: "AT",
    scheduleLabel: "Thứ Năm và Chủ Nhật",
    startedAt: "2026-05-18T09:00:00+07:00",
  },
];

export const LEARNER_CLASS_SESSIONS: LearnerClassSession[] = [
  { id: "math-session-01", classId: "class-math-10", sequence: 12, topic: "Hệ phương trình bậc nhất", taughtAt: "2026-08-20T18:00:00+07:00", durationMinutes: 90, status: "COMPLETED" },
  { id: "math-session-02", classId: "class-math-10", sequence: 13, topic: "Bất phương trình bậc hai", taughtAt: "2026-08-24T18:00:00+07:00", durationMinutes: 90, status: "COMPLETED" },
  { id: "math-session-03", classId: "class-math-10", sequence: 14, topic: "Dấu của tam thức bậc hai", taughtAt: "2026-08-29T09:00:00+07:00", durationMinutes: 90, status: "UPCOMING" },
  { id: "physics-session-01", classId: "class-physics-10", sequence: 7, topic: "Đồ thị chuyển động", taughtAt: "2026-08-18T19:30:00+07:00", durationMinutes: 90, status: "COMPLETED" },
  { id: "physics-session-02", classId: "class-physics-10", sequence: 8, topic: "Chuyển động thẳng biến đổi đều", taughtAt: "2026-08-25T19:30:00+07:00", durationMinutes: 90, status: "UPCOMING" },
  { id: "english-session-01", classId: "class-ielts-65", sequence: 18, topic: "Speaking Part 1", taughtAt: "2026-08-16T20:00:00+07:00", durationMinutes: 60, status: "CANCELED" },
  { id: "english-session-02", classId: "class-ielts-65", sequence: 19, topic: "Speaking Part 2 - Describe a person", taughtAt: "2026-08-27T20:00:00+07:00", durationMinutes: 60, status: "UPCOMING" },
  { id: "english-session-03", classId: "class-ielts-65", sequence: 17, topic: "Writing Task 1 - Bar chart", taughtAt: "2026-08-10T20:00:00+07:00", durationMinutes: 90, status: "COMPLETED" },
];

// Learner data only contains documents already published by the tutor.
export const LEARNER_SHARED_MATERIALS: LearnerSharedMaterial[] = [
  {
    id: "learner-material-01",
    sessionId: "math-session-01",
    title: "Tóm tắt hệ phương trình bậc nhất",
    description: "Tóm tắt lý thuyết, phương pháp thế và bộ câu hỏi luyện tập do BeeWise AI tạo.",
    source: "ai",
    fileType: "BEEWISE",
    sharedAt: "2026-08-20T20:15:00+07:00",
  },
  {
    id: "learner-material-02",
    sessionId: "math-session-01",
    title: "Bài tập tự luyện hệ phương trình",
    description: "Phiếu bài tập gồm 12 câu từ cơ bản đến vận dụng.",
    source: "upload",
    fileType: "PDF",
    fileSize: "1,8 MB",
    sharedAt: "2026-08-20T20:22:00+07:00",
  },
  {
    id: "learner-material-03",
    sessionId: "math-session-02",
    title: "Bất phương trình bậc hai - Ghi nhớ nhanh",
    description: "Sơ đồ xét dấu và các lỗi thường gặp khi giải bất phương trình.",
    source: "ai",
    fileType: "BEEWISE",
    sharedAt: "2026-08-24T20:05:00+07:00",
    isNew: true,
  },
  {
    id: "learner-material-04",
    sessionId: "physics-session-01",
    title: "Đồ thị tọa độ - thời gian",
    description: "Slide minh họa cách đọc và phân tích các dạng đồ thị chuyển động.",
    source: "upload",
    fileType: "PPTX",
    fileSize: "4,6 MB",
    sharedAt: "2026-08-19T08:10:00+07:00",
  },
  {
    id: "learner-material-05",
    sessionId: "english-session-03",
    title: "IELTS Writing Task 1 templates",
    description: "Mẫu cấu trúc câu và từ vựng mô tả xu hướng trong biểu đồ cột.",
    source: "upload",
    fileType: "DOCX",
    fileSize: "840 KB",
    sharedAt: "2026-08-11T08:20:00+07:00",
  },
  {
    id: "learner-material-06",
    sessionId: "english-session-03",
    title: "Bài luyện viết có hướng dẫn",
    description: "Đề luyện tập kèm dàn ý và tiêu chí tự đánh giá bài viết.",
    source: "ai",
    fileType: "BEEWISE",
    sharedAt: "2026-08-11T08:35:00+07:00",
  },
];

