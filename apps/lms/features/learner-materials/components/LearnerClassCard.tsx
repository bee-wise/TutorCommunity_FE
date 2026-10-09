import Link from "next/link";
import { ArrowRightIcon } from "@heroicons/react/24/outline";
import { buttonVariants } from "@workspace/ui/components/ui/button";
import type { LearnerClassSummary } from "../types/learner-materials.types";
import { formatLibraryDate } from "../utils/learner-materials.utils";
import { LibraryClassBadge } from "./LibraryClassBadge";
import { libraryButton } from "./learner-materials-ui";
import styles from "./LearnerLibraryCard.module.css";

export function LearnerClassCard({ classInfo, sessionCount, completedSessionCount, materialCount, newMaterialCount, latestMaterialAt }: LearnerClassSummary) {
  return (
    <article className="h-full min-w-0">
      <Link href={`/lms/learner/materials/classes/${encodeURIComponent(classInfo.id)}`} aria-label={`Xem buổi học lớp ${classInfo.title}, mã ${classInfo.code}`} className={`${styles.card} group flex h-full min-w-0 flex-col gap-3 p-4 transition-all motion-reduce:transition-none`}>
        <header className="space-y-3">
          <h3 className="font-nunito text-lg font-extrabold leading-[1.3] text-primary [overflow-wrap:anywhere]">{classInfo.title}</h3>
          <div className="flex flex-wrap items-center justify-between gap-2"><span className="text-xs font-bold tabular-nums text-muted-foreground">{classInfo.code}</span><LibraryClassBadge status={classInfo.status} /></div>
          <div className="flex flex-wrap gap-1.5" aria-label="Môn học và cấp độ">
            <span className="rounded-full border border-border bg-card px-2.5 py-0.5 text-xs font-semibold leading-5 text-primary">{classInfo.subject}</span>
            <span className="rounded-full border border-border bg-card px-2.5 py-0.5 text-xs font-medium leading-5 text-muted-foreground">{classInfo.level}</span>
          </div>
        </header>
        <div className="space-y-3 rounded-2xl border border-border bg-card p-3">
          <div className="flex min-w-0 items-center gap-2.5">
            <span aria-hidden="true" className="grid size-8 shrink-0 place-items-center rounded-full bg-primary font-nunito text-xs font-extrabold text-primary-foreground">{classInfo.tutorInitials}</span>
            <div className="min-w-0"><p className="text-xs text-muted-foreground">Gia sư</p><p className="text-sm font-bold leading-5 text-foreground [overflow-wrap:anywhere]">{classInfo.tutorName}</p></div>
          </div>
          <dl className="grid grid-cols-3 gap-2 border-t border-border pt-3">
            <Metric label="Buổi học" value={sessionCount} /><Metric label="Hoàn thành" value={completedSessionCount} /><Metric label="Tài liệu" value={materialCount} />
          </dl>
        </div>
        <p className="text-xs leading-5 text-muted-foreground">{classInfo.scheduleLabel}</p>
        <div className="mt-auto space-y-3">
          {newMaterialCount > 0 && <p className="rounded-xl border border-accent bg-accent px-3 py-2 text-xs font-semibold leading-5 text-accent-foreground">{newMaterialCount} tài liệu mới được chia sẻ</p>}
          {materialCount === 0 && <p className="rounded-xl border border-border bg-card px-3 py-2 text-xs text-muted-foreground">Gia sư chưa chia sẻ tài liệu.</p>}
          {latestMaterialAt && <p className="text-xs leading-5 text-muted-foreground">Cập nhật {formatLibraryDate(latestMaterialAt)}</p>}
          <span className={buttonVariants({ variant: "default", className: `${libraryButton} w-full justify-between rounded-xl border-primary` })}>Xem buổi học <ArrowRightIcon className="size-4 motion-safe:transition-transform motion-safe:group-hover:translate-x-0.5" aria-hidden="true" /></span>
        </div>
      </Link>
    </article>
  );
}

function Metric({ label, value }: { label: string; value: number }) {
  return <div><dt className="text-xs text-muted-foreground">{label}</dt><dd className="mt-1 font-nunito text-sm font-extrabold tabular-nums text-foreground">{value}</dd></div>;
}
