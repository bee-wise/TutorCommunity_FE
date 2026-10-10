"use client";

import { useRef, useState } from "react";
import dynamic from "next/dynamic";
import { useTutorClassDetail } from "../hooks/useTutorClassDetail";
import type { TutorClassSession } from "../types/classes.types";
import { ClassMissingState } from "./ClassMissingState";
import { ClassSessionList } from "./ClassSessionList";
import { ClassWorkspaceHeader } from "./ClassWorkspaceHeader";
import { classPage } from "./classes-ui";

const AttendanceDialog = dynamic(() => import("./AttendanceDialog").then((module) => module.AttendanceDialog));

export function ClassSessionsScreen({ classId }: { classId: string }) {
  const { classInfo, learners } = useTutorClassDetail(classId);
  const [selected, setSelected] = useState<TutorClassSession | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  if (!classInfo) return <ClassMissingState />;
  return <div className={classPage}>
    <ClassWorkspaceHeader classInfo={classInfo} title="Buổi học & điểm danh" />
    {classInfo.status === "upcoming" && <p className="text-sm text-muted-foreground">Điểm danh mở khi lớp đang học và buổi học đang diễn ra hoặc đã hoàn thành.</p>}
    <ClassSessionList key={classId} classInfo={classInfo} onAttendance={(session, trigger) => { triggerRef.current = trigger; setSelected(session); }} />
    <p className="text-xs text-muted-foreground">Điểm danh minh họa lưu trong phiên hiện tại. Tải lại trang sẽ xóa thay đổi.</p>
    {selected && <AttendanceDialog key={selected.id} classInfo={classInfo} session={selected} learners={learners} onClose={() => setSelected(null)} onRestoreFocus={() => triggerRef.current?.focus()} />}
  </div>;
}
