import { useState, useCallback, useMemo } from "react";
import {
  DEFAULT_FILTERS,
  type SearchMode,
  type TutorFilters,
  type ApiTutorProfile,
  type ManualSearchQuery,
} from "../data/types";
import { useGetTutorByAI } from "./useGetTutorByAI";
import { useGetTutorsManual } from "./useGetTutorsManual";

// Module-level cache: survives SPA navigation (Back/Forward) but resets on F5 (Full Reload)
let cachedSearchMode: SearchMode = "ai";
let cachedCurrentQuery: string = "";
let cachedFilters: TutorFilters = DEFAULT_FILTERS;
let cachedPage: number = 1;

const mapFiltersToManualQuery = (
  query: string,
  filters: TutorFilters,
  page: number,
): ManualSearchQuery => {
  const manualQuery: ManualSearchQuery = {
    keyword: query || undefined,
    page,
    pageSize: 50,
  };

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
    case "experience": // Backend currently doesn't support experience, fallback to rating
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
function applyLocalFiltersToAIResults(
  tutors: ApiTutorProfile[],
  filters: TutorFilters,
) {
  return tutors
    .filter((tutor) => {
      if (filters.teachingMode !== "all") {
        const isOnline = tutor.teachingModes?.includes("ONLINE");
        const isOffline = tutor.teachingModes?.includes("OFFLINE");
        if (filters.teachingMode === "online" && !isOnline) return false;
        if (filters.teachingMode === "offline" && !isOffline) return false;
      }

      if (filters.level !== "all") {
        const isTeacher = tutor.studentYear === "GRADUATED";
        if (filters.level === "teacher" || filters.level === "expert") {
          if (!isTeacher) return false;
        } else {
          if (isTeacher) return false;
        }
      }

      if (
        filters.maxPricePerSession !== null &&
        (tutor.hourlyRate || 0) > filters.maxPricePerSession
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
    })
    .sort((a, b) => {
      switch (filters.sortBy) {
        case "best_match":
        case "rating":
          return (b.ratingAvg || 0) - (a.ratingAvg || 0);
        case "price_asc":
          return (a.hourlyRate || 0) - (b.hourlyRate || 0);
        case "price_desc":
          return (b.hourlyRate || 0) - (a.hourlyRate || 0);
        default:
          return 0;
      }
    });
}

export function useTutorSearch() {
  const [searchMode, setSearchMode] = useState<SearchMode>(cachedSearchMode);
  const [filters, setFilters] = useState<TutorFilters>(cachedFilters);
  const [currentQuery, setCurrentQuery] = useState(cachedCurrentQuery);
  const [page, setPage] = useState(cachedPage);

  const aiSearchQuery = useMemo(
    () => ({ query: currentQuery, limit: 10, thresold: 0.65 }),
    [currentQuery],
  );

  const { data: aiTutors, isFetching: isAIFetching } = useGetTutorByAI(
    { ...aiSearchQuery },
    searchMode === "ai" && currentQuery.trim().length > 0,
  );

  const manualSearchQueryObj = useMemo(
    () => mapFiltersToManualQuery(currentQuery, filters, page),
    [currentQuery, filters, page],
  );

  const { data: manualResponse, isFetching: isManualFetching } =
    useGetTutorsManual(manualSearchQueryObj, searchMode === "manual");

  const handleSearch = useCallback(async (query: string, mode: SearchMode) => {
    setCurrentQuery(query);
    cachedCurrentQuery = query;
    setPage(1);
    cachedPage = 1;
  }, []);

  const handleModeChange = (mode: SearchMode) => {
    setSearchMode(mode);
    cachedSearchMode = mode;
    setCurrentQuery("");
    cachedCurrentQuery = "";
    setPage(1);
    cachedPage = 1;
  };

  const handleFiltersChange = (newFilters: TutorFilters) => {
    setFilters(newFilters);
    cachedFilters = newFilters;
    setPage(1);
    cachedPage = 1;
  };

  const handleClearFilters = () => {
    setFilters(DEFAULT_FILTERS);
    cachedFilters = DEFAULT_FILTERS;
    setCurrentQuery("");
    cachedCurrentQuery = "";
    setPage(1);
    cachedPage = 1;
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    cachedPage = newPage;
  };

  const manualResults = manualResponse?.data?.items || [];
  const displayTutors =
    searchMode === "ai"
      ? currentQuery.trim()
        ? applyLocalFiltersToAIResults(aiTutors || [], filters)
        : []
      : applyLocalFiltersToAIResults(manualResults, filters); // Áp dụng filter Frontend cho các filter API chưa support (level, minRating)

  const displayIsLoading =
    searchMode === "ai" ? isAIFetching : isManualFetching;
  const pagination =
    searchMode === "manual" ? manualResponse?.data?.pagination : undefined;

  const aiReason =
    searchMode === "ai" && displayTutors.length > 0 && currentQuery.trim()
      ? "Tìm thấy dựa trên môn học, hình thức dạy và mức học phí phù hợp với mô tả của bạn."
      : undefined;

  return {
    searchMode,
    currentQuery,
    filters,
    displayTutors,
    displayIsLoading,
    isAIFetching,
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
