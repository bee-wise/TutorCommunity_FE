import { z } from "zod";

const requiredText = (label: string, minimum = 2) =>
  z.string().trim().min(minimum, `${label} cần ít nhất ${minimum} ký tự.`);
const optionalUrl = z.string().trim().url("Đường dẫn tệp không hợp lệ.").or(z.literal(""));
const timeRangeSchema = z
  .string()
  .regex(/^([01]\d|2[0-3]):[0-5]\d-([01]\d|2[0-3]):[0-5]\d$/, "Khung giờ không hợp lệ.")
  .refine((value) => {
    const [start = "", end = ""] = value.split("-");
    return start < end;
  }, "Giờ kết thúc phải sau giờ bắt đầu.");

export const hourlyRateSchema = z.object({
  subjectId: z.string().uuid("Môn dạy không hợp lệ."),
  price: z.number().positive("Học phí phải lớn hơn 0."),
});

export const tutorProfileFormSchema = z
  .object({
    displayName: requiredText("Tên hiển thị"),
    dateOfBirth: z.string().min(1, "Vui lòng chọn ngày sinh."),
    gender: z.enum(["MALE", "FEMALE", "OTHER"], {
      message: "Vui lòng chọn giới tính.",
    }),
    avatarUrl: optionalUrl,
    headline: requiredText("Tiêu đề hồ sơ", 12).max(120, "Tiêu đề tối đa 120 ký tự."),
    universityId: z.string().uuid("Vui lòng chọn trường đại học."),
    majorId: z.string().uuid("Vui lòng chọn chuyên ngành."),
    studentYear: requiredText("Năm học"),
    studentCardUrl: optionalUrl,
    hourlyRate: z.array(hourlyRateSchema).min(1, "Vui lòng chọn ít nhất một môn dạy."),
    introduction: requiredText("Phần giới thiệu", 80).max(2000, "Phần giới thiệu tối đa 2.000 ký tự."),
    shortIntro: requiredText("Giới thiệu ngắn", 30).max(240, "Giới thiệu ngắn tối đa 240 ký tự."),
    videoUrl: optionalUrl,
    experienceYears: z.number().int().min(0).max(99),
    area: z.string().trim(),
    offlineCity: z.string().trim(),
    offlineDistrict: z.string().trim(),
    offlineWard: z.string().trim(),
    offlineAddressDetail: z.string().trim(),
    travelRadiusKm: z.number().int().min(0).max(100),
    identityDocumentsUrl: optionalUrl,
    bankInformation: z.string().trim(),
    availability: z.array(
      z.object({ day: requiredText("Ngày"), time: timeRangeSchema }),
    ),
    teachingMethods: z
      .array(z.object({ title: requiredText("Tên phương pháp"), description: requiredText("Mô tả", 10) }))
      .min(1, "Vui lòng thêm ít nhất một phương pháp giảng dạy."),
    achievements: z.array(
      z.object({
        id: z.string().uuid(),
        type: requiredText("Loại thành tích"),
        title: requiredText("Tên thành tích"),
        issuer: requiredText("Đơn vị cấp"),
        score: z.string(),
        startDate: z.string(),
        endDate: z.string(),
        imageUrl: optionalUrl,
        description: z.string(),
      }),
    ),
    teachingHistory: z.array(
      z.object({
        id: z.string().uuid(),
        title: requiredText("Vai trò giảng dạy"),
        organization: requiredText("Đơn vị giảng dạy"),
        detail: requiredText("Mô tả kinh nghiệm", 10),
        outcome: z.string(),
        startDate: z.string(),
        endDate: z.string(),
        isCurrent: z.boolean(),
      }),
    ),
    subjectIds: z.array(z.string().uuid()).min(1, "Vui lòng chọn ít nhất một môn dạy."),
    gradeLevelIds: z.array(z.string().uuid()).min(1, "Vui lòng chọn ít nhất một cấp học."),
    specializationIds: z.array(z.string().uuid()),
    teachingModes: z.array(z.enum(["ONLINE", "OFFLINE"])).min(1, "Vui lòng chọn hình thức dạy."),
  })
  .superRefine((value, context) => {
    const rateSubjects = value.hourlyRate.map((item) => item.subjectId);
    const uniqueRateSubjects = new Set(rateSubjects);
    if (
      uniqueRateSubjects.size !== value.subjectIds.length ||
      value.subjectIds.some((id) => !uniqueRateSubjects.has(id))
    ) {
      context.addIssue({
        code: "custom",
        path: ["hourlyRate"],
        message: "Mỗi môn dạy phải có đúng một mức học phí.",
      });
    }
    if (
      value.teachingModes.includes("OFFLINE") &&
      value.offlineCity.trim().length < 2
    ) {
      context.addIssue({
        code: "custom",
        path: ["offlineCity"],
        message: "Vui lòng chọn tỉnh hoặc thành phố khi dạy trực tiếp.",
      });
    }
  });

export type TutorProfileFormValues = z.infer<typeof tutorProfileFormSchema>;

const draftText = z.string().nullish();
const draftNumber = z.union([z.number(), z.string()]).nullish();

const draftHourlyRateSchema = z.object({
  subjectId: draftText,
  price: draftNumber,
});

const draftAchievementSchema = z.object({
  id: draftText,
  type: draftText,
  title: draftText,
  issuer: draftText,
  score: draftText,
  startDate: draftText,
  endDate: draftText,
  imageUrl: draftText,
  description: draftText,
});

const draftTeachingHistorySchema = z.object({
  id: draftText,
  title: draftText,
  organization: draftText,
  detail: draftText,
  outcome: draftText,
  startDate: draftText,
  endDate: draftText,
  isCurrent: z.boolean().nullish(),
});

export const tutorProfileDraftResponseSchema = z
  .object({
    displayName: draftText,
    dateOfBirth: draftText,
    gender: draftText,
    avatarUrl: draftText,
    headline: draftText,
    universityId: draftText,
    majorId: draftText,
    studentYear: draftText,
    studentCardUrl: draftText,
    hourlyRate: z.array(draftHourlyRateSchema).nullish(),
    hourlyRates: z.array(draftHourlyRateSchema).nullish(),
    introduction: draftText,
    shortIntro: draftText,
    videoUrl: draftText,
    experienceYears: draftNumber,
    area: draftText,
    offlineCity: draftText,
    offlineDistrict: draftText,
    offlineWard: draftText,
    offlineAddressDetail: draftText,
    travelRadiusKm: draftNumber,
    identityDocumentsUrl: draftText,
    bankInformation: draftText,
    availability: z
      .array(z.object({ day: draftText, time: draftText }))
      .nullish(),
    teachingMethods: z
      .array(z.object({ title: draftText, description: draftText }))
      .nullish(),
    achievements: z.array(draftAchievementSchema).nullish(),
    teachingHistory: z.array(draftTeachingHistorySchema).nullish(),
    subjectIds: z.array(z.string()).nullish(),
    gradeLevelIds: z.array(z.string()).nullish(),
    specializationIds: z.array(z.string()).nullish(),
    teachingModes: z.array(z.string()).nullish(),
  })
  .passthrough();

export type TutorProfileDraftResponse = z.infer<
  typeof tutorProfileDraftResponseSchema
>;

export const tutorProfileDefaultValues: TutorProfileFormValues = {
  displayName: "",
  dateOfBirth: "",
  gender: "OTHER",
  avatarUrl: "",
  headline: "",
  universityId: "",
  majorId: "",
  studentYear: "",
  studentCardUrl: "",
  hourlyRate: [],
  introduction: "",
  shortIntro: "",
  videoUrl: "",
  experienceYears: 0,
  area: "",
  offlineCity: "",
  offlineDistrict: "",
  offlineWard: "",
  offlineAddressDetail: "",
  travelRadiusKm: 0,
  identityDocumentsUrl: "",
  bankInformation: "",
  availability: [],
  teachingMethods: [{ title: "", description: "" }],
  achievements: [],
  teachingHistory: [],
  subjectIds: [],
  gradeLevelIds: [],
  specializationIds: [],
  teachingModes: ["ONLINE"],
};

function text(value: string | null | undefined): string {
  return value?.trim() ?? "";
}

function date(value: string | null | undefined): string {
  return text(value).slice(0, 10);
}

function number(value: number | string | null | undefined): number {
  const parsed = typeof value === "number" ? value : Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

export function mapDraftResponseToFormValues(
  draft: TutorProfileDraftResponse,
): TutorProfileFormValues {
  const gender = draft.gender?.trim().toUpperCase();
  const teachingModes = (draft.teachingModes ?? []).filter(
    (mode): mode is "ONLINE" | "OFFLINE" =>
      mode === "ONLINE" || mode === "OFFLINE",
  );
  const rates = draft.hourlyRate ?? draft.hourlyRates ?? [];

  return {
    displayName: text(draft.displayName),
    dateOfBirth: date(draft.dateOfBirth),
    gender:
      gender === "MALE" || gender === "FEMALE" || gender === "OTHER"
        ? gender
        : "OTHER",
    avatarUrl: text(draft.avatarUrl),
    headline: text(draft.headline),
    universityId: text(draft.universityId),
    majorId: text(draft.majorId),
    studentYear: text(draft.studentYear),
    studentCardUrl: text(draft.studentCardUrl),
    hourlyRate: rates
      .filter((item) => Boolean(item.subjectId))
      .map((item) => ({
        subjectId: text(item.subjectId),
        price: number(item.price),
      })),
    introduction: text(draft.introduction),
    shortIntro: text(draft.shortIntro),
    videoUrl: text(draft.videoUrl),
    experienceYears: number(draft.experienceYears),
    area: text(draft.area),
    offlineCity: text(draft.offlineCity),
    offlineDistrict: text(draft.offlineDistrict),
    offlineWard: text(draft.offlineWard),
    offlineAddressDetail: text(draft.offlineAddressDetail),
    travelRadiusKm: number(draft.travelRadiusKm),
    identityDocumentsUrl: text(draft.identityDocumentsUrl),
    bankInformation: text(draft.bankInformation),
    availability: (draft.availability ?? [])
      .filter((item) => Boolean(item.day) || Boolean(item.time))
      .map((item) => ({ day: text(item.day), time: text(item.time) })),
    teachingMethods:
      draft.teachingMethods?.length
        ? draft.teachingMethods.map((item) => ({
            title: text(item.title),
            description: text(item.description),
          }))
        : [{ title: "", description: "" }],
    achievements: (draft.achievements ?? []).map((item) => ({
      id: text(item.id),
      type: text(item.type),
      title: text(item.title),
      issuer: text(item.issuer),
      score: text(item.score),
      startDate: date(item.startDate),
      endDate: date(item.endDate),
      imageUrl: text(item.imageUrl),
      description: text(item.description),
    })),
    teachingHistory: (draft.teachingHistory ?? []).map((item) => ({
      id: text(item.id),
      title: text(item.title),
      organization: text(item.organization),
      detail: text(item.detail),
      outcome: text(item.outcome),
      startDate: date(item.startDate),
      endDate: date(item.endDate),
      isCurrent: item.isCurrent ?? false,
    })),
    subjectIds: draft.subjectIds ?? [],
    gradeLevelIds: draft.gradeLevelIds ?? [],
    specializationIds: draft.specializationIds ?? [],
    teachingModes: teachingModes.length ? teachingModes : ["ONLINE"],
  };
}
