import { UserIcon } from "@heroicons/react/24/outline";
import { Avatar, AvatarFallback, AvatarImage } from "@workspace/ui/components/ui/avatar";
import { safeExternalUrl } from "@workspace/core/lms-classes/lifecycle";
import { LmsClassCard } from "../../../components/LmsClassCard";
import { getClassKindLabel, getClassNaming } from "../../../components/lms-class-naming";
import type { TutorClassCardModel } from "../types/classes.types";
import { formatClassDay } from "../utils/classes.utils";
import { ClassStatusBadge } from "./ClassBadges";

export function TutorClassCard({ classInfo, learners, learnerPreviews, learnerCount, sessionCount, attendancePendingCount }: TutorClassCardModel) {
  const details = classInfo.serverDetails;
  const naming = getClassNaming({
    title: classInfo.title,
    programName: details?.programName,
    contextName: details?.contextName,
    teachingItemName: details?.teachingItemName,
  });
  const kindLabel = getClassKindLabel(details?.type ?? classInfo.kind.toUpperCase());
  const previews = learnerPreviews?.slice(0, classInfo.kind === "individual" ? 1 : 3) ?? [];
  const learnerNames = learners.map((learner) => learner.fullName).join(", ");
  const memberCount = learnerCount ?? learners.length;
  const pending = classInfo.status === "active" ? (attendancePendingCount ?? 0) : 0;

  return (
    <article className="min-w-0">
      <LmsClassCard
        href={`/lms/tutor/classes/${encodeURIComponent(classInfo.id)}`}
        ariaLabel={`Quản lý lớp ${naming.subject}`}
        field={naming.field}
        kindLabel={kindLabel}
        status={<ClassStatusBadge status={classInfo.status} />}
        subject={naming.subject}
        name={naming.name}
        level={naming.level}
        meta={[
          { label: "Số buổi", value: `${sessionCount} buổi` },
          { label: "Ngày tạo", value: formatClassDay(classInfo.createdAt) },
        ]}
        alert={pending > 0 ? <p role="status" className="rounded-xl border border-accent/40 bg-accent/15 px-3 py-2 text-xs font-bold leading-5 text-warning">{pending} buổi chưa xác nhận điểm danh</p> : undefined}
        cta="Quản lý lớp"
      >
        <div className="flex min-w-0 items-center gap-3 rounded-2xl bg-muted p-3">
          <div aria-hidden="true" className="flex shrink-0 -space-x-2">
            {learnerCount !== undefined && previews.length > 0
              ? previews.map((learner) => (
                  <Avatar key={learner.id} className="size-9 rounded-xl border-2 border-card bg-card">
                    <AvatarImage src={safeExternalUrl(learner.avatarUrl) ?? undefined} alt="" className="object-cover" referrerPolicy="no-referrer" />
                    <AvatarFallback className="rounded-xl bg-card text-primary"><UserIcon className="size-4" aria-hidden="true" /></AvatarFallback>
                  </Avatar>
                ))
              : learners.slice(0, 3).map((learner) => (
                  <span key={learner.id} className="grid size-9 place-items-center rounded-xl border-2 border-card bg-card font-lms text-[11px] font-extrabold text-primary">{learner.initials}</span>
                ))}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-bold" title={classInfo.kind === "individual" ? learnerNames : undefined}>
              {classInfo.kind === "individual" && learnerCount === undefined ? (learners[0]?.fullName ?? "Chưa có học viên") : `${memberCount} học viên trong lớp`}
            </p>
            <p className="mt-0.5 truncate text-xs text-muted-foreground" title={learnerNames}>
              {classInfo.kind === "individual" && learnerCount === undefined ? (learners[0]?.gradeLevel ?? kindLabel) : kindLabel}
            </p>
          </div>
        </div>
      </LmsClassCard>
    </article>
  );
}
