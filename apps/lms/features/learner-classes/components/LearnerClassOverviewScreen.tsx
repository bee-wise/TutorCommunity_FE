"use client";

import Link from "next/link";
import {
  CalendarDaysIcon,
  ChatBubbleLeftRightIcon,
  CheckBadgeIcon,
  ClockIcon,
  ComputerDesktopIcon,
  CreditCardIcon,
  UsersIcon,
} from "@heroicons/react/24/outline";
import { Button } from "@workspace/ui/components/ui/button";
import { LmsClassHeader } from "../../../components/LmsClassHeader";
import { LmsDetailLayout } from "../../../components/LmsDetailLayout";
import { LmsFactList } from "../../../components/LmsFactList";
import { LmsLinkList } from "../../../components/LmsLinkList";
import { getClassKindLabel, getClassNaming, getTeachingModeLabel } from "../../../components/lms-class-naming";
import { LearnerClassQueryError } from "./LearnerClassQueryError";
import { useLearnerClassQuery } from "../hooks/useLearnerClassesQuery";
import { LearnerWorkspaceSkeleton } from "./LearnerWorkspaceSkeleton";
import { LearnerClassProgress } from "./LearnerClassProgress";
import { LearnerClassTutorIdentity } from "./LearnerClassTutorIdentity";
import { LearnerClassStatus } from "./LearnerApiClassCard";
import { vietnamDate } from "../utils/learner-api-calendar";

export function LearnerClassOverviewScreen({ classId }: { classId: string }) {
  const query = useLearnerClassQuery(classId);

  if (query.loading) return <LearnerWorkspaceSkeleton view="detail" />;
  if (query.error || !query.data)
    return <LearnerClassQueryError error={query.error} onRetry={() => void query.refetch()} detail />;

  const data = query.data;
  const naming = getClassNaming(data);
  const completed = data.status === "COMPLETED";
  const opening = data.openingAt ? vietnamDate(data.openingAt).split("-").reverse().join("/") : undefined;
  const root = `/lms/learner/classes/${classId}`;

  return (
    <div className="mx-auto max-w-[1300px] space-y-6 px-4 py-6 text-foreground sm:px-6 lg:px-8">
      <LmsClassHeader
        field={naming.field}
        subject={naming.subject}
        name={naming.name}
        level={naming.level}
        badges={
          <>
            <LearnerClassStatus status={data.status} />
            <span className="rounded-full border border-border bg-card px-2.5 py-1 text-xs font-bold">{getClassKindLabel(data.type)}</span>
            <span className="rounded-full border border-border bg-card px-2.5 py-1 text-xs font-bold">{getTeachingModeLabel(data.teachingMode)}</span>
          </>
        }
        actions={
          <Button asChild className="min-h-11 px-5">
            <Link href={`${root}/sessions`}>
              <CalendarDaysIcon className="size-4" aria-hidden="true" />
              {completed ? "Xem lại buổi học" : "Xem buổi học"}
            </Link>
          </Button>
        }
        notice={
          completed ? (
            <div role="status" className="flex items-center gap-3 rounded-2xl border border-border bg-card px-4 py-3 text-sm font-medium text-primary">
              <CheckBadgeIcon className="size-5 shrink-0" aria-hidden="true" />
              <p>Lớp đã kết thúc. Tin nhắn chỉ xem lại; bản ghi vẫn được kiểm tra quyền khi mở.</p>
            </div>
          ) : undefined
        }
      />

      <section aria-label="Tiến độ lớp học" className="space-y-3 rounded-3xl border border-border bg-card p-5 shadow-soft">
        <LearnerClassProgress classId={classId} planned={data.numberOfSessions} />
        <p className="text-xs text-muted-foreground">{data.sessionCount} buổi đã được tạo trong hệ thống.</p>
      </section>

      <LmsDetailLayout
        aside={
          <>
            <section aria-label="Gia sư phụ trách" className="space-y-4 rounded-3xl border border-border bg-card p-5 shadow-soft">
              <h2 className="font-lms text-base font-extrabold">Gia sư phụ trách</h2>
              <LearnerClassTutorIdentity tutor={data} />
            </section>
            <LmsLinkList
              title="Trong lớp này"
              items={[
                { href: `/lms/learner/chat/classes/${classId}`, icon: ChatBubbleLeftRightIcon, label: "Nhắn tin với lớp và gia sư" },
                { href: "/lms/learner/schedule", icon: CalendarDaysIcon, label: "Lịch học cá nhân" },
                { href: "/lms/learner/tuition-fee", icon: CreditCardIcon, label: "Theo dõi học phí" },
              ]}
            />
          </>
        }
      >
        <section aria-labelledby="class-learning-title" className="rounded-3xl border border-border bg-card p-5 shadow-soft sm:p-6">
          <h2 id="class-learning-title" className="mb-1 font-lms text-lg font-extrabold">Thông tin lớp</h2>
          <LmsFactList
            facts={[
              { icon: ComputerDesktopIcon, label: "Hình thức học", value: getTeachingModeLabel(data.teachingMode) },
              { icon: ClockIcon, label: "Thời lượng mỗi buổi", value: `${data.sessionDurationMinutes} phút` },
              { icon: CalendarDaysIcon, label: "Khai giảng", value: opening ?? "Chưa có ngày khai giảng" },
              { icon: UsersIcon, label: "Học viên trong lớp", value: `${data.learnerCount} học viên` },
            ]}
          />
        </section>
      </LmsDetailLayout>
    </div>
  );
}
