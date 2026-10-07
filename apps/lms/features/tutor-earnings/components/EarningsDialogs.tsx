"use client";

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@workspace/ui/components/ui/dialog";
import type { EarningSession } from "../types/earnings.types";
import { formatCurrency, formatDateTime } from "../utils/earnings.utils";
import { EarningsStatusBadge } from "./EarningsStatusBadge";
import { outlineActionClass, primaryActionClass } from "./earnings-ui";

interface DetailDialogProps {
  session: EarningSession | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onReport: (session: EarningSession) => void;
}

export function EarningDetailDialog({ session, open, onOpenChange, onReport }: DetailDialogProps) {
  if (!session) return null;
  const fields = [
    ["Lớp học", session.className], ["Học viên", session.learnerName],
    ["Môn học", session.subject], ["Thời gian dạy", formatDateTime(session.taughtAt)],
    ["Thời lượng", `${session.durationMinutes} phút`], ["Mã quyết toán", session.settlementCode ?? "Chưa có"],
    ["Ngày quyết toán", session.settlementDate ? formatDateTime(session.settlementDate) : "Chưa quyết toán"],
  ];
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[90dvh] w-[calc(100%-2rem)] max-w-xl flex-col gap-0 overflow-hidden rounded-3xl border-border bg-card p-0 shadow-soft">
        <DialogHeader className="border-b border-border px-5 py-5 pr-12 text-left sm:px-6"><DialogTitle className="font-nunito text-xl font-extrabold leading-relaxed text-primary">Chi tiết thu nhập</DialogTitle><DialogDescription>{session.sessionCode}</DialogDescription></DialogHeader>
        <div className="space-y-5 overflow-y-auto px-5 py-5 sm:px-6">
          <div className="flex flex-wrap items-center justify-between gap-3"><div><p className="text-sm text-muted-foreground">Thu nhập buổi học</p><p className="mt-1 font-nunito text-3xl font-extrabold tabular-nums text-primary">{formatCurrency(session.fee)}</p></div><EarningsStatusBadge status={session.settlementStatus} /></div>
          <dl className="grid grid-cols-1 gap-4 border-t border-border pt-5 sm:grid-cols-2">{fields.map(([label, value]) => <div key={label}><dt className="text-xs text-muted-foreground">{label}</dt><dd className="mt-1 break-words text-sm font-bold leading-relaxed">{value}</dd></div>)}</dl>
          <p className="rounded-2xl border border-border p-4 text-sm leading-relaxed text-muted-foreground">Mức phí đã được chốt trước buổi học. Thu nhập được ghi nhận khi buổi học hoàn thành; buổi đang kiểm tra chờ admin xác minh.</p>
        </div>
        <DialogFooter className="gap-2 border-t border-border px-5 py-4 sm:px-6"><button type="button" className={outlineActionClass} onClick={() => onOpenChange(false)}>Đóng</button><button type="button" className={primaryActionClass} onClick={() => { onOpenChange(false); onReport(session); }}>Báo cáo vấn đề</button></DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
