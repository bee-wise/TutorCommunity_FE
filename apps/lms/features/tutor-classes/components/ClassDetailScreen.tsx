"use client";

import Link from "next/link";
import {
  BanknotesIcon,
  CalendarDaysIcon,
  ChatBubbleLeftRightIcon,
  CheckBadgeIcon,
  ClockIcon,
  ComputerDesktopIcon,
  FolderIcon,
  UsersIcon,
} from "@heroicons/react/24/outline";
import { Button } from "@workspace/ui/components/ui/button";
import { LmsClassHeader } from "../../../components/LmsClassHeader";
import { LmsDetailLayout } from "../../../components/LmsDetailLayout";
import { LmsFactList } from "../../../components/LmsFactList";
import { LmsLinkList } from "../../../components/LmsLinkList";
import { LmsMeterCard } from "../../../components/LmsMeterCard";
import { LmsStatCard } from "../../../components/LmsStatCard";
import { getClassKindLabel, getClassNaming, getTeachingModeLabel } from "../../../components/lms-class-naming";
import { useTutorClassDetail } from "../hooks/useTutorClassDetail";
import { formatClassDay } from "../utils/classes.utils";
import { getClassWorkspaceLinks } from "../utils/class-workspace.utils";
import { ClassQueryErrorState } from "./ClassQueryErrorState";
import { ClassWorkspaceSkeleton } from "./ClassWorkspaceSkeleton";
import { ClassMissingState } from "./ClassMissingState";
import { GroupClassManagement } from "./GroupClassManagement";
import { ClassStatusBadge } from "./ClassBadges";
import { classPage, classPanel } from "./classes-ui";

const BILLING_LABELS: Record<string, string> = { MONTHLY: "Thanh toán theo tháng", FULL_COURSE: "Thanh toán trọn khóa" };

export function ClassDetailScreen({ classId }: { classId: string }) {
  const { classInfo, loading, error, retry } = useTutorClassDetail(classId);
  const links = getClassWorkspaceLinks(classId);

  if (loading) return <ClassWorkspaceSkeleton />;
  if (error)
    return (
      <div className={classPage}>
        <ClassQueryErrorState error={error} onRetry={retry} detail />
      </div>
    );
  const details = classInfo?.serverDetails;
  if (!classInfo || !details) return <ClassMissingState />;

  const naming = getClassNaming({ ...details, title: classInfo.title });
  const spots = details.capacity - details.learnerCount;
  const money = new Intl.NumberFormat("vi-VN").format(details.pricePerHour);

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
            <span className="rounded-full border border-border bg-card px-2.5 py-1 text-xs font-bold">{getClassKindLabel(details.type)}</span>
            <span className="rounded-full border border-border bg-card px-2.5 py-1 text-xs font-bold">{getTeachingModeLabel(details.teachingMode)}</span>
          </>
        }
        actions={
          <Button asChild className="min-h-11 px-5">
            <Link href={links.sessions}>
              <CalendarDaysIcon className="size-4" aria-hidden="true" />
              Lịch buổi học
            </Link>
          </Button>
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

      <section aria-label="Tổng quan số liệu lớp học" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <LmsMeterCard label="Tiến độ buổi học" value={details.sessionCount} max={details.numberOfSessions} caption={`${details.sessionCount} trên ${details.numberOfSessions} buổi đã lên lịch`} />
        <LmsMeterCard label="Sĩ số học viên" value={details.learnerCount} max={details.capacity} tone="secondary" caption={spots > 0 ? `Còn ${spots} chỗ trống` : "Lớp đã đủ học viên"} />
        <LmsStatCard label="Thời lượng mỗi buổi" value={`${details.sessionDurationMinutes} phút`} icon={<ClockIcon aria-hidden="true" />} />
        <LmsStatCard label="Học phí mỗi giờ" value={`${money}đ`} icon={<BanknotesIcon aria-hidden="true" />} tone="accent" />
      </section>

      <LmsDetailLayout
        aside={
          <LmsLinkList
            title="Quản lý lớp"
            items={[
              { href: links.sessions, icon: CalendarDaysIcon, label: details.features.attendance ? "Buổi học và điểm danh" : "Buổi học", hint: `${details.sessionCount} buổi trong lịch` },
              { href: links.members, icon: UsersIcon, label: "Thành viên lớp", hint: `${details.learnerCount}/${details.capacity} học viên đang tham gia` },
              { href: links.messages, icon: ChatBubbleLeftRightIcon, label: "Phòng chat lớp" },
              { href: links.materials, icon: FolderIcon, label: "Kho tài liệu và đề AI" },
            ]}
          />
        }
      >
        <section aria-labelledby="class-info-title" className={classPanel}>
          <h2 id="class-info-title" className="mb-1 font-lms text-lg font-extrabold">Thông tin lớp</h2>
          <LmsFactList
            facts={[
              { icon: ComputerDesktopIcon, label: "Hình thức học", value: getTeachingModeLabel(details.teachingMode) },
              { icon: CalendarDaysIcon, label: "Khai giảng", value: details.openingAt ? formatClassDay(details.openingAt) : "Chưa lên lịch" },
              { icon: BanknotesIcon, label: "Cách thanh toán", value: BILLING_LABELS[details.billingMode ?? ""] ?? "Mức phí tiêu chuẩn" },
              { icon: ClockIcon, label: "Ngày tạo lớp", value: formatClassDay(classInfo.createdAt) },
            ]}
          />
        </section>
      </LmsDetailLayout>

      {classInfo.kind === "group" && <GroupClassManagement classId={classId} />}
    </div>
  );
}
