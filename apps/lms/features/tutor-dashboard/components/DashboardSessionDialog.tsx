import type { RefObject } from "react";
import { DialogContent, DialogTitle, DialogDescription, DialogHeader } from "@workspace/ui/components/ui/dialog";
import type { Session } from "@/features/tutor-schedule/types/schedule.types";
import { DashboardLink } from "./DashboardLink";

export function DashboardSessionDialog({ session, returnFocusRef }: {
  session: Session;
  returnFocusRef: RefObject<HTMLButtonElement | null>;
}) {
  const [year, month, day] = session.date.split("-");
  const info = [
    ["Học viên", session.studentFullName],
    ["Mã lớp", session.classId],
    ["Ngày học", `${day}/${month}/${year}`],
    ["Thời gian", `${session.startTime} - ${session.endTime}`],
    ["Tư vấn viên", session.consultantName],
    ["Học phí / buổi", `${new Intl.NumberFormat("vi-VN").format(session.feeVnd)}đ`],
  ] as const;

  return (
    <DialogContent
      onCloseAutoFocus={(event) => {
        event.preventDefault();
        returnFocusRef.current?.focus();
      }}
      className="max-h-[85dvh] w-[calc(100%-2rem)] overflow-y-auto rounded-3xl border-border bg-card p-6 shadow-soft sm:rounded-[32px] motion-reduce:animate-none motion-reduce:duration-0 [&>button]:flex [&>button]:size-11 [&>button]:items-center [&>button]:justify-center [&>button]:rounded-full"
    >
      <DialogHeader className="pr-10 text-left">
        <DialogTitle className="font-nunito text-2xl font-extrabold leading-[1.25] text-primary">{session.subject} {session.subjectLevel}</DialogTitle>
        <DialogDescription className="leading-relaxed">Thông tin buổi học từ lịch minh họa của bạn.</DialogDescription>
      </DialogHeader>
      <span className="w-fit rounded-full border border-primary bg-card px-3 py-1 text-xs font-bold text-primary">Sắp diễn ra</span>
      <dl className="space-y-4 py-2">
        {info.map(([label, value]) => (
          <div key={label} className="grid gap-1 sm:grid-cols-[140px_1fr]">
            <dt className="text-sm text-muted-foreground">{label}</dt>
            <dd className="min-w-0 text-sm font-semibold tabular-nums [overflow-wrap:anywhere]">{value}</dd>
          </div>
        ))}
      </dl>
      {session.notes && <p className="text-sm leading-relaxed text-muted-foreground">{session.notes}</p>}
      <DashboardLink href="/lms/tutor/schedule">Mở trang quản lý lịch dạy</DashboardLink>
      <p className="text-xs text-muted-foreground">Vào phòng học từ trang lịch dạy. Đây không phải lịch thực tế.</p>
    </DialogContent>
  );
}
