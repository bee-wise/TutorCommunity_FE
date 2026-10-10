"use client";

import Link from "next/link";
import { Button } from "@workspace/ui/components/ui/button";
import { useClassOverview } from "../hooks/useClassOverview";
import { formatClassDate, formatClassDay } from "../utils/classes.utils";
import { getClassWorkspaceLinks } from "../utils/class-workspace.utils";
import { SessionStatusBadge } from "./ClassBadges";
import { ClassLearnerIdentity } from "./ClassLearnerIdentity";
import { ClassWorkspaceHeader } from "./ClassWorkspaceHeader";
import { ClassMissingState } from "./ClassMissingState";
import { classOutlineButton, classPage, classPanel } from "./classes-ui";

export function ClassDetailScreen({ classId }: { classId: string }) {
  const { classInfo, learners, sessions, nextSession, pendingAttendance } =
    useClassOverview(classId);
  const links = getClassWorkspaceLinks(classId);
  if (!classInfo) return <ClassMissingState />;
  return (
    <div className={classPage}>
      <ClassWorkspaceHeader classInfo={classInfo} title="Thông tin lớp" />
      <div className="grid items-start gap-5 xl:grid-cols-[minmax(0,2fr)_minmax(280px,1fr)]">
        <div className="min-w-0 space-y-5">
          <section
            className={`${classPanel} space-y-5`}
            aria-labelledby="class-info-title"
          >
            <h2
              id="class-info-title"
              className="font-nunito text-lg font-extrabold text-primary"
            >
              Chi tiết lớp
            </h2>
            <dl className="grid gap-x-6 gap-y-5 sm:grid-cols-2">
              {[
                ["Mã lớp", classInfo.code],
                ["Môn học", classInfo.subject],
                ["Trình độ", classInfo.level],
                ["Ngày tạo lớp", formatClassDay(classInfo.createdAt)],
                ["Học viên", `${learners.length} học viên`],
                ["Buổi học", `${sessions.length} buổi trong lịch`],
              ].map(([label, value]) => (
                <div key={label} className="space-y-1.5">
                  <dt className="text-xs text-muted-foreground">{label}</dt>
                  <dd className="text-sm font-bold text-foreground [overflow-wrap:anywhere]">
                    {value}
                  </dd>
                </div>
              ))}
            </dl>
          </section>
          <section
            className={`${classPanel} space-y-4`}
            aria-labelledby="class-next-session"
          >
            <h2
              id="class-next-session"
              className="font-nunito text-lg font-extrabold text-primary"
            >
              Buổi học & điểm danh
            </h2>
            {nextSession && classInfo.status !== "completed" ? (
              <div className="space-y-3">
                <SessionStatusBadge status={nextSession.status} />
                <h3 className="font-nunito text-base font-extrabold leading-snug text-primary">
                  {nextSession.topic}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {formatClassDate(nextSession.taughtAt)} ·{" "}
                  {nextSession.durationMinutes} phút
                </p>
              </div>
            ) : (
              <p className="text-sm leading-relaxed text-muted-foreground">
                {classInfo.status === "completed"
                  ? "Xem lại các buổi học và điểm danh đã lưu của lớp."
                  : "Chưa có buổi học kế tiếp trong lịch của lớp."}
              </p>
            )}
            {pendingAttendance > 0 && (
              <p className="rounded-2xl border border-accent bg-accent px-4 py-3 text-sm font-bold text-accent-foreground">
                {pendingAttendance} buổi chưa xác nhận điểm danh
              </p>
            )}
            <Button asChild variant="outline" className={classOutlineButton}>
              <Link href={links.sessions}>Xem buổi học</Link>
            </Button>
          </section>
        </div>
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
          <ul className="space-y-4">
            {learners.slice(0, 3).map((learner) => (
              <li key={learner.id}>
                <ClassLearnerIdentity learner={learner} />
              </li>
            ))}
          </ul>
          {!learners.length && (
            <p className="text-sm text-muted-foreground">
              Chưa có học viên trong lớp.
            </p>
          )}
          <Button asChild variant="outline" className={classOutlineButton}>
            <Link href={links.members}>Xem thành viên ({learners.length})</Link>
          </Button>
        </section>
      </div>
      <p className="text-xs leading-relaxed text-muted-foreground">
        Dữ liệu lớp minh họa. Lịch, tài liệu và chat theo cùng mã lớp; chưa kết
        nối API lớp học.
      </p>
    </div>
  );
}
