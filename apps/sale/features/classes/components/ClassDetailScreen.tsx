"use client";

import type { ComponentType, ReactNode } from "react";
import Link from "next/link";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  BanknotesIcon,
  CalendarDaysIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  MagnifyingGlassIcon,
  MapPinIcon,
  SparklesIcon,
  UserGroupIcon,
  VideoCameraIcon,
} from "@heroicons/react/24/outline";
import type { GroupDto } from "@workspace/core/lms-classes/group.schemas";
import { Button } from "@workspace/ui/components/ui/button";
import { LearningPath } from "@workspace/ui/components/ui/learning-path";
import { Skeleton } from "@workspace/ui/components/ui/skeleton";
import { useRecruitingClass } from "../hooks/useRecruitingClass";
import {
  formatOpeningDate,
  formatOpeningTime,
  getBillingLabel,
  getClassSubject,
  getPriceSummary,
  getTeachingModeLabel,
  getTotalHours,
} from "../utils/classes.utils";
import { getProgramTheme } from "../utils/program-theme";
import { priceFormatter } from "./ClassCard";
import { ClassEnrollAction } from "./ClassEnrollAction";
import { MessageCard } from "./ClassListStates";

type Icon = ComponentType<{ className?: string }>;

const sectionClass =
  "rounded-3xl border border-border bg-background p-5 shadow-soft sm:p-6";

function Fact({
  icon: Icon,
  label,
  value,
}: {
  icon: Icon;
  label: string;
  value: ReactNode;
}) {
  return (
    <div className="flex items-start gap-3 rounded-2xl bg-muted p-3.5">
      <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-background text-primary">
        <Icon className="size-5" />
      </span>
      <div className="min-w-0">
        <dt className="text-xs font-semibold text-muted-foreground">{label}</dt>
        <dd className="mt-0.5 text-sm font-bold leading-snug text-foreground [overflow-wrap:anywhere]">
          {value}
        </dd>
      </div>
    </div>
  );
}

function ClassDetailContent({ classItem }: { classItem: GroupDto }) {
  const program = classItem.programName?.trim();
  const context = classItem.contextName?.trim();
  const teachingItem = classItem.teachingItemName?.trim();
  const theme = getProgramTheme(program);
  const price = getPriceSummary(classItem);
  const billing = getBillingLabel(classItem.billingMode);
  const openingDate = formatOpeningDate(classItem.openingAt);
  const openingTime = formatOpeningTime(classItem.openingAt);
  const isOnline = classItem.teachingMode === "ONLINE";
  const lessons = classItem.roadmap.reduce(
    (sum, stage) => sum + stage.lessons.length,
    0,
  );

  return (
    <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
      <div className="min-w-0 space-y-6">
        <section className="overflow-hidden rounded-3xl border border-border bg-background shadow-soft">
          <div
            className={`flex items-center gap-3 px-5 py-4 sm:px-6 ${theme.panel}`}
          >
            <theme.Icon className="size-7 shrink-0" aria-hidden="true" />
            <p className="font-nunito text-lg font-black leading-tight">
              <span className="sr-only">Chương trình: </span>
              {program || "Chương trình khác"}
            </p>
          </div>
          <div className="p-5 sm:p-6">
            {(context || teachingItem) && (
              <div className="flex flex-wrap items-center gap-2">
                {context && (
                  <span
                    className={`rounded-full px-3.5 py-1.5 text-sm font-extrabold leading-none ${theme.pill}`}
                  >
                    {context}
                  </span>
                )}
                {teachingItem && (
                  <span className="rounded-full border border-border bg-muted px-3 py-1.5 text-xs font-bold leading-none text-primary">
                    {teachingItem}
                  </span>
                )}
              </div>
            )}
            <h1 className="mt-4 font-nunito text-2xl font-black leading-[1.2] sm:text-3xl">
              {classItem.title ?? getClassSubject(classItem)}
            </h1>
            {classItem.highlight && (
              <p className="mt-3 inline-flex w-fit max-w-full items-start gap-1.5 rounded-lg bg-highlight px-3 py-1.5 text-sm font-bold leading-snug text-foreground">
                <span className="[overflow-wrap:anywhere]">
                  {classItem.highlight}
                </span>
              </p>
            )}
            <p className="mt-4 whitespace-pre-line text-sm leading-relaxed text-muted-foreground">
              {classItem.description || null}
            </p>
          </div>
        </section>

        <section className={sectionClass} aria-labelledby="class-info-heading">
          <h2
            id="class-info-heading"
            className="font-nunito text-xl font-extrabold text-foreground"
          >
            Thông tin lớp
          </h2>
          <dl className="mt-4 grid gap-3 sm:grid-cols-2">
            <Fact
              icon={CalendarDaysIcon}
              label="Khai giảng"
              value={
                openingDate
                  ? `${openingDate}${openingTime ? ` · ${openingTime}` : ""}`
                  : "Chưa có lịch khai giảng"
              }
            />
            <Fact
              icon={isOnline ? VideoCameraIcon : MapPinIcon}
              label="Hình thức học"
              value={
                isOnline || !classItem.location
                  ? getTeachingModeLabel(classItem.teachingMode)
                  : `${getTeachingModeLabel(classItem.teachingMode)} · ${classItem.location}`
              }
            />
            <Fact
              icon={ClockIcon}
              label="Thời lượng"
              value={`${classItem.numberOfSessions} buổi × ${classItem.sessionDurationMinutes} phút`}
            />
            <Fact
              icon={ClockIcon}
              label="Tổng thời gian học"
              value={`${getTotalHours(classItem)} giờ`}
            />
            <Fact
              icon={UserGroupIcon}
              label="Sĩ số"
              value={`Tối đa ${classItem.capacity} học viên`}
            />
            {billing && (
              <Fact
                icon={BanknotesIcon}
                label="Cách thu học phí"
                value={billing}
              />
            )}
          </dl>
        </section>

        <section
          className={sectionClass}
          aria-labelledby="class-roadmap-heading"
        >
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2
              id="class-roadmap-heading"
              className="font-nunito text-xl font-extrabold text-foreground"
            >
              Lộ trình học
            </h2>
            {classItem.roadmap.length > 0 && (
              <span className="rounded-full border border-border bg-muted px-3 py-1 text-xs font-bold tabular-nums text-primary">
                {classItem.roadmap.length} chặng · {lessons} bài
              </span>
            )}
          </div>
          {classItem.roadmap.length > 0 ? (
            <div className="mt-5">
              <LearningPath stages={classItem.roadmap} />
            </div>
          ) : (
            <p className="mt-3 rounded-2xl border border-dashed border-border px-4 py-6 text-center text-sm text-muted-foreground">
              Gia sư chưa cập nhật lộ trình chi tiết cho lớp này.
            </p>
          )}
        </section>
      </div>

      <aside
        className={`${sectionClass} space-y-5 lg:sticky lg:top-24`}
        aria-label="Học phí và đăng ký"
      >
        <div>
          <p className="text-xs font-semibold text-muted-foreground">Học phí</p>
          <p className="mt-1 font-nunito text-3xl font-black tabular-nums text-primary">
            {priceFormatter.format(price.amount)}đ
            <span className="ml-1.5 text-sm font-semibold text-muted-foreground">
              {price.unit}
            </span>
          </p>
          {price.note && (
            <p className="mt-1 text-xs font-semibold text-muted-foreground">
              {price.note}
            </p>
          )}
        </div>
        <ClassEnrollAction />
        <p className="text-xs leading-relaxed text-muted-foreground">
          Lớp nhóm nhỏ, tối đa {classItem.capacity} học viên. Bạn có thể học thử
          trước khi quyết định đăng ký chính thức.
        </p>
      </aside>
    </div>
  );
}

export function ClassDetailScreen({ classId }: { classId: string }) {
  const { classItem, isLoading, isError, notFound, refetch } =
    useRecruitingClass(classId);
  return (
    <section className="min-h-[70dvh] bg-muted pb-20 pt-6 sm:pt-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Button
          asChild
          variant="outline"
          className="mb-5 min-h-11 rounded-full px-4 font-bold"
        >
          <Link href="/classes">
            <ArrowLeftIcon className="size-4" aria-hidden="true" />
            Tất cả lớp học
          </Link>
        </Button>
        {isLoading ? (
          <div
            className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]"
            aria-busy="true"
            aria-label="Đang tải lớp học"
          >
            <div className="space-y-6">
              <Skeleton className="h-64 rounded-3xl" />
              <Skeleton className="h-56 rounded-3xl" />
            </div>
            <Skeleton className="h-64 rounded-3xl" />
          </div>
        ) : isError ? (
          <MessageCard
            icon={<ExclamationTriangleIcon className="size-6" />}
            title="Chưa tải được thông tin lớp"
            description="Kết nối đang gặp sự cố. Vui lòng thử lại sau ít phút."
            action={
              <Button
                size="lg"
                onClick={() => void refetch()}
                className="min-h-11 rounded-full px-6 font-bold"
              >
                Thử lại
              </Button>
            }
          />
        ) : notFound || !classItem ? (
          <MessageCard
            icon={<MagnifyingGlassIcon className="size-6" />}
            title="Lớp này không còn tuyển sinh"
            description="Lớp có thể đã khai giảng hoặc gia sư đã đóng đăng ký. Bạn xem thêm các lớp đang mở nhé."
            action={
              <Button
                asChild
                size="lg"
                className="min-h-11 rounded-full px-6 font-bold"
              >
                <Link href="/classes">Xem lớp đang mở</Link>
              </Button>
            }
          />
        ) : (
          <ClassDetailContent classItem={classItem} />
        )}
      </div>
    </section>
  );
}
