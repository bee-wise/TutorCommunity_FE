"use client";

import { Info } from "@phosphor-icons/react";
import { Button } from "@workspace/ui/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@workspace/ui/components/ui/dialog";
import type { ProfileStepIssue } from "../utils/profile-step-completion";

export function ProfileStepStatusDialog({
  open,
  stepTitle,
  issues,
  onOpenChange,
  onGoToStep,
}: {
  open: boolean;
  stepTitle: string;
  issues: ProfileStepIssue[];
  onOpenChange: (open: boolean) => void;
  onGoToStep: () => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-2xl border-border sm:max-w-lg">
        <DialogHeader className="pr-7 text-left">
          <div className="mb-2 flex size-10 items-center justify-center rounded-xl bg-accent/20 text-amber-800">
            <Info className="size-5" weight="fill" aria-hidden="true" />
          </div>
          <DialogTitle>Hoàn thành bước {stepTitle}</DialogTitle>
          <DialogDescription className="leading-6">
            Kiểm tra và hoàn thành các mục dưới đây trước khi gửi hồ sơ xét
            duyệt.
          </DialogDescription>
        </DialogHeader>

        <ul className="max-h-72 space-y-2 overflow-y-auto pr-1">
          {issues.map((issue) => (
            <li
              key={issue.key}
              className="flex items-start gap-3 rounded-xl border border-accent/40 bg-accent/20 px-3 py-2.5"
            >
              <span className="mt-2 size-1.5 shrink-0 rounded-full bg-amber-800" />
              <span className="min-w-0 text-sm leading-5">
                <strong className="block font-semibold text-foreground">
                  {issue.label}
                </strong>
                <span className="text-muted-foreground">{issue.message}</span>
              </span>
            </li>
          ))}
        </ul>

        <DialogFooter className="mt-1 gap-2 sm:space-x-0">
          <Button
            type="button"
            variant="outline"
            className="w-full sm:w-auto"
            onClick={() => onOpenChange(false)}
          >
            Đóng
          </Button>
          <Button
            type="button"
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90 sm:w-auto"
            onClick={onGoToStep}
          >
            Đi đến bước này
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
