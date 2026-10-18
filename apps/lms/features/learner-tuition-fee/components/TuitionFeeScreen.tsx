"use client";

import { useState } from "react";
import { InformationCircleIcon as Info } from "@heroicons/react/24/outline";
import { LibrarySearch, LibrarySelect } from "../../learner-materials/components/LibraryFilterControls";
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
    <div className="min-h-full bg-background">
      <div className="mx-auto max-w-[1300px] space-y-5 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <header><h1 className="text-2xl font-extrabold text-foreground sm:text-3xl">Theo dõi học phí</h1></header>
        <div className="flex items-start gap-2 rounded-xl border border-border bg-card px-4 py-3 text-sm leading-6 text-muted-foreground"><Info className="mt-0.5 shrink-0 text-primary" width={18} height={18} /><p>Học phí đã được thanh toán khi đăng ký trên BeeWise SALE. LMS chỉ hiển thị dữ liệu theo dõi và không thực hiện thanh toán.</p></div>
        <section className="rounded-3xl border border-border bg-card p-4 shadow-soft sm:p-5" aria-label="Bộ lọc học phí">
          <div className="grid gap-4 md:grid-cols-[minmax(240px,1fr)_210px]">
            <LibrarySearch id="tuition-class-search" label="Tìm lớp hoặc hóa đơn" value={tuition.search} placeholder="Lớp, gia sư, số hóa đơn..." onChange={tuition.setSearch} />
            <LibrarySelect id="tuition-class-status" label="Trạng thái lớp học" value={tuition.status} options={CLASS_STATUS_OPTIONS} onChange={tuition.setStatus} />
          </div>
        </section>
        <TuitionClassList summaries={tuition.filteredSummaries} onInvoice={setSelectedInvoice} />
      </div>
      <TuitionInvoiceDialog invoice={selectedInvoice} onClose={() => setSelectedInvoice(undefined)} />
    </div>
  );
}

const CLASS_STATUS_OPTIONS: readonly { value: "all" | TuitionClassStatus; label: string }[] = [
  { value: "all", label: "Tất cả lớp học" }, { value: "ACTIVE", label: "Đang học" }, { value: "COMPLETED", label: "Đã hoàn thành" },
];
