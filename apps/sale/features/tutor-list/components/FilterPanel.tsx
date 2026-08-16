"use client";

import { FunnelIcon, XIcon } from "@phosphor-icons/react";
import type { TutorFilters } from "../data/types";

const PRICE_OPTIONS = [
  { label: "Dưới 150.000đ", value: 150000 },
  { label: "Dưới 250.000đ", value: 250000 },
  { label: "Dưới 350.000đ", value: 350000 },
] as const;

interface FilterPanelProps {
  filters: TutorFilters;
  onFiltersChange: (filters: TutorFilters) => void;
}

export function FilterPanel({ filters, onFiltersChange }: FilterPanelProps) {
  const update = <K extends keyof TutorFilters>(
    key: K,
    value: TutorFilters[K],
  ) => onFiltersChange({ ...filters, [key]: value });

  const activeFilterCount =
    (filters.teachingMode !== "all" ? 1 : 0) +
    (filters.level !== "all" ? 1 : 0) +
    (filters.maxPricePerSession !== null ? 1 : 0) +
    (filters.minRating !== null ? 1 : 0) +
    (filters.availableOnly ? 1 : 0);

  const resetAll = () =>
    onFiltersChange({
      teachingMode: "all",
      level: "all",
      maxPricePerSession: null,
      minRating: null,
      availableOnly: false,
      sortBy: filters.sortBy,
    });

  return (
    <aside className="flex flex-col gap-5" aria-label="Bộ lọc tìm kiếm gia sư">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FunnelIcon size={16} className="text-[#280f91]" aria-hidden="true" />
          <span
            className="text-sm font-extrabold text-[#0c0c0b]"
            style={{ fontFamily: "var(--font-montserrat)" }}
          >
            Bộ lọc
          </span>
          {activeFilterCount > 0 && (
            <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#280f91] text-[10px] font-bold text-white">
              {activeFilterCount}
            </span>
          )}
        </div>
        {activeFilterCount > 0 && (
          <button
            type="button"
            onClick={resetAll}
            className="inline-flex items-center gap-1 text-xs text-foreground/50 hover:text-[#280f91] transition-colors font-semibold"
            id="filter-reset"
          >
            <XIcon size={12} aria-hidden="true" />
            Xóa tất cả
          </button>
        )}
      </div>

      {/* Teaching mode */}
      <div className="flex flex-col gap-2.5">
        <span
          className="text-xs font-bold text-[#0c0c0b] uppercase tracking-wide"
          style={{ fontFamily: "var(--font-montserrat)" }}
        >
          Hình thức dạy
        </span>
        <div
          className="grid grid-cols-3 gap-1.5"
          role="radiogroup"
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
              className={`rounded-xl py-2 text-xs font-semibold transition-all duration-150 ${
                filters.teachingMode === opt.value
                  ? "bg-[#280f91] text-white"
                  : "bg-transparent text-[#667085] hover:bg-[#f8fafc] border border-[#dce3f0]"
              }`}
              style={{ fontFamily: "var(--font-montserrat)" }}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tutor level
      <div className="flex flex-col gap-2.5">
        <span
          className="text-xs font-bold text-[#0c0c0b] uppercase tracking-wide"
          style={{ fontFamily: "var(--font-montserrat)" }}
        >
          Gia sư
        </span>
        <div
          className="flex flex-col gap-1.5"
          role="radiogroup"
          aria-label="Loại gia sư"
        >
          {(
            [
              { label: "Tất cả", value: "all" },
              { label: "Sinh viên", value: "student" },
              { label: "Giáo viên", value: "teacher" },
              { label: "Chuyên gia", value: "expert" },
            ] as const
          ).map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => update("level", opt.value)}
              aria-pressed={filters.level === opt.value}
              className={`rounded-xl px-3 py-2 text-xs font-semibold text-left transition-all duration-150 ${
                filters.level === opt.value
                  ? "bg-[#280f91] text-white"
                  : "bg-transparent text-[#667085] hover:bg-[#f8fafc] border border-[#dce3f0]"
              }`}
              style={{ fontFamily: "var(--font-montserrat)" }}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div> */}

      {/* Price filter */}
      <div className="flex flex-col gap-2.5">
        <span
          className="text-xs font-bold text-[#0c0c0b] uppercase tracking-wide"
          style={{ fontFamily: "var(--font-montserrat)" }}
        >
          Học phí tối đa
        </span>
        <div className="flex flex-col gap-1.5">
          <button
            type="button"
            onClick={() => update("maxPricePerSession", null)}
            aria-pressed={filters.maxPricePerSession === null}
            className={`rounded-xl px-3 py-2 text-xs font-semibold text-left transition-all duration-150 ${
              filters.maxPricePerSession === null
                ? "bg-[#280f91] text-white"
                : "bg-transparent text-[#667085] hover:bg-[#f8fafc] border border-[#dce3f0]"
            }`}
            style={{ fontFamily: "var(--font-montserrat)" }}
          >
            Không giới hạn
          </button>
          {PRICE_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => update("maxPricePerSession", opt.value)}
              aria-pressed={filters.maxPricePerSession === opt.value}
              className={`rounded-xl px-3 py-2 text-xs font-semibold text-left transition-all duration-150 ${
                filters.maxPricePerSession === opt.value
                  ? "bg-[#280f91] text-white"
                  : "bg-transparent text-[#667085] hover:bg-[#f8fafc] border border-[#dce3f0]"
              }`}
              style={{ fontFamily: "var(--font-montserrat)" }}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Available now toggle */}
      <label
        htmlFor="filter-available"
        className="flex items-center justify-between cursor-pointer group"
      >
        <span className="text-sm font-semibold text-[#0c0c0b] group-hover:text-[#280f91] transition-colors">
          Chỉ hiện đang nhận lớp
        </span>
        <div className="relative">
          <input
            type="checkbox"
            id="filter-available"
            checked={filters.availableOnly}
            onChange={(e) => update("availableOnly", e.target.checked)}
            className="sr-only"
          />
          <div
            className={`w-10 h-5.5 rounded-full transition-colors duration-200 ${
              filters.availableOnly
                ? "bg-[#280f91]"
                : "bg-[#f2f4f7] border border-[#dce3f0]"
            }`}
          >
            <div
              className={`absolute top-0.5 w-4.5 h-4.5 rounded-full bg-white shadow-sm transition-transform duration-200 ${
                filters.availableOnly ? "translate-x-5 left-0.5" : "left-0.5"
              }`}
            />
          </div>
        </div>
      </label>
    </aside>
  );
}
