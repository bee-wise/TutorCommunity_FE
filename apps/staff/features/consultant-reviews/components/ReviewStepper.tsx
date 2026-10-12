import { CheckIcon, ExclamationCircleIcon } from "@heroicons/react/24/outline";
import { profileSections } from "../data/profile-fields";

const titles = [...profileSections.map((section) => section.title), "Rà soát và gửi"];

export function ReviewStepper({
  activeStep,
  furthestStep,
  rejectionCounts,
  invalidSteps,
  onSelect,
}: {
  activeStep: number;
  furthestStep: number;
  rejectionCounts: number[];
  invalidSteps: boolean[];
  onSelect: (step: number) => void;
}) {
  return (
    <nav aria-label="Các bước xét duyệt" className="flex gap-2 overflow-x-auto pb-1 lg:flex-col lg:overflow-visible">
      {titles.map((title, index) => {
        const active = activeStep === index;
        const visited = index <= furthestStep;
        return (
          <button
            key={title}
            type="button"
            onClick={() => onSelect(index)}
            disabled={!visited}
            aria-current={active ? "step" : undefined}
            className={`flex min-w-44 shrink-0 items-center gap-3 rounded-2xl border px-3.5 py-3.5 text-left transition-all active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:active:scale-100 lg:w-full lg:min-w-0 ${active ? "border-primary bg-primary text-primary-foreground shadow-sm" : "border-border bg-card text-foreground hover:border-primary disabled:text-muted-foreground"}`}
          >
            <span className={`flex size-8 shrink-0 items-center justify-center rounded-lg text-xs font-extrabold ${active ? "bg-primary-foreground text-primary" : invalidSteps[index] ? "bg-destructive text-destructive-foreground" : index < furthestStep ? "bg-accent text-accent-foreground" : "border border-border bg-background text-muted-foreground"}`}>
              {invalidSteps[index] ? <ExclamationCircleIcon className="size-4" aria-hidden="true" /> : index < furthestStep ? <CheckIcon className="size-4" aria-hidden="true" /> : index + 1}
            </span>
            <span className="min-w-0">
              <span className="block text-xs font-semibold">Bước {index + 1}</span>
              <span className="block truncate text-sm font-bold">{title}</span>
              {invalidSteps[index] ? <span className={`block text-xs ${active ? "text-primary-foreground" : "text-destructive"}`}>Thiếu lý do</span> : rejectionCounts[index] > 0 && <span className={`block text-xs ${active ? "text-primary-foreground" : "text-destructive"}`}>{rejectionCounts[index]} mục cần sửa</span>}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
