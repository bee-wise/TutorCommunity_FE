import type * as React from "react";
import { Button } from "@workspace/ui/components/ui/button";
import { Skeleton } from "@workspace/ui/components/ui/skeleton";
import { getApiErrorMessage } from "@workspace/core/sys-libs/error-handler";
import { interviewStatusLabels } from "@workspace/core/ai-interviews/interview-status";

export const panelClass =
  "rounded-3xl border border-border bg-card p-5 shadow-2xs sm:p-6";
export const actionClass =
  "min-h-11 rounded-full transition-all active:scale-[0.98]";
export const fieldClass =
  "min-h-11 w-full rounded-2xl border border-input bg-background px-3 py-2 text-sm outline-none transition-all focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50";
export function InterviewStatus({ status }: { status: string }) {
  const tone =
    status === "PENDING_REVIEW"
      ? "border-accent/60 bg-accent/20 text-foreground"
      : status === "APPROVED"
        ? "border-secondary/20 bg-secondary/10 text-secondary"
        : status === "REJECTED" || status === "SYSTEM_ERROR"
          ? "border-destructive/20 bg-destructive/10 text-destructive"
          : status === "NEEDS_REVISION"
            ? "border-accent/60 bg-accent/15 text-foreground"
            : "border-border bg-muted text-muted-foreground";
  return (
    <span
      className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-3 py-1.5 text-xs font-bold ${tone}`}
    >
      <span className="size-1.5 rounded-full bg-current" aria-hidden="true" />
      {interviewStatusLabels[status] ?? status}
    </span>
  );
}
export function InterviewQueryState({
  pending,
  error,
  retry,
}: {
  pending: boolean;
  error: unknown;
  retry: () => void;
}) {
  if (pending)
    return (
      <div className="space-y-3">
        <Skeleton className="h-16 rounded-2xl" />
        <Skeleton className="h-64 rounded-3xl" />
      </div>
    );
  if (error)
    return (
      <div role="alert" className={panelClass}>
        <p className="text-sm text-destructive">{getApiErrorMessage(error)}</p>
        <Button
          variant="outline"
          className={`mt-4 ${actionClass}`}
          onClick={retry}
        >
          Thử lại
        </Button>
      </div>
    );
  return null;
}
export function FieldError({ message }: { message?: string }) {
  return message ? (
    <p role="alert" className="mt-1 text-xs text-destructive">
      {message}
    </p>
  ) : null;
}

export function Chip({
  tone = "neutral",
  children,
}: {
  tone?: "neutral" | "flag" | "ok" | "danger";
  children: React.ReactNode;
}) {
  const classes = {
    neutral: "border-border bg-muted text-muted-foreground",
    flag: "border-transparent bg-highlight text-foreground",
    ok: "border-transparent bg-secondary text-secondary-foreground",
    danger: "border-destructive/30 bg-card text-destructive",
  }[tone];
  return (
    <span
      className={`inline-flex items-center gap-1 whitespace-nowrap rounded-full border px-2.5 py-1 text-xs font-bold ${classes}`}
    >
      {children}
    </span>
  );
}
export function ScoreBar({
  value,
  max,
  flagged,
}: {
  value: number | null;
  max: number;
  flagged?: boolean;
}) {
  const percent = value == null ? 0 : Math.min(100, (value / max) * 100);
  return (
    <div
      role="meter"
      aria-valuemin={0}
      aria-valuemax={max}
      aria-valuenow={value ?? undefined}
      className="h-2 w-full overflow-hidden rounded-full bg-muted"
    >
      <div
        className={`h-full rounded-full ${flagged ? "bg-accent" : "bg-primary"}`}
        style={{ width: `${percent}%` }}
      />
    </div>
  );
}
export function SectionTitle({
  icon,
  children,
  aside,
}: {
  icon?: React.ReactNode;
  children: React.ReactNode;
  aside?: React.ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-2">
      <h2 className="flex items-center gap-2.5 font-nunito text-lg font-extrabold">
        {icon && (
          <span className="flex size-8 items-center justify-center rounded-lg bg-muted text-primary [&>svg]:size-5">
            {icon}
          </span>
        )}
        {children}
      </h2>
      {aside}
    </div>
  );
}
