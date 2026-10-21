"use client";

import Link from "next/link";
import {
  CalendarDaysIcon,
  ChatBubbleLeftRightIcon,
  ComputerDesktopIcon,
  FolderIcon,
  InformationCircleIcon,
  MagnifyingGlassIcon,
  MapPinIcon,
  UserGroupIcon,
  UsersIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { Button } from "@workspace/ui/components/ui/button";
import { useClassMembers } from "../hooks/useClassMembers";
import { getClassWorkspaceLinks } from "../utils/class-workspace.utils";
import { formatClassDate, formatClassIdentifier } from "../utils/classes.utils";
import { ClassLearnerIdentity } from "./ClassLearnerIdentity";
import { ClassMissingState } from "./ClassMissingState";
import { ClassPagination } from "./ClassPagination";
import { ClassWorkspaceSkeleton } from "./ClassWorkspaceSkeleton";
import { ClassQueryErrorState } from "./ClassQueryErrorState";
import { MemberChangesPanel } from "./MemberChangesPanel";
import { ClassKindBadge, ClassStatusBadge } from "./ClassBadges";
import { classInput, classPage } from "./classes-ui";

type Member = ReturnType<typeof useClassMembers>["members"][number];

function MemberCard({ learner }: { learner: Member }) {
  const hasLeft = Boolean(learner.leftAt);
  return (
    <li className="group flex flex-col justify-between overflow-hidden rounded-3xl border border-border bg-card p-5 shadow-soft transition-all duration-300 hover:border-primary/40 hover:shadow-soft-hover">
      <div>
        {/* Top: Learner Identity & Status */}
        <div className="flex items-start justify-between gap-3 border-b border-border/70 pb-4">
          <ClassLearnerIdentity learner={learner} showContact={false} />
          <span
            className={`inline-flex shrink-0 items-center rounded-full border px-2.5 py-1 text-[11px] font-bold ${
              hasLeft
                ? "border-border bg-muted text-muted-foreground"
                : "border-secondary/30 bg-secondary/15 text-foreground"
            }`}
          >
            {hasLeft ? "Đã rời lớp" : "Đang tham gia"}
          </span>
        </div>

        {/* Details in sleek container */}
        <div className="mt-4 space-y-2.5 rounded-2xl border border-border/60 bg-muted/20 p-3.5 text-xs">
          {learner.gradeLevel && (
            <div className="flex items-baseline justify-between gap-2">
              <span className="text-muted-foreground">Cấp/lớp:</span>
              <span className="font-bold text-foreground">
                {learner.gradeLevel}
              </span>
            </div>
          )}
          <div className="flex items-baseline justify-between gap-2">
            <span className="text-muted-foreground">Mã học viên:</span>
            <span className="font-mono font-bold tabular-nums text-primary">
              {formatClassIdentifier(learner.id)}
            </span>
          </div>
          <div className="flex items-baseline justify-between gap-2">
            <span className="inline-flex items-center gap-1.5 text-muted-foreground">
              <CalendarDaysIcon className="size-3.5" aria-hidden="true" />
              Ngày tham gia:
            </span>
            <span className="font-semibold text-foreground">
              {formatClassDate(learner.joinedAt)}
            </span>
          </div>
          {learner.leftAt && (
            <div className="flex items-baseline justify-between gap-2 border-t border-border/70 pt-2">
              <span className="text-muted-foreground">Ngày rời lớp:</span>
              <span className="font-semibold text-foreground">
                {formatClassDate(learner.leftAt)}
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-border/60 pt-3 text-[11px] text-muted-foreground">
        <span className="font-medium">
          {hasLeft ? "Hồ sơ lưu trữ" : "Hồ sơ chính thức"}
        </span>
        <span className="rounded-md border border-border/60 bg-muted/40 px-2 py-0.5 font-bold text-foreground transition-colors">
          {hasLeft ? "Đã kết thúc" : "Đang theo học"}
        </span>
      </div>
    </li>
  );
}

export function ClassMembersScreen({ classId }: { classId: string }) {
  const list = useClassMembers(classId);
  const links = getClassWorkspaceLinks(classId);

  if (list.loading) return <ClassWorkspaceSkeleton />;
  if (list.error)
    return (
      <div className={classPage}>
        <ClassQueryErrorState error={list.error} onRetry={list.retry} detail />
      </div>
    );
  if (!list.classInfo) return <ClassMissingState />;

  const details = list.classInfo.serverDetails;
  const isHistory = list.mode === "history";
  const capacity = details?.capacity;
  const learnerCount = details?.learnerCount ?? list.total;
  const fillRate =
    capacity && capacity > 0
      ? Math.min(100, Math.round((learnerCount / capacity) * 100))
      : 100;
  const remainingSpots =
    capacity !== undefined && capacity > 0
      ? Math.max(0, capacity - learnerCount)
      : null;

  return (
    <div className={classPage}>
      {/* Header & Navigation strip matching ClassDetailScreen and ClassSessionsScreen */}
      <header className="space-y-4">
        <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-border/70 pb-4">
          <div>
            <h1 className="font-lms text-2xl font-extrabold text-primary sm:text-3xl">
              Thành viên lớp
            </h1>
          </div>

          <div className="flex items-center gap-2.5 rounded-2xl border border-border/80 bg-card px-4 py-2 shadow-2xs">
            <UsersIcon className="size-5 text-primary" aria-hidden="true" />
            <div className="text-right sm:text-left">
              <p className="text-xs font-bold text-muted-foreground">
                Tổng sĩ số lớp
              </p>
              <p className="font-lms text-sm font-extrabold text-foreground">
                {learnerCount}
                {capacity !== undefined && (
                  <span className="font-normal text-muted-foreground">
                    {" "}
                    / {capacity} học viên
                  </span>
                )}
              </p>
            </div>
          </div>
        </div>

        {list.classInfo.status === "completed" && (
          <p
            className="rounded-2xl border border-border bg-card px-4 py-3 text-sm font-medium text-primary shadow-2xs"
            role="status"
          >
            Lớp đã kết thúc. Tin nhắn, tài liệu và điểm danh ở chế độ chỉ xem.
          </p>
        )}
      </header>

      {/* Roster Section with Toolbar & Grid */}
      <section aria-labelledby="class-member-list-title" className="space-y-4">
        {/* Modern Toolbar */}
        <div className="flex flex-col gap-3 rounded-3xl border border-border bg-card p-4 shadow-soft sm:flex-row sm:items-center sm:justify-between sm:p-5">
          {/* Segmented Switcher */}
          <div
            role="group"
            aria-label="Danh sách hiển thị"
            className="flex rounded-2xl bg-muted/60 p-1"
          >
            <button
              type="button"
              aria-pressed={!isHistory}
              onClick={() => list.setMode("current")}
              className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all active:scale-[0.98] ${
                !isHistory
                  ? "bg-card text-foreground shadow-2xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <span>Đang tham gia</span>
              <span
                className={`rounded-full px-1.5 py-0.5 text-[10px] font-extrabold ${
                  !isHistory
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {!isHistory ? list.total : learnerCount}
              </span>
            </button>
            <button
              type="button"
              aria-pressed={isHistory}
              onClick={() => list.setMode("history")}
              className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all active:scale-[0.98] ${
                isHistory
                  ? "bg-card text-foreground shadow-2xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <span>Lịch sử tham gia</span>
              {isHistory && (
                <span className="rounded-full bg-primary px-1.5 py-0.5 text-[10px] font-extrabold text-primary-foreground">
                  {list.total}
                </span>
              )}
            </button>
          </div>

          {/* Search Input */}
          <div className="relative flex-1 sm:max-w-md">
            <label htmlFor="class-member-search" className="sr-only">
              Tìm học viên
            </label>
            <MagnifyingGlassIcon
              className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden="true"
            />
            <input
              id="class-member-search"
              type="search"
              maxLength={100}
              value={list.search}
              onChange={(event) => list.updateSearch(event.target.value)}
              className={`${classInput} h-10 rounded-full pl-9 pr-9 text-xs`}
              placeholder="Tìm học viên theo tên, mã hoặc cấp lớp..."
            />
            {list.search && (
              <button
                type="button"
                aria-label="Xóa tìm kiếm"
                onClick={() => list.updateSearch("")}
                className="absolute right-2 top-1/2 grid size-7 -translate-y-1/2 place-items-center rounded-full text-muted-foreground transition-all hover:bg-muted hover:text-primary active:scale-95"
              >
                <XMarkIcon className="size-4" />
              </button>
            )}
          </div>
        </div>

        {/* Section title & count */}
        <div className="flex flex-wrap items-center justify-between gap-2 px-1">
          <h2
            id="class-member-list-title"
            className="font-lms text-lg font-extrabold text-foreground"
          >
            {isHistory ? "Lịch sử học viên đã tham gia" : "Danh sách học viên"}
          </h2>
          <span
            className="rounded-full border border-border bg-card px-3 py-1 text-xs font-bold tabular-nums text-muted-foreground shadow-2xs"
            aria-live="polite"
          >
            {list.total} học viên
          </span>
        </div>

        {/* Member Cards Grid */}
        {list.members.length ? (
          <ul className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {list.members.map((learner) => (
              <MemberCard key={learner.enrollmentId} learner={learner} />
            ))}
          </ul>
        ) : (
          <div className="rounded-3xl border border-dashed border-border bg-card px-5 py-12 text-center shadow-soft">
            <span className="mx-auto grid size-12 place-items-center rounded-2xl bg-muted/60 text-muted-foreground">
              <UserGroupIcon className="size-6" aria-hidden="true" />
            </span>
            <h3 className="mt-4 font-lms text-base font-extrabold text-foreground">
              {list.search
                ? "Không tìm thấy học viên"
                : isHistory
                  ? "Chưa có lịch sử tham gia"
                  : "Lớp chưa có học viên"}
            </h3>
            <p className="mt-1 text-xs text-muted-foreground">
              {list.search
                ? `Không có kết quả nào khớp với "${list.search}". Vui lòng thử từ khóa khác.`
                : isHistory
                  ? "Chưa có học viên nào từng rời khỏi lớp học này."
                  : "Danh sách học viên hiện đang trống hoặc đang cập nhật."}
            </p>
            {list.search && (
              <Button
                type="button"
                variant="outline"
                className="mt-4 rounded-xl transition-all active:scale-[0.98]"
                onClick={() => list.updateSearch("")}
              >
                Xóa tìm kiếm
              </Button>
            )}
          </div>
        )}

        {/* Pagination */}
        <ClassPagination
          page={list.page}
          pageCount={list.pageCount}
          label="Phân trang thành viên"
          onPageChange={list.setPage}
        />
      </section>

      {/* Member Changes Panel */}
      <MemberChangesPanel
        classId={classId}
        readOnly={
          list.classInfo.status !== "active" &&
          list.classInfo.status !== "upcoming"
        }
      />
    </div>
  );
}
