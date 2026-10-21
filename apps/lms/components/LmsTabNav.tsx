"use client";

import type { KeyboardEvent } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@workspace/core/helpers/utils";

const tabClass = "inline-flex min-h-11 shrink-0 items-center rounded-[10px] px-3.5 text-[13px] font-bold text-muted-foreground outline-none transition-colors hover:text-primary focus-visible:ring-[3px] focus-visible:ring-ring/50 aria-selected:bg-primary aria-selected:text-primary-foreground aria-[current=page]:bg-primary aria-[current=page]:text-primary-foreground";
const listClass = "inline-flex max-w-full gap-1 overflow-x-auto rounded-[14px] border border-border bg-card p-1";

export interface LmsTabItem<T extends string = string> {
  value: T;
  label: string;
}

interface LmsTabsProps<T extends string> {
  label: string;
  items: LmsTabItem<T>[];
  value: T;
  onChange: (value: T) => void;
  className?: string;
}

/** State-driven segmented tabs (e.g. calendar view). Max 5 items; use a Select beyond that. */
export function LmsTabs<T extends string>({ label, items, value, onChange, className }: LmsTabsProps<T>) {
  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
    const current = items.findIndex((item) => item.value === value);
    const step = event.key === "ArrowRight" ? 1 : -1;
    const next = items[(current + step + items.length) % items.length];
    if (!next) return;
    event.preventDefault();
    onChange(next.value);
    event.currentTarget.querySelector<HTMLElement>(`[data-tab="${next.value}"]`)?.focus();
  };

  return (
    <div role="tablist" aria-label={label} onKeyDown={handleKeyDown} className={cn(listClass, className)}>
      {items.map((item) => (
        <button key={item.value} type="button" role="tab" data-tab={item.value} aria-selected={item.value === value} tabIndex={item.value === value ? 0 : -1} onClick={() => onChange(item.value)} className={tabClass}>
          {item.label}
        </button>
      ))}
    </div>
  );
}

export interface LmsTabNavItem {
  href: string;
  label: string;
  /** Match nested routes too (default: exact match). */
  matchPrefix?: boolean;
}

/** Route-driven tab bar (e.g. class hub). Each tab is a real link, so deep links keep working. */
export function LmsTabNav({ label, items, className }: { label: string; items: LmsTabNavItem[]; className?: string }) {
  const pathname = usePathname();
  return (
    <nav aria-label={label} className={cn(listClass, className)}>
      {items.map((item) => {
        const active = item.matchPrefix ? pathname === item.href || pathname.startsWith(`${item.href}/`) : pathname === item.href;
        return (
          <Link key={item.href} href={item.href} aria-current={active ? "page" : undefined} className={tabClass}>
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
