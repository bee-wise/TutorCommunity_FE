"use client";

import { useState } from "react";
import {
  FunnelIcon,
  XIcon,
} from "@phosphor-icons/react";
import type { TutorFilters } from "../data/types";

const ALL_SUBJECTS = [
  "Toán",
  "Vật Lý",
  "Hóa Học",
  "Sinh Học",
  "Ngữ Văn",
  "Tiếng Anh",
  "Tiếng Nhật",
  "Lịch Sử",
  "Địa Lý",
  "Tin Học",
  "Lập Trình",
] as const;

const PRICE_OPTIONS = [
  { label: "Dưới 150.000đ", value: 150000 },
  { label: "Dưới 250.000đ", value: 250000 },
  { label: "Dưới 350.000đ", value: 350000 },
] as const;

const RATING_OPTIONS = [
  { label: "4.5+", value: 4.5 },
  { label: "4.0+", value: 4.0 },
] as const;

interface FilterPanelProps {
  filters: TutorFilters;
  onFiltersChange: (filters: TutorFilters) => void;
}

export function FilterPanel({
  filters,
  onFiltersChange,
}: FilterPanelProps) {
  const [showAllSubjects, setShowAllSubjects] = useState(false);
  const update = <K extends keyof TutorFilters>(key: K, value: TutorFilters[K]) =>
    onFiltersChange({ ...filters, [key]: value });

  const toggleSubject = (subject: (typeof ALL_SUBJECTS)[number]) => {
    const current = filters.subjects as string[];
    const updated = current.includes(subject)
      ? current.filter((s) => s !== subject)
      : [...current, subject];
    update("subjects", updated as TutorFilters["subjects"]);
  };

  const activeFilterCount =
    (filters.subjects.length > 0 ? 1 : 0) +
    (filters.teachingMode !== "all" ? 1 : 0) +
    (filters.level !== "all" ? 1 : 0) +
    (filters.maxPricePerSession !== null ? 1 : 0) +
    (filters.minRating !== null ? 1 : 0) +
    (filters.availableOnly ? 1 : 0);

  const resetAll = () =>
    onFiltersChange({
      subjects: [],
      teachingMode: "all",
      level: "all",
      maxPricePerSession: null,
      minRating: null,
      availableOnly: false,
      sortBy: filters.sortBy,
    });

  return (
    <aside
      className="flex flex-col gap-5"
      aria-label="Bộ lọc tìm kiếm gia sư"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FunnelIcon size={16} className="text-primary" aria-hidden="true" />
          <span
            className="text-sm font-bold text-foreground"
            style={{ fontFamily: "var(--font-montserrat)" }}
          >
            Bộ lọc
          </span>
          {activeFilterCount > 0 && (
            <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white">
              {activeFilterCount}
            </span>
          )}
        </div>
        {activeFilterCount > 0 && (
          <button
            type="button"
            onClick={resetAll}
            className="inline-flex items-center gap-1 text-xs text-foreground/50 hover:text-primary transition-colors"
            id="filter-reset"
          >
            <XIcon size={12} aria-hidden="true" />
            Xóa tất cả
          </button>
        )}
      </div>

      {/* Subjects */}
      <div className="flex flex-col gap-2.5">
        <span
          className="text-xs font-semibold text-foreground/70 uppercase tracking-wide"
          style={{ fontFamily: "var(--font-montserrat)" }}
        >
          Môn học
        </span>
        <div className="flex flex-wrap gap-1.5" role="group" aria-label="Lọc theo môn học">
          {(showAllSubjects ? ALL_SUBJECTS : ALL_SUBJECTS.slice(0, 6)).map((subject) => {
            const isSelected = (filters.subjects as string[]).includes(subject);
            return (
              <button
                key={subject}
                type="button"
                onClick={() => toggleSubject(subject)}
                aria-pressed={isSelected}
                className={`rounded-full px-3 py-1 text-xs font-semibold transition-all duration-150 ${
                  isSelected
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "bg-muted/70 text-foreground/60 hover:bg-muted border border-border"
                }`}
                style={{ fontFamily: "var(--font-montserrat)" }}
              >
                {subject}
              </button>
            );
          })}
        </div>
        <button
          type="button"
          onClick={() => setShowAllSubjects((value) => !value)}
          className="w-fit text-xs font-bold text-primary hover:underline"
        >
          {showAllSubjects ? "Thu gọn" : `Xem thêm ${ALL_SUBJECTS.length - 6} môn`}
        </button>
      </div>

      {/* Teaching mode */}
      <div className="flex flex-col gap-2.5">
        <span
          className="text-xs font-semibold text-foreground/70 uppercase tracking-wide"
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
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted/70 text-foreground/60 hover:bg-muted border border-border"
              }`}
              style={{ fontFamily: "var(--font-montserrat)" }}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tutor level */}
      <div className="flex flex-col gap-2.5">
        <span
          className="text-xs font-semibold text-foreground/70 uppercase tracking-wide"
          style={{ fontFamily: "var(--font-montserrat)" }}
        >
          Loại gia sư
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
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted/60 text-foreground/60 hover:bg-muted border border-border"
              }`}
              style={{ fontFamily: "var(--font-montserrat)" }}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Price filter */}
      <div className="flex flex-col gap-2.5">
        <span
          className="text-xs font-semibold text-foreground/70 uppercase tracking-wide"
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
                ? "bg-primary text-primary-foreground"
                : "bg-muted/60 text-foreground/60 hover:bg-muted border border-border"
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
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted/60 text-foreground/60 hover:bg-muted border border-border"
              }`}
              style={{ fontFamily: "var(--font-montserrat)" }}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Rating filter */}
      <div className="flex flex-col gap-2.5">
        <span
          className="text-xs font-semibold text-foreground/70 uppercase tracking-wide"
          style={{ fontFamily: "var(--font-montserrat)" }}
        >
          Đánh giá tối thiểu
        </span>
        <div className="flex flex-col gap-1.5">
          <button
            type="button"
            onClick={() => update("minRating", null)}
            aria-pressed={filters.minRating === null}
            className={`rounded-xl px-3 py-2 text-xs font-semibold text-left transition-all duration-150 ${
              filters.minRating === null
                ? "bg-primary text-primary-foreground"
                : "bg-muted/60 text-foreground/60 hover:bg-muted border border-border"
            }`}
            style={{ fontFamily: "var(--font-montserrat)" }}
          >
            Tất cả
          </button>
          {RATING_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => update("minRating", opt.value)}
              aria-pressed={filters.minRating === opt.value}
              className={`rounded-xl px-3 py-2 text-xs font-semibold text-left transition-all duration-150 ${
                filters.minRating === opt.value
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted/60 text-foreground/60 hover:bg-muted border border-border"
              }`}
              style={{ fontFamily: "var(--font-montserrat)" }}
            >
              ★ {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Available now toggle */}
      <label
        htmlFor="filter-available"
        className="flex items-center justify-between cursor-pointer"
      >
        <span className="text-sm text-foreground/70">Chỉ hiện đang nhận lớp</span>
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
              filters.availableOnly ? "bg-primary" : "bg-muted border border-border"
            }`}
          >
            <div
              className={`absolute top-0.5 w-4.5 h-4.5 rounded-full bg-background shadow-sm transition-transform duration-200 ${
                filters.availableOnly ? "translate-x-5 left-0.5" : "left-0.5"
              }`}
            />
          </div>
        </div>
      </label>
    </aside>
  );
}
