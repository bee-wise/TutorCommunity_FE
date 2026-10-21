import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowRightIcon } from "@heroicons/react/24/outline";

interface LmsSectionProps {
  title: string;
  /** Renders the "Xem tất cả" chip when set. */
  href?: string;
  hrefLabel?: string;
  actions?: ReactNode;
  children: ReactNode;
}

export function LmsSection({ title, href, hrefLabel = "Xem tất cả", actions, children }: LmsSectionProps) {
  return (
    <section className="space-y-3.5">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-lg font-extrabold">{title}</h2>
        <div className="flex items-center gap-2">
          {actions}
          {href && (
            <Link href={href} className="inline-flex min-h-8 items-center gap-1.5 rounded-lg border border-border bg-background px-2.5 py-1 text-xs font-bold outline-none hover:bg-muted focus-visible:ring-[3px] focus-visible:ring-ring/50 active:scale-95">
              {hrefLabel}
              <ArrowRightIcon className="size-3.5" aria-hidden />
            </Link>
          )}
        </div>
      </div>
      {children}
    </section>
  );
}
