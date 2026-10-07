import { Check } from "@phosphor-icons/react";

const LABELS = [
  "Chọn buổi học",
  "Review bản ghi Zoom",
  "Tài liệu sẵn sàng",
] as const;
export function AIFlowSteps({ step }: { step: number }) {
  return (
    <ol
      className="grid grid-cols-3 gap-2"
      aria-label="Tiến trình tạo tài liệu AI"
    >
      {LABELS.map((label, index) => (
        <li
          key={label}
          aria-current={step === index + 1 ? "step" : undefined}
          className="relative min-w-0 text-center"
        >
          {index < 2 && (
            <span
              aria-hidden="true"
              className={`absolute top-5 left-[calc(50%+24px)] h-px w-[calc(100%-40px)] ${step > index + 1 ? "bg-secondary" : "bg-border"}`}
            />
          )}
          <span
            className={`relative mx-auto grid size-10 place-items-center rounded-full border text-sm font-bold ${step > index + 1 ? "border-secondary bg-secondary text-secondary-foreground" : step === index + 1 ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card text-muted-foreground"}`}
          >
            {step > index + 1 ? (
              <Check weight="bold" aria-hidden="true" />
            ) : (
              index + 1
            )}
          </span>
          <span
            className={`mt-2 block text-xs font-bold leading-relaxed sm:text-sm ${step === index + 1 ? "text-primary" : "text-muted-foreground"}`}
          >
            {label}
          </span>
        </li>
      ))}
    </ol>
  );
}
