import type { TutorProfileFormValues } from "../schemas/profile-registration.schema";
import { buildTutorProfileDraftPayload } from "./build-draft-payload";

const profileFields = [
  "displayName", "dateOfBirth", "gender", "avatarUrl", "headline",
  "universityId", "majorId", "studentYear", "studentCardUrl",
  "teachingOfferings", "introduction", "shortIntro", "videoUrl",
  "experienceYears", "area", "offlineCity", "offlineDistrict",
  "offlineWard", "offlineAddressDetail", "travelRadiusKm",
  "identityDocumentsUrl", "teachingMethods", "achievements",
  "teachingHistory", "specializationIds", "teachingModes",
] as const;

type ProfileField = (typeof profileFields)[number];
export type TutorProfileReviewPatch = Partial<Record<ProfileField, unknown>>;

function normalizedPayload(values: TutorProfileFormValues): TutorProfileReviewPatch {
  const payload = buildTutorProfileDraftPayload(values);
  return Object.fromEntries(profileFields.map((field) => [
    field,
    field === "teachingMethods" ? (payload[field] ?? []) : payload[field],
  ])) as TutorProfileReviewPatch;
}

export function buildTutorProfileReviewPatch(
  current: TutorProfileFormValues,
  original: TutorProfileFormValues,
): TutorProfileReviewPatch {
  const currentPayload = normalizedPayload(current);
  const originalPayload = normalizedPayload(original);
  return Object.fromEntries(profileFields
    .filter((field) => JSON.stringify(currentPayload[field]) !== JSON.stringify(originalPayload[field]))
    .map((field) => [field, currentPayload[field]])) as TutorProfileReviewPatch;
}
