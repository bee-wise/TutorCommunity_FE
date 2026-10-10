"use client";

import { TUTOR_CLASS_SESSIONS } from "../data/classes.mock";
import { useAttendanceStore } from "../store/attendance.store";
import { canMarkAttendance } from "../utils/classes.utils";
import { useTutorClassDetail } from "./useTutorClassDetail";

export function useClassOverview(classId: string) {
  const detail = useTutorClassDetail(classId);
  const records = useAttendanceStore((state) => state.records);
  const sessions = TUTOR_CLASS_SESSIONS.filter((session) => session.classId === classId);
  const nextSession = sessions.filter((session) => session.status === "ongoing" || session.status === "scheduled")
    .sort((a, b) => Number(b.status === "ongoing") - Number(a.status === "ongoing") || a.taughtAt.localeCompare(b.taughtAt))[0];
  const pendingAttendance = sessions.filter((session) => detail.classInfo && canMarkAttendance(detail.classInfo, session) && records[session.id]?.state !== "confirmed").length;
  return { ...detail, sessions, nextSession, pendingAttendance };
}
