import Link from "next/link";
import { ArrowRight, FolderOpen } from "@phosphor-icons/react";
import type { LearnerClassSummary } from "../types/learner-materials.types";
import { formatLibraryDate } from "../utils/learner-materials.utils";

export function ClassLibraryList({ classes }: { classes: LearnerClassSummary[] }) {
  if (classes.length === 0) {
    return (
      <div className="grid min-h-72 place-items-center rounded-2xl border border-dashed border-[#280F91]/20 bg-white p-6 text-center">
        <div><FolderOpen size={28} weight="duotone" className="mx-auto text-[#280F91]" /><h2 className="mt-3 text-lg font-extrabold">Không tìm thấy lớp học</h2><p className="mt-1 text-sm text-muted-foreground">Hãy đổi từ khóa hoặc môn học đang lọc.</p></div>
      </div>
    );
  }

  return (
    <section className="overflow-hidden rounded-2xl border border-border bg-white shadow-sm" aria-labelledby="class-library-title">
      <div className="border-b border-border px-4 py-4 sm:px-5"><h2 id="class-library-title" className="text-lg font-extrabold">Lớp học của tôi</h2><p className="mt-0.5 text-xs text-muted-foreground">Chọn một lớp để xem các buổi học và tài liệu đã được chia sẻ.</p></div>
      <div className="divide-y divide-border">
        {classes.map((summary) => (
          <article key={summary.classInfo.id} className="p-4 transition-colors hover:bg-muted/20 sm:p-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
              <div className="flex min-w-0 flex-1 items-start gap-3">
                <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-[#CFE1FA] text-sm font-extrabold text-[#280F91]">{summary.classInfo.tutorInitials}</span>
                <div className="min-w-0"><div className="flex flex-wrap items-center gap-2"><h3 className="text-base font-extrabold">{summary.classInfo.subject}</h3><span className="rounded-full bg-[#280F91]/8 px-2 py-1 text-xs font-bold text-[#280F91]">{summary.classInfo.level}</span></div><p className="mt-1 text-sm text-muted-foreground">{summary.classInfo.tutorName}</p><p className="mt-1 text-xs text-muted-foreground">{summary.classInfo.scheduleLabel}</p></div>
              </div>
              <dl className="grid grid-cols-3 gap-3 text-sm lg:min-w-[360px]">
                <Metric label="Buổi học" value={String(summary.sessionCount)} />
                <Metric label="Đã hoàn thành" value={String(summary.completedSessionCount)} />
                <Metric label="Tài liệu" value={String(summary.materialCount)} />
              </dl>
              <div className="flex flex-col gap-2 lg:items-end">
                <Link href={`/lms/learner/materials/classes/${summary.classInfo.id}`} className="inline-flex h-10 items-center justify-center gap-1.5 whitespace-nowrap rounded-xl bg-[#280F91] px-4 text-sm font-bold text-white hover:bg-[#280F91]/90">Xem buổi học <ArrowRight size={15} weight="bold" /></Link>
                {summary.latestMaterialAt && <p className="text-xs text-muted-foreground">Cập nhật {formatLibraryDate(summary.latestMaterialAt)}</p>}
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return <div><dt className="text-xs text-muted-foreground">{label}</dt><dd className="mt-1 font-extrabold text-foreground">{value}</dd></div>;
}

