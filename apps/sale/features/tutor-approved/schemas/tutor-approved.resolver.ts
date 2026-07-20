import type { MeType } from "@workspace/core/types/auth.type";
import { tutorApprovedScenarios, type TutorApprovedScenario } from "../types";

export function parseTutorApprovedScenario(value?: string | null): TutorApprovedScenario {
  return tutorApprovedScenarios.includes(value as TutorApprovedScenario)
    ? (value as TutorApprovedScenario)
    : "ready";
}

export function resolveTutorApprovedScenario(user?: MeType | null): TutorApprovedScenario {
  const status = user?.listingStatus?.trim().toUpperCase();
  if (status === "EXPIRED") return "listing-expired";
  if (status === "EXPIRING_SOON") return "listing-expiring";
  return "ready";
}
