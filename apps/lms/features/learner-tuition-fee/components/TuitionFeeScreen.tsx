"use client";

import { useState } from "react";
import { Info, MagnifyingGlass } from "@phosphor-icons/react";
import { useTuitionFee } from "../hooks/useTuitionFee";
import type {
  LearnerTuitionClass,
  TuitionClassStatus,
} from "../types/tuition-fee.types";
import { TuitionClassList } from "./TuitionClassList";
import { TuitionInvoiceDialog } from "./TuitionInvoiceDialog";

export function TuitionFeeScreen() {
  const tuition = useTuitionFee();
  const [selectedInvoice, setSelectedInvoice] = useState<LearnerTuitionClass>();

  return (
    <div className="min-h-full bg-[#F8FAFC]">
      <div className="mx-auto max-w-[1300px] space-y-5 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <header><h1 className="text-2xl font-extrabold text-slate-950 sm:text-3xl">Theo dõi học phí</h1><p className="mt-1.5 max-w-2xl text-sm text-slate-500">Xem học phí đã thanh toán theo lớp, theo từng buổi học và xuất hóa đơn.</p></header>
        <div className="flex items-start gap-2 rounded-xl border border-[#CFE1FA] bg-white px-4 py-3 text-sm leading-6 text-slate-600"><Info className="mt-0.5 shrink-0 text-[#280F91]" size={18} weight="bold" /><p>Học phí đã được thanh toán khi đăng ký trên BeeWise SALE. LMS chỉ hiển thị dữ liệu theo dõi và không thực hiện thanh toán.</p></div>
        <section className="rounded-2xl border border-border bg-white p-3 shadow-sm sm:p-4" aria-label="Bộ lọc học phí">
          <div className="grid gap-2 md:grid-cols-[minmax(240px,1fr)_210px]">
            <label className="relative block"><span className="sr-only">Tìm lớp học hoặc hóa đơn</span><MagnifyingGlass className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} /><input value={tuition.search} onChange={(event) => tuition.setSearch(event.target.value)} placeholder="Tìm lớp, gia sư, số hóa đơn..." className="h-10 w-full rounded-xl border border-input pl-10 pr-3 text-sm outline-none placeholder:text-slate-500 focus:border-[#280F91] focus:ring-2 focus:ring-[#280F91]/20" /></label>
            <label><span className="sr-only">Trạng thái lớp học</span><select value={tuition.status} onChange={(event) => tuition.setStatus(event.target.value as "all" | TuitionClassStatus)} className="h-10 w-full rounded-xl border border-input bg-white px-3 text-sm font-semibold outline-none focus:border-[#280F91] focus:ring-2 focus:ring-[#280F91]/20"><option value="all">Tất cả lớp học</option><option value="ACTIVE">Đang học</option><option value="COMPLETED">Đã hoàn thành</option></select></label>
          </div>
        </section>
        <TuitionClassList summaries={tuition.filteredSummaries} onInvoice={setSelectedInvoice} />
      </div>
      <TuitionInvoiceDialog invoice={selectedInvoice} onClose={() => setSelectedInvoice(undefined)} />
    </div>
  );
}
