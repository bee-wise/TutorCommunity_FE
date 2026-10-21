"use client";

import { useState } from "react";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  CalendarDaysIcon,
  AdjustmentsHorizontalIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";
import { Button } from "@workspace/ui/components/ui/button";
import {
  learnerSessionLabels,
  validateCustomRange,
} from "../utils/learner-api-calendar";
import type { LearnerSessionFilters } from "../services/learner-classes.service";
import { learnerAction } from "./LearnerApiClassCard";

interface LearnerSessionFilterBarProps {
  month: string;
  isCustom: boolean;
  status: LearnerSessionFilters["status"];
  onChangeMonth: (offset: number) => void;
  onApplyCustomRange: (from: string, to: string) => void;
  onResetMonthPreset: () => void;
  onChangeStatus: (status: LearnerSessionFilters["status"]) => void;
}

const dateTimeInput =
  "h-11 rounded-xl border border-input bg-card px-3 text-sm font-semibold text-foreground outline-none transition-colors focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-ring";

export function LearnerSessionFilterBar({
  month,
  isCustom,
  status,
  onChangeMonth,
  onApplyCustomRange,
  onResetMonthPreset,
  onChangeStatus,
}: LearnerSessionFilterBarProps) {
  const [fromInput, setFromInput] = useState("");
  const [toInput, setToInput] = useState("");
  const [rangeError, setRangeError] = useState<string | null>(null);
  const [showRange, setShowRange] = useState(false);

  const handleApply = () => {
    const result = validateCustomRange(fromInput, toInput);
    if (!result.valid) {
      setRangeError(result.error);
      return;
    }
    setRangeError(null);
    onApplyCustomRange(result.from, result.to);
  };

  const handleResetPreset = () => {
    setRangeError(null);
    setFromInput("");
    setToInput("");
    onResetMonthPreset();
  };

  const handleMonthShift = (offset: number) => {
    setRangeError(null);
    onChangeMonth(offset);
  };

  return (
    <section
      aria-label="Bộ lọc buổi học"
      className="space-y-3 rounded-3xl border border-border bg-card p-3 shadow-soft sm:p-4"
    >
      <div className="flex flex-wrap items-center gap-3">
        {/* Month stepper */}
        <div className="flex items-center gap-1 rounded-full bg-muted p-1">
          <Button
            type="button"
            variant="ghost"
            className="size-10 rounded-full p-0 hover:bg-card"
            aria-label="Tháng trước"
            onClick={() => handleMonthShift(-1)}
          >
            <ChevronLeftIcon className="size-4" aria-hidden="true" />
          </Button>
          <span className="min-w-32 px-1 text-center text-sm font-extrabold tabular-nums text-foreground">
            {isCustom ? "Tùy chỉnh" : `Tháng ${month.split("-").reverse().join("/")}`}
          </span>
          <Button
            type="button"
            variant="ghost"
            className="size-10 rounded-full p-0 hover:bg-card"
            aria-label="Tháng sau"
            onClick={() => handleMonthShift(1)}
          >
            <ChevronRightIcon className="size-4" aria-hidden="true" />
          </Button>
        </div>

        {/* Status chips */}
        <div
          role="group"
          aria-label="Trạng thái buổi học"
          className="flex min-w-0 flex-1 gap-1.5 overflow-x-auto pb-0.5"
        >
          {[["all", "Tất cả"], ...Object.entries(learnerSessionLabels)].map(
            ([value, label]) => (
              <button
                key={value}
                type="button"
                aria-pressed={status === value}
                onClick={() =>
                  onChangeStatus(
                    value === "all" || Object.hasOwn(learnerSessionLabels, value)
                      ? (value as typeof status)
                      : "all",
                  )
                }
                className={`min-h-10 shrink-0 whitespace-nowrap rounded-full px-4 text-xs font-bold transition-all active:scale-[0.98] motion-reduce:transition-none ${
                  status === value
                    ? "bg-primary text-primary-foreground shadow-xs"
                    : "bg-muted text-muted-foreground hover:text-primary"
                }`}
              >
                {label}
              </button>
            ),
          )}
        </div>

        <Button
          type="button"
          variant="outline"
          aria-expanded={showRange || isCustom}
          className={`${learnerAction} px-3.5 text-xs font-bold`}
          onClick={() => setShowRange((value) => !value)}
        >
          <AdjustmentsHorizontalIcon className="size-4 text-primary" aria-hidden="true" />
          Khoảng ngày giờ
        </Button>
      </div>

      {(showRange || isCustom) && (
        <div className="rounded-2xl bg-muted p-3.5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-xs font-bold text-foreground">
              Lọc theo khoảng ngày - giờ · Giờ Việt Nam (UTC+7)
            </p>
            {isCustom && (
              <button
                type="button"
                onClick={handleResetPreset}
                className="inline-flex items-center gap-1 text-xs font-bold text-primary transition-colors hover:text-primary/80"
              >
                <ArrowPathIcon className="size-3.5" aria-hidden="true" />
                <span>Đặt lại theo tháng</span>
              </button>
            )}
          </div>

          <div className="mt-2.5 flex flex-wrap items-end gap-3">
            <label className="grid gap-1 text-xs">
              <span className="font-semibold text-muted-foreground">Từ ngày giờ</span>
              <input
                type="datetime-local"
                aria-label="Thời gian bắt đầu (giờ Việt Nam)"
                value={fromInput}
                onChange={(e) => {
                  setFromInput(e.target.value);
                  if (rangeError) setRangeError(null);
                }}
                className={dateTimeInput}
              />
            </label>

            <label className="grid gap-1 text-xs">
              <span className="font-semibold text-muted-foreground">Đến ngày giờ</span>
              <input
                type="datetime-local"
                aria-label="Thời gian kết thúc (giờ Việt Nam)"
                value={toInput}
                onChange={(e) => {
                  setToInput(e.target.value);
                  if (rangeError) setRangeError(null);
                }}
                className={dateTimeInput}
              />
            </label>

            <Button
              type="button"
              className={`${learnerAction} px-4 text-xs font-bold`}
              onClick={handleApply}
            >
              <CalendarDaysIcon className="size-4" aria-hidden="true" />
              <span>Áp dụng</span>
            </Button>
          </div>

          {rangeError && (
            <p role="alert" className="mt-2 text-xs font-bold text-destructive">
              {rangeError}
            </p>
          )}
        </div>
      )}
    </section>
  );
}
