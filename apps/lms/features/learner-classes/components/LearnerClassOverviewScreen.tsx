"use client";

import Link from "next/link";
import {
  AcademicCapIcon,
  ArrowRightIcon,
  BookOpenIcon,
  CalendarDaysIcon,
  ChatBubbleLeftRightIcon,
  CheckBadgeIcon,
  ClockIcon,
  ComputerDesktopIcon,
  CreditCardIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";
import { Button } from "@workspace/ui/components/ui/button";
import { LearnerClassQueryError } from "./LearnerClassQueryError";
import { useLearnerClassQuery } from "../hooks/useLearnerClassesQuery";
import { LearnerWorkspaceSkeleton } from "./LearnerWorkspaceSkeleton";
import { LearnerClassProgress } from "./LearnerClassProgress";
import { LearnerClassTutorIdentity } from "./LearnerClassTutorIdentity";
import { learnerAction, LearnerClassStatus } from "./LearnerApiClassCard";
import { vietnamDate } from "../utils/learner-api-calendar";

export function LearnerClassOverviewScreen({ classId }: { classId: string }) {
  const query = useLearnerClassQuery(classId);

  if (query.loading) return <LearnerWorkspaceSkeleton view="detail" />;
  if (query.error || !query.data)
    return (
      <LearnerClassQueryError
        error={query.error}
        onRetry={() => void query.refetch()}
        detail
      />
    );

  const data = query.data;
  const sessionProgress =
    data.numberOfSessions > 0
      ? Math.min(
          100,
          Math.round((data.sessionCount / data.numberOfSessions) * 100),
        )
      : 0;

  return (
    <div className="mx-auto max-w-[1300px] space-y-6 px-4 py-6 text-foreground sm:px-6 lg:px-8">
      {/* Header & Hero Area */}
      <header className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full border border-border bg-card px-3 py-0.5 font-mono text-xs font-bold text-muted-foreground shadow-2xs">
              {data.code ?? data.id}
            </span>
            <LearnerClassStatus status={data.status} />
            <span className="inline-flex rounded-full border border-border bg-card px-2.5 py-0.5 text-xs font-bold text-foreground shadow-2xs">
              {data.type === "GROUP"
                ? "Lớp nhóm"
                : data.type === "INDIVIDUAL"
                  ? "Lớp 1:1"
                  : "Chưa xác định loại lớp"}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-2.5 py-0.5 text-[11px] font-bold text-foreground shadow-2xs">
              <ComputerDesktopIcon
                className="size-3.5 text-primary"
                aria-hidden="true"
              />
              {data.teachingMode === "ONLINE"
                ? "Trực tuyến"
                : data.teachingMode === "OFFLINE"
                  ? "Trực tiếp"
                  : "Chưa xác định"}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button
              asChild
              variant="default"
              className="min-h-10 rounded-xl px-4 text-xs font-bold shadow-soft transition-all active:scale-[0.98]"
            >
              <Link href={"/lms/learner/classes/" + classId + "/sessions"}>
                <CalendarDaysIcon className="size-4" aria-hidden="true" />
                {data.status === "COMPLETED"
                  ? "Xem lại buổi học"
                  : "Xem buổi học"}
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="min-h-10 rounded-xl border-border bg-card px-3.5 text-xs font-bold text-foreground hover:bg-muted transition-all active:scale-[0.98]"
            >
              <Link
                href={"/lms/learner/chat/classes/" + classId}
                aria-label="Phòng chat lớp"
              >
                <ChatBubbleLeftRightIcon
                  className="size-4"
                  aria-hidden="true"
                />
                <span>Tin nhắn lớp</span>
              </Link>
            </Button>
          </div>
        </div>

        <div className="border-b border-border/70 pb-4">
          <h1 className="font-lms text-2xl font-extrabold text-primary [overflow-wrap:anywhere] sm:text-3xl">
            {data.title ?? "Thông tin lớp"}
          </h1>
          <p className="mt-1 text-sm font-semibold text-muted-foreground">
            {data.teachingItemName ?? "Chưa có môn học"}
            {data.programName ? ` · ${data.programName}` : ""}
            {data.contextName ? ` (${data.contextName})` : ""}
          </p>
        </div>

        {data.status === "COMPLETED" && (
          <div
            className="flex items-center gap-3 rounded-2xl border border-border bg-card px-4 py-3 text-sm font-medium text-primary shadow-2xs"
            role="status"
          >
            <CheckBadgeIcon
              className="size-5 shrink-0 text-primary"
              aria-hidden="true"
            />
            <p>
              Lớp đã kết thúc. Tin nhắn chỉ xem lại; bản ghi vẫn được kiểm tra
              quyền khi mở.
            </p>
          </div>
        )}
      </header>

      {/* 4 Overview Stat Cards (WITHOUT ICONS) */}
      <section
        aria-label="Tổng quan tiến độ lớp học"
        className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
      >
        {/* Card 1: Tiến độ học tập */}
        <div className="flex flex-col justify-between rounded-3xl border border-border bg-card p-5 shadow-soft transition-all duration-200 hover:shadow-soft-hover">
          <div>
            <p className="text-xs font-bold text-muted-foreground">
              Tiến độ học tập
            </p>
            <p className="mt-2 text-2xl font-extrabold tracking-tight text-foreground tabular-nums">
              {data.sessionCount} / {data.numberOfSessions}
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
              Đã hoàn thành {sessionProgress}% lộ trình khóa học
            </p>
          </div>
        </div>

        {/* Card 2: Thời lượng buổi học */}
        <div className="flex flex-col justify-between rounded-3xl border border-border bg-card p-5 shadow-soft transition-all duration-200 hover:shadow-soft-hover">
          <div>
            <p className="text-xs font-bold text-muted-foreground">
              Thời lượng buổi học
            </p>
            <p className="mt-2 text-2xl font-extrabold tracking-tight text-foreground tabular-nums">
              {data.sessionDurationMinutes}{" "}
              <span className="text-base font-semibold text-muted-foreground">
                phút
              </span>
            </p>
          </div>
          <div className="mt-4">
            <p className="text-[11px] font-semibold text-muted-foreground">
              {data.teachingMode === "ONLINE"
                ? "Học trực tuyến"
                : "Học trực tiếp"}
            </p>
          </div>
        </div>

        {/* Card 3: Phân loại lớp */}
        <div className="flex flex-col justify-between rounded-3xl border border-border bg-card p-5 shadow-soft transition-all duration-200 hover:shadow-soft-hover">
          <div>
            <p className="text-xs font-bold text-muted-foreground">
              Quy mô lớp học
            </p>
            <p className="mt-2 text-2xl font-extrabold tracking-tight text-foreground tabular-nums">
              {data.type === "GROUP"
                ? "Lớp nhóm"
                : data.type === "INDIVIDUAL"
                  ? "Lớp 1:1"
                  : "Tiêu chuẩn"}
            </p>
          </div>
          <div className="mt-4">
            <p className="text-[11px] font-semibold text-muted-foreground">
              {data.learnerCount} học viên cùng tham gia
            </p>
          </div>
        </div>

        {/* Card 4: Ngày khai giảng */}
        <div className="flex flex-col justify-between rounded-3xl border border-border bg-card p-5 shadow-soft transition-all duration-200 hover:shadow-soft-hover">
          <div>
            <p className="text-xs font-bold text-muted-foreground">
              Ngày khai giảng
            </p>
            <p className="mt-2 text-2xl font-extrabold tracking-tight text-foreground tabular-nums">
              {data.openingAt
                ? vietnamDate(data.openingAt).split("-").reverse().join("/")
                : "Chưa lên lịch"}
            </p>
          </div>
          <div className="mt-4">
            <p className="text-[11px] font-semibold text-muted-foreground">
              {data.status === "ACTIVE"
                ? "Lớp học đang diễn ra"
                : data.status === "COMPLETED"
                  ? "Lớp đã hoàn thành"
                  : "Chuẩn bị khai giảng"}
            </p>
          </div>
        </div>
      </section>

      {/* Main Content Layout */}
      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(320px,1fr)]">
        {/* Left Column: Nội dung & lịch học */}
        <section
          aria-labelledby="class-learning-title"
          className="space-y-6 rounded-3xl border border-border bg-card p-5 shadow-soft sm:p-7"
        >
          <div className="flex items-center justify-between border-b border-border/70 pb-3">
            <div>
              <h2
                id="class-learning-title"
                className="font-lms text-lg font-extrabold text-foreground"
              >
                Nội dung & lịch học
              </h2>
              <p className="text-xs font-medium text-muted-foreground">
                Thông số chuyên môn và lộ trình học tập của bạn
              </p>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {[
              {
                icon: AcademicCapIcon,
                label: "Môn học",
                value: data.teachingItemName ?? "Chưa có môn học",
              },
              {
                icon: SparklesIcon,
                label: "Chương trình",
                value: data.programName ?? "Chương trình tiêu chuẩn",
              },
              {
                icon: BookOpenIcon,
                label: "Cấp độ / bối cảnh",
                value: data.contextName ?? "Chưa có thông tin",
              },
              {
                icon: ComputerDesktopIcon,
                label: "Hình thức",
                value:
                  data.teachingMode === "ONLINE"
                    ? "Trực tuyến"
                    : data.teachingMode === "OFFLINE"
                      ? "Trực tiếp"
                      : "Chưa xác định",
              },
              {
                icon: ClockIcon,
                label: "Thời lượng dự kiến",
                value: `${data.sessionDurationMinutes} phút/buổi`,
              },
              {
                icon: CalendarDaysIcon,
                label: "Ngày khai giảng",
                value: data.openingAt
                  ? vietnamDate(data.openingAt).split("-").reverse().join("/")
                  : "Chưa có ngày khai giảng",
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

          {/* Progress area */}
          <div className="rounded-2xl border border-border/80 bg-muted/20 p-4">
            <LearnerClassProgress
              classId={classId}
              planned={data.numberOfSessions}
            />
            <p className="mt-3 text-xs text-muted-foreground">
              {data.sessionCount} buổi đã được tạo trong hệ thống.
            </p>
          </div>

          <div className="pt-2">
            <Button asChild className={`${learnerAction} w-full sm:w-auto`}>
              <Link href={"/lms/learner/classes/" + classId + "/sessions"}>
                <CalendarDaysIcon className="size-4" aria-hidden="true" />
                {data.status === "COMPLETED"
                  ? "Xem lại buổi học"
                  : "Xem buổi học"}
              </Link>
            </Button>
          </div>
        </section>

        {/* Right Column: Gia sư phụ trách & Trao đổi */}
        <aside aria-label="Gia sư và trao đổi" className="space-y-5">
          {/* Card Gia sư */}
          <section className="space-y-4 rounded-3xl border border-border bg-card p-5 shadow-soft sm:p-6">
            <div className="flex items-center gap-3">
              <div>
                <h2 className="font-lms text-base font-extrabold text-foreground">
                  Gia sư phụ trách
                </h2>
              </div>
            </div>

            <LearnerClassTutorIdentity tutor={data} />

            <Button
              asChild
              variant="outline"
              className={`${learnerAction} w-full justify-between shadow-2xs hover:border-primary/40 hover:bg-muted`}
            >
              <Link href={"/lms/learner/chat/classes/" + classId}>
                <span className="flex items-center gap-2">
                  <ChatBubbleLeftRightIcon
                    className="size-4 text-primary"
                    aria-hidden="true"
                  />
                  Nhắn tin với lớp & gia sư
                </span>
                <ArrowRightIcon className="size-4" aria-hidden="true" />
              </Link>
            </Button>
          </section>

          {/* Card Lối tắt nhanh */}
          <section
            className="space-y-3 rounded-3xl border border-border bg-card p-5 shadow-soft"
            aria-label="Lối tắt tiện ích học viên"
          >
            <h3 className="font-lms text-sm font-extrabold text-foreground">
              Lối tắt học tập
            </h3>
            <div className="space-y-2">
              <Link
                href="/lms/learner/schedule"
                className="flex items-center justify-between rounded-2xl border border-border/70 bg-card p-3 text-xs font-bold text-foreground transition-all hover:border-primary/30 hover:bg-muted/50 active:scale-[0.98]"
              >
                <div className="flex items-center gap-2.5">
                  <span className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <CalendarDaysIcon className="size-4" aria-hidden="true" />
                  </span>
                  <span>Lịch học cá nhân</span>
                </div>
                <ArrowRightIcon
                  className="size-3.5 text-muted-foreground"
                  aria-hidden="true"
                />
              </Link>
              <Link
                href="/lms/learner/tuition-fee"
                className="flex items-center justify-between rounded-2xl border border-border/70 bg-card p-3 text-xs font-bold text-foreground transition-all hover:border-primary/30 hover:bg-muted/50 active:scale-[0.98]"
              >
                <div className="flex items-center gap-2.5">
                  <span className="flex size-8 items-center justify-center rounded-lg bg-secondary/15 text-foreground">
                    <CreditCardIcon className="size-4" aria-hidden="true" />
                  </span>
                  <span>Theo dõi học phí</span>
                </div>
                <ArrowRightIcon
                  className="size-3.5 text-muted-foreground"
                  aria-hidden="true"
                />
              </Link>
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}
