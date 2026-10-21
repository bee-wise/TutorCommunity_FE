import Link from "next/link";
import { ArrowRightIcon as ArrowRight } from "@heroicons/react/24/outline";
import { Button } from "@workspace/ui/components/ui/button";
import { EmptyState } from "@workspace/ui/components/ui/empty-state";
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
    return <EmptyState imageAlt="" title="Không có lớp học phù hợp" description="Hãy thử thay đổi từ khóa hoặc trạng thái." />;
  }

  return (
    <section className="overflow-hidden rounded-3xl border border-border bg-card shadow-soft" aria-labelledby="tuition-classes-title">
      <header className="border-b border-border px-4 py-4 sm:px-5"><h2 id="tuition-classes-title" className="text-lg font-extrabold text-foreground">Học phí theo lớp</h2><p className="mt-1 text-xs text-muted-foreground">Các khoản dưới đây đã được thanh toán qua BeeWise SALE.</p></header>
      <div className="divide-y divide-border">
        {summaries.map((summary) => (
          <article key={summary.classInfo.id} className="grid gap-4 px-4 py-5 sm:px-5 xl:grid-cols-[minmax(220px,1.4fr)_minmax(170px,0.9fr)_minmax(150px,0.8fr)_auto] xl:items-center">
            <div className="flex min-w-0 items-start gap-3">
              <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-muted text-xs font-extrabold text-primary">{summary.classInfo.tutorInitials}</span>
              <div className="min-w-0"><div className="flex flex-wrap items-center gap-2"><h3 className="font-extrabold text-foreground">{summary.classInfo.className}</h3><TuitionClassStatusBadge status={summary.classInfo.status} /></div><p className="mt-1 text-sm text-muted-foreground">{summary.classInfo.tutorName}</p><p className="mt-1 text-xs text-muted-foreground">Thanh toán {formatTuitionDate(summary.classInfo.paidAt)}</p></div>
            </div>
            <dl className="grid grid-cols-2 gap-3 text-sm xl:block"><div><dt className="text-xs text-muted-foreground">Gói học</dt><dd className="mt-1 font-bold text-foreground">{summary.classInfo.packageName}</dd></div><div className="xl:mt-2"><dt className="text-xs text-muted-foreground">Đã ghi nhận</dt><dd className="mt-1 font-bold text-foreground">{summary.recordedSessionCount} buổi</dd></div></dl>
            <dl className="grid grid-cols-2 gap-3 text-sm xl:block"><div><dt className="text-xs text-muted-foreground">Tổng đã trả</dt><dd className="mt-1 font-extrabold text-primary">{formatTuitionCurrency(summary.classInfo.totalPaid)}</dd></div><div className="xl:mt-2"><dt className="text-xs text-muted-foreground">Chưa phân bổ</dt><dd className="mt-1 font-bold text-foreground">{summary.remainingSessionCount} buổi</dd></div></dl>
            <div className="flex flex-col gap-2 sm:flex-row xl:flex-col">
              <Button type="button" variant="outline" className="min-h-11" onClick={() => onInvoice(summary.classInfo)}>Xuất hóa đơn</Button>
              <Button asChild className="min-h-11"><Link href={`/lms/learner/tuition-fee/${summary.classInfo.id}`}>Xem buổi học<ArrowRight width={16} height={16} /></Link></Button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
