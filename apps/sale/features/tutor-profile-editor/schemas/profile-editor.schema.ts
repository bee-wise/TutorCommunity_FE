import { z } from "zod";
import { TEACHING_MODE_VALUES } from "../constants/profile-editor.options";

const requiredText = (label: string, minimum = 2) =>
  z.string().trim().min(minimum, `${label} cần ít nhất ${minimum} ký tự.`);

const listItemSchema = z.object({ value: requiredText("Nội dung") });

const requiredList = (label: string) =>
  z.array(listItemSchema).min(1, `Cần có ít nhất một ${label.toLowerCase()}.`);

export const tutorProfileEditorSchema = z.object({
  displayName: requiredText("Họ và tên"),
  avatarUrl: z.string(),
  headline: requiredText("Tiêu đề hồ sơ", 12).max(
    120,
    "Tiêu đề hồ sơ tối đa 120 ký tự.",
  ),
  shortIntro: requiredText("Giới thiệu ngắn", 30).max(
    240,
    "Giới thiệu ngắn tối đa 240 ký tự.",
  ),
  university: requiredText("Trường học"),
  major: requiredText("Chuyên ngành"),
  studentYear: requiredText("Tình trạng học tập"),
  subjects: requiredList("Môn giảng dạy"),
  specializations: z.array(listItemSchema),
  teachingModes: z
    .array(z.object({ value: z.enum(TEACHING_MODE_VALUES) }))
    .length(1, "Vui lòng chọn một hình thức dạy."),
  area: requiredText("Khu vực dạy"),
  hourlyRate: requiredText("Học phí"),
  availability: z
    .array(
      z.object({
        day: requiredText("Ngày dạy"),
        time: requiredText("Khung giờ"),
      }),
    )
    .min(1, "Cần có ít nhất một lịch rảnh."),
  experienceYears: requiredText("Số năm kinh nghiệm"),
  introduction: requiredList("Đoạn giới thiệu"),
  teachingMethods: z.array(
    z.object({
      title: requiredText("Tên phương pháp"),
      description: requiredText("Mô tả phương pháp", 10),
    }),
  ),
  education: requiredList("Thông tin học vấn"),
  achievements: z.array(listItemSchema),
  teachingHistory: z.array(
    z.object({
      title: requiredText("Tên kinh nghiệm"),
      organization: z.string().optional(),
      startDate: z.string().optional(),
      endDate: z.string().optional(),
      isCurrent: z.boolean().optional(),
      detail: requiredText("Mô tả kết quả", 10),
      outcome: z.string().optional(),
    }),
  ),
  certificates: z.array(
    z.object({
      id: z.string().optional(),
      title: requiredText("Tên minh chứng"),
      type: requiredText("Loại minh chứng"),
      issuer: z.string().optional(),
      score: z.string().optional(),
      startDate: z.string().optional(),
      endDate: z.string().optional(),
      imageUrl: z.string(),
      status: requiredText("Trạng thái xác minh"),
      description: requiredText("Mô tả công khai", 10),
    }),
  ),
});

export type TutorProfileEditorValues = z.infer<
  typeof tutorProfileEditorSchema
>;

export type TutorProfileReviewStatus = "PENDING_REVIEW";

export interface TutorProfileMutationResult {
  status: TutorProfileReviewStatus;
  updatedAt: string;
}
