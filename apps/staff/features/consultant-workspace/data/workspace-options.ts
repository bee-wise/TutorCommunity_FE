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
  "Chào bạn, mình là tư vấn viên BeeWise. Mình sẽ hỗ trợ hai bên trong quá trình kết nối nhé.",
  "Hai bên có thể cho mình biết khung giờ phù hợp để sắp xếp buổi học thử không ạ?",
  "Mình sẽ tổng hợp thông tin và cập nhật lại trong cuộc trò chuyện này.",
];

export const widgetPreviews = [
  { title: "Đề xuất học thử", detail: "Chọn thời gian và hình thức học" },
  { title: "Điều khoản lớp học", detail: "Tổng hợp lịch học và học phí" },
  { title: "Theo dõi lớp học", detail: "Cập nhật tiến độ sau kết nối" },
];
