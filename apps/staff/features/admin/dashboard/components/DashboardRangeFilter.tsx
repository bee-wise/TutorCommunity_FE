"use client";

import type { DashboardRangePreset } from "../data/dashboardRange";
import { formatDateInput } from "../data/dashboardRange";

const options: { key: DashboardRangePreset; label: string }[] = [
  { key: "today", label: "Hôm nay" },
  { key: "7d", label: "7 ngày" },
  { key: "30d", label: "30 ngày" },
  { key: "custom", label: "Tùy chọn" },
];

export function DashboardRangeFilter({
  preset,
  onPresetChange,
  customFrom,
  customTo,
  onCustomFromChange,
  onCustomToChange,
  referenceDate,
  invalid,
}: {
  preset: DashboardRangePreset;
  onPresetChange: (preset: DashboardRangePreset) => void;
  customFrom: string;
  customTo: string;
  onCustomFromChange: (value: string) => void;
  onCustomToChange: (value: string) => void;
  referenceDate: Date;
  invalid: boolean;
}) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap gap-1 rounded-xl border border-border bg-card p-1" role="group" aria-label="Khoảng thời gian dashboard">
        {options.map((option) => (
          <button
            key={option.key}
            type="button"
            onClick={() => onPresetChange(option.key)}
            aria-pressed={preset === option.key}
            className={`rounded-lg px-3 py-2 text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${preset === option.key ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}
          >
            {option.label}
          </button>
        ))}
      </div>
      {preset === "custom" && (
        <div className="flex flex-wrap items-end gap-3 rounded-xl border border-border bg-card p-3">
          <label className="flex flex-col gap-1 text-xs font-medium text-muted-foreground">
            Từ ngày
            <input type="date" value={customFrom} max={formatDateInput(referenceDate)} onChange={(event) => onCustomFromChange(event.target.value)} className="rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" />
          </label>
          <label className="flex flex-col gap-1 text-xs font-medium text-muted-foreground">
            Đến ngày
            <input type="date" value={customTo} max={formatDateInput(referenceDate)} onChange={(event) => onCustomToChange(event.target.value)} className="rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" />
          </label>
          {invalid && <p role="alert" className="text-xs font-medium text-destructive">Chọn khoảng ngày hợp lệ, không vượt quá hôm nay.</p>}
        </div>
      )}
    </div>
  );
}
