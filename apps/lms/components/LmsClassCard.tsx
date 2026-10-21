import type { ReactNode } from "react";
import Link from "next/link";
import { ChevronRightIcon } from "@heroicons/react/24/outline";
import { cn } from "@workspace/core/helpers/utils";

interface LmsClassCardProps {
  href: string;
  ariaLabel: string;
  /** Lĩnh vực, shown as a quiet eyebrow. Falls back to `kindLabel`. */
  field?: string;
  kindLabel: string;
  status: ReactNode;
  subject: string;
  /** Class title, only when it differs from subject and level. */
  name?: string;
  level?: string;
  /** Middle block, e.g. who is in the class. */
  children?: ReactNode;
  /** Label/value pairs along the bottom, at most three. */
  meta?: { label: string; value: string }[];
  /** Highlighted warning above the call to action. */
  alert?: ReactNode;
  cta: string;
}

/** The one class card for tutor and learner lists: same entity, same hierarchy. The whole card is one link. */
export function LmsClassCard({ href, ariaLabel, field, kindLabel, status, subject, name, level, children, meta, alert, cta }: LmsClassCardProps) {
  return (
    <Link
      href={href}
      aria-label={ariaLabel}
      className="group flex h-full min-w-0 flex-col gap-4 rounded-3xl border border-border bg-card p-5 shadow-soft outline-none transition-[transform,box-shadow] duration-300 ease-[var(--ease-soft)] hover:-translate-y-1 hover:shadow-soft-hover focus-visible:ring-[3px] focus-visible:ring-ring/50 active:scale-[0.98] motion-reduce:transform-none"
    >
      <div className="flex items-center justify-between gap-2">
        <span className="min-w-0 truncate text-xs font-bold text-muted-foreground">{field ?? kindLabel}</span>
        {status}
      </div>

      <div className="space-y-2">
        <h2 className="font-lms text-lg font-extrabold leading-6 [overflow-wrap:anywhere]">{subject}</h2>
        {name && <p className="text-xs leading-5 text-muted-foreground [overflow-wrap:anywhere]">{name}</p>}
        <div className="flex flex-wrap gap-1.5">
          {level && <span className="rounded-lg bg-muted px-2 py-1 text-[11px] font-bold text-primary">{level}</span>}
          {field && <span className="rounded-lg bg-muted px-2 py-1 text-[11px] font-bold text-muted-foreground">{kindLabel}</span>}
        </div>
      </div>

      {children}

      {meta && meta.length > 0 && (
        <dl className={cn("grid gap-3 border-t border-border pt-4 text-xs", meta.length === 1 ? "grid-cols-1" : meta.length === 2 ? "grid-cols-2" : "grid-cols-3")}>
          {meta.map((item) => (
            <div key={item.label} className="min-w-0">
              <dt className="text-muted-foreground">{item.label}</dt>
              <dd className="mt-0.5 truncate font-bold tabular-nums">{item.value}</dd>
            </div>
          ))}
        </dl>
      )}

      <div className="mt-auto space-y-3">
        {alert}
        <span className="flex min-h-11 items-center justify-between rounded-xl border border-border px-4 text-sm font-bold text-primary transition-colors group-hover:border-primary group-hover:bg-primary group-hover:text-primary-foreground">
          {cta}
          <ChevronRightIcon className="size-4" aria-hidden="true" />
        </span>
      </div>
    </Link>
  );
}
