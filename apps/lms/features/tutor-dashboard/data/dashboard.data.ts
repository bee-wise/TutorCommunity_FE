import { MOCK_SESSIONS } from "@/features/tutor-schedule/data/mock-sessions";
import { getUpcomingDashboardSessions } from "../utils/dashboard-schedule.utils";

// Reuse the schedule's demo records so session details do not disagree across pages.
export const DASHBOARD_SESSIONS = getUpcomingDashboardSessions(MOCK_SESSIONS).slice(0, 5);

export const DEMO_NOTIFICATIONS = [
  { id: "n1", title: "Bài tập mới", content: "Có 5 học sinh nộp bài tập Toán 10", time: "10 phút trước" },
  { id: "n2", title: "Nhắc nhở lớp học", content: "Lớp Vật lý 11 sẽ bắt đầu sau 2 tiếng nữa", time: "1 giờ trước" },
  { id: "n3", title: "Tài liệu AI", content: "Tài liệu 'Đạo hàm cơ bản' đã được tạo xong", time: "3 giờ trước" },
] as const;
