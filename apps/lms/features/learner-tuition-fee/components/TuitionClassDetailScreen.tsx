"use client";

import { useState } from "react";
import Link from "next/link";
import { DownloadSimple, WarningCircle } from "@phosphor-icons/react";
import { Button } from "@workspace/ui/components/ui/button";
import { LibrarySearch, LibrarySelect } from "../../learner-materials/components/LibraryFilterControls";
import { useTuitionClass } from "../hooks/useTuitionFee";
import type { TuitionSessionFilter } from "../types/tuition-fee.types";
import {
  formatTuitionCurrency,
  formatTuitionDate,
} from "../utils/tuition-fee.utils";
import { TuitionInvoiceDialog } from "./TuitionInvoiceDialog";
import { TuitionSessionLedger } from "./TuitionSessionLedger";

export function TuitionClassDetailScreen({ classId }: { classId: string }) {
  const tuition = useTuitionClass(classId);
  const [invoiceOpen, setInvoiceOpen] = useState(false);

  if (!tuition.classInfo || !tuition.summary) {
    return <MissingTuitionClass />;
  }

  return (
    <div className="min-h-full bg-background">
      <div className="mx-auto max-w-[1200px] space-y-5 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <header className="flex flex-wrap items-center justify-between gap-3">
          <h1 className="font-nunito text-2xl font-extrabold text-primary sm:text-3xl">Học phí lớp học</h1>
          <Button type="button" onClick={() => setInvoiceOpen(true)} className="min-h-11 rounded-xl transition-all active:scale-[0.98]"><DownloadSimple size={16} weight="bold" />Xuất hóa đơn</Button>
        </header>

        <section className="overflow-hidden rounded-2xl border border-border bg-white" aria-label="Thông tin học phí lớp học">
          <dl className="grid grid-cols-2 divide-x divide-y divide-border sm:grid-cols-3 lg:grid-cols-6 lg:divide-y-0">
            <SummaryItem label="Tổng đã trả" value={formatTuitionCurrency(tuition.classInfo.totalPaid)} emphasis />
            <SummaryItem label="Đơn giá buổi" value={formatTuitionCurrency(tuition.classInfo.feePerSession)} />
            <SummaryItem label="Gói học" value={`${tuition.classInfo.purchasedSessionCount} buổi`} />
            <SummaryItem label="Đã ghi nhận" value={`${tuition.summary.recordedSessionCount} buổi`} />
            <SummaryItem label="Đã giữ" value={`${tuition.summary.reservedSessionCount} buổi`} />
            <SummaryItem label="Chưa phân bổ" value={`${tuition.summary.remainingSessionCount} buổi`} />
          </dl>
          <div className="border-t border-border px-4 py-3 text-xs text-slate-500 sm:px-5">Thanh toán {formatTuitionDate(tuition.classInfo.paidAt)} | Mã SALE: {tuition.classInfo.saleOrderCode}</div>
        </section>

        <section className="rounded-3xl border border-border bg-card p-4 shadow-soft sm:p-5" aria-label="Bộ lọc buổi học">
          <div className="grid gap-4 md:grid-cols-[minmax(240px,1fr)_210px]">
            <LibrarySearch id="tuition-session-search" label="Tìm buổi học" value={tuition.search} placeholder="Số buổi hoặc chủ đề..." onChange={tuition.setSearch} />
            <LibrarySelect id="tuition-session-status" label="Trạng thái buổi học" value={tuition.status} options={SESSION_STATUS_OPTIONS} onChange={tuition.setStatus} />
          </div>
        </section>
        <TuitionSessionLedger sessions={tuition.filteredSessions} />
      </div>
      <TuitionInvoiceDialog invoice={invoiceOpen ? tuition.classInfo : undefined} onClose={() => setInvoiceOpen(false)} />
    </div>
  );
}

const SESSION_STATUS_OPTIONS: readonly { value: TuitionSessionFilter; label: string }[] = [
  { value: "all", label: "Tất cả buổi học" }, { value: "COMPLETED", label: "Đã hoàn thành" },
  { value: "UPCOMING", label: "Sắp diễn ra" }, { value: "CANCELED", label: "Đã hủy" },
];

function SummaryItem({ label, value, emphasis = false }: { label: string; value: string; emphasis?: boolean }) {
  return <div className="min-w-0 p-4"><dt className="text-xs text-slate-500">{label}</dt><dd className={`mt-1 truncate text-sm font-extrabold ${emphasis ? "text-[#280F91]" : "text-slate-950"}`}>{value}</dd></div>;
}

function MissingTuitionClass() {
  return <div className="grid min-h-[60dvh] place-items-center bg-[#F8FAFC] p-6 text-center"><div><WarningCircle className="mx-auto text-[#905B0F]" size={36} weight="duotone" /><h1 className="mt-3 text-xl font-extrabold">Không tìm thấy dữ liệu học phí</h1><Button asChild variant="outline" className="mt-4 min-h-11 rounded-xl transition-all active:scale-[0.98]"><Link href="/lms/learner/tuition-fee">Về danh sách học phí</Link></Button></div></div>;
}
