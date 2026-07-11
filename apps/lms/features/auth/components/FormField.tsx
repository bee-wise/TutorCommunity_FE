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
        <p className="text-[10px] text-red-500  flex items-center gap-1">
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
      className={`w-full h-11 px-4 rounded-xl border text-sm bg-[#f8f9fc] text-[#0c0c0b] placeholder:text-[#0c0c0b]/40
        transition-all duration-200 outline-none
        focus:bg-white focus:border-[#280f91] focus:ring-4 focus:ring-[#280f91]/10
        ${
          hasError
            ? "border-red-400 focus:border-red-500 focus:ring-red-400/20 bg-red-50/50"
            : "border-[#0c0c0b]/10 hover:border-[#280f91]/40"
        }
        ${className ?? ""}
      `}
      {...props}
    />
  );
}
