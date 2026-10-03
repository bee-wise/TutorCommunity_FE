import type { TutorProfileSubmission } from "../schemas/consultant-review.schema";

export type ProfileFieldName = keyof TutorProfileSubmission;

export const profileSections: { title: string; description: string; fields: ProfileFieldName[] }[] = [
  {
    title: "Thông tin cá nhân",
    description: "Nhận diện và giới thiệu của gia sư",
    fields: ["displayName", "dateOfBirth", "gender", "avatarUrl", "headline", "shortIntro", "introduction", "videoUrl"],
  },
  {
    title: "Học vấn và xác minh",
    description: "Thông tin trường, chuyên ngành và tài liệu minh chứng",
    fields: ["universityId", "majorId", "studentYear", "studentCardUrl", "identityDocumentsUrl", "achievements", "teachingHistory"],
  },
  {
    title: "Nội dung và học phí",
    description: "Tổ hợp giảng dạy, môn học và mức phí đề xuất",
    fields: ["teachingOfferings", "subjectIds", "gradeLevelIds", "specializationIds", "hourlyRate"],
  },
  {
    title: "Phương pháp và lịch dạy",
    description: "Cách dạy, kinh nghiệm và thời gian có thể nhận lớp",
    fields: ["teachingModes", "teachingMethods", "availability", "experienceYears"],
  },
  {
    title: "Khu vực và thanh toán",
    description: "Phạm vi dạy trực tiếp và thông tin liên quan",
    fields: ["area", "offlineCity", "offlineDistrict", "offlineWard", "offlineAddressDetail", "travelRadiusKm", "bankInformation"],
  },
];

export const profileFieldLabels: Record<ProfileFieldName, string> = {
  teachingOfferings: "Tổ hợp giảng dạy",
  displayName: "Tên hiển thị",
  dateOfBirth: "Ngày sinh",
  gender: "Giới tính",
  avatarUrl: "Ảnh đại diện",
  headline: "Tiêu đề hồ sơ",
  universityId: "Mã trường đại học",
  majorId: "Mã chuyên ngành",
  studentYear: "Năm học",
  studentCardUrl: "Thẻ sinh viên",
  hourlyRate: "Học phí theo môn",
  introduction: "Giới thiệu chi tiết",
  shortIntro: "Giới thiệu ngắn",
  videoUrl: "Video giới thiệu",
  experienceYears: "Số năm kinh nghiệm",
  area: "Khu vực giảng dạy",
  offlineCity: "Tỉnh / thành phố",
  offlineDistrict: "Quận / huyện",
  offlineWard: "Phường / xã",
  offlineAddressDetail: "Địa chỉ chi tiết",
  travelRadiusKm: "Bán kính di chuyển (km)",
  identityDocumentsUrl: "Giấy tờ tùy thân",
  bankInformation: "Thông tin ngân hàng",
  availability: "Lịch rảnh",
  teachingMethods: "Phương pháp giảng dạy",
  achievements: "Thành tích",
  teachingHistory: "Kinh nghiệm giảng dạy",
  subjectIds: "Mã môn học",
  gradeLevelIds: "Mã khối lớp",
  specializationIds: "Mã chuyên môn",
  teachingModes: "Hình thức dạy",
};

const nestedFieldLabels: Record<string, string> = {
  id: "Mã tổ hợp",
  programVersionId: "Mã phiên bản chương trình",
  teachingItemId: "Mã nội dung dạy",
  contextId: "Mã cấp học",
  teachingMode: "Hình thức dạy",
  basePrice: "Giá cơ bản (VND)",
  proposal: "Đề xuất mới",
  teachingItemName: "Tên nội dung dạy",
  contextName: "Tên cấp học",
  contextType: "Loại cấp học",
  subjectId: "Mã môn học",
  price: "Học phí (VND)",
  day: "Thứ",
  time: "Khung giờ",
  title: "Tiêu đề",
  description: "Mô tả",
  type: "Loại",
  issuer: "Đơn vị cấp",
  score: "Kết quả",
  startDate: "Ngày bắt đầu",
  endDate: "Ngày kết thúc",
  imageUrl: "Ảnh minh chứng",
  organization: "Đơn vị",
  detail: "Chi tiết",
  outcome: "Kết quả",
  isCurrent: "Hiện tại",
};

export function formatReviewDate(value?: string | null): string {
  if (!value) return "Chưa có";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? value
    : new Intl.DateTimeFormat("vi-VN", { dateStyle: "medium", timeStyle: "short" }).format(date);
}

export function readableFieldName(value?: string | null): string {
  if (!value) return "Trường dữ liệu";
  if (value in profileFieldLabels) return profileFieldLabels[value as ProfileFieldName];
  return nestedFieldLabels[value] ?? value.replace(/([a-z])([A-Z])/g, "$1 $2");
}

export function safeDocumentUrl(value: string): string | null {
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:" ? url.href : null;
  } catch {
    return null;
  }
}
