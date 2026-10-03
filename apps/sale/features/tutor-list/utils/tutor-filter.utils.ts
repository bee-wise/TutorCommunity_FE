import type { TutorFilters } from "../data/types";

export function getTeachingCapabilities(modes: string[]) {
  const normalizedModes = modes.map((mode) => mode.toUpperCase());
  const isHybrid = normalizedModes.includes("HYBRID");

  return {
    online: isHybrid || normalizedModes.includes("ONLINE"),
    offline: isHybrid || normalizedModes.includes("OFFLINE"),
  };
}

export function countActiveFilters(filters: TutorFilters, isManual: boolean) {
  return (
    (isManual && filters.subjectId ? 1 : 0) +
    (isManual && filters.gradeLevelId ? 1 : 0) +
    (isManual && filters.city ? 1 : 0) +
    (filters.teachingMode !== "all" ? 1 : 0) +
    (filters.level !== "all" ? 1 : 0) +
    (filters.maxPricePerSession !== null ? 1 : 0) +
    (filters.minRating !== null ? 1 : 0) +
    (filters.availableOnly ? 1 : 0)
  );
}
