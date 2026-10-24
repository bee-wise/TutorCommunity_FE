"use client";

import { useMemo, useState } from "react";
import type { GroupDto } from "@workspace/core/lms-classes/group.schemas";
import { useRecruitingClasses } from "../hooks/useRecruitingClasses";
import {
  getClassSubject,
  normalizeSearch,
  type TeachingMode,
} from "../utils/classes.utils";
import { ClassCard } from "./ClassCard";
import { ClassDetailDialog } from "./ClassDetailDialog";
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
import { ClassesHero, type SubjectTab } from "./ClassesHero";

type SortOrder = "recommended" | "price-low" | "price-high" | "soonest";

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
  const [subject, setSubject] = useState("all");
  const [mode, setMode] = useState<AllOr<TeachingMode>>("all");
  const [maxPrice, setMaxPrice] = useState("all");
  const [sortOrder, setSortOrder] = useState<SortOrder>("recommended");
  const [selectedClass, setSelectedClass] = useState<GroupDto | null>(null);

  const hasClasses = !isLoading && !isError && classes.length > 0;

  const tabs = useMemo<SubjectTab[]>(() => {
    const counts = new Map<string, number>();
    for (const classItem of classes) {
      const name = getClassSubject(classItem);
      counts.set(name, (counts.get(name) ?? 0) + 1);
    }
    const subjects = [...counts.entries()]
      .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], "vi"))
      .map(([name, count]) => ({ value: name, label: name, count }));
    return [{ value: "all", label: "Tất cả", count: classes.length }, ...subjects];
  }, [classes]);

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
        (subject === "all" || getClassSubject(classItem) === subject) &&
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
  }, [classes, query, subject, mode, maxPrice, sortOrder]);

  const resetFilters = () => {
    setQuery("");
    setSubject("all");
    setMode("all");
    setMaxPrice("all");
    setSortOrder("recommended");
  };

  const filterState = {
    mode,
    onModeChange: setMode,
    maxPrice,
    onMaxPriceChange: setMaxPrice,
  };
  const activeFilterCount = [mode !== "all", maxPrice !== "all"].filter(
    Boolean,
  ).length;

  return (
    <>
      <ClassesHero
        showControls={hasClasses}
        query={query}
        onQueryChange={setQuery}
        tabs={tabs}
        activeTab={subject}
        onTabChange={setSubject}
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
                  <select
                    id="class-sort"
                    value={sortOrder}
                    onChange={(event) =>
                      setSortOrder(event.target.value as SortOrder)
                    }
                    className="min-h-11 rounded-full border border-border bg-background px-4 text-sm font-semibold text-foreground outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20"
                  >
                    <option value="recommended">Mặc định</option>
                    <option value="soonest">Khai giảng sớm</option>
                    <option value="price-low">Học phí thấp nhất</option>
                    <option value="price-high">Học phí cao nhất</option>
                  </select>
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
                          <ClassCard
                            key={classItem.id}
                            classItem={classItem}
                            onView={() => setSelectedClass(classItem)}
                          />
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

      <ClassDetailDialog
        classItem={selectedClass}
        onClose={() => setSelectedClass(null)}
      />
    </>
  );
}
