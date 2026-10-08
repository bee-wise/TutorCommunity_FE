"use client";

import { Select } from "radix-ui";
import { CheckIcon, ChevronDownIcon } from "@heroicons/react/20/solid";
import { classInput } from "./classes-ui";

interface ClassFilterSelectProps {
  id: string;
  value: string;
  options: readonly { value: string; label: string }[];
  onValueChange: (value: string) => void;
}

export function ClassFilterSelect({ id, value, options, onValueChange }: ClassFilterSelectProps) {
  return (
    <Select.Root value={value} onValueChange={onValueChange}>
      <Select.Trigger id={id} className={`${classInput} flex items-center justify-between gap-3 text-left active:scale-[0.98]`}>
        <Select.Value />
        <Select.Icon><ChevronDownIcon className="size-4 text-muted-foreground" aria-hidden="true" /></Select.Icon>
      </Select.Trigger>
      <Select.Portal>
        <Select.Content position="popper" sideOffset={6} className="z-50 max-h-[var(--radix-select-content-available-height)] min-w-[var(--radix-select-trigger-width)] overflow-y-auto rounded-2xl border border-border bg-popover p-1.5 shadow-soft">
          <Select.Viewport>
            {options.map((option) => (
              <Select.Item key={option.value} value={option.value} className="relative flex min-h-11 cursor-pointer items-center rounded-xl py-2 pl-3 pr-9 text-sm outline-none transition-all active:scale-[0.98] data-[highlighted]:bg-muted data-[highlighted]:text-primary data-[state=checked]:font-bold motion-reduce:transition-none">
                <Select.ItemText>{option.label}</Select.ItemText>
                <Select.ItemIndicator className="absolute right-3"><CheckIcon className="size-4 text-primary" aria-hidden="true" /></Select.ItemIndicator>
              </Select.Item>
            ))}
          </Select.Viewport>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  );
}
