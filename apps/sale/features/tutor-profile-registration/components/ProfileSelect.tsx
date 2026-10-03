"use client";

import { useId, useMemo, useRef, useState } from "react";
import { Check, CaretDown, MagnifyingGlass } from "@phosphor-icons/react";
import { Popover } from "radix-ui";

export interface ProfileSelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export const profileSelectTriggerClass =
  "flex h-11 w-full min-w-0 items-center justify-between gap-2 rounded-xl border border-border bg-card px-3 text-left text-sm font-medium text-foreground outline-none transition hover:border-primary/50 focus-visible:border-primary focus-visible:ring-3 focus-visible:ring-primary/10 disabled:cursor-not-allowed disabled:bg-muted disabled:text-muted-foreground data-[invalid=true]:border-destructive data-[state=open]:border-primary data-[state=open]:ring-3 data-[state=open]:ring-primary/10";

export const profileSelectContentClass =
  "z-50 max-h-[min(320px,var(--radix-popover-content-available-height))] w-[var(--radix-popover-trigger-width)] min-w-[220px] overflow-hidden rounded-2xl border border-border bg-popover p-1.5 text-popover-foreground shadow-xl outline-none";

export const profileSelectOptionClass =
  "flex min-h-10 w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm outline-none transition hover:bg-primary/5 focus-visible:bg-primary/10 disabled:cursor-not-allowed disabled:opacity-50";

function normalizeSearch(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .toLocaleLowerCase("vi")
    .trim();
}

export function ProfileSelect({
  value,
  onChange,
  options,
  placeholder,
  label,
  disabled = false,
  searchable,
  searchPlaceholder = "Tìm trong danh sách...",
  emptyMessage = "Không tìm thấy lựa chọn phù hợp.",
  invalid = false,
  onBlur,
}: {
  value: string;
  onChange: (value: string) => void;
  options: readonly ProfileSelectOption[];
  placeholder: string;
  label: string;
  disabled?: boolean;
  searchable?: boolean;
  searchPlaceholder?: string;
  emptyMessage?: string;
  invalid?: boolean;
  onBlur?: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const searchRef = useRef<HTMLInputElement>(null);
  const optionRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const listId = useId();
  const useSearch = searchable ?? options.length >= 8;
  const selected = options.find((option) => option.value === value);
  const filtered = useMemo(() => {
    const query = normalizeSearch(search);
    return query
      ? options.filter((option) => normalizeSearch(option.label).includes(query))
      : options;
  }, [options, search]);

  const focusOption = (index: number, direction: 1 | -1) => {
    let next = index;
    while (next >= 0 && next < filtered.length) {
      if (!filtered[next]?.disabled) {
        optionRefs.current[next]?.focus();
        return;
      }
      next += direction;
    }
  };

  return (
    <Popover.Root
      open={open}
      onOpenChange={(nextOpen) => {
        setOpen(nextOpen);
        if (!nextOpen) {
          setSearch("");
          onBlur?.();
        }
      }}
    >
      <Popover.Trigger asChild>
        <button
          type="button"
          disabled={disabled}
          aria-label={label}
          data-invalid={invalid || undefined}
          aria-controls={open ? listId : undefined}
          className={profileSelectTriggerClass}
        >
          <span className={`min-w-0 truncate ${selected ? "" : "text-muted-foreground"}`}>
            {selected?.label ?? placeholder}
          </span>
          <CaretDown size={16} aria-hidden="true" className={`shrink-0 text-primary transition-transform ${open ? "rotate-180" : ""}`} />
        </button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          align="start"
          sideOffset={6}
          collisionPadding={12}
          className={profileSelectContentClass}
          onOpenAutoFocus={(event) => {
            if (!useSearch) return;
            event.preventDefault();
            searchRef.current?.focus();
          }}
        >
          {useSearch ? (
            <div className="relative mb-1.5">
              <MagnifyingGlass size={16} aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                ref={searchRef}
                type="search"
                aria-label={`Tìm ${label.toLocaleLowerCase("vi")}`}
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "ArrowDown") {
                    event.preventDefault();
                    focusOption(0, 1);
                  }
                }}
                placeholder={searchPlaceholder}
                className="h-10 w-full rounded-xl border border-border bg-muted/50 pl-9 pr-3 text-sm outline-none placeholder:text-muted-foreground focus:border-primary"
              />
            </div>
          ) : null}
          <div id={listId} role="listbox" aria-label={label} className="max-h-64 overflow-y-auto overscroll-contain">
            {filtered.length ? filtered.map((option, index) => (
              <button
                key={option.value}
                ref={(node) => { optionRefs.current[index] = node; }}
                type="button"
                role="option"
                aria-selected={option.value === value}
                disabled={option.disabled}
                onClick={() => {
                  onChange(option.value);
                  setOpen(false);
                  setSearch("");
                  onBlur?.();
                }}
                onKeyDown={(event) => {
                  if (event.key === "ArrowDown" || event.key === "ArrowUp") {
                    event.preventDefault();
                    focusOption(index + (event.key === "ArrowDown" ? 1 : -1), event.key === "ArrowDown" ? 1 : -1);
                  } else if (event.key === "Home") {
                    event.preventDefault();
                    focusOption(0, 1);
                  } else if (event.key === "End") {
                    event.preventDefault();
                    focusOption(filtered.length - 1, -1);
                  } else if (event.key === "ArrowLeft" && useSearch) {
                    searchRef.current?.focus();
                  }
                }}
                className={`${profileSelectOptionClass} ${option.value === value ? "bg-primary/10 font-semibold text-primary" : "text-foreground"}`}
              >
                <span className="min-w-0 flex-1">{option.label}</span>
                {option.value === value ? <Check size={16} weight="bold" aria-hidden="true" className="shrink-0 text-primary" /> : null}
              </button>
            )) : <p className="px-3 py-4 text-sm text-muted-foreground">{emptyMessage}</p>}
          </div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
