"use client";

import Link from "next/link";
import { Button } from "@workspace/ui/components/ui/button";
import {
  BanknotesIcon,
  CalendarDaysIcon,
  ChatBubbleLeftRightIcon,
  CheckBadgeIcon,
  ClockIcon,
  ComputerDesktopIcon,
  CreditCardIcon,
  FolderIcon,
  UsersIcon,
} from "@heroicons/react/24/outline";
import { LmsDetailLayout } from "../../../components/LmsDetailLayout";
import { LmsInfoGrid } from "../../../components/LmsInfoGrid";
import { LmsLinkList } from "../../../components/LmsLinkList";
import { LmsHeroBanner, LmsHeroProgress } from "../../../components/LmsHeroBanner";
import { getTeachingModeLabel } from "../../../components/lms-class-naming";
import { useTutorClassDetail } from "../hooks/useTutorClassDetail";
import { formatClassDay } from "../utils/classes.utils";
import { getClassWorkspaceLinks } from "../utils/class-workspace.utils";
import { ClassQueryErrorState } from "./ClassQueryErrorState";
import { ClassWorkspaceSkeleton } from "./ClassWorkspaceSkeleton";
import { ClassMissingState } from "./ClassMissingState";
import { GroupClassManagement } from "./GroupClassManagement";
import { GroupLaunchActions } from "./GroupLaunchActions";
import { classPage } from "./classes-ui";

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

  const isGroup = classInfo.kind === "group";
  const spots = details.capacity - details.learnerCount;
  const remaining = Math.max(0, details.numberOfSessions - details.sessionCount);
  const money = new Intl.NumberFormat("vi-VN").format(details.pricePerHour);

  return (
    <div className={classPage}>
      {isGroup && <GroupLaunchActions classId={classId} />}
      {classInfo.status === "completed" && (
        <div role="status" className="flex items-center gap-3 rounded-2xl border border-border bg-card px-4 py-3 text-sm font-medium text-primary">
          <CheckBadgeIcon className="size-5 shrink-0" aria-hidden="true" />
          <p>Lớp đã kết thúc. Tin nhắn, tài liệu và điểm danh ở chế độ chỉ xem.</p>
        </div>
      )}
      <LmsHeroBanner title="Thông tin lớp" mascot="handshake">
        <LmsHeroProgress
          label="Số buổi đã lên lịch so với kế hoạch"
          value={details.sessionCount}
          max={details.numberOfSessions}
          note={remaining > 0 ? `Còn ${remaining} buổi chưa xếp` : "Đã xếp đủ lịch"}
        />
        <Button asChild className="min-h-11 bg-accent px-5 font-bold text-accent-foreground hover:bg-accent/90">
          <Link href={links.sessions}>
            <CalendarDaysIcon className="size-4" aria-hidden="true" />
            {classInfo.status === "completed" ? "Xem lại buổi học" : "Vào buổi học"}
          </Link>
        </Button>
      </LmsHeroBanner>

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
        <LmsInfoGrid
          title="Thông tin lớp"
          titleId="class-info-title"
          items={[
            { icon: ComputerDesktopIcon, label: "Hình thức học", value: getTeachingModeLabel(details.teachingMode) },
            { icon: ClockIcon, label: "Thời lượng mỗi buổi", value: `${details.sessionDurationMinutes} phút` },
            { icon: CalendarDaysIcon, label: "Khai giảng", value: details.openingAt ? formatClassDay(details.openingAt) : "Chưa lên lịch" },
            { icon: BanknotesIcon, label: "Học phí mỗi giờ", value: `${money}đ` },
            ...(isGroup
              ? [
                  { icon: UsersIcon, label: "Sĩ số học viên", value: `${details.learnerCount} / ${details.capacity} · ${spots > 0 ? `còn ${spots} chỗ` : "đã đủ"}` },
                  { icon: CreditCardIcon, label: "Cách thanh toán", value: BILLING_LABELS[details.billingMode ?? ""] ?? "Mức phí tiêu chuẩn" },
                ]
              : []),
          ]}
        />
      </LmsDetailLayout>

      {isGroup && <GroupClassManagement classId={classId} />}
    </div>
  );
}
