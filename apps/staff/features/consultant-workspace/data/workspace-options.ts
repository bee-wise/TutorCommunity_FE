export const closeReasons = [
  ["LEARNER_NOT_INTERESTED", "Học viên không còn quan tâm"],
  ["TUTOR_UNAVAILABLE", "Gia sư không có thời gian"],
  ["SCHEDULE_MISMATCH", "Lịch học không phù hợp"],
  ["LEARNING_MODE_MISMATCH", "Hình thức học không phù hợp"],
  ["FEE_NOT_AGREED", "Chưa thống nhất học phí"],
  ["TRIAL_UNSUCCESSFUL", "Học thử không thành công"],
  ["LEARNER_WITHDREW", "Học viên rút lui"],
  ["TUTOR_NO_RESPONSE", "Gia sư không phản hồi"],
  ["DUPLICATE_CONNECTION", "Kết nối trùng lặp"],
  ["POLICY_VIOLATION", "Vi phạm chính sách"],
  ["OTHER", "Lý do khác"],
] as const;

export const messageTemplates = [
  {
    id: "greeting",
    title: "Chào hỏi",
    description: "Mở đầu cuộc trò chuyện",
    content: "Chào bạn, mình là tư vấn viên BeeWise. Mình sẽ hỗ trợ hai bên trong quá trình kết nối nhé.",
  },
  {
    id: "trial-time",
    title: "Hẹn học thử",
    description: "Hỏi thời gian phù hợp",
    content: "Hai bên có thể cho mình biết khung giờ phù hợp để sắp xếp buổi học thử không ạ?",
  },
  {
    id: "follow-up",
    title: "Cập nhật tiến độ",
    description: "Thông báo bước tiếp theo",
    content: "Mình sẽ tổng hợp thông tin và cập nhật lại trong cuộc trò chuyện này.",
  },
] as const;

