import { z } from "zod";
import {
  isEligibleBirthDate,
  MIN_TUTOR_AGE,
  parseBirthDate,
} from "../utils/birth-date";
import { STUDENT_YEAR_VALUES } from "../constants/student-year.constants";

const requiredText = (label: string, minimum = 2) =>
  z.string().trim().min(minimum, `${label} cần ít nhất ${minimum} ký tự.`);
const requiredUrl = (label: string) =>
  z
    .string()
    .trim()
    .min(1, `Vui lòng tải lên ${label.toLowerCase()}.`)
    .url("Đường dẫn tệp không hợp lệ.");
const optionalUrl = z
  .string()
  .trim()
  .url("Đường dẫn tệp không hợp lệ.")
  .or(z.literal(""));
const dateOfBirthSchema = z.string().superRefine((value, context) => {
  if (!value) {
    context.addIssue({ code: "custom", message: "Vui lòng chọn ngày sinh." });
    return;
  }
  const date = parseBirthDate(value);
  if (!date) {
    context.addIssue({ code: "custom", message: "Ngày sinh không hợp lệ." });
  } else if (!isEligibleBirthDate(date)) {
    context.addIssue({
      code: "custom",
      message: `Gia sư cần từ đủ ${MIN_TUTOR_AGE} tuổi.`,
    });
  }
});

const teachingOfferingSchema = z
  .object({
    id: z.string().uuid().nullable(),
    programId: z.string().uuid("Vui lòng chọn chương trình."),
    programVersionId: z
      .string()
      .uuid("Chương trình chưa có phiên bản được xuất bản."),
    teachingItemId: z.string(),
    contextSelection: z.string(),
    proposedTeachingItemName: z.string().trim(),
    proposedContextName: z.string().trim(),
    proposedContextType: z.enum([
      "GRADE",
      "LEVEL",
      "MAJOR",
      "EXAM_TRACK",
      "CERT_LEVEL",
      "OTHER",
    ]),
    teachingMode: z.enum(["ONLINE", "OFFLINE"]),
    basePrice: z
      .number({ error: "Vui lòng nhập học phí hợp lệ." })
      .positive("Học phí phải lớn hơn 0."),
  })
  .superRefine((offering, context) => {
    if (offering.teachingItemId === "__proposal__") {
      if (offering.proposedTeachingItemName.length < 2) {
        context.addIssue({
          code: "custom",
          path: ["proposedTeachingItemName"],
          message: "Vui lòng nhập tên môn đề xuất.",
        });
      }
    } else if (!z.uuid().safeParse(offering.teachingItemId).success) {
      context.addIssue({
        code: "custom",
        path: ["teachingItemId"],
        message: "Vui lòng chọn môn giảng dạy.",
      });
    }
    if (offering.contextSelection === "__proposal__") {
      if (offering.proposedContextName.length < 2) {
        context.addIssue({
          code: "custom",
          path: ["proposedContextName"],
          message: "Vui lòng nhập cấp học đề xuất.",
        });
      }
    } else if (
      offering.contextSelection !== "__none__" &&
      !z.uuid().safeParse(offering.contextSelection).success
    ) {
      context.addIssue({
        code: "custom",
        path: ["contextSelection"],
        message: "Vui lòng chọn cấp học hoặc ngữ cảnh.",
      });
    }
  });

export type TeachingOfferingFormValue = z.infer<typeof teachingOfferingSchema>;

export const emptyTeachingOffering: TeachingOfferingFormValue = {
  id: null,
  programId: "",
  programVersionId: "",
  teachingItemId: "",
  contextSelection: "",
  proposedTeachingItemName: "",
  proposedContextName: "",
  proposedContextType: "OTHER",
  teachingMode: "ONLINE",
  basePrice: 0,
};

export const tutorProfileFormSchema = z
  .object({
    displayName: requiredText("Tên hiển thị"),
    dateOfBirth: dateOfBirthSchema,
    gender: z
      .enum(["", "male", "female", "others"], {
        message: "Vui lòng chọn giới tính.",
      })
      .refine((value): boolean => value !== "", "Vui lòng chọn giới tính."),
    avatarUrl: requiredUrl("Ảnh đại diện"),
    headline: requiredText("Tiêu đề hồ sơ", 12).max(
      120,
      "Tiêu đề tối đa 120 ký tự.",
    ),
    universityId: z.string().uuid("Vui lòng chọn trường đại học."),
    majorId: z.string().uuid("Vui lòng chọn chuyên ngành."),
    studentYear: z
      .enum(["", ...STUDENT_YEAR_VALUES, "GRATUATED"], {
        message: "Vui lòng chọn năm học / tình trạng học tập.",
      })
      .refine(
        (value): boolean => value !== "",
        "Vui lòng chọn năm học / tình trạng học tập.",
      ),
    studentCardUrl: requiredUrl("Thẻ sinh viên / bằng tốt nghiệp"),
    teachingOfferings: z
      .array(teachingOfferingSchema)
      .min(1, "Vui lòng thêm ít nhất một tổ hợp giảng dạy."),
    introduction: requiredText("Phần giới thiệu", 80).max(
      2000,
      "Phần giới thiệu tối đa 2.000 ký tự.",
    ),
    shortIntro: requiredText("Giới thiệu ngắn", 30).max(
      240,
      "Giới thiệu ngắn tối đa 240 ký tự.",
    ),
    videoUrl: optionalUrl,
    experienceYears: z.number().int().min(0).max(99),
    area: z.string().trim(),
    offlineCity: z.string().trim(),
    offlineDistrict: z.string().trim(),
    offlineWard: z.string().trim(),
    offlineAddressDetail: z.string().trim(),
    travelRadiusKm: z.number().int().min(0).max(100),
    identityDocumentsUrl: requiredUrl("Giấy tờ tùy thân"),
    teachingMethods: z.array(
      z.object({
        title: requiredText("Tên phương pháp"),
        description: requiredText("Mô tả", 10),
      }),
    ),
    achievements: z.array(
      z.object({
        id: z.string().optional(),
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
        id: z.string().optional(),
        title: requiredText("Vai trò giảng dạy"),
        organization: requiredText("Đơn vị giảng dạy"),
        detail: requiredText("Mô tả kinh nghiệm", 10),
        outcome: z.string(),
        startDate: z.string(),
        endDate: z.string(),
        isCurrent: z.boolean(),
      }),
    ),
    specializationIds: z.array(z.string().uuid()),
    teachingModes: z
      .array(z.enum(["ONLINE", "OFFLINE"]))
      .min(1, "Vui lòng chọn hình thức dạy."),
  })
  .superRefine((value, context) => {
    const offeringKeys = value.teachingOfferings.map((item) =>
      [
        item.programVersionId,
        item.teachingItemId === "__proposal__"
          ? item.proposedTeachingItemName.toLowerCase()
          : item.teachingItemId,
        item.contextSelection === "__proposal__"
          ? item.proposedContextName.toLowerCase()
          : item.contextSelection,
        item.teachingMode,
      ].join(":"),
    );
    if (new Set(offeringKeys).size !== offeringKeys.length) {
      context.addIssue({
        code: "custom",
        path: ["teachingOfferings"],
        message:
          "Tổ hợp giảng dạy bị trùng. Hãy thay đổi môn, cấp học hoặc hình thức dạy.",
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

const draftTeachingOfferingSchema = z.object({
  id: draftText,
  programId: draftText,
  programVersionId: draftText,
  teachingItemId: draftText,
  contextId: draftText,
  teachingMode: draftText,
  basePrice: draftNumber,
  proposal: z
    .object({
      teachingItemName: draftText,
      contextName: draftText,
      contextType: draftText,
    })
    .nullish(),
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
    universityId: z.unknown().optional(),
    university_id: z.unknown().optional(),
    university: z.unknown().optional(),
    majorId: z.unknown().optional(),
    major_id: z.unknown().optional(),
    major: z.unknown().optional(),
    studentYear: draftText,
    studentCardUrl: draftText,
    teachingOfferings: z.array(draftTeachingOfferingSchema).nullish(),
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
    teachingMethods: z
      .array(z.object({ title: draftText, description: draftText }))
      .nullish(),
    achievements: z.array(draftAchievementSchema).nullish(),
    teachingHistory: z.array(draftTeachingHistorySchema).nullish(),
    subjectIds: z.unknown().optional(),
    subjects: z.unknown().optional(),
    gradeLevelIds: z.unknown().optional(),
    gradeLevels: z.unknown().optional(),
    specializationIds: z.unknown().optional(),
    specializations: z.unknown().optional(),
    teachingModes: z.array(z.string()).nullish(),
  })
  .passthrough();

export type TutorProfileDraftResponse = z.infer<
  typeof tutorProfileDraftResponseSchema
>;

export const tutorProfileDefaultValues: TutorProfileFormValues = {
  displayName: "",
  dateOfBirth: "",
  gender: "",
  avatarUrl: "",
  headline: "",
  universityId: "",
  majorId: "",
  studentYear: "",
  studentCardUrl: "",
  teachingOfferings: [emptyTeachingOffering],
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
  teachingMethods: [],
  achievements: [],
  teachingHistory: [],
  specializationIds: [],
  teachingModes: ["ONLINE"],
};

function text(value: unknown): string {
  if (value === null || value === undefined) return "";
  return String(value).trim();
}

function date(value: unknown): string {
  return text(value).slice(0, 10);
}

function number(value: number | string | null | undefined): number {
  const parsed = typeof value === "number" ? value : Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function normalizeContextType(
  value: unknown,
): TeachingOfferingFormValue["proposedContextType"] {
  const type = text(value);
  return type === "GRADE" ||
    type === "LEVEL" ||
    type === "MAJOR" ||
    type === "EXAM_TRACK" ||
    type === "CERT_LEVEL"
    ? type
    : "OTHER";
}

function normalizeGender(value: unknown): TutorProfileFormValues["gender"] {
  const normalized = text(value).toLowerCase();
  if (
    normalized === "male" ||
    normalized === "female" ||
    normalized === "others"
  ) {
    return normalized;
  }
  return normalized === "other" ? "others" : "";
}

function normalizeStudentYear(
  value: unknown,
): TutorProfileFormValues["studentYear"] {
  const str = text(value).trim().toUpperCase();
  if (str === "GRATUATED" || str === "GRADUATED") return "GRADUATED";
  if (
    STUDENT_YEAR_VALUES.includes(str as (typeof STUDENT_YEAR_VALUES)[number])
  ) {
    return str as (typeof STUDENT_YEAR_VALUES)[number];
  }
  if (str.includes("NĂM 1") || str.includes("NAM 1") || str === "1")
    return "YEAR_1";
  if (str.includes("NĂM 2") || str.includes("NAM 2") || str === "2")
    return "YEAR_2";
  if (str.includes("NĂM 3") || str.includes("NAM 3") || str === "3")
    return "YEAR_3";
  if (str.includes("NĂM 4") || str.includes("NAM 4") || str === "4")
    return "YEAR_4";
  if (str.includes("NĂM 5") || str.includes("NAM 5") || str === "5")
    return "YEAR_5";
  if (str.includes("NĂM 6") || str.includes("NAM 6") || str === "6")
    return "YEAR_6";
  if (
    str.includes("TỐT NGHIỆP") ||
    str.includes("TOT NGHIEP") ||
    str.includes("GRADUAT")
  ) {
    return "GRADUATED";
  }
  return "";
}

function extractCatalogId(value: unknown): string {
  if (!value) return "";
  if (typeof value === "string") return value.trim();
  if (typeof value === "number") return String(value);
  if (typeof value === "object") {
    const obj = value as Record<string, unknown>;
    if (obj.id) return String(obj.id).trim();
    if (obj._id) return String(obj._id).trim();
    if (obj.value) return String(obj.value).trim();
    if (obj.universityId) return String(obj.universityId).trim();
    if (obj.majorId) return String(obj.majorId).trim();
    if (obj.name && typeof obj.name === "string") return obj.name.trim();
  }
  return "";
}

function extractCatalogIds(value: unknown): string[] {
  if (!value) return [];
  if (Array.isArray(value)) {
    return value
      .map((item) => extractCatalogId(item))
      .filter((id): id is string => Boolean(id));
  }
  const single = extractCatalogId(value);
  return single ? [single] : [];
}

export function mapDraftResponseToFormValues(
  draft: TutorProfileDraftResponse,
): TutorProfileFormValues {
  const teachingModes = (draft.teachingModes ?? []).filter(
    (mode): mode is "ONLINE" | "OFFLINE" =>
      mode === "ONLINE" || mode === "OFFLINE",
  );
  const offerings = (draft.teachingOfferings ?? []).map((item) => ({
    id: text(item.id) || null,
    programId: text(item.programId),
    programVersionId: text(item.programVersionId),
    teachingItemId:
      text(item.teachingItemId) ||
      (text(item.proposal?.teachingItemName) ? "__proposal__" : ""),
    contextSelection:
      text(item.contextId) ||
      (text(item.proposal?.contextName) ? "__proposal__" : "__none__"),
    proposedTeachingItemName: text(item.proposal?.teachingItemName),
    proposedContextName: text(item.proposal?.contextName),
    proposedContextType: normalizeContextType(item.proposal?.contextType),
    teachingMode:
      item.teachingMode === "OFFLINE"
        ? ("OFFLINE" as const)
        : ("ONLINE" as const),
    basePrice: number(item.basePrice),
  }));

  return {
    displayName: text(draft.displayName),
    dateOfBirth: date(draft.dateOfBirth),
    gender: normalizeGender(draft.gender),
    avatarUrl: text(draft.avatarUrl),
    headline: text(draft.headline),
    universityId:
      extractCatalogId(draft.universityId) ||
      extractCatalogId(draft.university) ||
      extractCatalogId(draft.university_id),
    majorId:
      extractCatalogId(draft.majorId) ||
      extractCatalogId(draft.major) ||
      extractCatalogId(draft.major_id),
    studentYear: normalizeStudentYear(draft.studentYear),
    studentCardUrl: text(draft.studentCardUrl),
    teachingOfferings: offerings.length
      ? offerings
      : [{ ...emptyTeachingOffering }],
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
    teachingMethods: (draft.teachingMethods ?? [])
      .filter((item) => text(item.title) || text(item.description))
      .map((item) => ({
        title: text(item.title),
        description: text(item.description),
      })),
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
    specializationIds: [
      ...new Set([
        ...extractCatalogIds(draft.specializationIds),
        ...extractCatalogIds(draft.specializations),
      ]),
    ],
    teachingModes: offerings.length
      ? [...new Set(offerings.map((item) => item.teachingMode))]
      : teachingModes.length
        ? teachingModes
        : ["ONLINE"],
  };
}
