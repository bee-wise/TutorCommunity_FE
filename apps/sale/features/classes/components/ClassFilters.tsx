"use client";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@workspace/ui/components/ui/collapsible";
import { ChevronDownIcon, FunnelIcon } from "@heroicons/react/24/outline";
import type { TeachingMode } from "../utils/classes.utils";

export type AllOr<T extends string> = "all" | T;

export type ClassFilterState = {
  mode: AllOr<TeachingMode>;
  onModeChange: (value: AllOr<TeachingMode>) => void;
  maxPrice: string;
  onMaxPriceChange: (value: string) => void;
};

const MODE_OPTIONS: Array<{ value: AllOr<TeachingMode>; label: string }> = [
  { value: "all", label: "Tất cả" },
  { value: "ONLINE", label: "Online" },
  { value: "OFFLINE", label: "Trực tiếp" },
];

function FilterFields({
  idPrefix,
  mode,
  onModeChange,
  maxPrice,
  onMaxPriceChange,
}: ClassFilterState & { idPrefix: string }) {
  return (
    <div className="space-y-6">
      <fieldset>
        <legend className="text-sm font-bold text-foreground">
          Hình thức học
        </legend>
        <div className="mt-2 grid grid-cols-3 gap-1 rounded-full bg-muted p-1">
          {MODE_OPTIONS.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => onModeChange(option.value)}
              aria-pressed={mode === option.value}
              className={`min-h-9 rounded-full px-1.5 text-xs font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${mode === option.value ? "bg-background text-primary shadow-soft" : "text-muted-foreground hover:text-foreground"}`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </fieldset>
      <div>
        <label
          htmlFor={`${idPrefix}-price`}
          className="text-sm font-bold text-foreground"
        >
          Học phí mỗi buổi
        </label>
        <select
          id={`${idPrefix}-price`}
          value={maxPrice}
          onChange={(event) => onMaxPriceChange(event.target.value)}
          className="mt-2 min-h-11 w-full rounded-2xl border border-border bg-background px-4 text-sm font-medium text-foreground outline-none transition-colors focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20"
        >
          <option value="all">Mọi mức học phí</option>
          <option value="180000">Đến 180.000đ</option>
          <option value="200000">Đến 200.000đ</option>
          <option value="250000">Đến 250.000đ</option>
        </select>
      </div>
    </div>
  );
}

export function ClassFiltersSidebar({
  onReset,
  ...filters
}: ClassFilterState & { onReset: () => void }) {
  return (
    <aside
      className="hidden rounded-3xl border border-border bg-background p-5 shadow-soft lg:sticky lg:top-24 lg:block"
      aria-label="Bộ lọc lớp học"
    >
      <div className="mb-6 flex items-center justify-between">
        <h2 className="font-nunito text-lg font-extrabold text-foreground">
          Bộ lọc
        </h2>
        <button
          type="button"
          onClick={onReset}
          className="rounded-full px-2 py-1 text-xs font-bold text-primary hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          Xóa tất cả
        </button>
      </div>
      <FilterFields {...filters} idPrefix="desktop-class" />
    </aside>
  );
}

export function ClassFiltersCollapsible({
  activeCount,
  onReset,
  ...filters
}: ClassFilterState & { activeCount: number; onReset: () => void }) {
  return (
    <Collapsible className="group mt-5 rounded-3xl border border-border bg-background shadow-soft lg:hidden">
      <CollapsibleTrigger className="flex min-h-12 w-full items-center justify-between rounded-3xl px-5 text-sm font-bold text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
        <span className="flex items-center gap-2">
          <FunnelIcon className="size-5" />
          Bộ lọc
        </span>
        <span className="flex items-center gap-2">
          {activeCount > 0 && (
            <span className="rounded-full bg-primary px-2 py-0.5 text-xs text-primary-foreground">
              {activeCount}
            </span>
          )}
          <ChevronDownIcon className="size-4 text-muted-foreground transition-transform duration-200 group-data-[state=open]:rotate-180" />
        </span>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="border-t border-border p-5">
          <FilterFields {...filters} idPrefix="mobile-class" />
          <button
            type="button"
            onClick={onReset}
            className="mt-5 rounded-full border border-border bg-background px-3 py-1.5 text-xs font-bold text-primary hover:bg-muted active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            Xóa bộ lọc
          </button>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
