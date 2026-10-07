"use client";

import { Select } from "radix-ui";
import type { Ref } from "react";
import { CaretDown, Check } from "@phosphor-icons/react";
import { inputClass } from "./lms-page-ui";

interface LmsSelectProps {
  id: string;
  value: string;
  options: readonly { value: string; label: string }[];
  onValueChange: (value: string) => void;
  invalid?: boolean;
  describedBy?: string;
  triggerRef?: Ref<HTMLButtonElement>;
  onBlur?: () => void;
}

export function LmsSelect({ id, value, options, onValueChange, invalid, describedBy, triggerRef, onBlur }: LmsSelectProps) {
  return (
    <Select.Root value={value} onValueChange={onValueChange}>
      <Select.Trigger id={id} ref={triggerRef} onBlur={onBlur} aria-invalid={invalid} aria-describedby={describedBy} className={`${inputClass} flex items-center justify-between gap-2 text-left ${invalid ? "border-destructive" : ""}`}>
        <Select.Value />
        <Select.Icon><CaretDown size={16} weight="bold" aria-hidden="true" /></Select.Icon>
      </Select.Trigger>
      <Select.Portal>
        <Select.Content position="popper" sideOffset={6} className="z-50 max-h-[var(--radix-select-content-available-height)] min-w-[var(--radix-select-trigger-width)] overflow-y-auto rounded-2xl border border-border bg-popover p-1.5 shadow-soft">
          <Select.Viewport>
            {options.map((option) => (
              <Select.Item key={option.value} value={option.value} className="relative flex min-h-11 cursor-pointer items-center rounded-xl py-2 pl-3 pr-9 text-sm text-foreground outline-none data-[highlighted]:bg-primary data-[highlighted]:text-primary-foreground">
                <Select.ItemText>{option.label}</Select.ItemText>
                <Select.ItemIndicator className="absolute right-3"><Check size={16} weight="bold" aria-hidden="true" /></Select.ItemIndicator>
              </Select.Item>
            ))}
          </Select.Viewport>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  );
}
