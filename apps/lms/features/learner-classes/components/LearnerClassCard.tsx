import Link from "next/link";
import { ChevronRightIcon } from "@heroicons/react/24/outline";
import { buttonVariants } from "@workspace/ui/components/ui/button";
import { LibraryClassBadge } from "../../learner-materials/components/LibraryClassBadge";
import type { LearnerClassWorkspaceSummary } from "../types/learner-classes.types";

export function LearnerClassCard({
  classInfo,
  sessionCount,
  completedSessionCount,
  materialCount,
  pendingExerciseCount,
}: LearnerClassWorkspaceSummary) {
  const actionLabel = classInfo.status === "completed" ? "Xem lại lớp" : classInfo.status === "upcoming" ? "Xem lớp" : "Vào lớp";

  return (
    <article className="min-w-0">
      <Link
        href={`/lms/learner/classes/${encodeURIComponent(classInfo.id)}`}
        aria-label={`${actionLabel} ${classInfo.title}, mã ${classInfo.code}`}
        className="group flex h-full min-w-0 flex-col rounded-3xl border border-border bg-card p-4 shadow-soft outline-none transition-all duration-200 hover:-translate-y-1 hover:border-primary/25 hover:shadow-soft-hover active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 motion-reduce:transform-none motion-reduce:transition-none sm:p-5"
      >
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="text-xs font-bold tabular-nums text-muted-foreground">
            {classInfo.code}
          </span>
          <LibraryClassBadge status={classInfo.status} />
        </div>

        <h2 className="mt-3 line-clamp-2 font-nunito text-lg font-extrabold leading-[1.3] text-primary [overflow-wrap:anywhere]">
          {classInfo.title}
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          {classInfo.subject} · {classInfo.level}
        </p>

        <div className="mt-4 flex min-w-0 items-center gap-2.5 border-t border-border pt-4">
          <span
            aria-hidden="true"
            className="grid size-9 shrink-0 place-items-center rounded-full bg-primary font-nunito text-xs font-extrabold text-primary-foreground"
          >
            {classInfo.tutorInitials}
          </span>
          <div className="min-w-0">
            <p className="text-xs text-muted-foreground">Gia sư</p>
            <p className="truncate text-sm font-bold text-foreground" title={classInfo.tutorName}>
              {classInfo.tutorName}
            </p>
          </div>
        </div>

        <dl className="mt-4 grid grid-cols-2 gap-3 border-t border-border pt-4">
          <Metric label="Đã học" value={sessionCount > 0 ? `${completedSessionCount}/${sessionCount} buổi` : "Chưa có buổi"} />
          <Metric label="Tài liệu" value={`${materialCount} tài liệu`} />
        </dl>

        <div className="mt-auto pt-4">
          <p className="text-xs leading-5 text-muted-foreground">
            Lịch học: {classInfo.scheduleLabel}
          </p>
          {pendingExerciseCount > 0 && (
            <p className="mt-3 w-fit rounded-full border border-accent bg-accent px-3 py-1.5 text-xs font-bold text-accent-foreground">
              {pendingExerciseCount} bài tập cần làm
            </p>
          )}
          <span
            className={buttonVariants({
              variant: "outline",
              className: "mt-4 min-h-11 w-full justify-between rounded-full border-primary px-4 font-bold text-primary transition-all group-hover:bg-primary group-hover:text-primary-foreground active:scale-[0.98]",
            })}
          >
            {actionLabel}
            <ChevronRightIcon className="size-4" aria-hidden="true" />
          </span>
        </div>
      </Link>
    </article>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0">
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="mt-1 font-nunito text-sm font-extrabold tabular-nums text-foreground">
        {value}
      </dd>
    </div>
  );
}
