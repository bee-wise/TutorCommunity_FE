import type { ElementType, ReactNode } from "react";
import Link from "next/link";
import { ChevronRightIcon } from "@heroicons/react/24/outline";

export interface LmsLinkItem {
  href: string;
  icon: ElementType;
  label: string;
  /** Short figure or hint shown under the label. */
  hint?: ReactNode;
}

/** Where to go next from a record: one row per destination, the whole row is the link. */
export function LmsLinkList({ title, items }: { title: string; items: LmsLinkItem[] }) {
  return (
    <section aria-label={title} className="overflow-hidden rounded-3xl border border-border bg-card shadow-soft">
      <h2 className="border-b border-border px-5 py-4 font-lms text-base font-extrabold">{title}</h2>
      <ul className="divide-y divide-border">
        {items.map(({ href, icon: Icon, label, hint }) => (
          <li key={label}>
            <Link href={href} className="flex min-h-14 items-center gap-3 px-5 py-3 outline-none transition-colors hover:bg-muted focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-muted text-primary"><Icon className="size-[18px]" aria-hidden="true" /></span>
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-bold">{label}</span>
                {hint && <span className="mt-0.5 block text-xs text-muted-foreground">{hint}</span>}
              </span>
              <ChevronRightIcon className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
