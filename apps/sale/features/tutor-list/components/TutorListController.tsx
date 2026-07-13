"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
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
  const hasPlayedGalaxyAnim = useRef(false);

  const {
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
      <AnimatePresence>
        {searchMode === "ai" && !hasPlayedGalaxyAnim.current && (
          <motion.div
            key="ai-galaxy-border"
            className="pointer-events-none fixed inset-0 z-[100] blur-[3px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 1, 0] }}
            transition={{
              duration: 4.5,
              times: [0, 0.15, 0.85, 1],
              ease: "easeInOut",
            }}
            onAnimationComplete={() => {
              hasPlayedGalaxyAnim.current = true;
            }}
          >
            <div
              className="absolute inset-0 p-[5px] overflow-hidden"
              style={{
                WebkitMask:
                  "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                WebkitMaskComposite: "xor",
                maskComposite: "exclude",
              }}
            >
              <div
                className="absolute -inset-full animate-spin"
                style={{
                  animationDuration: "3s",
                  background:
                    "conic-gradient(from 0deg, transparent 0%, transparent 25%, #280f91 50%, #3b82f6 70%, #ec4899 85%, #ffc500 100%)",
                }}
              />
            </div>
            <div
              className="absolute inset-0"
              style={{
                boxShadow:
                  "inset 0 0 80px rgba(168, 85, 247, 0.4), inset 0 0 15px rgba(255, 197, 0, 0.4)",
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {isAIFetching && <AILoadingOverlay query={currentQuery} />}

      <MobileFilterDrawer
        isOpen={isFilterDrawerOpen}
        onClose={() => setIsFilterDrawerOpen(false)}
        filters={filters}
        onFiltersChange={handleFiltersChange}
        resultCount={displayTutors.length}
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
                  className="text-2xl md:text-3xl font-extrabold text-[#0c0c0b] tracking-tight leading-tight"
                  style={{ fontFamily: "var(--font-montserrat)" }}
                >
                  Tìm Gia Sư
                </h1>
              </div>

              <SearchBar
                mode={searchMode}
                onModeChange={handleModeChange}
                onSearch={handleSearch}
                isLoading={displayIsLoading}
              />
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
                    style={{ fontFamily: "var(--font-montserrat)" }}
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
                          (filters.level !== "all" ? 1 : 0) || ""}
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

              <TutorListResults
                tutors={displayTutors}
                isLoading={displayIsLoading && !isAIFetching}
                searchMode={searchMode}
                query={currentQuery}
                aiReason={aiReason}
                isLoggedIn={isLoggedIn}
                pagination={pagination}
                onClearFilters={handleClearFilters}
                onTryAI={() => handleModeChange("ai")}
                onPageChange={handlePageChange}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
