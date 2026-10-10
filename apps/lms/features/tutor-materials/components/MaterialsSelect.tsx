"use client";

import { Select } from "radix-ui";
import { CheckIcon, ChevronDownIcon } from "@heroicons/react/20/solid";

export function MaterialsSelect({ label, value, options, onChange, disabled, id, compact = false }: {
  label: string; value: string; options: readonly { value: string; label: string }[];
  onChange: (value: string) => void; disabled?: boolean; id?: string; compact?: boolean;
}) {
  return (
    <Select.Root value={value} onValueChange={onChange} disabled={disabled}>
      <Select.Trigger id={id} aria-label={label} className={`flex w-full min-w-0 items-center justify-between gap-2 rounded-2xl border border-input bg-card text-sm font-semibold text-foreground outline-none transition-all hover:border-primary active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:text-muted-foreground motion-reduce:transform-none [&>span:first-child]:truncate ${compact ? "h-11 px-3" : "min-h-12 px-4"}`}>
        <Select.Value placeholder={label} /><Select.Icon className="shrink-0"><ChevronDownIcon className="size-4" aria-hidden="true" /></Select.Icon>
      </Select.Trigger>
      <Select.Portal>
        <Select.Content position="popper" sideOffset={6} className="z-50 max-h-72 min-w-[var(--radix-select-trigger-width)] overflow-hidden rounded-2xl border border-border bg-popover p-1.5 text-popover-foreground shadow-soft">
          <Select.ScrollUpButton className="text-center">↑</Select.ScrollUpButton>
          <Select.Viewport>
            {options.map((option) => (
              <Select.Item key={option.value} value={option.value} className="relative flex min-h-11 cursor-pointer items-center rounded-xl py-2 pr-9 pl-3 text-sm outline-none data-[highlighted]:bg-primary data-[highlighted]:text-primary-foreground">
                <Select.ItemText>{option.label}</Select.ItemText>
                <Select.ItemIndicator className="absolute right-3"><CheckIcon className="size-4" aria-hidden="true" /></Select.ItemIndicator>
              </Select.Item>
            ))}
          </Select.Viewport>
          <Select.ScrollDownButton className="text-center">↓</Select.ScrollDownButton>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  );
}
