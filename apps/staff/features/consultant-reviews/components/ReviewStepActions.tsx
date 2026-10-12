import {
  ArrowLeftIcon,
  ArrowRightIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";
import { Button } from "@workspace/ui/components/ui/button";

export function ReviewStepActions({
  activeStep,
  lastStep,
  reviewable,
  onPrevious,
  onNext,
  onSubmit,
}: {
  activeStep: number;
  lastStep: number;
  reviewable: boolean;
  onPrevious: () => void;
  onNext: () => void;
  onSubmit: () => void;
}) {
  return (
    <div className="mt-3 rounded-2xl border border-border bg-card p-2 shadow-sm">
      <div className="flex gap-2">
        {activeStep > 0 && (
          <Button
            type="button"
            variant="outline"
            onClick={onPrevious}
            className="min-h-10 min-w-0 flex-1 gap-1.5 rounded-xl px-2 text-xs font-bold transition-all active:scale-[0.98]"
          >
            <ArrowLeftIcon className="size-4" aria-hidden="true" /> Bước trước
          </Button>
        )}
        {activeStep < lastStep ? (
          <Button
            type="button"
            onClick={onNext}
            className="min-h-10 min-w-0 flex-1 gap-1.5 rounded-xl px-2 text-xs font-bold transition-all active:scale-[0.98]"
          >
            Tiếp tục <ArrowRightIcon className="size-4" aria-hidden="true" />
          </Button>
        ) : reviewable ? (
          <Button
            type="button"
            onClick={onSubmit}
            className="min-h-10 min-w-0 flex-1 gap-1.5 rounded-xl px-2 text-xs font-bold transition-all active:scale-[0.98]"
          >
            <CheckCircleIcon className="size-4" aria-hidden="true" /> Gửi kết quả
          </Button>
        ) : null}
      </div>
    </div>
  );
}
