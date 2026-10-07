import type { TutorProfileFormValues } from "../schemas/profile-registration.schema";

function buildTeachingOfferings(profile: TutorProfileFormValues) {
  return profile.teachingOfferings
    .filter((item) =>
      item.programVersionId &&
      (item.teachingItemId === "__proposal__" ? item.proposedTeachingItemName.trim().length >= 2 : Boolean(item.teachingItemId)) &&
      (item.contextSelection === "__proposal__" ? item.proposedContextName.trim().length >= 2 : Boolean(item.contextSelection)) &&
      Number.isFinite(item.basePrice) && item.basePrice > 0,
    )
    .map((item) => {
      const proposal = {
        ...(item.teachingItemId === "__proposal__" ? { teachingItemName: item.proposedTeachingItemName.trim() } : {}),
        ...(item.contextSelection === "__proposal__" ? { contextName: item.proposedContextName.trim(), contextType: item.proposedContextType } : {}),
      };
      return {
        ...(item.id ? { id: item.id } : {}),
        programVersionId: item.programVersionId,
        teachingItemId: item.teachingItemId === "__proposal__" ? null : item.teachingItemId,
        contextId: item.contextSelection === "__none__" || item.contextSelection === "__proposal__" ? null : item.contextSelection,
        teachingMode: item.teachingMode,
        basePrice: item.basePrice,
        ...(Object.keys(proposal).length ? { proposal } : {}),
      };
    });
}

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

function buildAchievements(profile: TutorProfileFormValues) {
  return (profile.achievements ?? [])
    .filter((item) => item.type?.trim() || item.title?.trim() || item.issuer?.trim())
    .map((item) => ({
      ...(item.id?.trim() ? { id: item.id.trim() } : {}),
      type: item.type?.trim() || "CERTIFICATE",
      title: item.title?.trim() || "",
      issuer: item.issuer?.trim() || "",
      score: item.score?.trim() || null,
      startDate: item.startDate?.trim() || null,
      endDate: item.endDate?.trim() || null,
      imageUrl: item.imageUrl?.trim() || null,
      description: item.description?.trim() || null,
    }));
}

function buildTeachingHistory(profile: TutorProfileFormValues) {
  return (profile.teachingHistory ?? [])
    .filter((item) => item.title?.trim() || item.organization?.trim() || item.detail?.trim())
    .map((item) => ({
      ...(item.id?.trim() ? { id: item.id.trim() } : {}),
      title: item.title?.trim() || "",
      organization: item.organization?.trim() || "",
      detail: item.detail?.trim() || "",
      outcome: item.outcome?.trim() || null,
      startDate: item.startDate?.trim() || null,
      endDate: item.endDate?.trim() || null,
      isCurrent: Boolean(item.isCurrent),
    }));
}

export function buildTutorProfileDraftPayload(
  profile: TutorProfileFormValues,
): Record<string, unknown> {
  const payload = normalizeDraftValue(profile) as Record<string, unknown>;
  delete payload.bankInformation;
  delete payload.availability;
  payload.teachingOfferings = buildTeachingOfferings(profile);
  payload.teachingModes = [...new Set(profile.teachingOfferings.map((item) => item.teachingMode))];
  payload.achievements = buildAchievements(profile);
  payload.teachingHistory = buildTeachingHistory(profile);
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
