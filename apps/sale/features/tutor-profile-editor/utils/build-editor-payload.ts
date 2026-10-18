import type { TutorProfileData } from "../../tutor-profile/types/tutor.type";
import type { TutorProfileEditorValues } from "../schemas/profile-editor.schema";
import type { ProfileMediaState } from "../types/profile-editor.types";

export function buildTutorProfileEditorPayload(
  profile: TutorProfileEditorValues,
  media: ProfileMediaState,
  baseProfile?: (Partial<TutorProfileData> & Record<string, unknown>) | null,
): Record<string, unknown> {
  const introText = profile.introduction
    .map((item) => item.value.trim())
    .filter(Boolean)
    .join("\n\n");

  const hourlyRateNumber =
    typeof profile.hourlyRate === "number"
      ? profile.hourlyRate
      : parseInt(String(profile.hourlyRate).replace(/\D/g, ""), 10) || 0;

  const preserved: Record<string, unknown> = {};
  if (baseProfile) {
    if (baseProfile.teachingOfferings) preserved.teachingOfferings = baseProfile.teachingOfferings;
    if (baseProfile.dateOfBirth) preserved.dateOfBirth = baseProfile.dateOfBirth;
    if (baseProfile.gender) preserved.gender = baseProfile.gender;
    if (baseProfile.studentCardUrl) preserved.studentCardUrl = baseProfile.studentCardUrl;
    if (baseProfile.identityDocumentsUrl) preserved.identityDocumentsUrl = baseProfile.identityDocumentsUrl;
    if (baseProfile.offlineCity) preserved.offlineCity = baseProfile.offlineCity;
    if (baseProfile.offlineDistrict) preserved.offlineDistrict = baseProfile.offlineDistrict;
    if (baseProfile.offlineWard) preserved.offlineWard = baseProfile.offlineWard;
    if (baseProfile.offlineAddressDetail) preserved.offlineAddressDetail = baseProfile.offlineAddressDetail;
    if (baseProfile.travelRadiusKm !== undefined) preserved.travelRadiusKm = baseProfile.travelRadiusKm;
    if (baseProfile.universityId) preserved.universityId = baseProfile.universityId;
    if (baseProfile.majorId) preserved.majorId = baseProfile.majorId;
    if (baseProfile.specializationIds) preserved.specializationIds = baseProfile.specializationIds;
    if (baseProfile.subjectIds) preserved.subjectIds = baseProfile.subjectIds;
    if (baseProfile.gradeLevelIds) preserved.gradeLevelIds = baseProfile.gradeLevelIds;
  }

  return {
    ...preserved,
    displayName: profile.displayName.trim(),
    avatarUrl: profile.avatarUrl || null,
    videoUrl: media.videoUrl || null,
    headline: profile.headline.trim(),
    shortIntro: profile.shortIntro.trim(),
    university: profile.university.trim(),
    major: profile.major.trim(),
    studentYear: profile.studentYear.trim(),
    subjects: profile.subjects.map((s) => s.value.trim()).filter(Boolean),
    specializations: profile.specializations
      .map((s) => s.value.trim())
      .filter(Boolean),
    teachingModes: profile.teachingModes.map((m) => m.value),
    area: profile.area.trim(),
    hourlyRate: hourlyRateNumber,
    availability: profile.availability.map((slot) => ({
      day: slot.day.trim(),
      time: slot.time.trim(),
    })),
    experienceYears: profile.experienceYears.trim(),
    introduction: introText,
    teachingMethods: profile.teachingMethods.map((m) => ({
      title: m.title.trim(),
      description: m.description.trim(),
    })),
    achievements: profile.certificates.map((c) => ({
      ...(c.id?.trim() ? { id: c.id.trim() } : {}),
      title: c.title.trim(),
      type: c.type.trim() || "CERTIFICATE",
      issuer: c.issuer?.trim() || "",
      score: c.score?.trim() || null,
      startDate: c.startDate?.trim() || null,
      endDate: c.endDate?.trim() || null,
      description: c.description.trim(),
      imageUrl: c.imageUrl || null,
      status: c.status || "Đã xác minh",
    })),
    teachingHistory: profile.teachingHistory.map((h) => ({
      title: h.title.trim(),
      organization: h.organization?.trim() || "",
      startDate: h.startDate?.trim() || null,
      endDate: h.endDate?.trim() || null,
      isCurrent: Boolean(h.isCurrent),
      detail: h.detail.trim(),
      outcome: h.outcome?.trim() || null,
    })),
  };
}
