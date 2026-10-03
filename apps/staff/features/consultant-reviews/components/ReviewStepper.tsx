import { Check, WarningCircle } from "@phosphor-icons/react";
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
            className={`flex min-w-44 shrink-0 items-center gap-3 rounded-xl border px-3 py-3 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed lg:w-full lg:min-w-0 ${active ? "border-primary bg-card text-primary shadow-sm" : "border-transparent bg-transparent text-foreground hover:border-border hover:bg-card disabled:text-muted-foreground"}`}
          >
            <span className={`flex size-8 shrink-0 items-center justify-center rounded-lg text-xs font-extrabold ${active ? "bg-primary text-primary-foreground" : invalidSteps[index] ? "bg-destructive text-destructive-foreground" : index < furthestStep ? "bg-secondary text-secondary-foreground" : "border border-border bg-card text-muted-foreground"}`}>
              {invalidSteps[index] ? <WarningCircle size={16} aria-hidden="true" /> : index < furthestStep ? <Check size={16} aria-hidden="true" /> : index + 1}
            </span>
            <span className="min-w-0">
              <span className="block text-xs font-semibold">Bước {index + 1}</span>
              <span className="block truncate text-sm font-bold">{title}</span>
              {invalidSteps[index] ? <span className="block text-xs text-destructive">Thiếu lý do</span> : rejectionCounts[index] > 0 && <span className="block text-xs text-destructive">{rejectionCounts[index]} mục cần sửa</span>}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
