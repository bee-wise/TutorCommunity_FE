import Link from "next/link";
import { ArrowRightIcon } from "@heroicons/react/24/outline";
import { Button, buttonVariants } from "@workspace/ui/components/ui/button";
import { LEARNER_SESSION_STATUS_LABELS, type LearnerSessionSummary } from "../types/learner-materials.types";
import { formatLibraryDate } from "../utils/learner-materials.utils";
import { libraryBadge, libraryButton, libraryPanel } from "./learner-materials-ui";

const STATUS_STYLES = {
  COMPLETED: "border-primary bg-primary text-primary-foreground",
  UPCOMING: "border-accent bg-accent text-accent-foreground",
  CANCELED: "border-destructive bg-card text-destructive",
} as const;

export function LearnerSessionCard({ classId, session, materialCount }: LearnerSessionSummary & { classId: string }) {
  return (
    <article className={`${libraryPanel} flex min-w-0 flex-col gap-4`}>
      <header className="space-y-3">
        <h3 className="font-nunito text-lg font-extrabold leading-[1.3] text-primary [overflow-wrap:anywhere]">{session.topic}</h3>
        <div className="flex flex-wrap items-center justify-between gap-2"><span className="text-xs font-bold text-muted-foreground">Buổi {session.sequence}</span><span className={`${libraryBadge} ${STATUS_STYLES[session.status]}`}>{LEARNER_SESSION_STATUS_LABELS[session.status]}</span></div>
      </header>
      <dl className="space-y-2 rounded-2xl border border-border bg-card p-3 text-sm">
        <div className="flex flex-wrap justify-between gap-x-3 gap-y-1"><dt className="text-muted-foreground">Thời gian</dt><dd className="font-semibold tabular-nums">{formatLibraryDate(session.taughtAt)}</dd></div>
        <div className="flex justify-between gap-3"><dt className="text-muted-foreground">Thời lượng</dt><dd className="font-semibold tabular-nums">{session.durationMinutes} phút</dd></div>
      </dl>
      <div className="mt-auto space-y-3">
        {materialCount > 0 ? <p className="text-sm font-bold text-primary">{materialCount} tài liệu được chia sẻ</p> : <p className="rounded-xl border border-border bg-card px-3 py-2 text-sm text-muted-foreground">Chưa có tài liệu được chia sẻ.</p>}
        {materialCount > 0 ? <Link href={`/lms/learner/materials/classes/${encodeURIComponent(classId)}/sessions/${encodeURIComponent(session.id)}`} aria-label={`Xem tài liệu buổi ${session.sequence}: ${session.topic}`} className={buttonVariants({ variant: "default", className: `${libraryButton} w-full justify-between rounded-xl border-primary` })}>Xem tài liệu <ArrowRightIcon className="size-4" aria-hidden="true" /></Link> : <Button type="button" variant="outline" disabled className={`${libraryButton} w-full rounded-xl border-border bg-card text-muted-foreground disabled:opacity-100`}>Chưa thể xem</Button>}
      </div>
    </article>
  );
}
