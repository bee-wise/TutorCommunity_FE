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
    <label className="grid gap-1.5 text-sm font-semibold text-slate-700">
      <span>
        {label}
        {required ? <span className="ml-1 text-red-600">*</span> : null}
      </span>
      {children}
      {error ? <span className="text-xs font-medium text-red-600">{error}</span> : null}
      {!error && hint ? <span className="text-xs font-normal leading-5 text-slate-500">{hint}</span> : null}
    </label>
  );
}

export const profileInputClass =
  "h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#280f91] focus:ring-3 focus:ring-[#280f91]/10 disabled:bg-slate-50";

export const profileTextareaClass =
  "min-h-28 w-full resize-y rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm leading-6 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#280f91] focus:ring-3 focus:ring-[#280f91]/10";
