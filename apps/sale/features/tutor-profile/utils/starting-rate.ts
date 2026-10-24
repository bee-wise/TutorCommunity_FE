import type { TutorProfileData } from "../types/tutor.type";

export function getTutorStartingRate(tutor: TutorProfileData) {
  if (typeof tutor.hourlyRate === "number" && tutor.hourlyRate > 0) {
    return tutor.hourlyRate;
  }
  const prices = (tutor.teachingOfferings ?? [])
    .map((offering) => offering.basePrice)
    .filter((price): price is number => typeof price === "number" && price > 0);
  return prices.length > 0 ? Math.min(...prices) : null;
}
