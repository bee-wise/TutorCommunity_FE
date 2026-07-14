import type { MeType } from "../types/auth.type";

export const TUTOR_LMS_URL = "https://superlms.beewise.vn";

export function getTutorPublicProfilePath(
  user?: Pick<MeType, "id" | "tutorProfileId"> | null,
) {
  const profileId = user?.tutorProfileId || user?.id;
  return profileId ? `/tutors/${encodeURIComponent(profileId)}` : "/tutors";
}
