"use client";

import { ExclamationCircleIcon } from "@heroicons/react/24/outline";
import type { FieldError } from "react-hook-form";

interface FormFieldProps {
  label: string;
  error?: FieldError;
  children: React.ReactNode;
  hint?: string;
  htmlFor?: string;
}

export function FormField({ label, error, children, hint, htmlFor }: FormFieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={htmlFor}
        className="text-sm font-bold text-foreground"
        style={{ fontFamily: "var(--font-nunito-family)" }}
      >
        {label}
      </label>
      {children}
      {hint && !error && (
        <p className="text-xs text-muted-foreground">{hint}</p>
      )}
      {error && (
        <p className="flex items-center gap-1 text-xs font-semibold text-destructive" role="alert">
          <ExclamationCircleIcon className="size-3.5 shrink-0" aria-hidden />
          {error.message}
        </p>
      )}
    </div>
  );
}

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  hasError?: boolean;
}

export function Input({ hasError, className, ...props }: InputProps) {
  return (
    <input
      aria-invalid={hasError || undefined}
      className={`w-full min-h-11 px-4 rounded-xl border bg-card text-sm text-foreground placeholder:text-muted-foreground
        transition-colors duration-200 outline-none
        focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/20
        ${
          hasError
            ? "border-destructive focus-visible:border-destructive"
            : "border-input hover:border-primary"
        }
        ${className ?? ""}
      `}
      {...props}
    />
  );
}
