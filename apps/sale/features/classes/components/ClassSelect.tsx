"use client";

import { cn } from "@workspace/core/helpers/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/ui/select";

// Radix items cannot have an empty value, so "no selection" travels as a sentinel.
const EMPTY = "__empty__";
const toItem = (value: string) => value || EMPTY;

export type ClassSelectOption = { value: string; label: string };

export function ClassSelect({
  id,
  value,
  onValueChange,
  options,
  placeholder,
  disabled,
  className,
}: {
  id: string;
  value: string;
  onValueChange: (value: string) => void;
  options: readonly ClassSelectOption[];
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}) {
  const selected = options.some((option) => toItem(option.value) === toItem(value))
    ? toItem(value)
    : "";
  return (
    <Select
      value={selected}
      onValueChange={(next) => onValueChange(next === EMPTY ? "" : next)}
      disabled={disabled}
    >
      <SelectTrigger id={id} className={cn("min-h-11 rounded-2xl font-medium", className)}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent className="rounded-2xl">
        {options.map((option) => (
          <SelectItem key={toItem(option.value)} value={toItem(option.value)}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
