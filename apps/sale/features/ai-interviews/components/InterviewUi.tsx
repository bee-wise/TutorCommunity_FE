import type { ReactNode } from "react";
import type { useTutorInterview } from "../hooks/useTutorInterview";
import { CheckIcon } from "@heroicons/react/20/solid";
import { ExclamationCircleIcon } from "@heroicons/react/24/outline";

export const interviewPanelClass = "min-w-0 rounded-3xl border border-border bg-card shadow-soft md:rounded-[32px]";
export const interviewButtonClass = "min-h-11 rounded-full px-5 font-semibold transition-all active:scale-[0.98]";
export type InterviewController = ReturnType<typeof useTutorInterview>;

export function InterviewCheck({ checked, onChange, children }: {
  checked: boolean; onChange: (checked: boolean) => void; children: ReactNode;
}) {
  return <label className={`flex cursor-pointer items-start gap-3 rounded-2xl border p-4 text-sm leading-6 transition-all ${checked ? "border-primary/30 bg-primary/5" : "border-border bg-background hover:border-primary/30"}`}>
    <input type="checkbox" className="peer sr-only" checked={checked} onChange={(event) => onChange(event.target.checked)} />
    <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-md border-2 border-border bg-card text-primary-foreground transition-all peer-checked:border-primary peer-checked:bg-primary peer-focus-visible:ring-2 peer-focus-visible:ring-ring peer-focus-visible:ring-offset-2"><CheckIcon aria-hidden="true" className={`size-4 ${checked ? "opacity-100" : "opacity-0"}`} /></span>
    <span>{children}</span>
  </label>;
}

export function InterviewNotice({ children, tone = "info" }: { children: ReactNode; tone?: "info" | "error" }) {
  return <div role={tone === "error" ? "alert" : undefined} className={`flex items-start gap-3 rounded-2xl border p-4 text-sm leading-6 ${tone === "error" ? "border-destructive/25 bg-destructive/5 text-destructive" : "border-border bg-muted/40 text-foreground"}`}>
    <ExclamationCircleIcon aria-hidden="true" className={`mt-0.5 size-5 shrink-0 ${tone === "error" ? "text-destructive" : "text-primary"}`} />
    <div className="min-w-0">{children}</div>
  </div>;
}
