import type { ReactNode } from "react";
import Link from "next/link";
import { cn } from "@workspace/core/helpers/utils";

interface LmsEntityCardProps {
  title: string;
  /** Icon tile on the left. */
  icon?: ReactNode;
  /** Status badge, read as status. */
  status?: ReactNode;
  /** Subordinate metadata line(s). */
  meta?: ReactNode;
  /** At most one primary CTA. Not allowed together with `href`. */
  action?: ReactNode;
  /** Makes the whole card one link. */
  href?: string;
  className?: string;
}

const baseClass = "flex min-w-0 items-center gap-3.5 rounded-3xl border border-border bg-card p-5 shadow-soft";
const linkClass = "transition-[transform,box-shadow] duration-300 ease-[var(--ease-soft)] hover:-translate-y-1 hover:shadow-soft-hover focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 motion-reduce:transform-none";

export function LmsEntityCard({ title, icon, status, meta, action, href, className }: LmsEntityCardProps) {
  const body = (
    <>
      {icon && <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-muted text-primary [&>svg]:size-5">{icon}</span>}
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-extrabold">{title}</p>
        {meta && <div className="mt-0.5 text-xs text-muted-foreground">{meta}</div>}
      </div>
      {status}
      {!href && action}
    </>
  );
  if (href) return <Link href={href} className={cn(baseClass, linkClass, className)}>{body}</Link>;
  return <div className={cn(baseClass, className)}>{body}</div>;
}
