"use client";

import {
  CalendarBlank,
  CheckCircle,
  Clock,
  Hash,
  Receipt,
  User,
  WarningCircle,
} from "@phosphor-icons/react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@workspace/ui/components/ui/dialog";
import type { EarningSession } from "../types/earnings.types";
import { formatCurrency, formatDateTime } from "../utils/earnings.utils";
import { EarningsStatusBadge } from "./EarningsStatusBadge";

interface DetailDialogProps {
  session: EarningSession | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onReport: (session: EarningSession) => void;
}

export function EarningDetailDialog({
  session,
  open,
  onOpenChange,
  onReport,
}: DetailDialogProps) {
  if (!session) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90dvh] w-[calc(100%-2rem)] max-w-xl overflow-y-auto rounded-2xl border-border p-0">
        <DialogHeader className="border-b border-border bg-muted/45 px-5 py-5 pr-12 text-left sm:px-6">
          <DialogTitle className="text-xl font-extrabold">Chi tiết thu nhập</DialogTitle>
          <DialogDescription>{session.sessionCode}</DialogDescription>
        </DialogHeader>

        <div className="space-y-5 px-5 py-1 sm:px-6">
          <div className="flex flex-col gap-3 rounded-2xl bg-[#280F91] p-5 text-white sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-white/75">Học phí buổi học</p>
              <p className="mt-1 font-nunito text-3xl font-extrabold">{formatCurrency(session.fee)}</p>
            </div>
            <EarningsStatusBadge status={session.settlementStatus} />
          </div>

          <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <DetailItem icon={Receipt} label="Lớp học" value={session.className} />
            <DetailItem icon={User} label="Học viên" value={session.learnerName} />
            <DetailItem icon={CalendarBlank} label="Thời gian dạy" value={formatDateTime(session.taughtAt)} />
            <DetailItem icon={Clock} label="Thời lượng" value={`${session.durationMinutes} phút`} />
            <DetailItem icon={Hash} label="Mã quyết toán" value={session.settlementCode ?? "Chưa có"} />
            <DetailItem
              icon={CheckCircle}
              label="Ngày quyết toán"
              value={session.settlementDate ? formatDateTime(session.settlementDate) : "Chưa quyết toán"}
            />
          </dl>

          <div className="rounded-xl border border-[#DCE8FB] bg-[#CFE1FA]/25 p-4 text-sm text-muted-foreground">
            Học phí của mỗi buổi được thiết lập trước trong thỏa thuận lớp học. Khoản thu được ghi nhận sau khi buổi học hoàn thành.
          </div>
        </div>

        <DialogFooter className="gap-2 border-t border-border px-5 py-4 sm:px-6">
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="h-10 rounded-xl border border-input px-4 text-sm font-bold text-foreground hover:bg-muted"
          >
            Đóng
          </button>
          <button
            type="button"
            onClick={() => {
              onOpenChange(false);
              onReport(session);
            }}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-[#FFC500] px-4 text-sm font-bold text-[#0C0C0B] hover:bg-[#FADC76]"
          >
            <WarningCircle size={18} weight="bold" aria-hidden="true" />
            Báo cáo vấn đề
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function DetailItem({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Receipt;
  label: string;
  value: string;
}) {
  return (
    <div className="flex gap-3">
      <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-muted text-[#280F91]">
        <Icon size={18} weight="duotone" aria-hidden="true" />
      </span>
      <div>
        <dt className="text-xs text-muted-foreground">{label}</dt>
        <dd className="mt-0.5 text-sm font-bold text-foreground">{value}</dd>
      </div>
    </div>
  );
}

