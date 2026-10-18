import Link from "next/link";
import { ChevronRightIcon, UserIcon } from "@heroicons/react/24/outline";
import { buttonVariants } from "@workspace/ui/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@workspace/ui/components/ui/avatar";
import { safeExternalUrl } from "@workspace/core/lms-classes/lifecycle";
import type { TutorClassCardModel } from "../types/classes.types";
import { formatClassDay, formatClassIdentifier } from "../utils/classes.utils";
import { ClassStatusBadge } from "./ClassBadges";
import { classOutlineButton } from "./classes-ui";

export function TutorClassCard({ classInfo, learners, learnerPreviews, learnerCount, sessionCount, attendancePendingCount }: TutorClassCardModel) {
  const learnerNames = learners.map((learner) => learner.fullName).join(", ");
  const previews = learnerPreviews?.slice(0, classInfo.kind === "individual" ? 1 : 3) ?? [];
  return (
    <article className="min-w-0">
      <Link href={`/lms/tutor/classes/${encodeURIComponent(classInfo.id)}`} aria-label={`Quản lý lớp ${classInfo.title}, mã ${formatClassIdentifier(classInfo.code)}`}
        className="group flex h-full min-w-0 flex-col rounded-3xl border border-border bg-card p-5 shadow-soft outline-none transition-all duration-200 hover:border-primary/25 hover:shadow-soft-hover focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 active:scale-[0.98] motion-reduce:transition-none motion-reduce:transform-none">
        <div className="flex flex-wrap items-center justify-between gap-2"><span className="whitespace-nowrap text-[11px] font-bold tracking-wide text-muted-foreground">{formatClassIdentifier(classInfo.code)}</span><ClassStatusBadge status={classInfo.status} /></div>
        <h2 className="mt-3 font-lms text-lg font-extrabold leading-6 text-foreground [overflow-wrap:anywhere]">{classInfo.title}</h2>
        <p className="mt-1.5 text-xs leading-5 text-muted-foreground">{classInfo.subject} · {classInfo.level}</p>
        <div className="mt-4 flex min-w-0 items-center gap-3 rounded-2xl border border-border/70 bg-muted/40 p-3">
          {learnerCount !== undefined && previews.length > 0 && <div aria-hidden="true" className="flex shrink-0 -space-x-2">{previews.map((learner) => <Avatar key={learner.id} className="size-9 rounded-xl border-2 border-card bg-muted"><AvatarImage src={safeExternalUrl(learner.avatarUrl) ?? undefined} alt="" className="object-cover" referrerPolicy="no-referrer" /><AvatarFallback className="rounded-xl bg-muted text-primary"><UserIcon className="size-4" aria-hidden="true" /></AvatarFallback></Avatar>)}</div>}
          {learnerCount === undefined && <div aria-hidden="true" className="flex shrink-0 -space-x-2">{learners.slice(0, 3).map((learner) => <span key={learner.id} className="grid size-9 place-items-center rounded-xl border-2 border-card bg-muted font-lms text-[11px] font-extrabold text-primary">{learner.initials}</span>)}</div>}
          <div className="min-w-0">
            <p className="truncate text-sm font-bold" title={classInfo.kind === "individual" ? learnerNames : undefined}>{learnerCount !== undefined ? `${learnerCount} học viên trong lớp` : classInfo.kind === "individual" ? learners[0]?.fullName ?? "Chưa có học viên" : `${learners.length} học viên trong lớp`}</p>
            <p className="mt-0.5 truncate text-xs text-muted-foreground" title={learnerNames}>{learnerCount !== undefined ? classInfo.serverDetails?.programName || "Chưa có chương trình học" : classInfo.kind === "individual" ? learners[0]?.gradeLevel ?? "Chưa có thông tin" : learnerNames || "Chưa có học viên"}</p>
          </div>
        </div>
        <dl className="mt-4 flex flex-wrap items-center justify-between gap-x-3 gap-y-2 text-xs">
          <div><dt className="sr-only">Số buổi học</dt><dd className="font-bold text-foreground/80">{sessionCount} buổi học</dd></div>
          <div className="flex gap-1 text-muted-foreground"><dt>Thêm</dt><dd>{formatClassDay(classInfo.createdAt)}</dd></div>
        </dl>
        <div className="mt-auto pt-4">
          {classInfo.status === "active" && (attendancePendingCount ?? 0) > 0 && <p className="mb-3 rounded-xl border border-accent/40 bg-accent/15 px-3 py-2 text-xs font-bold leading-5 text-warning">{attendancePendingCount} buổi chưa xác nhận điểm danh</p>}
          <span className={buttonVariants({ variant: "outline", className: `${classOutlineButton} w-full justify-between group-hover:border-primary/30 group-hover:bg-muted` })}>Quản lý lớp<ChevronRightIcon className="size-4" aria-hidden="true" /></span>
        </div>
      </Link>
    </article>
  );
}
