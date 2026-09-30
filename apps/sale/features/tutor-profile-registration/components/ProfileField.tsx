import type { ReactNode } from "react";

export function ProfileField({
  label,
  error,
  hint,
  required = false,
  children,
}: {
  label: ReactNode;
  error?: string;
  hint?: string;
  required?: boolean;
  children: ReactNode;
}) {
  return (
    <label className="grid gap-1.5 text-sm font-semibold text-foreground">
      <span>
        {label}
        {required ? <span className="ml-1 text-destructive">*</span> : null}
      </span>
      {children}
      {error ? <span className="text-xs font-medium text-destructive">{error}</span> : null}
      {!error && hint ? <span className="text-xs font-normal leading-5 text-muted-foreground">{hint}</span> : null}
    </label>
  );
}

export const profileInputClass =
  "h-11 w-full rounded-xl border border-border bg-card px-3 text-sm text-foreground outline-none transition placeholder:text-muted-foreground/60 focus:border-primary focus:ring-3 focus:ring-primary/10 disabled:bg-muted";

export const profileTextareaClass =
  "min-h-28 w-full resize-y rounded-xl border border-border bg-card px-3 py-2.5 text-sm leading-6 text-foreground outline-none transition placeholder:text-muted-foreground/60 focus:border-primary focus:ring-3 focus:ring-primary/10";

