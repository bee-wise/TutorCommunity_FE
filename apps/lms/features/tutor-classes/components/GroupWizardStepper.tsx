import { CheckIcon } from "@heroicons/react/20/solid";
import { groupWizardSteps } from "../utils/group-class-draft";

export function GroupWizardStepper({
  step,
  reached,
  disabled,
  onSelect,
}: {
  step: number;
  reached: number;
  disabled: boolean;
  onSelect: (step: number) => void;
}) {
  return (
    <nav aria-label="Các bước tạo lớp nhóm" className="space-y-2">
      <ol className="flex items-start">
        {groupWizardSteps.map((label, i) => {
          const current = i === step;
          const done = i < step || (i <= reached && !current);
          const last = i === groupWizardSteps.length - 1;
          return (
            <li key={label} className={last ? "shrink-0" : "flex flex-1 items-start"}>
              <button
                type="button"
                disabled={disabled || i > reached || current}
                aria-current={current ? "step" : undefined}
                aria-label={`Bước ${i + 1}: ${label}`}
                onClick={() => onSelect(i)}
                className="group flex min-h-11 shrink-0 flex-col items-center gap-1.5 rounded-lg px-1 outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-default lg:w-28"
              >
                <span
                  className={`grid size-9 place-items-center rounded-full border-2 text-sm font-extrabold tabular-nums transition-colors motion-reduce:transition-none ${
                    current
                      ? "border-primary bg-primary text-primary-foreground"
                      : done
                        ? "border-primary bg-card text-primary"
                        : "border-border bg-card text-muted-foreground"
                  }`}
                >
                  {done ? <CheckIcon className="size-5" aria-hidden="true" /> : i + 1}
                </span>
                <span
                  className={`hidden text-center text-xs font-bold leading-4 lg:block ${current ? "text-primary" : i <= reached ? "text-foreground" : "text-muted-foreground"}`}
                >
                  {label}
                </span>
              </button>
              {!last && (
                <span
                  aria-hidden="true"
                  className={`mt-[18px] h-0.5 min-w-4 flex-1 rounded-full transition-colors motion-reduce:transition-none ${i < step ? "bg-primary" : "bg-border"}`}
                />
              )}
            </li>
          );
        })}
      </ol>
      <p className="text-sm font-bold text-foreground lg:hidden" aria-hidden="true">
        Bước {step + 1}/{groupWizardSteps.length} · {groupWizardSteps[step]}
      </p>
    </nav>
  );
}
