import type { TutorProfileFormValues } from "../schemas/profile-registration.schema";

function normalizeDraftValue(value: unknown): unknown {
  if (typeof value === "string") return value.trim() === "" ? null : value;
  if (typeof value === "number" && !Number.isFinite(value)) return null;
  if (Array.isArray(value)) {
    return value.map(normalizeDraftValue).filter((item) => item !== null);
  }
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => [key, normalizeDraftValue(item)]),
    );
  }
  return value;
}

export function buildTutorProfileDraftPayload(
  profile: TutorProfileFormValues,
): Record<string, unknown> {
  const payload = normalizeDraftValue(profile) as Record<string, unknown>;
  if (!profile.gender) delete payload.gender;
  if (profile.universityId) {
    payload.universityId = profile.universityId;
    payload.university_id = profile.universityId;
  }
  if (profile.majorId) {
    payload.majorId = profile.majorId;
    payload.major_id = profile.majorId;
  }
  const teachingMethods = profile.teachingMethods.filter(
    ({ title, description }) => title.trim() || description.trim(),
  );

  if (teachingMethods.length === 0) {
    delete payload.teachingMethods;
  } else {
    payload.teachingMethods = normalizeDraftValue(teachingMethods);
  }

  return payload;
}
