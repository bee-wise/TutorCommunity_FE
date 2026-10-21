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
import { LmsHeroBanner, LmsHeroProgress } from "../../../components/LmsHeroBanner";
import { LmsDetailLayout } from "../../../components/LmsDetailLayout";
import { LmsFactList } from "../../../components/LmsFactList";
import { LmsLinkList } from "../../../components/LmsLinkList";
import { getTeachingModeLabel } from "../../../components/lms-class-naming";
import { LearnerClassQueryError } from "./LearnerClassQueryError";
import { useLearnerClassQuery } from "../hooks/useLearnerClassesQuery";
import { LearnerWorkspaceSkeleton } from "./LearnerWorkspaceSkeleton";
import { useLearnerClassProgress } from "../hooks/useLearnerClassProgress";
import { LearnerClassTutorIdentity } from "./LearnerClassTutorIdentity";
import { vietnamDate } from "../utils/learner-api-calendar";

function OverviewHero({ classId, planned, created, completed, sessionsHref }: { classId: string; planned: number; created: number; completed: boolean; sessionsHref: string }) {
  const progress = useLearnerClassProgress(classId);
  const done = progress.data?.total ?? 0;
  return (
    <LmsHeroBanner title="Thông tin lớp" description="Tiến độ học tập và những điều cần biết về lớp của bạn." mascot={completed ? "cheer" : "flower"}>
      <LmsHeroProgress label="Buổi đã hoàn thành so với kế hoạch" value={done} max={planned} note={`${created} buổi đã được xếp lịch`} />
      <Button asChild className="min-h-11 bg-accent px-5 font-bold text-accent-foreground hover:bg-accent/90">
        <Link href={sessionsHref}>
          <CalendarDaysIcon className="size-4" aria-hidden="true" />
          {completed ? "Xem lại buổi học" : "Xem buổi học"}
        </Link>
      </Button>
    </LmsHeroBanner>
  );
}

export function LearnerClassOverviewScreen({ classId }: { classId: string }) {
  const query = useLearnerClassQuery(classId);

  if (query.loading) return <LearnerWorkspaceSkeleton view="detail" />;
  if (query.error || !query.data)
    return <LearnerClassQueryError error={query.error} onRetry={() => void query.refetch()} detail />;

  const data = query.data;
  const completed = data.status === "COMPLETED";
  const opening = data.openingAt ? vietnamDate(data.openingAt).split("-").reverse().join("/") : undefined;
  const root = `/lms/learner/classes/${classId}`;

  return (
    <div className="mx-auto max-w-[1300px] space-y-6 px-4 py-6 text-foreground sm:px-6 lg:px-8">
      {completed && (
        <div role="status" className="flex items-center gap-3 rounded-2xl border border-border bg-card px-4 py-3 text-sm font-medium text-primary">
          <CheckBadgeIcon className="size-5 shrink-0" aria-hidden="true" />
          <p>Lớp đã kết thúc. Tin nhắn chỉ xem lại; bản ghi vẫn được kiểm tra quyền khi mở.</p>
        </div>
      )}

      <OverviewHero classId={classId} planned={data.numberOfSessions} created={data.sessionCount} completed={completed} sessionsHref={`${root}/sessions`} />
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
