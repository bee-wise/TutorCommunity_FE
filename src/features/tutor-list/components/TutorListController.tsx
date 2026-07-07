"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { SparkleIcon, XIcon } from "@phosphor-icons/react";
import { SearchBar } from "./SearchBar";
import { FilterPanel } from "./FilterPanel";
import { TutorListResults } from "./TutorListResults";
import {
  MOCK_TUTORS,
  simulateAISearch,
  simulateManualSearch,
} from "../data/mock-tutors";
import {
  DEFAULT_FILTERS,
  type SearchMode,
  type TutorFilters,
  type Tutor,
} from "../data/types";

// Strands is a heavy WebGL component — load only when needed
const Strands = dynamic(() => import("@/src/components/Strands"), {
  ssr: false,
});

// ─── AI Loading Overlay ────────────────────────────────────────────────────

function AILoadingOverlay({ query }: { query: string }) {
  return (
    <AnimatePresence>
      <motion.div
        key="ai-loading"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="fixed inset-0 z-50 flex flex-col items-center justify-center"
        style={{
          background: "rgba(255,255,255,0.92)",
          backdropFilter: "blur(8px)",
        }}
        aria-live="polite"
        aria-label="AI đang tìm kiếm"
        role="status"
      >
        {/* Strands WebGL animation */}
        <div className="flex items-center justify-center w-36 h-36 mb-6 border rounded-full">
          <Strands
            colors={["#280f91", "#a855f7", "#3b82f6", "#ffc500"]}
            count={6}
            speed={0.6}
            amplitude={1.2}
            thickness={0.8}
            glow={3}
            intensity={0.7}
            opacity={0.9}
            waviness={1.2}
          />
        </div>

        <div className="flex flex-col items-center gap-3 text-center">
          <div className="flex items-center gap-2">
            <SparkleIcon
              size={20}
              className="text-primary"
              weight="fill"
              aria-hidden="true"
            />
            <span
              className="text-base font-bold text-primary"
              style={{ fontFamily: "var(--font-montserrat)" }}
            >
              AI đang phân tích...
            </span>
          </div>
          {query && (
            <p className="text-sm text-foreground/55 max-w-[32ch] leading-relaxed">
              &ldquo;{query}&rdquo;
            </p>
          )}
          <div className="flex gap-1.5 mt-1">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-1.5 h-1.5 rounded-full bg-primary"
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{
                  duration: 1.2,
                  repeat: Infinity,
                  delay: i * 0.2,
                  ease: "easeInOut",
                }}
                aria-hidden="true"
              />
            ))}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

// ─── Mobile Filter Drawer ──────────────────────────────────────────────────

function MobileFilterDrawer({
  isOpen,
  onClose,
  filters,
  onFiltersChange,
  resultCount,
}: {
  isOpen: boolean;
  onClose: () => void;
  filters: TutorFilters;
  onFiltersChange: (f: TutorFilters) => void;
  resultCount: number;
}) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/40"
            onClick={onClose}
            aria-hidden="true"
          />
          <motion.div
            key="drawer"
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 32 }}
            className="fixed top-0 left-0 z-50 h-full w-[88vw] max-w-sm bg-background shadow-2xl flex flex-col"
            role="dialog"
            aria-label="Bộ lọc gia sư"
            aria-modal="true"
          >
            <div className="flex items-center justify-between p-5 border-b border-border">
              <span
                className="text-base font-bold text-foreground"
                style={{ fontFamily: "var(--font-montserrat)" }}
              >
                Bộ lọc
              </span>
              <button
                type="button"
                onClick={onClose}
                className="text-foreground/50 hover:text-foreground transition-colors"
                aria-label="Đóng bộ lọc"
              >
                <XIcon size={20} aria-hidden="true" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-5">
              <FilterPanel
                filters={filters}
                onFiltersChange={onFiltersChange}
                resultCount={resultCount}
              />
            </div>
            <div className="p-5 border-t border-border">
              <button
                type="button"
                onClick={onClose}
                className="w-full h-11 rounded-full bg-primary text-white text-sm font-bold transition-all hover:bg-primary/90 active:scale-[0.98]"
                style={{ fontFamily: "var(--font-montserrat)" }}
              >
                Xem {resultCount} gia sư
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// ─── Main Controller ───────────────────────────────────────────────────────

interface TutorListControllerProps {
  isLoggedIn?: boolean; // passed from server context in production
}

export function TutorListController({
  isLoggedIn = false,
}: TutorListControllerProps) {
  const searchParams = useSearchParams();
  const initMode = (searchParams.get("mode") as SearchMode) || "ai";
  const initQuery = searchParams.get("q") || "";

  const [searchMode, setSearchMode] = useState<SearchMode>(initMode);
  const [filters, setFilters] = useState<TutorFilters>(DEFAULT_FILTERS);
  const [tutors, setTutors] = useState<Tutor[]>(MOCK_TUTORS);
  const [isLoading, setIsLoading] = useState(false);
  const [isAILoading, setIsAILoading] = useState(false);
  const [currentQuery, setCurrentQuery] = useState(initQuery);
  const [aiReason, setAiReason] = useState<string | undefined>(undefined);
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);

  const initialSearchDone = useRef(false);

  // Live filter updates for manual mode (no loading delay needed)
  useEffect(() => {
    if (searchMode === "manual") {
      const results = simulateManualSearch(currentQuery, filters);
      setTutors(results);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  const handleSearch = useCallback(
    async (query: string, mode: SearchMode) => {
      setCurrentQuery(query);
      setAiReason(undefined);

      if (!query.trim()) {
        setTutors(mode === "manual" ? simulateManualSearch("", filters) : MOCK_TUTORS);
        return;
      }

      if (mode === "ai") {
        // AI: full-screen loading overlay with Strands
        setIsAILoading(true);
        setIsLoading(true);
        await new Promise((r) => setTimeout(r, 2200)); // simulate AI latency
        const results = simulateAISearch(query);
        setTutors(results);
        setAiReason(
          results.length > 0
            ? `Tìm thấy dựa trên môn học, hình thức dạy và mức học phí phù hợp với mô tả của bạn.`
            : undefined,
        );
        setIsAILoading(false);
        setIsLoading(false);
      } else {
        // Manual: quick skeleton loading
        setIsLoading(true);
        await new Promise((r) => setTimeout(r, 600));
        const results = simulateManualSearch(query, filters);
        setTutors(results);
        setIsLoading(false);
      }
    },
    [filters],
  );

  const handleModeChange = (mode: SearchMode) => {
    setSearchMode(mode);
    setCurrentQuery("");
    setAiReason(undefined);
    handleSearch("", mode);
  };

  const handleFiltersChange = (newFilters: TutorFilters) => {
    setFilters(newFilters);
  };

  useEffect(() => {
    if (!initialSearchDone.current) {
      initialSearchDone.current = true;
      if (initMode === "ai" && initQuery) {
        handleSearch(initQuery, "ai");
      }
    }
  }, [initMode, initQuery, handleSearch]);

  return (
    <>
      {/* AI full-screen overlay */}
      {isAILoading && <AILoadingOverlay query={currentQuery} />}

      {/* Mobile filter drawer */}
      <MobileFilterDrawer
        isOpen={isFilterDrawerOpen}
        onClose={() => setIsFilterDrawerOpen(false)}
        filters={filters}
        onFiltersChange={handleFiltersChange}
        resultCount={tutors.length}
      />

      <div className="min-h-[calc(100dvh-64px)] bg-muted/30">
        {/* Page header */}
        <div
          className="border-b border-border bg-background"
          style={{ boxShadow: "0 1px 0 rgba(40,15,145,0.04)" }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <h1
                  className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight leading-tight"
                  style={{ fontFamily: "var(--font-montserrat)" }}
                >
                  Tìm Gia Sư
                </h1>
                <p className="text-sm text-foreground/55">
                  Kết nối với gia sư phù hợp — tìm thủ công hoặc để AI hỗ trợ
                </p>
              </div>

              <SearchBar
                mode={searchMode}
                onModeChange={handleModeChange}
                onSearch={handleSearch}
                isLoading={isLoading}
              />
            </div>
          </div>
        </div>

        {/* Body: sidebar + results */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex gap-8">
            {/* Sidebar filter — hidden on mobile */}
            <aside className="hidden lg:block w-64 shrink-0">
              <div className="sticky top-24 bg-card rounded-2xl border border-border p-5 shadow-sm">
                <FilterPanel
                  filters={filters}
                  onFiltersChange={handleFiltersChange}
                  resultCount={tutors.length}
                />
              </div>
            </aside>

            {/* Main results area */}
            <div className="flex-1 min-w-0 flex flex-col gap-4">
              {/* Mobile filter trigger */}
              <div className="flex items-center justify-between lg:hidden">
                <button
                  type="button"
                  onClick={() => setIsFilterDrawerOpen(true)}
                  className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-4 py-2 text-sm font-semibold text-foreground/70 shadow-sm hover:border-primary/30 transition-all"
                  id="mobile-filter-trigger"
                >
                  <span>Bộ lọc</span>
                  <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white">
                    {filters.subjects.length +
                      (filters.teachingMode !== "all" ? 1 : 0) +
                      (filters.level !== "all" ? 1 : 0) || ""}
                  </span>
                </button>

                <span className="text-sm text-foreground/50">
                  {tutors.length} gia sư
                </span>
              </div>

              {/* Results */}
              <TutorListResults
                tutors={tutors}
                isLoading={isLoading && !isAILoading}
                searchMode={searchMode}
                query={currentQuery}
                aiReason={aiReason}
                isLoggedIn={isLoggedIn}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
