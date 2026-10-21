"use client";

import { useState } from "react";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  CalendarDaysIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";
import { Button } from "@workspace/ui/components/ui/button";
import { ClassFilterSelect } from "../../tutor-classes/components/ClassFilterSelect";
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
      className="space-y-4 rounded-3xl border border-border bg-card p-4 sm:p-5 shadow-soft"
    >
      <div className="flex flex-wrap items-end justify-between gap-4">
        {/* Quick Month Preset Navigation */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-foreground">
              Chọn nhanh theo tháng
            </span>
            {isCustom && (
              <span className="rounded-md bg-muted px-2 py-0.5 text-[11px] font-bold text-muted-foreground">
                Đang dùng lọc tùy chỉnh
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              className={`${learnerAction} size-11 p-0`}
              aria-label="Tháng trước"
              onClick={() => handleMonthShift(-1)}
            >
              <ChevronLeftIcon className="size-4" aria-hidden="true" />
            </Button>
            <span className="min-w-28 text-center text-sm font-extrabold tabular-nums">
              Tháng {month.split("-").reverse().join("/")}
            </span>
            <Button
              type="button"
              variant="outline"
              className={`${learnerAction} size-11 p-0`}
              aria-label="Tháng sau"
              onClick={() => handleMonthShift(1)}
            >
              <ChevronRightIcon className="size-4" aria-hidden="true" />
            </Button>
          </div>
        </div>

        {/* Status Select */}
        <label className="grid w-full gap-1.5 text-xs font-bold text-foreground sm:w-56">
          <span>Trạng thái buổi</span>
          <ClassFilterSelect
            value={status}
            onValueChange={(value) =>
              onChangeStatus(
                Object.hasOwn(learnerSessionLabels, value)
                  ? (value as typeof status)
                  : "all",
              )
            }
            options={[
              { value: "all", label: "Tất cả trạng thái" },
              ...Object.entries(learnerSessionLabels).map(([val, label]) => ({
                value: val,
                label,
              })),
            ]}
          />
        </label>
      </div>

      {/* Custom Date-Time Range */}
      <div className="border-t border-border/70 pt-4">
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
          <label className="grid gap-1 text-xs font-medium text-foreground">
            <span className="font-semibold text-muted-foreground">Từ ngày giờ</span>
            <input
              type="datetime-local"
              aria-label="Thời gian bắt đầu (giờ Việt Nam)"
              value={fromInput}
              onChange={(e) => {
                setFromInput(e.target.value);
                if (rangeError) setRangeError(null);
              }}
              className="h-10 rounded-xl border border-border bg-card px-3 text-xs font-semibold text-foreground shadow-2xs outline-none transition-colors focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-ring"
            />
          </label>

          <label className="grid gap-1 text-xs font-medium text-foreground">
            <span className="font-semibold text-muted-foreground">Đến ngày giờ</span>
            <input
              type="datetime-local"
              aria-label="Thời gian kết thúc (giờ Việt Nam)"
              value={toInput}
              onChange={(e) => {
                setToInput(e.target.value);
                if (rangeError) setRangeError(null);
              }}
              className="h-10 rounded-xl border border-border bg-card px-3 text-xs font-semibold text-foreground shadow-2xs outline-none transition-colors focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-ring"
            />
          </label>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="default"
              className={`${learnerAction} min-h-10 px-4 text-xs font-bold shadow-2xs`}
              onClick={handleApply}
            >
              <CalendarDaysIcon className="size-4" aria-hidden="true" />
              <span>Áp dụng</span>
            </Button>
            {isCustom && (
              <Button
                type="button"
                variant="outline"
                className={`${learnerAction} min-h-10 px-3 text-xs font-bold text-muted-foreground`}
                onClick={handleResetPreset}
              >
                Hủy lọc tùy chỉnh
              </Button>
            )}
          </div>
        </div>

        {rangeError && (
          <p
            role="alert"
            className="mt-2 text-xs font-bold text-destructive"
          >
            {rangeError}
          </p>
        )}
      </div>
    </section>
  );
}
