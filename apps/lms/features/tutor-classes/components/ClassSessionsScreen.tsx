"use client";

import Link from "next/link";
import {
  CalendarDaysIcon,
  ChatBubbleLeftRightIcon,
  CheckBadgeIcon,
  FolderIcon,
  InformationCircleIcon,
  UsersIcon,
} from "@heroicons/react/24/outline";
import { Button } from "@workspace/ui/components/ui/button";
import { useTutorClassDetail } from "../hooks/useTutorClassDetail";
import { getClassWorkspaceLinks } from "../utils/class-workspace.utils";
import { formatClassIdentifier } from "../utils/classes.utils";
import { ClassMissingState } from "./ClassMissingState";
import { ApiSessionList } from "./ApiSessionList";
import { ClassQueryErrorState } from "./ClassQueryErrorState";
import { ClassWorkspaceSkeleton } from "./ClassWorkspaceSkeleton";
import { ClassKindBadge, ClassStatusBadge } from "./ClassBadges";
import { classPage } from "./classes-ui";

export function ClassSessionsScreen({ classId }: { classId: string }) {
  const { classInfo, loading, error, retry } = useTutorClassDetail(classId);
  const links = getClassWorkspaceLinks(classId);

  if (loading) return <ClassWorkspaceSkeleton />;
  if (error) return <ClassQueryErrorState error={error} onRetry={retry} detail />;
  if (!classInfo) return <ClassMissingState />;

  const details = classInfo.serverDetails;
  const sessionProgress =
    details && details.numberOfSessions > 0
      ? Math.min(
          100,
          Math.round((details.sessionCount / details.numberOfSessions) * 100),
        )
      : 0;

  return (
    <div className={classPage}>
      {/* Header Area */}
      <header className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full border border-border bg-card px-3 py-0.5 font-mono text-xs font-bold text-muted-foreground shadow-2xs">
              {formatClassIdentifier(classInfo.code)}
            </span>
            <ClassStatusBadge status={classInfo.status} />
            <ClassKindBadge kind={classInfo.kind} />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button
              asChild
              variant="outline"
              className="min-h-10 rounded-xl border-border bg-card px-3.5 text-xs font-bold text-foreground hover:bg-muted transition-all active:scale-[0.98]"
            >
              <Link href={links.overview}>
                <InformationCircleIcon className="size-4" aria-hidden="true" />
                Thông tin lớp
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="min-h-10 rounded-xl border-border bg-card px-3.5 text-xs font-bold text-foreground hover:bg-muted transition-all active:scale-[0.98]"
            >
              <Link href={links.members}>
                <UsersIcon className="size-4" aria-hidden="true" />
                Thành viên
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="min-h-10 rounded-xl border-border bg-card px-3.5 text-xs font-bold text-foreground hover:bg-muted transition-all active:scale-[0.98]"
            >
              <Link href={links.messages} aria-label="Phòng chat lớp">
                <ChatBubbleLeftRightIcon className="size-4" aria-hidden="true" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="min-h-10 rounded-xl border-border bg-card px-3.5 text-xs font-bold text-foreground hover:bg-muted transition-all active:scale-[0.98]"
            >
              <Link href={links.materials} aria-label="Kho tài liệu lớp">
                <FolderIcon className="size-4" aria-hidden="true" />
              </Link>
            </Button>
          </div>
        </div>

        <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-border/70 pb-4">
          <div>
            <h1 className="font-lms text-2xl font-extrabold text-primary sm:text-3xl">
              {details?.features.attendance ? "Buổi học & điểm danh" : "Buổi học"}
            </h1>
            <p className="mt-1 text-sm font-semibold text-muted-foreground">
              {details?.programName ? `${details.programName} · ` : ""}
              {details?.teachingItemName || classInfo.subject}
              {details?.contextName ? ` (${details.contextName})` : ""}
            </p>
          </div>

          {details && (
            <div className="flex items-center gap-3 rounded-2xl border border-border/80 bg-card px-4 py-2 shadow-2xs">
              <CalendarDaysIcon className="size-5 text-primary" aria-hidden="true" />
              <div className="text-right sm:text-left">
                <p className="text-xs font-bold text-muted-foreground">Tiến độ buổi học</p>
                <p className="text-sm font-extrabold text-foreground tabular-nums">
                  {details.sessionCount} / {details.numberOfSessions} buổi ({sessionProgress}%)
                </p>
              </div>
            </div>
          )}
        </div>

        {classInfo.status === "completed" && (
          <div
            className="flex items-center gap-3 rounded-2xl border border-border bg-card px-4 py-3 text-sm font-medium text-primary shadow-2xs"
            role="status"
          >
            <CheckBadgeIcon className="size-5 shrink-0 text-primary" aria-hidden="true" />
            <p>Lớp đã kết thúc. Tin nhắn, tài liệu và điểm danh ở chế độ chỉ xem.</p>
          </div>
        )}
      </header>

      {/* Main Sessions List Component */}
      <ApiSessionList key={classId} classInfo={classInfo} />
    </div>
  );
}
