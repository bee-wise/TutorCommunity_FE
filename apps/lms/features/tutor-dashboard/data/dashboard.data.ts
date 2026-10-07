import { MOCK_SESSIONS } from "@/features/tutor-schedule/data/mock-sessions";

// Keep the existing illustrative metrics. No dashboard API is connected yet.
export const DEMO_METRICS = [
  { label: "Tổng học viên", value: "45", description: "+3 so với tháng trước" },
  { label: "Lớp tuần này", value: "12", description: "Đã dạy 4 lớp" },
  { label: "Cần chấm điểm", value: "18", description: "5 bài tập mới nộp" },
  { label: "Đánh giá trung bình", value: "4,9 / 5", description: "Dựa trên 24 đánh giá" },
] as const;

// Reuse the schedule's demo records so session details do not disagree across pages.
export const DASHBOARD_SESSIONS = MOCK_SESSIONS
  .filter((session) => session.status === "UPCOMING")
  .sort((a, b) => `${a.date}T${a.startTime}`.localeCompare(`${b.date}T${b.startTime}`))
  .slice(0, 5);

export const DEMO_NOTIFICATIONS = [
  { id: "n1", title: "Bài tập mới", content: "Có 5 học sinh nộp bài tập Toán 10", time: "10 phút trước" },
  { id: "n2", title: "Nhắc nhở lớp học", content: "Lớp Vật lý 11 sẽ bắt đầu sau 2 tiếng nữa", time: "1 giờ trước" },
  { id: "n3", title: "Tài liệu AI", content: "Tài liệu 'Đạo hàm cơ bản' đã được tạo xong", time: "3 giờ trước" },
] as const;
