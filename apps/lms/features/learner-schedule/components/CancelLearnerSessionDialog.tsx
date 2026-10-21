"use client";

import { useState } from "react";
import { ExclamationTriangleIcon as Warning } from "@heroicons/react/24/outline";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@workspace/ui/components/ui/dialog";
import type {
  LearnerCancellationReasonCode,
  LearnerCancellationRequest,
  LearnerSession,
} from "../types/learner-schedule.types";
import { formatLearnerSessionDate } from "../utils/calendar.utils";

const CANCELLATION_REASONS: Array<{
  value: LearnerCancellationReasonCode;
  label: string;
}> = [
  { value: "schedule_conflict", label: "Trùng lịch hoặc có việc đột xuất" },
  { value: "health", label: "Sức khỏe không đảm bảo" },
  { value: "technical_issue", label: "Không thể tham gia do sự cố kỹ thuật" },
  { value: "no_longer_needed", label: "Không còn nhu cầu học buổi này" },
  { value: "other", label: "Lý do khác" },
];

interface CancelLearnerSessionDialogProps {
  session: LearnerSession | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (request: LearnerCancellationRequest) => void;
}

export function CancelLearnerSessionDialog({
  session,
  open,
  onOpenChange,
  onConfirm,
}: CancelLearnerSessionDialogProps) {
  const [reasonCode, setReasonCode] = useState<LearnerCancellationReasonCode>();
  const [otherReason, setOtherReason] = useState("");
  const valid = Boolean(
    reasonCode && (reasonCode !== "other" || otherReason.trim().length >= 5),
  );

  function closeDialog() {
    setReasonCode(undefined);
    setOtherReason("");
    onOpenChange(false);
  }

  function submitCancellation() {
    if (!reasonCode || !valid) return;
    const selectedReason = CANCELLATION_REASONS.find(
      (reason) => reason.value === reasonCode,
    );
    onConfirm({
      reasonCode,
      reasonText:
        reasonCode === "other"
          ? otherReason.trim()
          : (selectedReason?.label ?? ""),
    });
    setReasonCode(undefined);
    setOtherReason("");
  }

  if (!session) return null;

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) =>
        nextOpen ? onOpenChange(true) : closeDialog()
      }
    >
      <DialogContent className="max-h-[90dvh] w-[calc(100%-2rem)] max-w-lg overflow-y-auto rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-extrabold text-foreground">
            Hủy lịch học?
          </DialogTitle>
          <DialogDescription className="leading-6">
            {session.subject} - {session.topic}
            <br />
            {formatLearnerSessionDate(session.date)}, {session.startTime} -{" "}
            {session.endTime}
          </DialogDescription>
        </DialogHeader>

        <div className="rounded-xl border border-highlight bg-accent/15 p-3.5 text-warning">
          <div className="flex items-center gap-1.5 text-sm font-extrabold">
            <Warning width={17} height={17} />
            Có thể mất học phí
          </div>
          <p className="mt-1 text-sm leading-6">
            Việc tự nguyện hủy lịch có thể làm mất học phí của buổi này. Nếu bạn
            chỉ cần đổi lịch, hãy liên hệ tư vấn viên {session.consultantName}.
          </p>
        </div>

        <fieldset>
          <legend className="mb-2 text-sm font-extrabold text-foreground">
            Chọn lý do hủy
          </legend>
          <div className="grid gap-2">
            {CANCELLATION_REASONS.map((reason) => (
              <label
                key={reason.value}
                className={`flex cursor-pointer items-center gap-3 rounded-xl border px-3.5 py-3 text-sm font-semibold transition-colors ${reasonCode === reason.value ? "border-primary bg-muted text-primary" : "border-border text-foreground hover:bg-muted"}`}
              >
                <input
                  type="radio"
                  name="cancellation-reason"
                  value={reason.value}
                  checked={reasonCode === reason.value}
                  onChange={() => setReasonCode(reason.value)}
                  className="size-4 accent-primary"
                />
                {reason.label}
              </label>
            ))}
          </div>
        </fieldset>

        {reasonCode === "other" ? (
          <label className="block">
            <span className="text-sm font-extrabold text-foreground">
              Nhập lý do khác
            </span>
            <textarea
              value={otherReason}
              onChange={(event) => setOtherReason(event.target.value)}
              maxLength={300}
              rows={3}
              placeholder="Mô tả ngắn lý do bạn không thể tham gia..."
              className="mt-2 w-full resize-none rounded-xl border border-input px-3.5 py-3 text-sm outline-none placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
            <span className="mt-1 flex justify-between text-xs text-muted-foreground">
              <span>Tối thiểu 5 ký tự</span>
              <span>{otherReason.length}/300</span>
            </span>
          </label>
        ) : null}

        <DialogFooter className="gap-2 sm:gap-2">
          <button
            type="button"
            onClick={closeDialog}
            className="min-h-11 rounded-xl border border-input px-4 text-sm font-bold text-foreground hover:bg-muted"
          >
            Giữ lịch học
          </button>
          <button
            type="button"
            disabled={!valid}
            onClick={submitCancellation}
            className="min-h-11 rounded-xl bg-destructive px-4 text-sm font-bold text-destructive-foreground hover:bg-destructive disabled:cursor-not-allowed disabled:opacity-40"
          >
            Xác nhận hủy
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
