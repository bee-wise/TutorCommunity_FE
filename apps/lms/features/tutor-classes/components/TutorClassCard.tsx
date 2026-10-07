import Link from "next/link";
import { panelClass, primaryActionClass } from "@/components/lms-page-ui";
import { CLASS_ROSTER, TUTOR_CLASS_SESSIONS } from "../data/classes.mock";
import type { SessionAttendance, TutorClass } from "../types/classes.types";
import { ClassStatusBadge } from "./ClassBadges";

export function TutorClassCard({ classInfo, records }: { classInfo: TutorClass; records: Record<string, SessionAttendance> }) {
  const learners = CLASS_ROSTER.filter((learner) => classInfo.learnerIds.includes(learner.id));
  const sessions = TUTOR_CLASS_SESSIONS.filter((session) => session.classId === classInfo.id);
  const unfinished = sessions.filter((session) => (session.status === "ongoing" || session.status === "completed") && records[session.id]?.state !== "confirmed").length;
  return (
    <article className="min-w-0">
      <Link href={`/lms/tutor/classes/${encodeURIComponent(classInfo.id)}`} aria-label={`Quản lý lớp ${classInfo.title}, mã ${classInfo.code}`} className={`${panelClass} flex h-full min-w-0 flex-col gap-3 outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 motion-safe:transition-transform motion-safe:hover:-translate-y-1`}>
        <h2 className="font-nunito text-lg font-extrabold leading-relaxed text-primary [overflow-wrap:anywhere]">{classInfo.title}</h2>
        <div className="flex flex-wrap items-center justify-between gap-2"><span className="text-xs text-muted-foreground">{classInfo.code}</span><ClassStatusBadge status={classInfo.status} /></div>
        <p className="text-sm text-muted-foreground">{classInfo.subject} · {classInfo.level}</p>
        <p className="text-sm font-medium leading-relaxed">{classInfo.kind === "individual" ? learners[0]?.fullName ?? "Chưa có học viên" : `${learners.length} học viên trong lớp`}</p>
        <p className="text-sm text-muted-foreground">{sessions.length} buổi học</p>
        <div className="mt-auto space-y-3">{classInfo.status === "active" && unfinished > 0 && <p className="rounded-2xl border border-accent bg-accent px-3 py-2 text-xs font-bold leading-relaxed text-accent-foreground">{unfinished} buổi chưa xác nhận điểm danh</p>}<span className={`${primaryActionClass} w-full`}>Quản lý lớp</span></div>
      </Link>
    </article>
  );
}
