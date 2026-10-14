"use client";

import Link from "next/link";
import {
  ArrowRightIcon,
  CalendarDaysIcon,
  ClockIcon,
  UsersIcon,
} from "@heroicons/react/24/outline";
import { Button } from "@workspace/ui/components/ui/button";
import { useClassOverview } from "../hooks/useClassOverview";
import { formatClassDay, formatClassIdentifier } from "../utils/classes.utils";
import { getClassWorkspaceLinks } from "../utils/class-workspace.utils";
import { ClassQueryErrorState } from "./ClassQueryErrorState";
import { ClassWorkspaceSkeleton } from "./ClassWorkspaceSkeleton";
import { ClassWorkspaceHeader } from "./ClassWorkspaceHeader";
import { ClassMissingState } from "./ClassMissingState";
import { GroupClassManagement } from "./GroupClassManagement";
import { ClassKindBadge, ClassStatusBadge } from "./ClassBadges";
import { classOutlineButton, classPage, classPanel } from "./classes-ui";

export function ClassDetailScreen({ classId }: { classId: string }) {
  const { classInfo, loading, error, retry } = useClassOverview(classId);
  const links = getClassWorkspaceLinks(classId);
  if (loading) return <ClassWorkspaceSkeleton />;
  if (error)
    return (
      <div className={classPage}>
        <ClassQueryErrorState error={error} onRetry={retry} detail />
      </div>
    );
  if (!classInfo) return <ClassMissingState />;
  const details = classInfo.serverDetails;
  if (!details) return <ClassMissingState />;
  return (
    <div className={classPage}>
      <ClassWorkspaceHeader classInfo={classInfo} title="Thông tin lớp" />
      <section
        aria-label="Tổng quan lớp học"
        className="relative overflow-hidden rounded-3xl bg-primary p-5 text-primary-foreground shadow-soft sm:p-7"
      >
        <dl className="relative grid gap-2 sm:grid-cols-3">
          <div className="rounded-2xl border border-white/20 bg-white/10 p-4">
            <dt className="flex items-center gap-2 text-xs text-white/75">
              <CalendarDaysIcon className="size-4" />
              Buổi học
            </dt>
            <dd className="mt-2 font-nunito text-2xl font-extrabold">
              {details.sessionCount}
              <span className="ml-1 text-sm font-medium text-white/75">
                / {details.numberOfSessions}
              </span>
            </dd>
          </div>
          <div className="rounded-2xl border border-white/20 bg-white/10 p-4">
            <dt className="flex items-center gap-2 text-xs text-white/75">
              <UsersIcon className="size-4" />
              Học viên
            </dt>
            <dd className="mt-2 font-nunito text-2xl font-extrabold">
              {details.learnerCount}
              <span className="ml-1 text-sm font-medium text-white/75">
                / {details.capacity}
              </span>
            </dd>
          </div>
          <div className="rounded-2xl border border-white/20 bg-white/10 p-4">
            <dt className="flex items-center gap-2 text-xs text-white/75">
              <ClockIcon className="size-4" />
              Khai giảng
            </dt>
            <dd className="mt-2 font-nunito text-lg font-extrabold">
              {details.openingAt
                ? formatClassDay(details.openingAt)
                : "Chưa lên lịch"}
            </dd>
          </div>
        </dl>
      </section>
      <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1.4fr)_minmax(280px,1fr)]">
        <section
          className={`${classPanel} space-y-5`}
          aria-labelledby="class-info-title"
        >
          <h2
            id="class-info-title"
            className="font-nunito text-lg font-extrabold text-primary"
          >
            Thông tin giảng dạy
          </h2>
          <dl className="grid gap-x-6 gap-y-5 sm:grid-cols-2">
            {[
              [
                "Nội dung giảng dạy",
                details.teachingItemName?.trim() ||
                  "Chưa có nội dung giảng dạy",
              ],
              [
                "Cấp học / Ngữ cảnh",
                details.contextName?.trim() || "Chưa có bối cảnh học",
              ],
              [
                "Hình thức học",
                details.teachingMode === "ONLINE"
                  ? "Trực tuyến"
                  : details.teachingMode === "OFFLINE"
                    ? "Trực tiếp"
                    : "Chưa có thông tin",
              ],
              ["Thời lượng mỗi buổi", `${details.sessionDurationMinutes} phút`],
              [
                "Học phí mỗi giờ",
                `${new Intl.NumberFormat("vi-VN").format(details.pricePerHour)}đ`,
              ],
              ["Ngày tạo lớp", formatClassDay(classInfo.createdAt)],
              [
                "Mã nội dung giảng dạy",
                details.teachingOfferingId
                  ? formatClassIdentifier(details.teachingOfferingId)
                  : "Chưa liên kết",
              ],
            ].map(([label, value]) => (
              <div
                key={label}
                className="border-b border-border/70 pb-3 last:border-0"
              >
                <dt className="text-xs text-muted-foreground">{label}</dt>
                <dd className="mt-1 text-sm font-bold text-foreground [overflow-wrap:anywhere]">
                  {value}
                </dd>
              </div>
            ))}
          </dl>
        </section>
        <div className="space-y-5">
          <section
            className={`${classPanel} space-y-4`}
            aria-labelledby="class-next-session"
          >
            <h2
              id="class-next-session"
              className="font-nunito text-lg font-extrabold text-primary"
            >
              {details.features.attendance
                ? "Buổi học & điểm danh"
                : "Buổi học"}
            </h2>
            <p className="text-sm text-foreground">
              {details.sessionCount} buổi trong lịch
            </p>
            <Button
              asChild
              variant="outline"
              className={`${classOutlineButton} w-full justify-between`}
            >
              <Link href={links.sessions}>
                Xem buổi học
                <ArrowRightIcon className="size-4" />
              </Link>
            </Button>
          </section>
          <section
            className={`${classPanel} space-y-4`}
            aria-labelledby="class-roster-title"
          >
            <h2
              id="class-roster-title"
              className="font-nunito text-lg font-extrabold text-primary"
            >
              Thành viên lớp
            </h2>
            <p className="text-sm text-foreground">
              {details.learnerCount} / {details.capacity} học viên đang tham gia
            </p>
            <Button
              asChild
              variant="outline"
              className={`${classOutlineButton} w-full justify-between`}
            >
              <Link href={links.members}>
                Xem thành viên
                <ArrowRightIcon className="size-4" />
              </Link>
            </Button>
          </section>
        </div>
      </div>
      {classInfo.kind === "group" && <GroupClassManagement classId={classId} />}
    </div>
  );
}
