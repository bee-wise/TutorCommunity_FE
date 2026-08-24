import Link from "next/link";
import { ArrowRight, FileText } from "@phosphor-icons/react";
import type {
  LearnerTuitionClass,
  TuitionClassSummary,
} from "../types/tuition-fee.types";
import {
  formatTuitionCurrency,
  formatTuitionDate,
} from "../utils/tuition-fee.utils";
import { TuitionClassStatusBadge } from "./TuitionStatusBadge";

export function TuitionClassList({ summaries, onInvoice }: { summaries: TuitionClassSummary[]; onInvoice: (invoice: LearnerTuitionClass) => void }) {
  if (summaries.length === 0) {
    return <div className="rounded-2xl border border-dashed border-border bg-white px-5 py-14 text-center"><FileText className="mx-auto text-slate-400" size={34} weight="duotone" /><h2 className="mt-3 font-extrabold text-slate-950">Không có lớp học phù hợp</h2><p className="mt-1 text-sm text-slate-500">Hãy thử thay đổi từ khóa hoặc trạng thái.</p></div>;
  }

  return (
    <section className="overflow-hidden rounded-2xl border border-border bg-white shadow-sm" aria-labelledby="tuition-classes-title">
      <header className="border-b border-border px-4 py-4 sm:px-5"><h2 id="tuition-classes-title" className="text-lg font-extrabold text-slate-950">Học phí theo lớp</h2><p className="mt-1 text-xs text-slate-500">Các khoản dưới đây đã được thanh toán qua BeeWise SALE.</p></header>
      <div className="divide-y divide-border">
        {summaries.map((summary) => (
          <article key={summary.classInfo.id} className="grid gap-4 px-4 py-5 sm:px-5 xl:grid-cols-[minmax(220px,1.4fr)_minmax(170px,0.9fr)_minmax(150px,0.8fr)_auto] xl:items-center">
            <div className="flex min-w-0 items-start gap-3">
              <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-[#CFE1FA] text-xs font-extrabold text-[#280F91]">{summary.classInfo.tutorInitials}</span>
              <div className="min-w-0"><div className="flex flex-wrap items-center gap-2"><h3 className="font-extrabold text-slate-950">{summary.classInfo.className}</h3><TuitionClassStatusBadge status={summary.classInfo.status} /></div><p className="mt-1 text-sm text-slate-500">{summary.classInfo.tutorName}</p><p className="mt-1 text-xs text-slate-400">Thanh toán {formatTuitionDate(summary.classInfo.paidAt)}</p></div>
            </div>
            <dl className="grid grid-cols-2 gap-3 text-sm xl:block"><div><dt className="text-xs text-slate-500">Gói học</dt><dd className="mt-1 font-bold text-slate-900">{summary.classInfo.packageName}</dd></div><div className="xl:mt-2"><dt className="text-xs text-slate-500">Đã ghi nhận</dt><dd className="mt-1 font-bold text-slate-900">{summary.recordedSessionCount} buổi</dd></div></dl>
            <dl className="grid grid-cols-2 gap-3 text-sm xl:block"><div><dt className="text-xs text-slate-500">Tổng đã trả</dt><dd className="mt-1 font-extrabold text-[#280F91]">{formatTuitionCurrency(summary.classInfo.totalPaid)}</dd></div><div className="xl:mt-2"><dt className="text-xs text-slate-500">Chưa phân bổ</dt><dd className="mt-1 font-bold text-slate-900">{summary.remainingSessionCount} buổi</dd></div></dl>
            <div className="flex flex-col gap-2 sm:flex-row xl:flex-col">
              <button type="button" onClick={() => onInvoice(summary.classInfo)} className="inline-flex h-10 items-center justify-center rounded-xl border border-[#280F91]/20 px-3 text-sm font-bold text-[#280F91] hover:bg-[#EEF2FF]">Xuất hóa đơn</button>
              <Link href={`/lms/learner/tuition-fee/${summary.classInfo.id}`} className="inline-flex h-10 items-center justify-center gap-1.5 rounded-xl bg-[#280F91] px-3 text-sm font-bold text-white hover:bg-[#1F0B70]">Xem buổi học<ArrowRight size={16} weight="bold" /></Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
