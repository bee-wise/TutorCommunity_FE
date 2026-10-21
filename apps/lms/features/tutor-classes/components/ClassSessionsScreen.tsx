"use client";

import Link from "next/link";
import {
  ChatBubbleLeftRightIcon,
  CheckBadgeIcon,
  FolderIcon,
  InformationCircleIcon,
  UsersIcon,
} from "@heroicons/react/24/outline";
import { Button } from "@workspace/ui/components/ui/button";
import { LmsClassHeader } from "../../../components/LmsClassHeader";
import { LmsMeterCard } from "../../../components/LmsMeterCard";
import { getClassKindLabel, getClassNaming } from "../../../components/lms-class-naming";
import { useTutorClassDetail } from "../hooks/useTutorClassDetail";
import { getClassWorkspaceLinks } from "../utils/class-workspace.utils";
import { ClassMissingState } from "./ClassMissingState";
import { ApiSessionList } from "./ApiSessionList";
import { ClassQueryErrorState } from "./ClassQueryErrorState";
import { ClassWorkspaceSkeleton } from "./ClassWorkspaceSkeleton";
import { ClassStatusBadge } from "./ClassBadges";
import { classPage } from "./classes-ui";

export function ClassSessionsScreen({ classId }: { classId: string }) {
  const { classInfo, loading, error, retry } = useTutorClassDetail(classId);
  const links = getClassWorkspaceLinks(classId);

  if (loading) return <ClassWorkspaceSkeleton />;
  if (error) return <ClassQueryErrorState error={error} onRetry={retry} detail />;
  if (!classInfo) return <ClassMissingState />;

  const details = classInfo.serverDetails;
  const naming = getClassNaming({ ...details, title: classInfo.title });

  return (
    <div className={classPage}>
      <LmsClassHeader
        field={naming.field}
        subject={naming.subject}
        name={naming.name}
        level={naming.level}
        badges={
          <>
            <ClassStatusBadge status={classInfo.status} />
            <span className="rounded-full border border-border bg-card px-2.5 py-1 text-xs font-bold">{getClassKindLabel(details?.type)}</span>
          </>
        }
        actions={
          <>
            <Button asChild variant="outline" className="min-h-11">
              <Link href={links.overview}><InformationCircleIcon className="size-4" aria-hidden="true" />Thông tin lớp</Link>
            </Button>
            <Button asChild variant="outline" className="min-h-11">
              <Link href={links.members}><UsersIcon className="size-4" aria-hidden="true" />Thành viên</Link>
            </Button>
            <Button asChild variant="outline" size="icon" className="size-11">
              <Link href={links.messages} aria-label="Phòng chat lớp"><ChatBubbleLeftRightIcon className="size-4" aria-hidden="true" /></Link>
            </Button>
            <Button asChild variant="outline" size="icon" className="size-11">
              <Link href={links.materials} aria-label="Kho tài liệu lớp"><FolderIcon className="size-4" aria-hidden="true" /></Link>
            </Button>
          </>
        }
        notice={
          classInfo.status === "completed" ? (
            <div role="status" className="flex items-center gap-3 rounded-2xl border border-border bg-card px-4 py-3 text-sm font-medium text-primary">
              <CheckBadgeIcon className="size-5 shrink-0" aria-hidden="true" />
              <p>Lớp đã kết thúc. Tin nhắn, tài liệu và điểm danh ở chế độ chỉ xem.</p>
            </div>
          ) : undefined
        }
      />

      {details && (
        <div className="max-w-sm">
          <LmsMeterCard label="Tiến độ buổi học" value={details.sessionCount} max={details.numberOfSessions} caption={details.features.attendance ? "Buổi học và điểm danh của lớp" : "Số buổi đã lên lịch so với kế hoạch"} />
        </div>
      )}

      <ApiSessionList key={classId} classInfo={classInfo} />
    </div>
  );
}
