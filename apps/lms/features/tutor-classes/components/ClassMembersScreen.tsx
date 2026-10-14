"use client";

import { CalendarDaysIcon, MagnifyingGlassIcon, UserGroupIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { Button } from "@workspace/ui/components/ui/button";
import { useClassMembers } from "../hooks/useClassMembers";
import { formatClassDate, formatClassIdentifier } from "../utils/classes.utils";
import { ClassLearnerIdentity } from "./ClassLearnerIdentity";
import { ClassMissingState } from "./ClassMissingState";
import { ClassPagination } from "./ClassPagination";
import { ClassWorkspaceHeader } from "./ClassWorkspaceHeader";
import { ClassWorkspaceSkeleton } from "./ClassWorkspaceSkeleton";
import { ClassQueryErrorState } from "./ClassQueryErrorState";
import { MemberChangesPanel } from "./MemberChangesPanel";
import { classInput, classPage } from "./classes-ui";

type Member = ReturnType<typeof useClassMembers>["members"][number];

function MemberCard({ learner }: { learner: Member }) {
  const hasLeft = Boolean(learner.leftAt);
  return (
    <li className="overflow-hidden rounded-3xl border border-border bg-card shadow-soft">
      <div className="flex items-start justify-between gap-3 border-b border-border/70 p-4 sm:p-5">
        <ClassLearnerIdentity learner={learner} showContact={false} />
        <span className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-bold ${hasLeft ? "bg-muted text-muted-foreground" : "bg-secondary/15 text-secondary"}`}>
          {hasLeft ? "Đã rời lớp" : "Đang tham gia"}
        </span>
      </div>
      <dl className="grid gap-3 p-4 text-sm sm:p-5">
        {learner.gradeLevel && (
          <div className="flex items-baseline justify-between gap-3">
            <dt className="text-xs text-muted-foreground">Cấp/lớp</dt>
            <dd className="text-right font-bold text-foreground">{learner.gradeLevel}</dd>
          </div>
        )}
        <div className="flex items-baseline justify-between gap-3">
          <dt className="text-xs text-muted-foreground">Mã học viên</dt>
          <dd className="font-bold tabular-nums text-primary">{formatClassIdentifier(learner.id)}</dd>
        </div>
        <div className="flex items-baseline justify-between gap-3">
          <dt className="flex items-center gap-1 text-xs text-muted-foreground"><CalendarDaysIcon className="size-3.5" aria-hidden="true" />Tham gia</dt>
          <dd className="text-right font-semibold text-foreground">{formatClassDate(learner.joinedAt)}</dd>
        </div>
        {learner.leftAt && (
          <div className="flex items-baseline justify-between gap-3 border-t border-border/70 pt-3">
            <dt className="text-xs text-muted-foreground">Rời lớp</dt>
            <dd className="text-right font-semibold text-foreground">{formatClassDate(learner.leftAt)}</dd>
          </div>
        )}
      </dl>
    </li>
  );
}

export function ClassMembersScreen({ classId }: { classId: string }) {
  const list = useClassMembers(classId);
  if (list.loading) return <ClassWorkspaceSkeleton />;
  if (list.error) return <ClassQueryErrorState error={list.error} onRetry={list.retry} detail />;
  if (!list.classInfo) return <ClassMissingState />;

  const isHistory = list.mode === "history";
  const capacity = list.classInfo.serverDetails?.capacity;
  const learnerCount = list.classInfo.serverDetails?.learnerCount;

  return (
    <div className={classPage}>
      <ClassWorkspaceHeader classInfo={list.classInfo} title="Thành viên lớp" />
      <section aria-label="Tổng quan thành viên" className="overflow-hidden rounded-3xl border border-border bg-card shadow-soft lg:grid lg:grid-cols-[minmax(240px,0.7fr)_minmax(0,1.3fr)]">
        <div className="relative bg-primary p-5 text-primary-foreground sm:p-6">
          <div aria-hidden="true" className="absolute inset-y-0 right-0 w-1.5 bg-accent" />
          <span className="grid size-11 place-items-center rounded-xl border border-white/20 bg-white/10"><UserGroupIcon className="size-6" aria-hidden="true" /></span>
          <p className="mt-5 text-xs font-bold uppercase tracking-[0.13em] text-primary-foreground/70">{isHistory ? "Lịch sử tham gia" : "Sĩ số hiện tại"}</p>
          <p className="mt-1 font-nunito text-4xl font-extrabold tabular-nums">
            {isHistory ? list.total : learnerCount ?? list.total}
            {!isHistory && capacity !== undefined && <span className="ml-1 text-lg font-semibold text-primary-foreground/70">/ {capacity}</span>}
          </p>
          <p className="mt-1 text-xs font-medium text-primary-foreground/75">{isHistory ? list.search ? "hồ sơ phù hợp tìm kiếm" : "hồ sơ từng tham gia lớp" : "học viên đang học trong lớp"}</p>
          {!isHistory && capacity !== undefined && capacity > 0 && (
            <div className="mt-5 h-1.5 overflow-hidden rounded-full bg-white/20" aria-label={`Đã sử dụng ${learnerCount ?? 0} trên ${capacity} chỗ`}>
              <div className="h-full rounded-full bg-accent" style={{ width: `${Math.min(100, ((learnerCount ?? 0) / capacity) * 100)}%` }} />
            </div>
          )}
        </div>
        <div className="flex flex-col justify-center gap-4 p-5 sm:p-6">
          <div role="group" aria-label="Danh sách hiển thị" className="flex flex-wrap gap-2">
            <Button type="button" variant={!isHistory ? "default" : "outline"} aria-pressed={!isHistory} onClick={() => list.setMode("current")} className="min-h-10 rounded-xl px-4 text-sm font-bold transition-all active:scale-[0.98]">Đang tham gia</Button>
            <Button type="button" variant={isHistory ? "default" : "outline"} aria-pressed={isHistory} onClick={() => list.setMode("history")} className="min-h-10 rounded-xl px-4 text-sm font-bold transition-all active:scale-[0.98]">Lịch sử tham gia</Button>
          </div>
          <label className="grid gap-1.5 text-xs font-bold text-foreground" htmlFor="class-member-search">
            Tìm học viên
            <span className="relative">
              <MagnifyingGlassIcon className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
              <input id="class-member-search" type="search" maxLength={100} value={list.search} onChange={(event) => list.updateSearch(event.target.value)} className={`${classInput} pl-10 pr-10`} placeholder="Tên, mã học viên hoặc cấp/lớp" />
              {list.search && <button type="button" aria-label="Xóa tìm kiếm" onClick={() => list.updateSearch("")} className="absolute right-2 top-1/2 grid size-8 -translate-y-1/2 place-items-center rounded-lg text-muted-foreground transition-all hover:bg-muted hover:text-primary active:scale-95"><XMarkIcon className="size-4" /></button>}
            </span>
          </label>
        </div>
      </section>
      <section aria-labelledby="class-member-list-title" className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 id="class-member-list-title" className="font-nunito text-lg font-extrabold text-primary">{isHistory ? "Lịch sử học viên" : "Danh sách học viên"}</h2>
          <span className="rounded-full border border-border bg-card px-3 py-1.5 text-xs font-bold tabular-nums text-muted-foreground" aria-live="polite">{list.total} kết quả</span>
        </div>
        {list.members.length ? (
          <ul className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {list.members.map((learner) => <MemberCard key={learner.enrollmentId} learner={learner} />)}
          </ul>
        ) : (
          <div className="rounded-3xl border border-dashed border-border bg-card px-5 py-10 text-center">
            <UserGroupIcon className="mx-auto size-10 text-muted-foreground/60" aria-hidden="true" />
            <h3 className="mt-3 font-nunito text-base font-extrabold text-primary">{list.search ? "Không tìm thấy học viên" : isHistory ? "Chưa có lịch sử tham gia" : "Lớp chưa có học viên"}</h3>
            {list.search && <Button type="button" variant="outline" className="mt-4 rounded-xl transition-all active:scale-[0.98]" onClick={() => list.updateSearch("")}>Xóa tìm kiếm</Button>}
          </div>
        )}
        <ClassPagination page={list.page} pageCount={list.pageCount} label="Phân trang thành viên" onPageChange={list.setPage} />
      </section>
      <MemberChangesPanel classId={classId} readOnly={list.classInfo.status !== "active" && list.classInfo.status !== "upcoming"} />
    </div>
  );
}
