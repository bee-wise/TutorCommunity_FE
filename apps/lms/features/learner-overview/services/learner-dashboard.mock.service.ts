import type { LearnerDashboardData, LearningAssignment, LearningCourse } from "../types/learner-dashboard.types";

// An explicit report prototype, frozen to this sample week. Never an API fallback.
export function getLearnerDashboardMock(): LearnerDashboardData {
  const courses: LearningCourse[] = [
    { id: "math", title: "Toán 10 · Vững nền tảng", subject: "Toán", tutor: "Cô Nguyễn Thu Hà", initials: "TH", completed: 12, total: 16, schedule: "Thứ 3, Thứ 5 · 18:30", tone: "primary" },
    { id: "english", title: "Tiếng Anh · IELTS 6.5", subject: "Tiếng Anh", tutor: "Cô Phạm Anh Thư", initials: "AT", completed: 8, total: 12, schedule: "Thứ 4, Thứ 6 · 19:00", tone: "accent" },
    { id: "physics", title: "Vật lý 10 · Chuyển động", subject: "Vật lý", tutor: "Thầy Lê Minh Đức", initials: "MĐ", completed: 6, total: 12, schedule: "Thứ 7 · 09:00", tone: "secondary" },
  ];
  const assignments: LearningAssignment[] = [
    { id: "a1", title: "Bất phương trình bậc hai", courseId: "math", due: "16/10 · 18:00", status: "pending", description: "Hoàn thành 8 bài tập về dấu của tam thức bậc hai. Ghi rõ các bước lập bảng xét dấu và tập nghiệm." },
    { id: "a2", title: "Writing Task 1 · Line graph", courseId: "english", due: "17/10 · 20:00", status: "pending", description: "Viết bài mô tả biểu đồ đường trong 150–180 từ, chú ý cách nhóm số liệu và mô tả xu hướng." },
    { id: "a3", title: "Vận tốc & gia tốc", courseId: "physics", due: "18/10 · 08:00", status: "pending", description: "Ôn công thức chuyển động thẳng biến đổi đều và hoàn thành 6 bài vận dụng." },
    { id: "a4", title: "Hệ phương trình bậc nhất", courseId: "math", due: "13/10 · 18:00", status: "reviewed", score: 8.5, description: "Lập luận rõ ràng. Em cần kiểm tra điều kiện xác định trước khi kết luận nghiệm." },
    { id: "a5", title: "Reading · Study habits", courseId: "english", due: "12/10 · 20:00", status: "reviewed", score: 7.5, description: "Em đã tìm ý chính tốt hơn. Hãy luyện thêm câu hỏi True / False / Not Given." },
    { id: "a6", title: "Đồ thị chuyển động", courseId: "physics", due: "14/10 · 19:00", status: "submitted", description: "Bài làm đã được nộp trong dữ liệu minh họa và đang chờ gia sư nhận xét." },
  ];
  const reviewed = assignments.filter((item) => item.status === "reviewed" && item.score !== undefined);
  return {
    student: { name: "Minh Anh Nguyễn", initials: "MA", level: "Học sinh lớp 10", goal: "Củng cố nền tảng & IELTS 6.5", joined: "Tháng 8/2026" },
    referenceDate: "2026-10-15",
    week: [
      { date: "2026-10-12", day: "T2", number: "12" }, { date: "2026-10-13", day: "T3", number: "13" },
      { date: "2026-10-14", day: "T4", number: "14" }, { date: "2026-10-15", day: "T5", number: "15" },
      { date: "2026-10-16", day: "T6", number: "16" }, { date: "2026-10-17", day: "T7", number: "17" },
      { date: "2026-10-18", day: "CN", number: "18" },
    ],
    courses, assignments,
    sessions: [
      { id: "s1", courseId: "math", date: "2026-10-15", start: "18:30", end: "20:00", topic: "Dấu của tam thức bậc hai", mode: "Trực tuyến" },
      { id: "s2", courseId: "english", date: "2026-10-16", start: "19:00", end: "20:30", topic: "Writing Task 1 · Overview", mode: "Trực tuyến" },
      { id: "s3", courseId: "physics", date: "2026-10-17", start: "09:00", end: "10:30", topic: "Chuyển động thẳng biến đổi đều", mode: "Trực tuyến" },
    ],
    todos: [
      { id: "t1", title: "Ôn công thức trước buổi Toán", done: false },
      { id: "t2", title: "Hoàn thành bản nháp Writing", done: false },
      { id: "t3", title: "Đọc nhận xét bài tập tuần trước", done: true },
    ],
    feedback: { tutor: "Cô Nguyễn Thu Hà", subject: "Toán", date: "14/10/2026", content: "Minh Anh đã chủ động trình bày cách giải và tự kiểm tra đáp án. Buổi tới, em tập trung thêm vào điều kiện xác định và cách viết kết luận nhé." },
    summary: {
      completed: courses.reduce((sum, item) => sum + item.completed, 0),
      total: courses.reduce((sum, item) => sum + item.total, 0),
      pending: assignments.filter((item) => item.status === "pending").length,
      reviewed: reviewed.length,
      average: reviewed.length ? reviewed.reduce((sum, item) => sum + (item.score ?? 0), 0) / reviewed.length : null,
    },
  };
}