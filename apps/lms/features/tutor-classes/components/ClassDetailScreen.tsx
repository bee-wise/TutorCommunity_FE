"use client";

import Link from "next/link";
import {
  AcademicCapIcon,
  ArrowRightIcon,
  BanknotesIcon,
  BookOpenIcon,
  CalendarDaysIcon,
  ChatBubbleLeftRightIcon,
  CheckBadgeIcon,
  ClockIcon,
  ComputerDesktopIcon,
  FolderIcon,
  IdentificationIcon,
  MapPinIcon,
  SparklesIcon,
  UsersIcon,
} from "@heroicons/react/24/outline";
import { Button } from "@workspace/ui/components/ui/button";
import { useTutorClassDetail } from "../hooks/useTutorClassDetail";
import { formatClassDay, formatClassIdentifier } from "../utils/classes.utils";
import { getClassWorkspaceLinks } from "../utils/class-workspace.utils";
import { ClassQueryErrorState } from "./ClassQueryErrorState";
import { ClassWorkspaceSkeleton } from "./ClassWorkspaceSkeleton";
import { ClassMissingState } from "./ClassMissingState";
import { GroupClassManagement } from "./GroupClassManagement";
import { ClassKindBadge, ClassStatusBadge } from "./ClassBadges";
import { classOutlineButton, classPage, classPanel } from "./classes-ui";

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
  if (!classInfo) return <ClassMissingState />;
  const details = classInfo.serverDetails;
  if (!details) return <ClassMissingState />;

  const sessionProgress =
    details.numberOfSessions > 0
      ? Math.min(
          100,
          Math.round((details.sessionCount / details.numberOfSessions) * 100),
        )
      : 0;

  const capacityRate =
    details.capacity > 0
      ? Math.min(
          100,
          Math.round((details.learnerCount / details.capacity) * 100),
        )
      : 0;

  return (
    <div className={classPage}>
      {/* Header & Hero Area */}
      <header className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <Button
              asChild
              variant="default"
              className="min-h-10 rounded-xl px-4 text-xs font-bold shadow-soft transition-all active:scale-[0.98]"
            >
              <Link href={links.sessions}>
                <CalendarDaysIcon className="size-4" aria-hidden="true" />
                Lịch buổi học
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="min-h-10 rounded-xl border-border bg-card px-3.5 text-xs font-bold text-foreground hover:bg-muted transition-all active:scale-[0.98]"
            >
              <Link href={links.messages} aria-label="Phòng chat lớp">
                <ChatBubbleLeftRightIcon
                  className="size-4"
                  aria-hidden="true"
                />
                <span className="hidden sm:inline">Phòng chat</span>
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="min-h-10 rounded-xl border-border bg-card px-3.5 text-xs font-bold text-foreground hover:bg-muted transition-all active:scale-[0.98]"
            >
              <Link href={links.materials} aria-label="Kho tài liệu lớp">
                <FolderIcon className="size-4" aria-hidden="true" />
                <span className="hidden sm:inline">Tài liệu</span>
              </Link>
            </Button>
          </div>
        </div>

        <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-border/70 pb-4">
          <div>
            <h1 className="font-lms text-2xl font-extrabold text-foreground sm:text-3xl">
              Thông tin lớp
            </h1>
            <p className="mt-1 text-sm font-semibold text-muted-foreground">
              {details.programName ? `${details.programName} · ` : ""}
              {details.teachingItemName || "Chưa có nội dung giảng dạy"}
              {details.contextName ? ` (${details.contextName})` : ""}
            </p>
          </div>
        </div>

        {classInfo.status === "completed" && (
          <div
            className="flex items-center gap-3 rounded-2xl border border-border bg-card px-4 py-3 text-sm font-medium text-primary shadow-2xs"
            role="status"
          >
            <CheckBadgeIcon
              className="size-5 shrink-0 text-primary"
              aria-hidden="true"
            />
            <p>
              Lớp đã kết thúc. Tin nhắn, tài liệu và điểm danh ở chế độ chỉ xem.
            </p>
          </div>
        )}
      </header>

      {/* 4 Stat Cards Grid with Progress */}
      <section
        aria-label="Tổng quan số liệu lớp học"
        className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
      >
        {/* Card 1: Tiến độ buổi học */}
        <div className="flex flex-col justify-between rounded-3xl border border-border bg-card p-5 shadow-soft transition-all duration-200 hover:shadow-soft-hover">
          <div>
            <p className="text-xs font-bold text-muted-foreground">
              Tiến độ buổi học
            </p>
            <p className="mt-2 text-2xl font-extrabold tracking-tight text-foreground tabular-nums">
              {details.sessionCount} / {details.numberOfSessions}
            </p>
          </div>
          <div className="mt-4 space-y-1.5">
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-primary transition-all duration-500 ease-in-out"
                style={{ width: `${sessionProgress}%` }}
              />
            </div>
            <p className="text-[11px] font-semibold text-muted-foreground">
              Đã hoàn thành {sessionProgress}% lộ trình
            </p>
          </div>
        </div>

        {/* Card 2: Sĩ số học viên */}
        <div className="flex flex-col justify-between rounded-3xl border border-border bg-card p-5 shadow-soft transition-all duration-200 hover:shadow-soft-hover">
          <div>
            <p className="text-xs font-bold text-muted-foreground">
              Sĩ số học viên
            </p>
            <p className="mt-2 text-2xl font-extrabold tracking-tight text-foreground tabular-nums">
              {details.learnerCount} / {details.capacity}
            </p>
          </div>
          <div className="mt-4 space-y-1.5">
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-secondary transition-all duration-500 ease-in-out"
                style={{ width: `${capacityRate}%` }}
              />
            </div>
            <p className="text-[11px] font-semibold text-muted-foreground">
              {details.capacity - details.learnerCount > 0
                ? `Còn ${details.capacity - details.learnerCount} chỗ trống`
                : "Lớp đã đủ học viên"}
            </p>
          </div>
        </div>

        {/* Card 3: Thời lượng mỗi buổi */}
        <div className="flex flex-col justify-between rounded-3xl border border-border bg-card p-5 shadow-soft transition-all duration-200 hover:shadow-soft-hover">
          <div>
            <p className="text-xs font-bold text-muted-foreground">
              Thời lượng buổi dạy
            </p>
            <p className="mt-2 text-2xl font-extrabold tracking-tight text-foreground tabular-nums">
              {details.sessionDurationMinutes}{" "}
              <span className="text-base font-semibold text-muted-foreground">
                phút
              </span>
            </p>
          </div>
          <div className="mt-4">
            <p className="text-[11px] font-semibold text-muted-foreground">
              {details.teachingMode === "ONLINE"
                ? "Học trực tuyến"
                : "Học trực tiếp"}
              {details.openingAt
                ? ` · Khai giảng ${formatClassDay(details.openingAt)}`
                : ""}
            </p>
          </div>
        </div>

        {/* Card 4: Học phí mỗi giờ */}
        <div className="flex flex-col justify-between rounded-3xl border border-border bg-card p-5 shadow-soft transition-all duration-200 hover:shadow-soft-hover">
          <div>
            <p className="text-xs font-bold text-muted-foreground">
              Học phí mỗi giờ
            </p>
            <p className="mt-2 text-2xl font-extrabold tracking-tight text-foreground tabular-nums">
              {new Intl.NumberFormat("vi-VN").format(details.pricePerHour)}
              <span className="text-base font-semibold text-muted-foreground">
                đ
              </span>
            </p>
          </div>
          <div className="mt-4">
            <p className="text-[11px] font-semibold text-muted-foreground">
              {details.billingMode === "MONTHLY"
                ? "Thanh toán theo tháng"
                : details.billingMode === "FULL_COURSE"
                  ? "Thanh toán trọn khóa"
                  : "Mức phí tiêu chuẩn"}
            </p>
          </div>
        </div>
      </section>

      {/* Main Content Layout */}
      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(320px,1fr)]">
        {/* Left Column: Chi tiết giảng dạy & tính năng */}
        <section
          className={`${classPanel} space-y-6`}
          aria-labelledby="class-info-title"
        >
          <div className="flex items-center justify-between border-b border-border/70 pb-3">
            <div>
              <h2
                id="class-info-title"
                className="font-lms text-lg font-extrabold text-foreground"
              >
                Thông tin giảng dạy
              </h2>
              <p className="text-xs font-medium text-muted-foreground">
                Quy chuẩn môn học, thời lượng và thông số thiết lập
              </p>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {[
              {
                icon: AcademicCapIcon,
                label: "Nội dung giảng dạy",
                value:
                  details.teachingItemName?.trim() ||
                  "Chưa có nội dung giảng dạy",
              },
              {
                icon: BookOpenIcon,
                label: "Cấp học / Ngữ cảnh",
                value: details.contextName?.trim() || "Chưa có bối cảnh học",
              },
              {
                icon: ComputerDesktopIcon,
                label: "Hình thức học",
                value:
                  details.teachingMode === "ONLINE"
                    ? "Trực tuyến"
                    : details.teachingMode === "OFFLINE"
                      ? "Trực tiếp"
                      : "Chưa có thông tin",
              },
              {
                icon: ClockIcon,
                label: "Thời lượng mỗi buổi",
                value: `${details.sessionDurationMinutes} phút`,
              },
              {
                icon: BanknotesIcon,
                label: "Học phí mỗi giờ",
                value: `${new Intl.NumberFormat("vi-VN").format(details.pricePerHour)}đ`,
              },
              {
                icon: CalendarDaysIcon,
                label: "Ngày tạo lớp",
                value: formatClassDay(classInfo.createdAt),
              },
              {
                icon: SparklesIcon,
                label: "Chương trình đào tạo",
                value: details.programName?.trim() || "Chương trình tiêu chuẩn",
              },
              {
                icon: IdentificationIcon,
                label: "Mã nội dung giảng dạy",
                value: details.teachingOfferingId
                  ? formatClassIdentifier(details.teachingOfferingId)
                  : "Chưa liên kết",
              },
            ].map(({ icon: Icon, label, value }) => (
              <div
                key={label}
                className="flex items-start gap-3 rounded-2xl border border-border/60 bg-muted/30 p-3.5 transition-colors hover:bg-muted/50"
              >
                <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-card text-primary shadow-2xs">
                  <Icon className="size-4" aria-hidden="true" />
                </span>
                <div className="min-w-0 flex-1">
                  <dt className="text-xs font-semibold text-muted-foreground">
                    {label}
                  </dt>
                  <dd className="mt-1 font-lms text-sm font-extrabold text-foreground [overflow-wrap:anywhere]">
                    {value}
                  </dd>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Right Column: Lối tắt điều hướng & Quản lý */}
        <div className="space-y-5">
          {/* Box 1: Buổi học & điểm danh */}
          <section
            className={`${classPanel} space-y-4`}
            aria-labelledby="class-next-session"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <CalendarDaysIcon className="size-4.5" aria-hidden="true" />
                </span>
                <h2
                  id="class-next-session"
                  className="font-lms text-base font-extrabold text-foreground"
                >
                  {details.features.attendance
                    ? "Buổi học & điểm danh"
                    : "Buổi học"}
                </h2>
              </div>
              <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-extrabold text-primary">
                {details.sessionCount} buổi
              </span>
            </div>

            <p className="text-sm font-semibold text-foreground">
              {details.sessionCount} buổi trong lịch
            </p>

            <Button
              asChild
              variant="outline"
              className={`${classOutlineButton} w-full justify-between shadow-2xs hover:border-primary/40 hover:bg-muted active:scale-[0.98]`}
            >
              <Link href={links.sessions}>
                <span>Xem lịch & điểm danh</span>
                <ArrowRightIcon className="size-4" aria-hidden="true" />
              </Link>
            </Button>
          </section>

          {/* Box 2: Thành viên lớp */}
          <section
            className={`${classPanel} space-y-4`}
            aria-labelledby="class-roster-title"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-secondary/15 text-foreground">
                  <UsersIcon className="size-4.5" aria-hidden="true" />
                </span>
                <h2
                  id="class-roster-title"
                  className="font-lms text-base font-extrabold text-foreground"
                >
                  Thành viên lớp
                </h2>
              </div>
              <span className="rounded-full bg-secondary/15 px-2.5 py-0.5 text-xs font-extrabold text-foreground">
                {details.learnerCount}/{details.capacity}
              </span>
            </div>

            <p className="text-sm font-semibold text-foreground">
              {details.learnerCount} / {details.capacity} học viên đang tham gia
            </p>

            <Button
              asChild
              variant="outline"
              className={`${classOutlineButton} w-full justify-between shadow-2xs hover:border-primary/40 hover:bg-muted active:scale-[0.98]`}
            >
              <Link href={links.members}>
                <span>Xem danh sách học viên</span>
                <ArrowRightIcon className="size-4" aria-hidden="true" />
              </Link>
            </Button>
          </section>

          {/* Box 3: Tài nguyên & Kênh giao tiếp */}
          <section
            className={`${classPanel} space-y-3`}
            aria-label="Tài nguyên và trao đổi lớp học"
          >
            <h3 className="font-lms text-sm font-extrabold text-foreground">
              Tài nguyên & Trao đổi
            </h3>
            <div className="space-y-2">
              <Link
                href={links.materials}
                className="flex items-center justify-between rounded-2xl border border-border/70 bg-card p-3 text-xs font-bold text-foreground transition-all hover:border-primary/30 hover:bg-muted/50 active:scale-[0.98]"
              >
                <div className="flex items-center gap-2.5">
                  <span className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <FolderIcon className="size-4" aria-hidden="true" />
                  </span>
                  <span>Kho tài liệu & Đề thi AI</span>
                </div>
                <ArrowRightIcon
                  className="size-3.5 text-muted-foreground"
                  aria-hidden="true"
                />
              </Link>
              <Link
                href={links.messages}
                className="flex items-center justify-between rounded-2xl border border-border/70 bg-card p-3 text-xs font-bold text-foreground transition-all hover:border-primary/30 hover:bg-muted/50 active:scale-[0.98]"
              >
                <div className="flex items-center gap-2.5">
                  <span className="flex size-8 items-center justify-center rounded-lg bg-secondary/15 text-foreground">
                    <ChatBubbleLeftRightIcon
                      className="size-4"
                      aria-hidden="true"
                    />
                  </span>
                  <span>Phòng trao đổi chung</span>
                </div>
                <ArrowRightIcon
                  className="size-3.5 text-muted-foreground"
                  aria-hidden="true"
                />
              </Link>
            </div>
          </section>
        </div>
      </div>

      {/* Lớp nhóm: Vận hành tuyển sinh & Lộ trình */}
      {classInfo.kind === "group" && <GroupClassManagement classId={classId} />}
    </div>
  );
}
