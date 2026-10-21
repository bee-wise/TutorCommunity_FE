import { cn } from "@workspace/core/helpers/utils";
import { statusDot, statusTone, type StatusTone } from "./lms-status";

export function LmsStatusBadge({ status, label, className }: { status: StatusTone; label: string; className?: string }) {
  return (
    <span className={cn("inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full border px-2.5 py-1 text-xs font-bold", statusTone[status], className)}>
      <span className={cn("size-1.5 rounded-full", statusDot[status])} aria-hidden="true" />
      {label}
    </span>
  );
}
