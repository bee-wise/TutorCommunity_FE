"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeftIcon, FolderIcon } from "@heroicons/react/24/outline";
import { Button } from "@workspace/ui/components/ui/button";
import { useTutorClassDetail } from "../hooks/useTutorClassDetail";
import type { TutorClassSession } from "../types/classes.types";
import { AttendanceDialog } from "./AttendanceDialog";
import { ClassStatusBadge } from "./ClassBadges";
import { ClassLearnerIdentity } from "./ClassLearnerIdentity";
import { ClassSessionList } from "./ClassSessionList";
import { classHeading, classOutlineButton, classPage, classPanel } from "./classes-ui";

export function ClassDetailScreen({ classId }: { classId: string }) {
  const [selected, setSelected] = useState<TutorClassSession | null>(null);
  const attendanceTrigger = useRef<HTMLButtonElement | null>(null);
  const { classInfo, learners } = useTutorClassDetail(classId);
  const back = <Button asChild variant="outline" className={classOutlineButton}><Link href="/lms/tutor/classes"><ArrowLeftIcon className="size-4" aria-hidden="true" />Danh sách lớp</Link></Button>;

  if (!classInfo) return <div className={classPage}><section className={`${classPanel} space-y-4`}><h1 className={classHeading}>Không tìm thấy lớp học</h1>{back}</section></div>;
  return (
    <div className={classPage}>
      <div>{back}</div>
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0 space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold tracking-wide text-muted-foreground">{classInfo.code}</span>
            <ClassStatusBadge status={classInfo.status} />
            <span className="text-xs text-muted-foreground">{classInfo.kind === "individual" ? "Lớp 1:1" : "Lớp nhóm"}</span>
          </div>
          <h1 className={`${classHeading} [overflow-wrap:anywhere]`}>{classInfo.title}</h1>
          <p className="text-sm text-muted-foreground">{classInfo.subject} · {classInfo.level}</p>
        </div>
        <Button asChild variant="outline" className={`${classOutlineButton} w-full sm:w-auto`}>
          <Link href={`/lms/tutor/materials/classes/${encodeURIComponent(classId)}`}><FolderIcon className="size-4" aria-hidden="true" />Tài liệu của lớp</Link>
        </Button>
      </header>
      {classInfo.status !== "active" && <p className="rounded-2xl border border-border bg-muted/40 px-4 py-3 text-sm leading-relaxed text-muted-foreground">
        {classInfo.status === "completed" ? "Lớp đã kết thúc. Bạn có thể xem buổi học, tài liệu và điểm danh đã lưu nhưng không chỉnh sửa điểm danh." : "Lớp chưa bắt đầu. Điểm danh sẽ mở khi lớp đang học và buổi học đang diễn ra."}
      </p>}
      <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,3fr)_minmax(260px,1fr)]">
        <ClassSessionList key={classId} classInfo={classInfo} onAttendance={(session, trigger) => { attendanceTrigger.current = trigger; setSelected(session); }} />
        <aside className={`${classPanel} space-y-4 lg:sticky lg:top-5`} aria-labelledby="class-roster-title">
          <div className="flex items-center justify-between gap-2">
            <h2 id="class-roster-title" className="font-nunito text-base font-extrabold text-primary">Học viên trong lớp</h2>
            <span className="rounded-lg border border-border bg-muted px-2 py-0.5 text-xs font-bold tabular-nums text-primary">{learners.length}</span>
          </div>
          <ul className="space-y-3">
            {learners.map((learner) => <li key={learner.id} className="rounded-2xl border border-border/70 bg-muted/20 p-3"><ClassLearnerIdentity learner={learner} /><p className="mt-2 text-xs text-muted-foreground">{learner.gradeLevel}</p></li>)}
          </ul>
          {!learners.length && <p className="text-sm text-muted-foreground">Chưa có học viên trong lớp.</p>}
        </aside>
      </div>
      <p className="text-xs leading-relaxed text-muted-foreground">Dữ liệu lớp minh họa · Điểm danh lưu trong phiên hiện tại, chưa kết nối BE.</p>
      {selected && <AttendanceDialog key={selected.id} classInfo={classInfo} session={selected} learners={learners} onClose={() => setSelected(null)} onRestoreFocus={() => attendanceTrigger.current?.focus()} />}
    </div>
  );
}
