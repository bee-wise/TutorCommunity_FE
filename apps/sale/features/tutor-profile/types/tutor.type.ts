import { ApiResponse } from "@workspace/core/types/api-response.type";

export interface TutorAvailabilitySlot {
  day: string;
  time: string;
}

export interface TutorAchievementItem {
  title: string;
  type: string;
  imageUrl?: string;
  status?: string;
  description: string;
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

export interface TutorReviewItem {
  author: string;
  relationship: string;
  rating: number;
  quote: string;
}

export interface TutorProfileData {
  id: string;
  displayName: string; // tên hiển thị
  dateOfBirth: string;
  gender: string; // male, female, others
  introduction: string; // giới thiệu
  avatarUrl: string; // avatar
  videoUrl?: string; // video giới thiệu
  headline: string;
  shortIntro: string; // giới thiệu ngắn
  university: string; // tên trường đã học
  major: string; // tên ngành đã học
  studentYear: string; // năm học
  rating: number; // đánh giá
  reviewCount: number; // số lượt đánh giá
  responseTime: string; // thời gian phản hồi học viên
  teachingHours: string; // số giờ đã dạy
  subjects: string[]; // môn có thể dạy
  specializations: string[]; // chuyên môn, VD: dạy kèm 1:1, luyện thi chứng chỉ QT,...
  teachingModes: string[]; // trả về option: online, tại nhà, online và tại nhà
  area: string; // khu vực dạy
  hourlyRate: number; // lấy min học phí của gia sư đó
  availability: TutorAvailabilitySlot[]; // thời gian rãnh có thể dạy
  experienceYears: string; // số năm kinh nghiệm
  achievements: TutorAchievementItem[]; // thành tựu
  teachingMethods: TeachingMethod[]; // phương pháp dạy
  teachingHistory: TeachingHistoryItem[]; // lịch sử các lớp đã dạy
  reviews: TutorReviewItem[]; // danh sách các review từ learner hoặc phụ huynh
}

export type GetTutorDetailResponse = ApiResponse<TutorProfileData>;
