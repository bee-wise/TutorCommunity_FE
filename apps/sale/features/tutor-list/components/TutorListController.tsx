"use client";

import { useState, useEffect } from "react";
import { CircleNotchIcon, SparkleIcon } from "@phosphor-icons/react";
import { SearchBar } from "./SearchBar";
import { FilterPanel } from "./FilterPanel";
import { TutorListResults } from "./TutorListResults";
import { AILoadingOverlay } from "./AILoadingOverlay";
import { MobileFilterDrawer } from "./MobileFilterDrawer";
import { useTutorSearch } from "../hooks/useTutorSearch";
import type { TutorFilters } from "../data/types";

const SORT_OPTIONS = [
  { label: "Phù hợp nhất", value: "best_match" },
  { label: "Đánh giá cao nhất", value: "rating" },
  { label: "Kinh nghiệm nhiều nhất", value: "experience" },
  { label: "Học phí thấp nhất", value: "price_asc" },
  { label: "Học phí cao nhất", value: "price_desc" },
] as const;

interface TutorListControllerProps {
  isLoggedIn?: boolean; // passed from server context in production
}

export function TutorListController({
  isLoggedIn = false,
}: TutorListControllerProps) {
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);

  const {
    searchMode,
    currentQuery,
    filters,
    displayTutors,
    displayIsLoading,
    isAIFetching,
    isAIBackgroundFetching,
    aiReason,
    pagination,
    handleSearch,
    handleModeChange,
    handleFiltersChange,
    handleClearFilters,
    handlePageChange,
  } = useTutorSearch();

  const shouldHideFiltersAndHeader =
    searchMode === "ai" && (!currentQuery.trim() || displayTutors.length === 0);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (!currentQuery.trim() && searchMode === "ai") return;

      e.preventDefault();
      e.returnValue = "";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [currentQuery, searchMode]);

  return (
    <>
      <MobileFilterDrawer
        isOpen={isFilterDrawerOpen}
        onClose={() => setIsFilterDrawerOpen(false)}
        filters={filters}
        onFiltersChange={handleFiltersChange}
        resultCount={
          searchMode === "manual" && pagination
            ? pagination.totalItems
            : displayTutors.length
        }
        isLoading={displayIsLoading}
      />

      <div className="min-h-[calc(100dvh-64px)] bg-muted/30">
        <div
          className="border-b border-border bg-background"
          style={{ boxShadow: "0 1px 0 rgba(40,15,145,0.04)" }}
        >
          <div className="mx-auto max-w-[1480px] px-4 py-5 sm:px-6 lg:px-8">
            <div className="flex flex-col gap-4">
              <div>
                <h1
                  className="text-2xl uppercase md:text-3xl font-extrabold text-[#0c0c0b] tracking-tight leading-tight"
                  style={{ fontFamily: "var(--font-nunito-family)" }}
                >
                  Tìm Kiếm Gia Sư
                </h1>
              </div>

              <SearchBar
                key={searchMode}
                mode={searchMode}
                currentQuery={currentQuery}
                onModeChange={handleModeChange}
                onSearch={handleSearch}
                isLoading={displayIsLoading}
              />
              {isAIBackgroundFetching && (
                <div
                  className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-primary/15 bg-primary/5 px-3 py-2 text-xs text-foreground/65"
                  role="status"
                  aria-live="polite"
                >
                  <span className="flex items-center gap-2">
                    <CircleNotchIcon
                      className="animate-spin text-primary"
                      size={15}
                      aria-hidden="true"
                    />
                    AI vẫn đang tìm gia sư trong nền. Bạn có thể tiếp tục tìm
                    thủ công.
                  </span>
                  <button
                    type="button"
                    onClick={() => handleModeChange("ai")}
                    className="inline-flex items-center gap-1.5 font-bold text-primary hover:underline"
                  >
                    <SparkleIcon size={14} weight="fill" aria-hidden="true" />
                    Quay lại AI
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-[1480px] px-4 py-5 sm:px-6 lg:px-8">
          <div className="flex gap-6">
            {!shouldHideFiltersAndHeader && (
              <aside className="hidden xl:block w-[270px] shrink-0">
                <div className="sticky top-24 rounded-2xl border border-[#dce3f0] bg-white shadow-sm overflow-hidden flex flex-col max-h-[calc(100vh-8rem)]">
                  <div className="p-5 overflow-y-auto flex-1 custom-scrollbar">
                    <FilterPanel
                      filters={filters}
                      onFiltersChange={handleFiltersChange}
                    />
                  </div>
                </div>
              </aside>
            )}

            <div className="flex-1 min-w-0 flex flex-col gap-4">
              {!shouldHideFiltersAndHeader && (
                <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[#dce3f0] bg-white px-4 py-3 shadow-sm">
                  <p
                    className="text-base font-extrabold text-[#0c0c0b]"
                    style={{ fontFamily: "var(--font-nunito-family)" }}
                  >
                    {searchMode === "manual" && pagination
                      ? `${pagination.totalItems} gia sư`
                      : `${displayTutors.length} gia sư phù hợp`}
                  </p>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setIsFilterDrawerOpen(true)}
                      className="inline-flex items-center gap-2 rounded-xl border border-border bg-background px-3 py-2 text-sm font-semibold text-foreground/70 shadow-sm hover:border-primary/30 transition-all xl:hidden"
                      id="mobile-filter-trigger"
                    >
                      <span>Bộ lọc</span>
                      <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white">
                        {(filters.teachingMode !== "all" ? 1 : 0) +
                          (filters.level !== "all" ? 1 : 0) +
                          (filters.maxPricePerSession !== null ? 1 : 0) +
                          (filters.minRating !== null ? 1 : 0) +
                          (filters.availableOnly ? 1 : 0) || ""}
                      </span>
                    </button>
                    <label htmlFor="result-sort" className="sr-only">
                      Sắp xếp kết quả
                    </label>
                    <select
                      id="result-sort"
                      value={filters.sortBy}
                      onChange={(event) =>
                        handleFiltersChange({
                          ...filters,
                          sortBy: event.target.value as TutorFilters["sortBy"],
                        })
                      }
                      className="h-10 rounded-xl border border-border bg-background px-3 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/15"
                    >
                      {SORT_OPTIONS.map((option, index) => (
                        <option
                          key={`${option.value}-${index}`}
                          value={option.value}
                        >
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              {isAIFetching ? (
                <AILoadingOverlay key={currentQuery} query={currentQuery} />
              ) : (
                <TutorListResults
                  tutors={displayTutors}
                  isLoading={displayIsLoading}
                  searchMode={searchMode}
                  query={currentQuery}
                  aiReason={aiReason}
                  isLoggedIn={isLoggedIn}
                  pagination={pagination}
                  onClearFilters={handleClearFilters}
                  onTryAI={() => handleModeChange("ai")}
                  onPageChange={handlePageChange}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
