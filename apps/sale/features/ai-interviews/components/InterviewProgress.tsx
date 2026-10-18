import { CheckIcon } from "@heroicons/react/20/solid";
import type { InterviewPhase } from "../hooks/useTutorInterview";

const steps = ["Quy định", "Thiết bị", "Phỏng vấn"];

export function InterviewProgress({ phase, finished = false }: { phase: InterviewPhase; finished?: boolean }) {
  const active = phase === "policy" ? 0 : phase === "precheck" ? 1 : 2;
  return <ol aria-label="Tiến trình phỏng vấn" className="grid grid-cols-3 gap-2 rounded-2xl border border-border bg-card p-2 sm:gap-4 sm:p-3">
    {steps.map((label, index) => {
      const done = finished || index < active;
      const current = !finished && index === active;
      return <li key={label} aria-current={current ? "step" : undefined} className={`flex min-w-0 items-center gap-2 rounded-xl px-2 py-2 sm:gap-3 sm:px-3 ${current ? "bg-primary/5" : ""}`}>
        <span aria-hidden="true" className={`flex size-7 shrink-0 items-center justify-center rounded-full text-xs font-bold sm:size-8 ${done ? "bg-secondary text-secondary-foreground" : current ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
          {done ? <CheckIcon className="size-4" /> : index + 1}
        </span>
        <span className={`truncate text-xs font-semibold sm:text-sm ${current ? "text-primary" : done ? "text-foreground" : "text-muted-foreground"}`}>{label}</span>
      </li>;
    })}
  </ol>;
}
