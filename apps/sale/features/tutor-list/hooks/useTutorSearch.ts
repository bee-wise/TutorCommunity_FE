import { useState, useCallback, useMemo, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import {
  DEFAULT_FILTERS,
  DEFAULT_AI_FILTERS,
  type SearchMode,
  type TutorFilters,
  type ApiTutorProfile,
  type ManualSearchQuery,
} from "../data/types";
import { useGetTutorByAI } from "./useGetTutorByAI";
import { useGetTutorsManual } from "./useGetTutorsManual";
import { getTeachingCapabilities } from "../utils/tutor-filter.utils";

let cachedSearchMode: SearchMode = "manual";
let cachedQueries: Record<SearchMode, string> = { manual: "", ai: "" };
let cachedFiltersByMode: Record<SearchMode, TutorFilters> = {
  manual: DEFAULT_FILTERS,
  ai: DEFAULT_AI_FILTERS,
};
let cachedPage: number = 1;

const mapFiltersToManualQuery = (
  query: string,
  filters: TutorFilters,
  page: number,
): ManualSearchQuery => {
  const manualQuery: ManualSearchQuery = {
    keyword: query || undefined,
    page,
    pageSize: 6,
  };

  if (filters.subjectId) manualQuery.subjectId = filters.subjectId;
  if (filters.gradeLevelId) manualQuery.gradeLevelId = filters.gradeLevelId;
  if (filters.city) manualQuery.city = filters.city;

  if (filters.teachingMode !== "all") {
    manualQuery.teachingMode = filters.teachingMode.toUpperCase();
  }

  if (filters.maxPricePerSession !== null) {
    manualQuery.maxHourlyRate = filters.maxPricePerSession;
  }

  if (filters.availableOnly) {
    manualQuery.isOnline = true;
  }

  switch (filters.sortBy) {
    case "rating":
      manualQuery.sortBy = "rating";
      manualQuery.sortDirection = "desc";
      break;
    case "price_asc":
      manualQuery.sortBy = "hourlyRate";
      manualQuery.sortDirection = "asc";
      break;
    case "price_desc":
      manualQuery.sortBy = "hourlyRate";
      manualQuery.sortDirection = "desc";
      break;
    case "best_match":
      manualQuery.sortBy = "relevance";
      manualQuery.sortDirection = "desc";
      break;
    default:
      break;
  }

  return manualQuery;
};

// Filter function for AI mode results (since AI endpoint doesn't accept complex filters)
function applyLocalFilters(
  tutors: ApiTutorProfile[],
  filters: TutorFilters,
  mode: SearchMode,
) {
  const getTutorEffectiveRate = (tutor: ApiTutorProfile) => {
    if (typeof tutor.hourlyRate === "number" && tutor.hourlyRate > 0) {
      return tutor.hourlyRate;
    }
    const offeringMinPrice =
      tutor.teachingOfferings && tutor.teachingOfferings.length > 0
        ? Math.min(
            ...tutor.teachingOfferings
              .map((o) => o.basePrice)
              .filter((p) => typeof p === "number" && p > 0),
          )
        : null;
    return offeringMinPrice && Number.isFinite(offeringMinPrice)
      ? offeringMinPrice
      : 0;
  };

  const filtered = tutors.filter((tutor) => {
    if (filters.teachingMode !== "all") {
      const modes =
        tutor.teachingModes && tutor.teachingModes.length > 0
          ? tutor.teachingModes
          : (tutor.teachingOfferings || [])
              .map((o) => o.teachingMode)
              .filter(Boolean);
      const capabilities = getTeachingCapabilities(modes);
      if (filters.teachingMode === "online" && !capabilities.online)
        return false;
      if (filters.teachingMode === "offline" && !capabilities.offline)
        return false;
    }

    if (filters.level !== "all") {
      const isTeacher = tutor.studentYear === "GRADUATED";
      if (filters.level === "teacher" || filters.level === "expert") {
        if (!isTeacher) return false;
      } else {
        if (isTeacher) return false;
      }
    }

    const rate = getTutorEffectiveRate(tutor);
    if (
      filters.maxPricePerSession !== null &&
      rate > filters.maxPricePerSession
    ) {
      return false;
    }

    if (
      filters.minRating !== null &&
      (tutor.ratingAvg || 0) < filters.minRating
    ) {
      return false;
    }

    if (filters.availableOnly && !tutor.isOnline) return false;

    return true;
  });

  // The API already ranks AI matches and sorts manual results. Preserve that order
  // unless the learner explicitly selects another sort for the AI list.
  if (mode === "manual" || filters.sortBy === "best_match") return filtered;

  return filtered.sort((a, b) => {
    switch (filters.sortBy) {
      case "rating":
        return (b.ratingAvg || 0) - (a.ratingAvg || 0);
      case "price_asc":
        return getTutorEffectiveRate(a) - getTutorEffectiveRate(b);
      case "price_desc":
        return getTutorEffectiveRate(b) - getTutorEffectiveRate(a);
      default:
        return 0;
    }
  });
}

export function useTutorSearch() {
  const searchParams = useSearchParams();
  const requestedMode = searchParams.get("mode");
  const initialMode: SearchMode =
    requestedMode === "ai" || requestedMode === "manual"
      ? requestedMode
      : cachedSearchMode;
  const initialQuery = searchParams.get("q");

  const [searchMode, setSearchMode] = useState<SearchMode>(initialMode);
  const [filtersByMode, setFiltersByMode] =
    useState<Record<SearchMode, TutorFilters>>(cachedFiltersByMode);
  const [queries, setQueries] = useState<Record<SearchMode, string>>(() =>
    initialQuery === null
      ? cachedQueries
      : { ...cachedQueries, [initialMode]: initialQuery },
  );
  const [page, setPage] = useState(cachedPage);
  const currentQuery = queries[searchMode];
  const filters = filtersByMode[searchMode];

  // URL params are only an entry point; clear them without starting a new route navigation.
  useEffect(() => {
    if (requestedMode !== null || initialQuery !== null) {
      const url = new URL(window.location.href);
      url.searchParams.delete("mode");
      url.searchParams.delete("q");
      window.history.replaceState(
        null,
        "",
        `${url.pathname}${url.search}${url.hash}`,
      );
    }
  }, [initialQuery, requestedMode]);

  const aiSearchQuery = useMemo(
    () => ({ query: queries.ai, limit: 10, thresold: 0.65 }),
    [queries.ai],
  );

  const { data: aiTutors, isFetching: isAIRequestFetching } = useGetTutorByAI(
    { ...aiSearchQuery },
    queries.ai.trim().length > 0,
  );

  const manualSearchQueryObj = useMemo(
    () => mapFiltersToManualQuery(queries.manual, filtersByMode.manual, page),
    [queries.manual, filtersByMode.manual, page],
  );

  const { data: manualResponse, isFetching: isManualFetching } =
    useGetTutorsManual(manualSearchQueryObj, searchMode === "manual");

  const handleSearch = useCallback(async (query: string, mode: SearchMode) => {
    setQueries((currentQueries) => ({ ...currentQueries, [mode]: query }));
    cachedQueries = { ...cachedQueries, [mode]: query };
    setPage(1);
    cachedPage = 1;
  }, []);

  const handleModeChange = (mode: SearchMode) => {
    setSearchMode(mode);
    cachedSearchMode = mode;
    setPage(1);
    cachedPage = 1;
  };

  const handleFiltersChange = (newFilters: TutorFilters) => {
    setFiltersByMode((currentFilters) => ({
      ...currentFilters,
      [searchMode]: newFilters,
    }));
    cachedFiltersByMode = {
      ...cachedFiltersByMode,
      [searchMode]: newFilters,
    };
    setPage(1);
    cachedPage = 1;
  };

  const handleClearFilters = () => {
    const nextFilters =
      searchMode === "ai" ? DEFAULT_AI_FILTERS : DEFAULT_FILTERS;
    setFiltersByMode((currentFilters) => ({
      ...currentFilters,
      [searchMode]: nextFilters,
    }));
    cachedFiltersByMode = { ...cachedFiltersByMode, [searchMode]: nextFilters };
    setPage(1);
    cachedPage = 1;
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    cachedPage = newPage;
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const manualResults = manualResponse?.data?.items || [];
  const displayTutors =
    searchMode === "ai"
      ? queries.ai.trim()
        ? applyLocalFilters(aiTutors || [], filtersByMode.ai, "ai")
        : []
      : applyLocalFilters(manualResults, filtersByMode.manual, "manual"); // Áp dụng filter Frontend cho các filter API chưa support (level, minRating)

  const displayIsLoading =
    searchMode === "ai" ? isAIRequestFetching : isManualFetching;
  const pagination =
    searchMode === "manual" ? manualResponse?.data?.pagination : undefined;

  const aiReason =
    searchMode === "ai" && displayTutors.length > 0 && queries.ai.trim()
      ? "Tìm thấy dựa trên môn học, hình thức dạy và mức học phí phù hợp với mô tả của bạn."
      : undefined;

  return {
    searchMode,
    currentQuery,
    filters,
    displayTutors,
    displayIsLoading,
    isAIFetching: searchMode === "ai" && isAIRequestFetching,
    isAIBackgroundFetching: searchMode === "manual" && isAIRequestFetching,
    aiReason,
    pagination,
    page,
    handleSearch,
    handleModeChange,
    handleFiltersChange,
    handleClearFilters,
    handlePageChange,
  };
}
