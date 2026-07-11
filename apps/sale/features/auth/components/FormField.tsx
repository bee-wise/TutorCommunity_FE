"use client";

import { useId } from "react";
import type { FieldError } from "react-hook-form";

interface FormFieldProps {
  label: string;
  error?: FieldError;
  children: React.ReactNode;
  hint?: string;
}

export function FormField({ label, error, children, hint }: FormFieldProps) {
  return (
    <div className="flex flex-col gap-1">
      <label
        className="text-xs font-semibold text-foreground/80"
        style={{ fontFamily: "var(--font-montserrat)" }}
      >
        {label}
      </label>
      {children}
      {hint && !error && (
        <p className="text-[10px] text-foreground/50">{hint}</p>
      )}
      {error && (
        <p className="text-[10px] text-red-500 flex items-center gap-1">
          <span aria-hidden="true">✕</span>
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
      className={`w-full h-9 px-3 rounded-xl border text-sm bg-background text-foreground placeholder:text-foreground/40
        transition-all duration-200 outline-none
        focus:border-primary focus:ring-2 focus:ring-primary/20
        ${
          hasError
            ? "border-red-400 focus:border-red-500 focus:ring-red-400/20"
            : "border-border hover:border-primary/40"
        }
        ${className ?? ""}
      `}
      {...props}
    />
  );
}
