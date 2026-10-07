import type { ManualSearchQuery, TutorFilters } from "../data/types";

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
    (isManual && filters.programId ? 1 : 0) +
    (isManual && filters.programId && (filters.contextId || filters.hasContext === false) ? 1 : 0) +
    (isManual && filters.programId && filters.teachingItemId ? 1 : 0) +
    (isManual && filters.city ? 1 : 0) +
    (filters.teachingMode !== "all" ? 1 : 0) +
    (filters.level !== "all" ? 1 : 0) +
    (filters.maxPricePerSession !== null ? 1 : 0) +
    (filters.minRating !== null ? 1 : 0) +
    (filters.availableOnly ? 1 : 0)
  );
}

export function mapFiltersToManualQuery(
  keyword: string,
  filters: TutorFilters,
  page: number,
): ManualSearchQuery {
  const query: ManualSearchQuery = {
    keyword: keyword || undefined,
    page,
    pageSize: 6,
  };

  if (filters.programId) {
    query.programId = filters.programId;
    if (filters.programVersionId) query.programVersionId = filters.programVersionId;
    if (filters.contextId) query.contextId = filters.contextId;
    if (filters.hasContext === false) query.hasContext = false;
    if (filters.teachingItemId) query.teachingItemId = filters.teachingItemId;
  }
  if (filters.city) query.city = filters.city;
  if (filters.teachingMode !== "all") {
    query.teachingMode = filters.teachingMode.toUpperCase();
  }
  if (filters.maxPricePerSession !== null) {
    query.maxHourlyRate = filters.maxPricePerSession;
  }
  if (filters.availableOnly) query.isOnline = true;

  switch (filters.sortBy) {
    case "rating":
      query.sortBy = "rating";
      query.sortDirection = "desc";
      break;
    case "price_asc":
      query.sortBy = "hourlyRate";
      query.sortDirection = "asc";
      break;
    case "price_desc":
      query.sortBy = "hourlyRate";
      query.sortDirection = "desc";
      break;
    case "best_match":
      query.sortBy = "relevance";
      query.sortDirection = "desc";
      break;
  }

  return query;
}
