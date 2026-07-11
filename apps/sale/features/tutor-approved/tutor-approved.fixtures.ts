import type { TutorApprovedScenario, TutorApprovedState } from "./tutor-approved.types";

const profile = {
  fullName: "Nguyễn Minh Anh",
  firstName: "Minh Anh",
  email: "minh.anh@beewise.test",
  avatarUrl: "",
  title: "Gia sư Toán THCS và THPT",
  introduction: "Đồng hành cùng học sinh xây nền tảng vững chắc và tự tin chinh phục mục tiêu.",
  description: "Mình thiết kế lộ trình cá nhân hóa, chú trọng tư duy và phản hồi sau mỗi buổi học.",
  university: "Đại học Sư phạm TP.HCM",
  major: "Sư phạm Toán",
  subjects: ["Toán"],
  gradeLevels: ["Lớp 6–12"],
  teachingMode: "Online và Offline",
  offlineAreas: ["Quận 1", "Quận 3", "Bình Thạnh"],
  rate: "150.000 VNĐ / buổi",
  teachingMethod: "Chẩn đoán lỗ hổng, cá nhân hóa lộ trình và luyện tập theo mục tiêu.",
  experience: "3 năm gia sư Toán THCS, THPT và luyện thi vào lớp 10.",
  certificates: ["Chứng chỉ nghiệp vụ sư phạm"],
  awards: ["Sinh viên giỏi năm 2025"],
  rating: 4.9,
  reviewCount: 18,
};

const chats = [
  { id: "nam-toan-9", learnerName: "Nguyễn Hoàng Nam", learnerInitials: "NN", subject: "Toán", gradeLevel: "Lớp 9", mode: "Online · Buổi tối", consultantName: "Trần Thu Hà", lastMessage: "Em muốn bắt đầu học thử vào tuần sau.", time: "10 phút trước", unread: 2, status: "Đang trao đổi" },
  { id: "thu-toan-7", learnerName: "Lê Minh Thư", learnerInitials: "LT", subject: "Toán", gradeLevel: "Lớp 7", mode: "Offline", consultantName: "Phạm Minh Tuấn", lastMessage: "Gia đình có thể học tối thứ Tư.", time: "Hôm qua", unread: 0, status: "Đang trao đổi" },
  { id: "han-luyen-thi", learnerName: "Trần Gia Hân", learnerInitials: "TH", subject: "Ôn thi vào 10", gradeLevel: "Lớp 9", mode: "Online", consultantName: "Trần Thu Hà", lastMessage: "Consultant đã tham gia phòng chat.", time: "2 ngày trước", unread: 1, status: "Mới kết nối" },
];

const notifications = [
  { id: "n1", type: "message" as const, title: "Tin nhắn mới", description: "Bạn có tin nhắn mới từ Nguyễn Hoàng Nam.", time: "10 phút trước", read: false, actionLabel: "Mở Chat Room" },
  { id: "n2", type: "connection" as const, title: "Kết nối mới", description: "Một Learner vừa kết nối với hồ sơ của bạn.", time: "1 giờ trước", read: false, actionLabel: "Xem chi tiết" },
  { id: "n3", type: "profile" as const, title: "Hồ sơ đã được cập nhật", description: "Thay đổi hồ sơ của bạn đã được phê duyệt.", time: "Hôm qua", read: true, actionLabel: "Xem hồ sơ" },
  { id: "n4", type: "listing" as const, title: "Gói hiển thị sắp hết hạn", description: "Gói hiển thị của bạn sẽ hết hạn sau 7 ngày.", time: "2 ngày trước", read: false, actionLabel: "Gia hạn gói" },
  { id: "n5", type: "class" as const, title: "Lớp học đã kích hoạt", description: "Lớp Toán 9 đã được kích hoạt.", time: "3 ngày trước", read: true, actionLabel: "Vào LMS" },
];

export function createTutorApprovedState(scenario: TutorApprovedScenario): TutorApprovedState {
  const expired = scenario === "listing-expired";
  const expiring = scenario === "listing-expiring";
  const noConnections = scenario === "no-connections";
  return {
    scenario,
    permissions: {
      isProfileApproved: true,
      isListingActive: !expired,
      isProfilePublic: !expired,
      canReceiveNewConnections: !expired,
      postApprovalCompleted: true,
      canAccessTutorLms: true,
    },
    listingStatus: expired ? "EXPIRED" : expiring ? "EXPIRING_SOON" : "ACTIVE",
    listingStart: "01/07/2026",
    listingEnd: expiring || expired ? "18/07/2026" : "01/01/2027",
    daysRemaining: expired ? 0 : expiring ? 7 : 174,
    profile,
    draftProfile: { ...profile, subjects: [...profile.subjects], gradeLevels: [...profile.gradeLevels], offlineAreas: [...profile.offlineAreas] },
    chats: noConnections ? [] : scenario === "active-chats" ? chats : chats.slice(0, 2),
    notifications,
    availability: [
      { id: "mon", day: "Thứ Hai", start: "18:00", end: "21:00", mode: "Online" },
      { id: "wed", day: "Thứ Tư", start: "18:00", end: "21:00", mode: "Online và Offline" },
      { id: "sat", day: "Thứ Bảy", start: "08:00", end: "12:00", mode: "Offline" },
    ],
    renewalOpen: scenario === "subscription-renewal",
    renewalConfirmed: false,
    profileSubmitted: false,
  };
}
