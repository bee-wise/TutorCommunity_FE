import { STUDENT_YEAR_OPTIONS } from "../../tutor-profile-registration/constants/student-year.constants";
import {
  tutorProfileDefaultValues,
  type TutorProfileFormValues,
} from "../../tutor-profile-registration/schemas/profile-registration.schema";
import type { TutorProfileData } from "../../tutor-profile/types/tutor.type";

export interface CatalogNames {
  university?: string;
  major?: string;
}

const TEACHING_MODE_LABELS = { ONLINE: "Online", OFFLINE: "Tại nhà" } as const;

const emptyPreviewBase: TutorProfileData = {
  id: "",
  displayName: "",
  dateOfBirth: "",
  gender: "",
  introduction: "",
  avatarUrl: "",
  headline: "",
  shortIntro: "",
  university: "",
  major: "",
  studentYear: "",
  rating: 0,
  reviewCount: 0,
  responseTime: "",
  teachingHours: "",
  specializations: [],
  teachingModes: [],
  area: "",
  hourlyRate: 0,
  availability: [],
  experienceYears: "",
  achievements: [],
  teachingMethods: [],
  teachingHistory: [],
  reviews: [],
};

function studentYearLabel(value: string): string {
  if (value === "GRADUATED") return value;
  return STUDENT_YEAR_OPTIONS.find((item) => item.value === value)?.label ?? value;
}

function startingRate(values: TutorProfileFormValues, fallback: number): number {
  const prices = values.teachingOfferings
    .map((item) => item.basePrice)
    .filter((price) => Number.isFinite(price) && price > 0);
  return prices.length ? Math.min(...prices) : fallback;
}

/** Seeds the draft form for the local preview (no signed-in tutor). */
export function seedDraftFromTutor(tutor: TutorProfileData): TutorProfileFormValues {
  return {
    ...tutorProfileDefaultValues,
    displayName: tutor.displayName,
    avatarUrl: tutor.avatarUrl,
    headline: tutor.headline,
    shortIntro: tutor.shortIntro,
    introduction: tutor.introduction,
    videoUrl: tutor.videoUrl ?? "",
    experienceYears: Number.parseInt(tutor.experienceYears, 10) || 0,
    area: tutor.area,
    teachingMethods: tutor.teachingMethods.map((item) => ({ ...item })),
    achievements: tutor.achievements.map((item) => ({
      id: item.id ?? "",
      type: item.type,
      title: item.title,
      issuer: item.issuer ?? "",
      score: item.score ?? "",
      startDate: item.startDate ?? "",
      endDate: item.endDate ?? "",
      imageUrl: item.imageUrl ?? "",
      description: item.description,
    })),
    teachingHistory: tutor.teachingHistory.map((item) => ({
      id: item.id ?? "",
      title: item.title,
      organization: item.organization ?? "",
      detail: item.detail,
      outcome: item.outcome ?? "",
      startDate: item.startDate ?? "",
      endDate: item.endDate ?? "",
      isCurrent: Boolean(item.isCurrent),
    })),
  };
}

/**
 * Builds the read-only profile preview from the public profile plus the draft.
 * Catalog-backed fields (university, major, offerings) are drafted as ids, so
 * their display names come from the public profile or the resolved catalog names.
 */
export function mapDraftToPreview(
  values: TutorProfileFormValues,
  base: TutorProfileData | undefined,
  names: CatalogNames,
): TutorProfileData {
  const source = base ?? emptyPreviewBase;
  const publicAchievements = new Map(
    source.achievements.map((item) => [item.id, item]),
  );

  return {
    ...source,
    displayName: values.displayName || source.displayName,
    avatarUrl: values.avatarUrl || source.avatarUrl,
    videoUrl: values.videoUrl || undefined,
    headline: values.headline,
    shortIntro: values.shortIntro,
    introduction: values.introduction,
    university: names.university ?? source.university,
    major: names.major ?? source.major,
    studentYear: values.studentYear
      ? studentYearLabel(values.studentYear)
      : source.studentYear,
    teachingModes: values.teachingModes.map((mode) => TEACHING_MODE_LABELS[mode]),
    area: values.area || source.area,
    hourlyRate: startingRate(values, source.hourlyRate),
    experienceYears: String(values.experienceYears),
    achievements: values.achievements.map((item) => ({
      id: item.id || undefined,
      title: item.title,
      type: item.type,
      issuer: item.issuer || undefined,
      score: item.score || undefined,
      startDate: item.startDate || undefined,
      endDate: item.endDate || undefined,
      imageUrl: item.imageUrl || undefined,
      description: item.description,
      status: item.id ? publicAchievements.get(item.id)?.status : undefined,
    })),
    teachingMethods: values.teachingMethods.map((item) => ({ ...item })),
    teachingHistory: values.teachingHistory.map((item) => ({
      id: item.id || undefined,
      title: item.title,
      organization: item.organization || undefined,
      detail: item.detail,
      outcome: item.outcome || undefined,
      startDate: item.startDate || undefined,
      endDate: item.endDate || undefined,
      isCurrent: item.isCurrent,
    })),
  };
}
