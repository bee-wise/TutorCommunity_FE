import { Button } from "@workspace/ui/components/ui/button";
import type { SessionAttendance, TutorClass, TutorClassSession } from "../types/classes.types";
import { canMarkAttendance, formatClassDate } from "../utils/classes.utils";
import { AttendanceStateBadge, SessionStatusBadge } from "./ClassBadges";
import { classButton, classOutlineButton } from "./classes-ui";

export function ClassSessionCard({ classInfo, session, record, onAttendance }: {
  classInfo: TutorClass;
  session: TutorClassSession;
  record?: SessionAttendance;
  onAttendance: (session: TutorClassSession, trigger: HTMLButtonElement) => void;
}) {
  const editable = canMarkAttendance(classInfo, session);
  const action = editable ? record?.state === "confirmed" ? "Chỉnh sửa điểm danh" : "Điểm danh" : "Xem điểm danh";
  return (
    <article className={`min-w-0 rounded-2xl border p-4 ${session.status === "ongoing" ? "border-primary/20 bg-muted/40" : "border-border bg-card"}`}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-xs font-bold leading-5 text-muted-foreground">{formatClassDate(session.taughtAt)} · {session.durationMinutes} phút</p>
        <SessionStatusBadge status={session.status} />
      </div>
      <h3 className="mt-2 font-nunito text-base font-extrabold leading-6 text-primary [overflow-wrap:anywhere]">{session.topic}</h3>
      <p className="mt-1 text-[11px] leading-5 text-muted-foreground [overflow-wrap:anywhere]">Mã buổi: {session.id}</p>
      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-1.5">
          <AttendanceStateBadge record={record} />
          {record && <p className="text-[11px] leading-5 text-muted-foreground">Cập nhật {formatClassDate(record.updatedAt)}</p>}
        </div>
        <Button type="button" variant={editable ? "default" : "outline"} className={`${editable ? classButton : classOutlineButton} ${editable ? "border-primary" : ""} w-full sm:w-auto`}
          onClick={(event) => onAttendance(session, event.currentTarget)}>{action}</Button>
      </div>
    </article>
  );
}
