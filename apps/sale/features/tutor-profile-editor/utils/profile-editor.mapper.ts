import type { TutorProfileData } from "../../tutor-profile/types/tutor.type";
import type { TutorProfileEditorValues } from "../schemas/profile-editor.schema";
import { normalizeTeachingMode } from "../constants/profile-editor.options";

const listValues = (items: Array<{ value: string }>): string[] =>
  items.map((item) => item.value.trim()).filter(Boolean);

const toListItems = (items?: string[] | null) =>
  (items ?? [])
    .map((value) => ({ value: value.trim() }))
    .filter((item) => item.value.length > 0);

const toAvailabilityItems = (
  slots?: Array<{ day: string; time: string }> | null,
) => {
  if (!slots || slots.length === 0) {
    return [{ day: "Thứ Hai", time: "18:00 - 20:00" }];
  }
  return slots.flatMap((slot) => {
    const days = slot.day.split(",").map((day, index) => {
      const normalizedDay = day.trim();
      return index === 0 ||
        normalizedDay === "Chủ nhật" ||
        normalizedDay.startsWith("Thứ")
        ? normalizedDay
        : `Thứ ${normalizedDay}`;
    });
    return days.map((day) => ({ day, time: slot.time }));
  });
};

export function mapTutorProfileToEditorValues(
  tutor: TutorProfileData,
): TutorProfileEditorValues {
  const introParagraphs = (tutor.introduction || "")
    .split("\n\n")
    .map((p) => p.trim())
    .filter(Boolean);

  const subjects = toListItems(tutor.subjects);
  const specializations = toListItems(tutor.specializations);
  const achievements = (tutor.achievements || []).map((item) => ({
    value: item.title,
  }));

  const certificates =
    tutor.achievements && tutor.achievements.length > 0
      ? tutor.achievements.map((item) => ({
          id: item.id || undefined,
          title: item.title || "",
          type: item.type || "CERTIFICATE",
          issuer: item.issuer || "",
          score: item.score || "",
          startDate: item.startDate || "",
          endDate: item.endDate || "",
          description: item.description || "",
          imageUrl: item.imageUrl || "",
          status: item.status || "Đã xác minh",
        }))
      : [];

  const teachingMethods =
    tutor.teachingMethods && tutor.teachingMethods.length > 0
      ? tutor.teachingMethods.map((item) => ({
          title: item.title || "",
          description: item.description || "",
        }))
      : [];

  const teachingHistory =
    tutor.teachingHistory && tutor.teachingHistory.length > 0
      ? tutor.teachingHistory.map((item) => ({
          id: item.id || undefined,
          title: item.title || "",
          organization: item.organization || "",
          startDate: item.startDate || "",
          endDate: item.endDate || "",
          isCurrent: Boolean(item.isCurrent),
          detail: item.detail || "",
          outcome: item.outcome || "",
        }))
      : [];

  const rawHourlyRate = (tutor as unknown as Record<string, unknown>).hourlyRate;
  const hourlyRateDisplay =
    typeof rawHourlyRate === "number" && rawHourlyRate > 0
      ? `${rawHourlyRate.toLocaleString("vi-VN")}đ/giờ`
      : typeof rawHourlyRate === "string" && rawHourlyRate.trim()
        ? rawHourlyRate.trim()
        : "";

  return {
    displayName: tutor.displayName || "",
    avatarUrl: tutor.avatarUrl || "",
    headline: tutor.headline || "",
    shortIntro: tutor.shortIntro || "",
    university: tutor.university || "",
    major: tutor.major || "",
    studentYear: tutor.studentYear || "",
    subjects,
    specializations,
    teachingModes: [
      { value: normalizeTeachingMode(tutor.teachingModes || ["Online"]) },
    ],
    area: tutor.area || "",
    hourlyRate: hourlyRateDisplay,
    availability: toAvailabilityItems(tutor.availability),
    experienceYears: tutor.experienceYears ? String(tutor.experienceYears) : "",
    introduction: introParagraphs.map((value) => ({ value })),
    teachingMethods,
    education: [
      {
        value: [tutor.major, tutor.university].filter(Boolean).join(", "),
      },
      { value: tutor.studentYear || "" },
    ].filter((item) => item.value.trim().length > 0),
    achievements,
    teachingHistory,
    certificates,
  };
}

export function mapEditorValuesToTutorProfile(
  values: TutorProfileEditorValues,
  baseTutor?: Partial<TutorProfileData>,
): TutorProfileData {
  return {
    id: baseTutor?.id || "preview-tutor-profile",
    userId: baseTutor?.userId,
    displayName: values.displayName,
    dateOfBirth: baseTutor?.dateOfBirth || "2000-01-01",
    gender: baseTutor?.gender || "female",
    introduction: listValues(values.introduction).join("\n\n"),
    avatarUrl: values.avatarUrl || "/images/Tutor/1.png",
    videoUrl: baseTutor?.videoUrl,
    headline: values.headline,
    shortIntro: values.shortIntro,
    university: values.university,
    major: values.major,
    studentYear: values.studentYear,
    rating: baseTutor?.rating ?? 5.0,
    reviewCount: baseTutor?.reviewCount ?? 0,
    responseTime: baseTutor?.responseTime || "Thường phản hồi trong 15 phút",
    teachingHours: baseTutor?.teachingHours || "0+ giờ dạy đã duyệt",
    subjects: listValues(values.subjects),
    specializations: listValues(values.specializations),
    teachingModes: listValues(values.teachingModes),
    area: values.area,
    hourlyRate:
      typeof values.hourlyRate === "number"
        ? values.hourlyRate
        : parseInt(values.hourlyRate.replace(/\D/g, ""), 10) || 150000,
    availability: values.availability.map((slot) => ({ ...slot })),
    experienceYears: values.experienceYears,
    achievements: values.certificates.map((item) => ({
      id: item.id,
      title: item.title,
      type: item.type,
      issuer: item.issuer,
      score: item.score,
      startDate: item.startDate,
      endDate: item.endDate,
      imageUrl: item.imageUrl,
      status: item.status,
      description: item.description,
    })),
    teachingMethods: values.teachingMethods.map((item) => ({ ...item })),
    teachingHistory: values.teachingHistory.map((item) => ({ ...item })),
    reviews: baseTutor?.reviews || [],
  };
}

