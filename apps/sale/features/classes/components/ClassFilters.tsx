"use client";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@workspace/ui/components/ui/collapsible";
import { ChevronDownIcon, FunnelIcon } from "@heroicons/react/24/outline";
import type { OfferingOption } from "../hooks/useClassOfferingFilters";
import type { TeachingMode } from "../utils/classes.utils";
import { ClassSelect } from "./ClassSelect";

export type AllOr<T extends string> = "all" | T;

export type ClassFilterState = {
  offering: {
    program: string;
    onProgramChange: (value: string) => void;
    programOptions: OfferingOption[];
    programLoading: boolean;
    programSelected: boolean;
    context: string;
    onContextChange: (value: string) => void;
    contextOptions: OfferingOption[];
    contextLoading: boolean;
    item: string;
    onItemChange: (value: string) => void;
    itemOptions: OfferingOption[];
    itemLoading: boolean;
    failed: string;
    onRetry: () => void;
  };
  mode: AllOr<TeachingMode>;
  onModeChange: (value: AllOr<TeachingMode>) => void;
  maxPrice: string;
  onMaxPriceChange: (value: string) => void;
};

const PRICE_OPTIONS = [
  { value: "all", label: "Mọi mức học phí" },
  { value: "180000", label: "Đến 180.000đ" },
  { value: "200000", label: "Đến 200.000đ" },
  { value: "250000", label: "Đến 250.000đ" },
];

const MODE_OPTIONS: Array<{ value: AllOr<TeachingMode>; label: string }> = [
  { value: "all", label: "Tất cả" },
  { value: "ONLINE", label: "Online" },
  { value: "OFFLINE", label: "Trực tiếp" },
];

function FilterField({
  id,
  label,
  children,
}: {
  id: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-xs font-semibold text-foreground">
        {label}
      </label>
      {children}
    </div>
  );
}

function OfferingFilters({
  idPrefix,
  offering,
}: {
  idPrefix: string;
  offering: ClassFilterState["offering"];
}) {
  const placeholder = (all: string, loading: boolean) =>
    !offering.programSelected
      ? "Chọn chương trình trước"
      : loading
        ? "Đang tải..."
        : all;
  return (
    <div className="flex flex-col gap-3.5 border-b border-border pb-6">
      <p className="font-nunito text-sm font-extrabold text-foreground">
        Nhu cầu học tập
      </p>
      <FilterField id={`${idPrefix}-program`} label="Chương trình">
        <ClassSelect
          id={`${idPrefix}-program`}
          value={offering.program}
          onValueChange={offering.onProgramChange}
          options={offering.programOptions}
          placeholder={offering.programLoading ? "Đang tải chương trình..." : "Tất cả"}
          disabled={offering.programOptions.length === 0}
        />
      </FilterField>
      <FilterField id={`${idPrefix}-context`} label="Cấp học / ngữ cảnh">
        <ClassSelect
          id={`${idPrefix}-context`}
          value={offering.context}
          onValueChange={offering.onContextChange}
          options={offering.contextOptions}
          placeholder={placeholder("Tất cả", offering.contextLoading)}
          disabled={!offering.programSelected || offering.contextOptions.length === 0}
        />
      </FilterField>
      <FilterField id={`${idPrefix}-item`} label="Môn / nội dung dạy">
        <ClassSelect
          id={`${idPrefix}-item`}
          value={offering.item}
          onValueChange={offering.onItemChange}
          options={offering.itemOptions}
          placeholder={placeholder("Tất cả", offering.itemLoading)}
          disabled={!offering.programSelected || offering.itemOptions.length === 0}
        />
      </FilterField>
      {offering.failed && (
        <div className="flex flex-wrap items-center gap-2 text-xs leading-5 text-destructive">
          <span>Không tải được {offering.failed}.</span>
          <button
            type="button"
            onClick={offering.onRetry}
            className="font-bold underline underline-offset-2"
          >
            Thử lại
          </button>
        </div>
      )}
    </div>
  );
}

function FilterFields({
  idPrefix,
  offering,
  mode,
  onModeChange,
  maxPrice,
  onMaxPriceChange,
}: ClassFilterState & { idPrefix: string }) {
  return (
    <div className="space-y-6">
      <OfferingFilters idPrefix={idPrefix} offering={offering} />
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
        <div className="mt-2">
          <ClassSelect
            id={`${idPrefix}-price`}
            value={maxPrice}
            onValueChange={onMaxPriceChange}
            options={PRICE_OPTIONS}
          />
        </div>
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
