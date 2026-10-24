import type { ReactNode } from "react";
import { ExclamationCircleIcon } from "@heroicons/react/24/outline";
import { classInput, classLabel } from "./classes-ui";

export function GroupWizardField({
  id,
  label,
  hint,
  error,
  className = "",
  children,
}: {
  id: string;
  label: string;
  hint?: string;
  error?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={`grid content-start gap-1.5 ${className}`}>
      <label htmlFor={id} className={classLabel}>
        {label}
      </label>
      {children}
      {hint && !error && (
        <p id={`${id}-hint`} className="text-xs text-muted-foreground">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} className="flex items-center gap-1 text-xs font-semibold text-destructive">
          <ExclamationCircleIcon className="size-3.5 shrink-0" aria-hidden="true" />
          {error}
        </p>
      )}
    </div>
  );
}

// classInput is sized for one-line inputs; multi-line fields need roomier padding.
export const wizardTextareaClass = `${classInput} px-4 py-3 leading-relaxed resize-y`;

// Accessible wiring for the control rendered inside GroupWizardField.
export const wizardFieldProps = (id: string, error?: string, hint?: string) => ({
  id,
  "aria-invalid": Boolean(error) || undefined,
  "aria-describedby": error ? `${id}-error` : hint ? `${id}-hint` : undefined,
});
