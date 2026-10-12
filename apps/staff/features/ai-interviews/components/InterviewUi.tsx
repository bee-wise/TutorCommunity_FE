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
