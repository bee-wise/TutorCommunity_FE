"use client";

import { useEffect, useId } from "react";
import { XIcon } from "@phosphor-icons/react";
import { ProfileSelect } from "../../tutor-profile-registration/components/ProfileSelect";
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

export function FilterPanel({
  searchMode,
  filters,
  onFiltersChange,
  showHeader = true,
}: FilterPanelProps) {
  const availableId = useId();
  const isManual = searchMode === "manual";
  const { programs, contexts, teachingItems, provinces } =
    useTutorSearchOptions(
      isManual,
      filters.programId,
      filters.contextId,
      filters.hasContext,
    );
  const update = <K extends keyof TutorFilters>(
    key: K,
    value: TutorFilters[K],
  ) => onFiltersChange({ ...filters, [key]: value });

  const activeFilterCount = countActiveFilters(filters, isManual);
  const failedFilterNames = [
    programs.isError && "chương trình",
    contexts.isError && "cấp học / ngữ cảnh",
    teachingItems.isError && "môn / nội dung dạy",
    provinces.isError && "tỉnh / thành phố",
  ].filter(Boolean).join(", ");
  const teachingItemOptions = Array.from(
    new Map(
      (teachingItems.data ?? []).map((item) => [
        item.teachingItemId ?? item.id,
        item,
      ]),
    ).values(),
  );

  useEffect(() => {
    if (!isManual || !filters.programId || !contexts.data) return;
    const currentVersionId = contexts.data.programVersionId;
    if (filters.programVersionId !== currentVersionId) {
      onFiltersChange({
        ...filters,
        programVersionId: currentVersionId,
        contextId: null,
        hasContext: null,
        teachingItemId: null,
      });
      return;
    }
    const contextIsInvalid =
      (filters.contextId &&
        !contexts.data.contexts.some((item) => item.id === filters.contextId)) ||
      (filters.hasContext === false && !contexts.data.hasWithoutContext);
    if (contextIsInvalid) {
      onFiltersChange({
        ...filters,
        contextId: null,
        hasContext: null,
        teachingItemId: null,
      });
    }
  }, [contexts.data, filters, isManual, onFiltersChange]);

  useEffect(() => {
    if (
      !isManual ||
      !filters.teachingItemId ||
      !teachingItems.isSuccess ||
      teachingItems.isFetching ||
      filters.programVersionId !== contexts.data?.programVersionId
    ) return;
    if (!teachingItems.data.some(
      (item) => (item.teachingItemId ?? item.id) === filters.teachingItemId,
    )) {
      onFiltersChange({ ...filters, teachingItemId: null });
    }
  }, [contexts.data?.programVersionId, filters, isManual, onFiltersChange, teachingItems.data, teachingItems.isFetching, teachingItems.isSuccess]);

  const resetAll = () =>
    onFiltersChange({
      programId: null,
      programVersionId: null,
      contextId: null,
      teachingItemId: null,
      hasContext: null,
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
          <div className="flex flex-col gap-1.5 text-xs font-semibold text-foreground">
            <span>Chương trình</span>
            <ProfileSelect
              label="Chương trình"
              value={filters.programId ?? ""}
              onChange={(programId) =>
                onFiltersChange({
                  ...filters,
                  programId: programId || null,
                  programVersionId: null,
                  contextId: null,
                  teachingItemId: null,
                  hasContext: null,
                })
              }
              options={programs.data ? [
                { value: "", label: "Tất cả chương trình" },
                ...programs.data.map((program) => ({
                  value: program.id,
                  label: program.name ?? program.code ?? "Chương trình chưa đặt tên",
                })),
              ] : []}
              placeholder={programs.isPending ? "Đang tải chương trình..." : "Tất cả chương trình"}
              disabled={programs.isPending || programs.isError}
            />
          </div>
          <div className="flex flex-col gap-1.5 text-xs font-semibold text-foreground">
            <span>Cấp học / ngữ cảnh</span>
            <ProfileSelect
              label="Cấp học / ngữ cảnh"
              value={filters.hasContext === false ? "__none__" : filters.contextId ?? ""}
              onChange={(selection) =>
                onFiltersChange({
                  ...filters,
                  contextId: selection && selection !== "__none__" ? selection : null,
                  hasContext: selection === "__none__" ? false : null,
                  teachingItemId: null,
                })
              }
              options={contexts.data ? [
                { value: "", label: "Tất cả cấp học / ngữ cảnh" },
                ...contexts.data.contexts.map((context) => ({
                  value: context.id,
                  label: context.name ?? context.code ?? "Ngữ cảnh chưa đặt tên",
                })),
                ...(contexts.data.hasWithoutContext
                  ? [{ value: "__none__", label: "Không áp dụng ngữ cảnh" }]
                  : []),
              ] : []}
              placeholder={!filters.programId ? "Chọn chương trình trước" : contexts.isPending ? "Đang tải cấp học..." : "Tất cả cấp học / ngữ cảnh"}
              disabled={!filters.programId || contexts.isPending || contexts.isError || !contexts.data}
            />
          </div>
          <div className="flex flex-col gap-1.5 text-xs font-semibold text-foreground">
            <span>Môn / nội dung dạy</span>
            <ProfileSelect
              label="Môn / nội dung dạy"
              value={filters.teachingItemId ?? ""}
              onChange={(value) => update("teachingItemId", value || null)}
              options={teachingItems.data ? [
                { value: "", label: "Tất cả môn / nội dung" },
                ...teachingItemOptions.map((item) => ({
                  value: item.teachingItemId ?? item.id,
                  label: item.name ?? item.code ?? "Môn chưa đặt tên",
                })),
              ] : []}
              placeholder={!filters.programId ? "Chọn chương trình trước" : teachingItems.isPending ? "Đang tải môn dạy..." : "Tất cả môn / nội dung"}
              disabled={!filters.programId || teachingItems.isPending || teachingItems.isError}
            />
          </div>
          <div className="flex flex-col gap-1.5 text-xs font-semibold text-foreground">
            <span>Tỉnh / thành phố</span>
            <ProfileSelect
              label="Tỉnh / thành phố"
              value={filters.city}
              onChange={(value) => update("city", value)}
              options={provinces.data ? [
                { value: "", label: "Toàn quốc" },
                ...provinces.data.map((province) => ({
                  value: province.name,
                  label: province.name,
                })),
              ] : []}
              placeholder={provinces.isPending ? "Đang tải khu vực..." : "Toàn quốc"}
              disabled={provinces.isPending || provinces.isError}
              searchable
              searchPlaceholder="Tìm tỉnh / thành phố..."
            />
          </div>
          {failedFilterNames && (
            <div className="flex flex-wrap items-center gap-2 text-xs leading-5 text-destructive">
              <span>Không tải được {failedFilterNames}.</span>
              <button
                type="button"
                onClick={() => {
                  if (programs.isError) void programs.refetch();
                  if (contexts.isError) void contexts.refetch();
                  if (teachingItems.isError) void teachingItems.refetch();
                  if (provinces.isError) void provinces.refetch();
                }}
                className="font-bold underline underline-offset-2"
              >
                Thử lại
              </button>
            </div>
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
