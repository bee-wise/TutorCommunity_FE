"use client";

import { Select } from "radix-ui";
import { CheckIcon, ChevronDownIcon, MagnifyingGlassIcon } from "@heroicons/react/20/solid";
import { libraryInput, libraryLabel } from "./learner-materials-ui";

export function LibrarySearch({ id, label, value, placeholder, onChange }: {
  id: string; label: string; value: string; placeholder: string; onChange: (value: string) => void;
}) {
  return (
    <label htmlFor={id} className="grid min-w-0 gap-2">
      <span className={libraryLabel}>{label}</span>
      <span className="relative">
        <MagnifyingGlassIcon className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
        <input id={id} type="search" value={value} placeholder={placeholder} onChange={(event) => onChange(event.target.value)} className={`${libraryInput} pl-10`} />
      </span>
    </label>
  );
}

export function LibrarySelect<T extends string>({ id, label, value, options, onChange }: {
  id: string; label: string; value: T; options: readonly { value: T; label: string }[]; onChange: (value: T) => void;
}) {
  return (
    <div className="grid min-w-0 gap-2">
      <label htmlFor={id} className={libraryLabel}>{label}</label>
      <Select.Root value={value} onValueChange={(nextValue) => {
        const option = options.find((item) => item.value === nextValue);
        if (option) onChange(option.value);
      }}>
        <Select.Trigger id={id} aria-label={label} className={`${libraryInput} group flex items-center justify-between gap-3 text-left active:scale-[0.98]`}>
          <Select.Value />
          <Select.Icon><ChevronDownIcon className="size-4 text-muted-foreground transition-transform group-data-[state=open]:rotate-180 motion-reduce:transition-none" aria-hidden="true" /></Select.Icon>
        </Select.Trigger>
        <Select.Portal>
          <Select.Content position="popper" sideOffset={6} align="start" className="z-50 max-h-[var(--radix-select-content-available-height)] min-w-[var(--radix-select-trigger-width)] overflow-y-auto rounded-2xl border border-border bg-popover p-1.5 text-popover-foreground shadow-soft">
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
    </div>
  );
}
