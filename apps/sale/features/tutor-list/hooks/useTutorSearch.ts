import { useState, useCallback, useMemo, useEffect } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import {
  DEFAULT_FILTERS,
  type SearchMode,
  type TutorFilters,
  type ApiTutorProfile,
  type ManualSearchQuery,
} from "../data/types";
import { useGetTutorByAI } from "./useGetTutorByAI";
import { useGetTutorsManual } from "./useGetTutorsManual";

let cachedSearchMode: SearchMode = "manual";
let cachedQueries: Record<SearchMode, string> = { manual: "", ai: "" };
let cachedFiltersByMode: Record<SearchMode, TutorFilters> = {
  manual: DEFAULT_FILTERS,
  ai: DEFAULT_FILTERS,
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
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const requestedMode = searchParams.get("mode");
  const initialMode: SearchMode =
    requestedMode === "ai" || requestedMode === "manual"
      ? requestedMode
      : cachedSearchMode;
  const initialQuery = searchParams.get("q");

  const [searchMode, setSearchMode] = useState<SearchMode>(initialMode);
  const [filtersByMode, setFiltersByMode] = useState<
    Record<SearchMode, TutorFilters>
  >(cachedFiltersByMode);
  const [queries, setQueries] = useState<Record<SearchMode, string>>(() =>
    initialQuery === null
      ? cachedQueries
      : { ...cachedQueries, [initialMode]: initialQuery },
  );
  const [page, setPage] = useState(cachedPage);
  const currentQuery = queries[searchMode];
  const filters = filtersByMode[searchMode];

  // URL params are only an entry point; internal searches remain local afterwards.
  useEffect(() => {
    if (requestedMode !== null || initialQuery !== null) {
      router.replace(pathname, { scroll: false });
    }
  }, [initialQuery, pathname, requestedMode, router]);

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
    setFiltersByMode((currentFilters) => ({
      ...currentFilters,
      [searchMode]: DEFAULT_FILTERS,
    }));
    cachedFiltersByMode = {
      ...cachedFiltersByMode,
      [searchMode]: DEFAULT_FILTERS,
    };
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
        ? applyLocalFiltersToAIResults(aiTutors || [], filtersByMode.ai)
        : []
      : applyLocalFiltersToAIResults(manualResults, filtersByMode.manual); // Áp dụng filter Frontend cho các filter API chưa support (level, minRating)

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
