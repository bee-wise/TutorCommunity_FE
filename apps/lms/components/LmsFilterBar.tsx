import type { ReactNode } from "react";
import { cn } from "@workspace/core/helpers/utils";

export interface LmsFilterOption<T extends string = string> {
  value: T;
  label: string;
}

interface LmsFilterBarProps<T extends string> {
  label: string;
  options: LmsFilterOption<T>[];
  value: T;
  onChange: (value: T) => void;
  /** Trailing controls such as search or a sort Select. */
  trailing?: ReactNode;
  className?: string;
}

export function LmsFilterBar<T extends string>({ label, options, value, onChange, trailing, className }: LmsFilterBarProps<T>) {
  return (
    <div className={cn("flex flex-wrap items-center justify-between gap-3", className)}>
      <div role="group" aria-label={label} className="flex flex-wrap gap-2">
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            aria-pressed={option.value === value}
            onClick={() => onChange(option.value)}
            className="inline-flex min-h-11 items-center rounded-lg border border-border bg-card px-3.5 text-[13px] font-bold text-muted-foreground outline-none transition-colors hover:bg-muted hover:text-primary focus-visible:ring-[3px] focus-visible:ring-ring/50 aria-pressed:border-primary aria-pressed:bg-primary aria-pressed:text-primary-foreground"
          >
            {option.label}
          </button>
        ))}
      </div>
      {trailing}
    </div>
  );
}
