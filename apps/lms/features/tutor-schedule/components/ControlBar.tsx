"use client";

import { CalendarDays, List, ChevronDown, Check } from "lucide-react";
import { useState } from "react";
import { cn } from '@workspace/core/helpers/utils';
import type { ViewMode, FilterState } from "../types/schedule.types";
import { SUBJECT_OPTIONS, STATUS_OPTIONS } from "../types/schedule.types";

interface ControlBarProps {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  filters: FilterState;
  onSubjectChange: (value: string) => void;
  onStatusChange: (value: string) => void;
}

// Minimal dropdown since existing dropdown-menu uses radix and needs careful usage
function FilterDropdown({
  options,
  value,
  onChange,
  placeholder,
}: {
  options: { value: string; label: string }[];
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
}) {
  const [open, setOpen] = useState(false);
  const selected = options.find((o) => o.value === value);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((p) => !p)}
        className="flex items-center gap-2 h-9 pl-3 pr-2 rounded-xl border border-border/60 bg-white text-sm font-medium text-foreground shadow-xs hover:bg-muted/50 hover:border-[#280f91]/30 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#280f91]/40 select-none min-w-[160px]"
      >
        <span className="flex-1 text-left truncate">
          {selected?.label ?? placeholder}
        </span>
        <ChevronDown
          className={cn(
            "size-4 text-muted-foreground shrink-0 transition-transform duration-200",
            open && "rotate-180",
          )}
          strokeWidth={1.75}
        />
      </button>

      {open && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setOpen(false)}
          />
          <div className="absolute top-full mt-1.5 right-0 z-20 w-full min-w-[160px] bg-white border border-border/60 rounded-xl shadow-lg py-1 overflow-hidden">
            {options.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => {
                  onChange(opt.value);
                  setOpen(false);
                }}
                className={cn(
                  "flex items-center gap-2 w-full text-left px-3 py-2 text-sm transition-colors hover:bg-muted/60",
                  value === opt.value
                    ? "text-[#280f91] font-semibold"
                    : "text-foreground",
                )}
              >
                <span className="flex-1">{opt.label}</span>
                {value === opt.value && (
                  <Check className="size-3.5 text-[#280f91] shrink-0" strokeWidth={2.5} />
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export function ControlBar({
  viewMode,
  onViewModeChange,
  filters,
  onSubjectChange,
  onStatusChange,
}: ControlBarProps) {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
      {/* Left: View mode toggle */}
      <div className="flex items-center gap-1 p-1 bg-muted/60 rounded-xl border border-border/40">
        <button
          type="button"
          onClick={() => onViewModeChange("calendar")}
          className={cn(
            "flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm font-semibold transition-all duration-200 select-none",
            viewMode === "calendar"
              ? "bg-white text-[#280f91] shadow-sm border border-border/50"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          <CalendarDays className="size-4 shrink-0" strokeWidth={1.75} />
          Lịch tháng
        </button>
        <button
          type="button"
          onClick={() => onViewModeChange("list")}
          className={cn(
            "flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm font-semibold transition-all duration-200 select-none",
            viewMode === "list"
              ? "bg-white text-[#280f91] shadow-sm border border-border/50"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          <List className="size-4 shrink-0" strokeWidth={1.75} />
          Danh sách
        </button>
      </div>

      {/* Right: Filters */}
      <div className="flex items-center gap-2">
        <span className="text-xs font-medium text-muted-foreground hidden sm:inline">
          Lọc:
        </span>
        <FilterDropdown
          options={SUBJECT_OPTIONS}
          value={filters.subject}
          onChange={onSubjectChange}
          placeholder="Tất cả môn"
        />
        <FilterDropdown
          options={STATUS_OPTIONS}
          value={filters.status}
          onChange={onStatusChange}
          placeholder="Tất cả trạng thái"
        />
      </div>
    </div>
  );
}
