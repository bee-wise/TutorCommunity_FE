"use client";

import { useMemo, useState } from "react";
import { useRecruitingClasses } from "../hooks/useRecruitingClasses";
import { useClassOfferingFilters } from "../hooks/useClassOfferingFilters";
import { normalizeSearch, type TeachingMode } from "../utils/classes.utils";
import { ClassCard } from "./ClassCard";
import { ClassSelect } from "./ClassSelect";
import {
  ClassFiltersCollapsible,
  ClassFiltersSidebar,
  type AllOr,
} from "./ClassFilters";
import {
  ClassesLoadError,
  ClassListSkeleton,
  NoMatchingClasses,
  NoRecruitingClasses,
} from "./ClassListStates";
import { ClassesHero } from "./ClassesHero";

type SortOrder = "recommended" | "price-low" | "price-high" | "soonest";

const SORT_OPTIONS = [
  { value: "recommended", label: "Mặc định" },
  { value: "soonest", label: "Khai giảng sớm" },
  { value: "price-low", label: "Học phí thấp nhất" },
  { value: "price-high", label: "Học phí cao nhất" },
];

export function ClassDiscovery() {
  const {
    classes,
    isLoading,
    isError,
    refetch,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = useRecruitingClasses();
  const [query, setQuery] = useState("");
  const [mode, setMode] = useState<AllOr<TeachingMode>>("all");
  const [maxPrice, setMaxPrice] = useState("all");
  const [sortOrder, setSortOrder] = useState<SortOrder>("recommended");

  const offering = useClassOfferingFilters(classes);
  const hasClasses = !isLoading && !isError && classes.length > 0;

  const visibleClasses = useMemo(() => {
    const search = normalizeSearch(query);
    const filtered = classes.filter((classItem) => {
      const matchesSearch =
        !search ||
        normalizeSearch(
          `${classItem.title ?? ""} ${classItem.programName ?? ""} ${classItem.contextName ?? ""} ${classItem.teachingItemName ?? ""}`,
        ).includes(search);

      return (
        matchesSearch &&
        offering.matches(classItem) &&
        (mode === "all" || classItem.teachingMode === mode) &&
        (maxPrice === "all" || classItem.pricePerSession <= Number(maxPrice))
      );
    });

    if (sortOrder === "price-low") {
      return filtered.sort((a, b) => a.pricePerSession - b.pricePerSession);
    }
    if (sortOrder === "price-high") {
      return filtered.sort((a, b) => b.pricePerSession - a.pricePerSession);
    }
    if (sortOrder === "soonest") {
      const time = (value?: string | null) =>
        value ? Date.parse(value) : Number.POSITIVE_INFINITY;
      return filtered.sort((a, b) => time(a.openingAt) - time(b.openingAt));
    }
    return filtered;
  }, [classes, query, offering, mode, maxPrice, sortOrder]);

  const resetFilters = () => {
    setQuery("");
    offering.reset();
    setMode("all");
    setMaxPrice("all");
    setSortOrder("recommended");
  };

  const filterState = {
    offering: {
      program: offering.programId,
      onProgramChange: offering.selectProgram,
      programOptions: offering.programOptions,
      programLoading: offering.programLoading,
      programSelected: offering.programSelected,
      context: offering.context,
      onContextChange: offering.selectContext,
      contextOptions: offering.contextOptions,
      contextLoading: offering.contextLoading,
      item: offering.item,
      onItemChange: offering.selectItem,
      itemOptions: offering.itemOptions,
      itemLoading: offering.itemLoading,
      failed: offering.failed,
      onRetry: offering.retry,
    },
    mode,
    onModeChange: setMode,
    maxPrice,
    onMaxPriceChange: setMaxPrice,
  };
  const activeFilterCount =
    offering.activeCount +
    [mode !== "all", maxPrice !== "all"].filter(Boolean).length;

  return (
    <>
      <ClassesHero
        showControls={hasClasses}
        query={query}
        onQueryChange={setQuery}
      />

      <section className="min-h-[60dvh] bg-muted pb-20 pt-7 sm:pt-9">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {isLoading ? (
            <ClassListSkeleton />
          ) : isError ? (
            <ClassesLoadError onRetry={() => void refetch()} />
          ) : classes.length === 0 ? (
            <NoRecruitingClasses />
          ) : (
            <>
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h2 className="font-nunito text-xl font-black text-foreground sm:text-2xl">
                    Lớp đang mở
                  </h2>
                  <p className="mt-0.5 text-sm text-muted-foreground">
                    {visibleClasses.length} kết quả
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <label
                    htmlFor="class-sort"
                    className="text-sm font-semibold text-muted-foreground"
                  >
                    Sắp xếp
                  </label>
                  <ClassSelect
                    id="class-sort"
                    value={sortOrder}
                    onValueChange={(value) => setSortOrder(value as SortOrder)}
                    options={SORT_OPTIONS}
                    className="w-48"
                  />
                </div>
              </div>

              <ClassFiltersCollapsible
                {...filterState}
                activeCount={activeFilterCount}
                onReset={resetFilters}
              />

              <div className="mt-5 grid items-start gap-6 lg:grid-cols-[252px_minmax(0,1fr)] lg:gap-7">
                <ClassFiltersSidebar {...filterState} onReset={resetFilters} />

                <div>
                  {visibleClasses.length > 0 ? (
                    <>
                      <div className="grid gap-4">
                        {visibleClasses.map((classItem) => (
                          <ClassCard key={classItem.id} classItem={classItem} />
                        ))}
                      </div>
                      {hasNextPage && (
                        <div className="mt-6 flex justify-center">
                          <button
                            type="button"
                            onClick={() => void fetchNextPage()}
                            disabled={isFetchingNextPage}
                            className="min-h-11 rounded-full border border-border bg-background px-6 text-sm font-bold text-primary transition-colors hover:bg-muted active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                          >
                            {isFetchingNextPage ? "Đang tải..." : "Xem thêm lớp"}
                          </button>
                        </div>
                      )}
                    </>
                  ) : (
                    <NoMatchingClasses onReset={resetFilters} />
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </section>
    </>
  );
}
