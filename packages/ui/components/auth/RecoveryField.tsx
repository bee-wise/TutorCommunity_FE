import type { ReactNode } from "react";

export function RecoveryField({ label, htmlFor, error, errorId, children }: {
  label: string;
  htmlFor: string;
  error?: string;
  errorId: string;
  children: ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={htmlFor} className="block text-xs font-bold text-foreground/80">{label}</label>
      {children}
      {error && <p id={errorId} role="alert" className="text-xs font-medium text-destructive">{error}</p>}
    </div>
  );
}
