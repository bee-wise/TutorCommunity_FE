"use client";

import { useState } from "react";
import Link from "next/link";
import { actionClass, headingClass, pageClass, panelClass } from "@/components/lms-page-ui";
import { CLASS_ROSTER, TUTOR_CLASSES } from "../data/classes.mock";
import type { TutorClassSession } from "../types/classes.types";
import { AttendanceDialog } from "./AttendanceDialog";
import { ClassStatusBadge } from "./ClassBadges";
import { ClassSessionList } from "./ClassSessionList";

export function ClassDetailScreen({ classId }: { classId: string }) {
  const [selected, setSelected] = useState<TutorClassSession | null>(null);
  const classInfo = TUTOR_CLASSES.find((item) => item.id === classId);
  if (!classInfo) return <div className={pageClass}><section className={`${panelClass} space-y-4`}><h1 className={headingClass}>Không tìm thấy lớp học</h1><Link href="/lms/tutor/classes" className={actionClass}>Về danh sách lớp</Link></section></div>;
  const learners = CLASS_ROSTER.filter((learner) => classInfo.learnerIds.includes(learner.id));
  return <div className={pageClass}>
    <Link href="/lms/tutor/classes" className={actionClass}>Về danh sách lớp</Link>
    <header className="space-y-3"><h1 className={headingClass}>{classInfo.title}</h1><div className="flex flex-wrap items-center gap-3"><span className="text-sm font-bold text-muted-foreground">{classInfo.code}</span><ClassStatusBadge status={classInfo.status} /><span className="text-sm text-muted-foreground">{classInfo.kind === "individual" ? "Lớp 1:1" : "Lớp nhóm"}</span></div><p className="text-sm text-muted-foreground">{classInfo.subject} · {classInfo.level}</p></header>
    {classInfo.status !== "active" && <p className="rounded-2xl border border-border p-4 text-sm leading-relaxed text-muted-foreground">{classInfo.status === "completed" ? "Lớp đã kết thúc. Bạn có thể xem buổi học, tài liệu và điểm danh đã lưu nhưng không chỉnh sửa điểm danh." : "Lớp chưa bắt đầu. Điểm danh sẽ mở khi lớp đang học và buổi học đang diễn ra."}</p>}
    <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,3fr)_minmax(240px,1fr)]">
      <ClassSessionList classInfo={classInfo} onAttendance={setSelected} />
      <aside className={`${panelClass} space-y-4 lg:sticky lg:top-5`} aria-labelledby="class-roster-title"><h2 id="class-roster-title" className="font-nunito text-lg font-extrabold text-primary">Học viên trong lớp ({learners.length})</h2><ul className="space-y-4">{learners.map((learner) => <li key={learner.id} className="flex items-start gap-3"><span aria-hidden="true" className="grid size-9 shrink-0 place-items-center rounded-full bg-primary text-xs font-bold text-primary-foreground">{learner.initials}</span><div className="min-w-0"><p className="text-sm font-bold leading-relaxed">{learner.fullName}</p><p className="mt-1 text-xs text-muted-foreground">{learner.gradeLevel}</p></div></li>)}</ul><Link href={`/lms/tutor/materials/classes/${encodeURIComponent(classId)}`} className={`${actionClass} w-full`}>Tài liệu của lớp</Link></aside>
    </div>
    <p className="text-xs text-muted-foreground">Dữ liệu lớp minh họa. Điểm danh lưu trong phiên hiện tại, chưa kết nối BE.</p>
    {selected && <AttendanceDialog key={selected.id} classInfo={classInfo} session={selected} learners={learners} onClose={() => setSelected(null)} />}
  </div>;
}
