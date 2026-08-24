"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, DownloadSimple, MagnifyingGlass, WarningCircle } from "@phosphor-icons/react";
import { useTuitionClass } from "../hooks/useTuitionFee";
import type { TuitionSessionFilter } from "../types/tuition-fee.types";
import {
  formatTuitionCurrency,
  formatTuitionDate,
} from "../utils/tuition-fee.utils";
import { TuitionClassStatusBadge } from "./TuitionStatusBadge";
import { TuitionInvoiceDialog } from "./TuitionInvoiceDialog";
import { TuitionSessionLedger } from "./TuitionSessionLedger";

export function TuitionClassDetailScreen({ classId }: { classId: string }) {
  const tuition = useTuitionClass(classId);
  const [invoiceOpen, setInvoiceOpen] = useState(false);

  if (!tuition.classInfo || !tuition.summary) {
    return <MissingTuitionClass />;
  }

  return (
    <div className="min-h-full bg-[#F8FAFC]">
      <div className="mx-auto max-w-[1200px] space-y-5 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <Link href="/lms/learner/tuition-fee" className="inline-flex items-center gap-1.5 text-sm font-bold text-[#280F91] hover:underline"><ArrowLeft size={17} weight="bold" />Theo dõi học phí</Link>
        <header className="flex flex-col gap-4 rounded-2xl border border-border bg-white p-5 shadow-sm sm:p-6 md:flex-row md:items-center md:justify-between">
          <div className="flex min-w-0 items-start gap-3"><span className="grid size-12 shrink-0 place-items-center rounded-xl bg-[#CFE1FA] text-sm font-extrabold text-[#280F91]">{tuition.classInfo.tutorInitials}</span><div><div className="flex flex-wrap items-center gap-2"><h1 className="text-xl font-extrabold text-slate-950 sm:text-2xl">{tuition.classInfo.className}</h1><TuitionClassStatusBadge status={tuition.classInfo.status} /></div><p className="mt-1 text-sm text-slate-500">{tuition.classInfo.tutorName}</p></div></div>
          <button type="button" onClick={() => setInvoiceOpen(true)} className="inline-flex h-10 items-center justify-center gap-2 whitespace-nowrap rounded-xl bg-[#280F91] px-4 text-sm font-bold text-white hover:bg-[#1F0B70] active:scale-[0.98]"><DownloadSimple size={18} weight="bold" />Xuất hóa đơn</button>
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

        <section className="rounded-2xl border border-border bg-white p-3 shadow-sm sm:p-4" aria-label="Bộ lọc buổi học">
          <div className="grid gap-2 md:grid-cols-[minmax(240px,1fr)_210px]">
            <label className="relative block"><span className="sr-only">Tìm buổi học</span><MagnifyingGlass className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} /><input value={tuition.search} onChange={(event) => tuition.setSearch(event.target.value)} placeholder="Tìm số buổi hoặc chủ đề..." className="h-10 w-full rounded-xl border border-input pl-10 pr-3 text-sm outline-none placeholder:text-slate-500 focus:border-[#280F91] focus:ring-2 focus:ring-[#280F91]/20" /></label>
            <label><span className="sr-only">Trạng thái buổi học</span><select value={tuition.status} onChange={(event) => tuition.setStatus(event.target.value as TuitionSessionFilter)} className="h-10 w-full rounded-xl border border-input bg-white px-3 text-sm font-semibold outline-none focus:border-[#280F91] focus:ring-2 focus:ring-[#280F91]/20"><option value="all">Tất cả buổi học</option><option value="COMPLETED">Đã hoàn thành</option><option value="UPCOMING">Sắp diễn ra</option><option value="CANCELED">Đã hủy</option></select></label>
          </div>
        </section>
        <TuitionSessionLedger sessions={tuition.filteredSessions} />
      </div>
      <TuitionInvoiceDialog invoice={invoiceOpen ? tuition.classInfo : undefined} onClose={() => setInvoiceOpen(false)} />
    </div>
  );
}

function SummaryItem({ label, value, emphasis = false }: { label: string; value: string; emphasis?: boolean }) {
  return <div className="min-w-0 p-4"><dt className="text-xs text-slate-500">{label}</dt><dd className={`mt-1 truncate text-sm font-extrabold ${emphasis ? "text-[#280F91]" : "text-slate-950"}`}>{value}</dd></div>;
}

function MissingTuitionClass() {
  return <div className="grid min-h-[60dvh] place-items-center bg-[#F8FAFC] p-6 text-center"><div><WarningCircle className="mx-auto text-[#905B0F]" size={36} weight="duotone" /><h1 className="mt-3 text-xl font-extrabold">Không tìm thấy dữ liệu học phí</h1><Link href="/lms/learner/tuition-fee" className="mt-4 inline-flex h-10 items-center rounded-xl bg-[#280F91] px-4 text-sm font-bold text-white">Quay lại</Link></div></div>;
}
