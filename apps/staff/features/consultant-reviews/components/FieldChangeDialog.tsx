"use client";

import { useState } from "react";
import { ArrowLeftIcon, ArrowRightIcon } from "@heroicons/react/24/outline";
import { Button } from "@workspace/ui/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@workspace/ui/components/ui/dialog";
import { formatReviewDate, readableFieldName } from "../data/profile-fields";
import { useSubmitFieldReview } from "../hooks/useConsultantReviews";
import type { PendingFieldChange } from "../schemas/consultant-review.schema";
import { ReviewValue } from "./ReviewValue";

function parseValue(value?: string | null): unknown {
  if (!value) return value;
  try {
    return JSON.parse(value) as unknown;
  } catch {
    return value;
  }
}

export function FieldChangeDialog({
  request,
  onClose,
}: {
  request: PendingFieldChange | null;
  onClose: () => void;
}) {
  const action = useSubmitFieldReview();
  const [step, setStep] = useState<0 | 1>(0);
  const [decision, setDecision] = useState<"approve" | "reject" | null>(null);
  const [note, setNote] = useState("");
  const [reason, setReason] = useState("");
  const [triedSubmit, setTriedSubmit] = useState(false);

  function close() {
    if (action.isPending) return;
    setStep(0);
    setDecision(null);
    setNote("");
    setReason("");
    setTriedSubmit(false);
    onClose();
  }

  async function submit() {
    setTriedSubmit(true);
    if (!request || !decision || (decision === "reject" && !reason.trim())) return;
    try {
      await action.mutateAsync({ request, decision, reason, note });
      close();
    } catch {
      // The mutation displays the API error and keeps the dialog open.
    }
  }

  return (
    <Dialog open={Boolean(request)} onOpenChange={(open) => { if (!open) close(); }}>
      <DialogContent className="max-h-[90dvh] overflow-y-auto rounded-3xl border-border sm:max-w-2xl">
        <DialogHeader>
          <p className="text-xs font-extrabold uppercase tracking-wider text-primary">Bước {step + 1} / 2</p>
          <DialogTitle className="font-nunito text-xl font-extrabold">{step === 0 ? "Đối chiếu thay đổi" : "Chọn quyết định"}</DialogTitle>
          <DialogDescription>
            {readableFieldName(request?.fieldName)} · {request?.requestedByFullName || request?.requestedByEmail || "Gia sư"} · {formatReviewDate(request?.requestedAt)}
          </DialogDescription>
        </DialogHeader>

        {request && step === 0 && (
          <div className="space-y-4 py-2">
            <p className="text-sm leading-6 text-muted-foreground">Kiểm tra giá trị đã công khai và giá trị gia sư muốn cập nhật trước khi đưa ra quyết định.</p>
            <div className="grid min-w-0 gap-3 sm:grid-cols-2">
              <div className="min-w-0 rounded-2xl border border-border bg-background p-4">
                <p className="mb-2 text-xs font-bold text-muted-foreground">Giá trị hiện tại</p>
                <div className="break-words text-sm"><ReviewValue value={parseValue(request.oldValue)} fieldName={request.fieldName} /></div>
              </div>
              <div className="min-w-0 rounded-2xl border border-primary bg-card p-4">
                <p className="mb-2 text-xs font-bold text-primary">Giá trị đề xuất</p>
                <div className="break-words text-sm"><ReviewValue value={parseValue(request.newValue)} fieldName={request.fieldName} /></div>
              </div>
            </div>
            {(request.fieldName?.toLowerCase() === "teachingofferings" || request.targetTable?.toLowerCase().includes("teaching_offering")) && (
              <p className="rounded-xl border border-border bg-background p-3 text-xs text-muted-foreground">Thay đổi tổ hợp giảng dạy được xử lý như một lượt duyệt thay thế.</p>
            )}
          </div>
        )}

        {request && step === 1 && (
          <div className="space-y-5 py-2">
            <p className="text-sm leading-6 text-muted-foreground">Chọn một quyết định cho yêu cầu này. Giá trị mới chỉ được áp dụng khi phê duyệt.</p>
            <div className="grid gap-3 sm:grid-cols-2" role="group" aria-label="Quyết định xét duyệt">
              <button
                type="button"
                onClick={() => setDecision("approve")}
                aria-pressed={decision === "approve"}
                className={`rounded-2xl border p-4 text-left text-sm font-bold transition-all active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${decision === "approve" ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card text-foreground hover:border-primary"}`}
              >
                Phê duyệt
                <span className={`mt-1 block text-xs font-normal ${decision === "approve" ? "text-primary-foreground" : "text-muted-foreground"}`}>Áp dụng giá trị mới</span>
              </button>
              <button
                type="button"
                onClick={() => setDecision("reject")}
                aria-pressed={decision === "reject"}
                className={`rounded-2xl border p-4 text-left text-sm font-bold transition-all active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${decision === "reject" ? "border-destructive bg-destructive text-destructive-foreground" : "border-border bg-card text-foreground hover:border-destructive"}`}
              >
                Từ chối
                <span className={`mt-1 block text-xs font-normal ${decision === "reject" ? "text-destructive-foreground" : "text-muted-foreground"}`}>Giữ nguyên giá trị hiện tại</span>
              </button>
            </div>
            {triedSubmit && !decision && <p className="text-xs font-semibold text-destructive">Vui lòng chọn quyết định.</p>}

            {decision === "reject" && (
              <div>
                <label htmlFor="field-rejection-reason" className="mb-1.5 block text-sm font-bold">Lý do từ chối *</label>
                <textarea
                  id="field-rejection-reason"
                  value={reason}
                  onChange={(event) => setReason(event.target.value)}
                  maxLength={1000}
                  rows={3}
                  aria-invalid={triedSubmit && !reason.trim()}
                  placeholder="Nêu điều gia sư cần sửa"
                  className="w-full resize-y rounded-xl border border-input bg-background px-3.5 py-3 text-sm outline-none transition-all placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-ring/30 aria-invalid:border-destructive"
                />
                {triedSubmit && !reason.trim() && <p className="mt-1 text-xs font-semibold text-destructive">Vui lòng nhập lý do từ chối.</p>}
              </div>
            )}
            {decision === "approve" && (
              <div>
                <label htmlFor="field-approval-note" className="mb-1.5 block text-sm font-bold">Ghi chú (không bắt buộc)</label>
                <textarea id="field-approval-note" value={note} onChange={(event) => setNote(event.target.value)} maxLength={1000} rows={2} className="w-full resize-y rounded-xl border border-input bg-background px-3.5 py-3 text-sm outline-none transition-all focus:border-primary focus:ring-2 focus:ring-ring/30" />
              </div>
            )}
          </div>
        )}

        <DialogFooter className="gap-2">
          {step === 0 ? (
            <>
              <Button type="button" variant="outline" onClick={close} className="min-h-10 rounded-xl font-bold transition-all active:scale-[0.98]">Đóng</Button>
              <Button type="button" onClick={() => setStep(1)} className="min-h-10 gap-2 rounded-xl font-bold transition-all active:scale-[0.98]">Tiếp tục <ArrowRightIcon className="size-4" aria-hidden="true" /></Button>
            </>
          ) : (
            <>
              <Button type="button" variant="outline" onClick={() => setStep(0)} disabled={action.isPending} className="min-h-10 gap-2 rounded-xl font-bold transition-all active:scale-[0.98]"><ArrowLeftIcon className="size-4" aria-hidden="true" /> Bước trước</Button>
              <Button type="button" variant={decision === "reject" ? "destructive" : "default"} onClick={() => void submit()} disabled={action.isPending} className="min-h-10 rounded-xl font-bold transition-all active:scale-[0.98]">{action.isPending ? "Đang gửi..." : "Xác nhận quyết định"}</Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
