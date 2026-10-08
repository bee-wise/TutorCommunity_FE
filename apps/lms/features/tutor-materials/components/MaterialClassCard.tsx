import Link from "next/link";
import { ArrowRightIcon } from "@heroicons/react/24/outline";
import { buttonVariants } from "@workspace/ui/components/ui/button";
import { CLASS_STATUS_LABELS } from "../types/class-materials.types";
import type { MaterialLibraryCard } from "../types/material-library.types";
import { libraryButton } from "./material-library-ui";
import styles from "./MaterialClassCard.module.css";

const STATUS_STYLES = {
  active: "border-primary bg-primary text-primary-foreground",
  upcoming: "border-accent bg-accent text-accent-foreground",
  completed: "border-border bg-card text-muted-foreground",
} as const;

export function MaterialClassCard({ classInfo, learners, sessionCount, materialCount, missingPublishedCount }: MaterialLibraryCard) {
  return (
    <article className="h-full min-w-0">
      <Link href={`/lms/tutor/materials/classes/${encodeURIComponent(classInfo.id)}`}
        aria-label={`Xem tài liệu lớp ${classInfo.title}, mã ${classInfo.code}`}
        className={`${styles.card} group flex h-full min-w-0 flex-col gap-3 p-4 transition-all motion-reduce:transition-none`}>
        <header className="space-y-3">
          <h2 className="font-nunito text-lg font-extrabold leading-[1.3] text-primary [overflow-wrap:anywhere]">{classInfo.title}</h2>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-xs font-bold tabular-nums text-muted-foreground">{classInfo.code}</span>
            <span className={`rounded-full border px-2.5 py-0.5 text-[11px] font-bold leading-5 ${STATUS_STYLES[classInfo.status]}`}>
              {CLASS_STATUS_LABELS[classInfo.status]}
            </span>
          </div>
          <div className="flex flex-wrap gap-1.5" aria-label="Môn học và cấp độ">
            <span className="rounded-full border border-border bg-card px-2.5 py-0.5 text-[11px] font-semibold leading-5 text-primary [overflow-wrap:anywhere]">{classInfo.subject}</span>
            <span className="rounded-full border border-border bg-card px-2.5 py-0.5 text-[11px] font-medium leading-5 text-muted-foreground [overflow-wrap:anywhere]">{classInfo.level}</span>
          </div>
        </header>
        <div className="space-y-3 rounded-2xl border border-border bg-card p-3">
          <div className="flex min-w-0 items-center gap-2.5">
            <div className="flex shrink-0 -space-x-2" aria-hidden="true">
              {learners.slice(0, 3).map((learner) => <span key={learner.id} className="grid size-8 shrink-0 place-items-center rounded-full border-2 border-card bg-primary font-nunito text-[11px] font-extrabold text-primary-foreground">{learner.initials}</span>)}
            </div>
            <div className="min-w-0 space-y-0.5">
              <p className="text-[11px] leading-4 text-muted-foreground">Học viên</p>
              <p className="text-sm font-bold leading-5 text-foreground [overflow-wrap:anywhere]">{classInfo.kind === "individual" ? learners[0]?.fullName ?? "Chưa có học viên" : `${learners.length} học viên trong lớp`}</p>
            </div>
          </div>
          <dl className="grid grid-cols-2 gap-3 border-t border-border pt-3">
            <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
              <dt className="text-xs text-muted-foreground">Buổi học</dt>
              <dd className="font-nunito text-sm font-extrabold tabular-nums text-foreground">{sessionCount}</dd>
            </div>
            <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
              <dt className="text-xs text-muted-foreground">Tài liệu</dt>
              <dd className="font-nunito text-sm font-extrabold tabular-nums text-foreground">{materialCount}</dd>
            </div>
          </dl>
        </div>
        <div className="mt-auto space-y-3">
          {missingPublishedCount > 0 && <p className="rounded-xl border border-accent bg-accent px-3 py-2 text-xs font-medium leading-5 text-accent-foreground"><strong className="font-extrabold tabular-nums">{missingPublishedCount} buổi</strong> chưa có tài liệu đã xuất bản</p>}
          <span className={buttonVariants({ variant: "default", className: `${libraryButton} w-full justify-between rounded-xl border-primary` })}>
            Xem tài liệu <ArrowRightIcon className="size-4 motion-safe:transition-transform motion-safe:duration-200 motion-safe:group-hover:translate-x-0.5" aria-hidden="true" />
          </span>
        </div>
      </Link>
    </article>
  );
}
