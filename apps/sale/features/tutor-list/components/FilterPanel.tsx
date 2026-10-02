"use client";

import { useId } from "react";
import { CaretDownIcon, FunnelIcon, XIcon } from "@phosphor-icons/react";
import type { SearchMode, TutorFilters } from "../data/types";
import { countActiveFilters } from "../utils/tutor-filter.utils";
import { useTutorSearchOptions } from "../hooks/useTutorSearchOptions";

const PRICE_OPTIONS = [
  { label: "Dưới 150.000đ", value: 150000 },
  { label: "Dưới 250.000đ", value: 250000 },
  { label: "Dưới 350.000đ", value: 350000 },
] as const;

interface FilterPanelProps {
  searchMode: SearchMode;
  filters: TutorFilters;
  onFiltersChange: (filters: TutorFilters) => void;
  showHeader?: boolean;
}

const selectClassName =
  "peer h-11 w-full appearance-none rounded-xl border border-input bg-background px-3 pr-10 text-sm font-medium text-foreground transition-colors hover:border-primary focus-visible:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:bg-muted disabled:text-muted-foreground";

export function FilterPanel({
  searchMode,
  filters,
  onFiltersChange,
  showHeader = true,
}: FilterPanelProps) {
  const availableId = useId();
  const isManual = searchMode === "manual";
  const { subjects, gradeLevels, provinces } = useTutorSearchOptions(isManual);
  const update = <K extends keyof TutorFilters>(
    key: K,
    value: TutorFilters[K],
  ) => onFiltersChange({ ...filters, [key]: value });

  const activeFilterCount = countActiveFilters(filters, isManual);

  const resetAll = () =>
    onFiltersChange({
      subjectId: null,
      gradeLevelId: null,
      city: "",
      teachingMode: "all",
      level: "all",
      maxPricePerSession: null,
      minRating: null,
      availableOnly: false,
      sortBy: filters.sortBy,
    });

  return (
    <aside
      className="flex flex-col font-sans"
      aria-label="Bộ lọc tìm kiếm gia sư"
    >
      {(showHeader || activeFilterCount > 0) && (
        <div
          className={`mb-5 flex flex-wrap items-center gap-x-2 gap-y-2 ${showHeader ? "border-b border-border pb-4" : "justify-end"}`}
        >
          {showHeader && (
            <div className="flex shrink-0 items-center gap-2.5">
              <span className="whitespace-nowrap font-nunito text-base font-extrabold text-foreground">
                Bộ lọc
              </span>
              {activeFilterCount > 0 && (
                <span className="inline-flex h-5 min-w-5 shrink-0 items-center justify-center rounded-md bg-primary px-1 text-[11px] font-bold text-primary-foreground">
                  {activeFilterCount}
                </span>
              )}
            </div>
          )}
          {activeFilterCount > 0 && (
            <button
              type="button"
              onClick={resetAll}
              className="ml-auto inline-flex shrink-0 items-center gap-1 rounded-md px-1.5 py-1 text-xs font-bold text-primary transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              id="filter-reset"
            >
              <XIcon size={13} weight="bold" aria-hidden="true" />
              Xóa tất cả
            </button>
          )}
        </div>
      )}

      {isManual && (
        <div className="flex flex-col gap-3.5 border-b border-border pb-5">
          <p className="font-nunito text-sm font-extrabold text-foreground">
            Nhu cầu học tập
          </p>
          <label className="flex flex-col gap-1.5 text-xs font-semibold text-foreground">
            Môn học
            <span className="relative">
              <select
                value={filters.subjectId ?? ""}
                onChange={(event) =>
                  update("subjectId", event.target.value || null)
                }
                disabled={subjects.isPending || subjects.isError}
                className={selectClassName}
              >
                <option value="">
                  {subjects.isPending
                    ? "Đang tải môn học..."
                    : "Tất cả môn học"}
                </option>
                {(subjects.data ?? []).map((subject) => (
                  <option key={subject.id} value={subject.id}>
                    {subject.name}
                  </option>
                ))}
              </select>
              <CaretDownIcon
                size={16}
                weight="bold"
                aria-hidden="true"
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-primary transition-transform duration-200 peer-focus:rotate-180"
              />
            </span>
          </label>
          <label className="flex flex-col gap-1.5 text-xs font-semibold text-foreground">
            Cấp lớp
            <span className="relative">
              <select
                value={filters.gradeLevelId ?? ""}
                onChange={(event) =>
                  update("gradeLevelId", event.target.value || null)
                }
                disabled={gradeLevels.isPending || gradeLevels.isError}
                className={selectClassName}
              >
                <option value="">
                  {gradeLevels.isPending
                    ? "Đang tải cấp lớp..."
                    : "Tất cả cấp lớp"}
                </option>
                {(gradeLevels.data ?? []).map((gradeLevel) => (
                  <option key={gradeLevel.id} value={gradeLevel.id}>
                    {gradeLevel.name}
                  </option>
                ))}
              </select>
              <CaretDownIcon
                size={16}
                weight="bold"
                aria-hidden="true"
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-primary transition-transform duration-200 peer-focus:rotate-180"
              />
            </span>
          </label>
          <label className="flex flex-col gap-1.5 text-xs font-semibold text-foreground">
            Tỉnh / thành phố
            <span className="relative">
              <select
                value={filters.city}
                onChange={(event) => update("city", event.target.value)}
                disabled={provinces.isPending || provinces.isError}
                className={selectClassName}
              >
                <option value="">
                  {provinces.isPending ? "Đang tải khu vực..." : "Toàn quốc"}
                </option>
                {(provinces.data ?? []).map((province) => (
                  <option key={province.code} value={province.name}>
                    {province.name}
                  </option>
                ))}
              </select>
              <CaretDownIcon
                size={16}
                weight="bold"
                aria-hidden="true"
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-primary transition-transform duration-200 peer-focus:rotate-180"
              />
            </span>
          </label>
          {(subjects.isError || gradeLevels.isError || provinces.isError) && (
            <p className="text-xs leading-5 text-destructive">
              Chưa tải được một số bộ lọc. Vui lòng thử lại sau.
            </p>
          )}
        </div>
      )}

      <div className={`border-b border-border py-5 ${isManual ? "" : "pt-0"}`}>
        <p className="mb-3 font-nunito text-sm font-extrabold text-foreground">
          Hình thức dạy
        </p>
        <div
          className="grid grid-cols-3 gap-1 rounded-xl border border-border bg-muted p-1"
          role="group"
          aria-label="Hình thức dạy học"
        >
          {(
            [
              { label: "Tất cả", value: "all" },
              { label: "Online", value: "online" },
              { label: "Tại nhà", value: "offline" },
            ] as const
          ).map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => update("teachingMode", opt.value)}
              aria-pressed={filters.teachingMode === opt.value}
              className={`min-h-8 rounded-lg px-1 text-xs font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
                filters.teachingMode === opt.value
                  ? "bg-primary text-primary-foreground"
                  : "text-foreground hover:bg-card hover:text-primary"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div className="border-b border-border py-5">
        <p className="mb-3 font-nunito text-sm font-extrabold text-foreground">
          Học phí tối đa
        </p>
        <div
          className="grid grid-cols-2 gap-2"
          role="group"
          aria-label="Học phí tối đa"
        >
          <button
            type="button"
            onClick={() => update("maxPricePerSession", null)}
            aria-pressed={filters.maxPricePerSession === null}
            className={`min-h-11 rounded-xl border px-2.5 py-2 text-left text-xs font-semibold leading-tight transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
              filters.maxPricePerSession === null
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-card text-foreground hover:border-primary hover:bg-muted"
            }`}
          >
            Không giới hạn
          </button>
          {PRICE_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => update("maxPricePerSession", opt.value)}
              aria-pressed={filters.maxPricePerSession === opt.value}
              className={`min-h-11 rounded-xl border px-2.5 py-2 text-left text-xs font-semibold leading-tight transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
                filters.maxPricePerSession === opt.value
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-card text-foreground hover:border-primary hover:bg-muted"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <label
        htmlFor={availableId}
        className="mt-5 flex cursor-pointer items-center justify-between gap-3 rounded-xl border border-border bg-card p-3.5 transition-colors hover:border-primary"
      >
        <span className="min-w-0 text-sm font-semibold leading-snug text-foreground">
          Chỉ hiện đang trực tuyến
        </span>
        <span className="relative shrink-0">
          <input
            type="checkbox"
            id={availableId}
            checked={filters.availableOnly}
            onChange={(event) => update("availableOnly", event.target.checked)}
            className="peer sr-only"
          />
          <span
            className={`block h-6 w-11 rounded-full border transition-colors duration-200 peer-focus-visible:ring-2 peer-focus-visible:ring-ring peer-focus-visible:ring-offset-2 ${
              filters.availableOnly
                ? "border-primary bg-primary"
                : "border-input bg-muted"
            }`}
          >
            <span
              className={`absolute left-0.5 top-0.5 block h-5 w-5 rounded-full bg-background shadow-sm transition-transform duration-200 ${filters.availableOnly ? "translate-x-5" : ""}`}
            />
          </span>
        </span>
      </label>
    </aside>
  );
}
