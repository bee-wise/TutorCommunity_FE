"use client";

import { useState } from "react";
import { Warning } from "@phosphor-icons/react";
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
          <DialogTitle className="text-xl font-extrabold text-slate-950">
            Hủy lịch học?
          </DialogTitle>
          <DialogDescription className="leading-6">
            {session.subject} - {session.topic}
            <br />
            {formatLearnerSessionDate(session.date)}, {session.startTime} -{" "}
            {session.endTime}
          </DialogDescription>
        </DialogHeader>

        <div className="rounded-xl border border-[#FADC76] bg-[#FFF9E8] p-3.5 text-[#6D4A13]">
          <div className="flex items-center gap-1.5 text-sm font-extrabold">
            <Warning size={17} weight="fill" />
            Có thể mất học phí
          </div>
          <p className="mt-1 text-sm leading-6">
            Việc tự nguyện hủy lịch có thể làm mất học phí của buổi này. Nếu bạn
            chỉ cần đổi lịch, hãy liên hệ tư vấn viên {session.consultantName}.
          </p>
        </div>

        <fieldset>
          <legend className="mb-2 text-sm font-extrabold text-slate-900">
            Chọn lý do hủy
          </legend>
          <div className="grid gap-2">
            {CANCELLATION_REASONS.map((reason) => (
              <label
                key={reason.value}
                className={`flex cursor-pointer items-center gap-3 rounded-xl border px-3.5 py-3 text-sm font-semibold transition-colors ${reasonCode === reason.value ? "border-[#280F91] bg-[#EEF2FF] text-[#280F91]" : "border-border text-slate-700 hover:bg-slate-50"}`}
              >
                <input
                  type="radio"
                  name="cancellation-reason"
                  value={reason.value}
                  checked={reasonCode === reason.value}
                  onChange={() => setReasonCode(reason.value)}
                  className="size-4 accent-[#280F91]"
                />
                {reason.label}
              </label>
            ))}
          </div>
        </fieldset>

        {reasonCode === "other" ? (
          <label className="block">
            <span className="text-sm font-extrabold text-slate-900">
              Nhập lý do khác
            </span>
            <textarea
              value={otherReason}
              onChange={(event) => setOtherReason(event.target.value)}
              maxLength={300}
              rows={3}
              placeholder="Mô tả ngắn lý do bạn không thể tham gia..."
              className="mt-2 w-full resize-none rounded-xl border border-input px-3.5 py-3 text-sm outline-none placeholder:text-slate-400 focus:border-[#280F91] focus:ring-2 focus:ring-[#280F91]/20"
            />
            <span className="mt-1 flex justify-between text-xs text-slate-500">
              <span>Tối thiểu 5 ký tự</span>
              <span>{otherReason.length}/300</span>
            </span>
          </label>
        ) : null}

        <DialogFooter className="gap-2 sm:gap-2">
          <button
            type="button"
            onClick={closeDialog}
            className="h-10 rounded-xl border border-input px-4 text-sm font-bold text-slate-700 hover:bg-slate-50"
          >
            Giữ lịch học
          </button>
          <button
            type="button"
            disabled={!valid}
            onClick={submitCancellation}
            className="h-10 rounded-xl bg-[#9B3E38] px-4 text-sm font-bold text-white hover:bg-[#82332E] disabled:cursor-not-allowed disabled:opacity-40"
          >
            Xác nhận hủy
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
