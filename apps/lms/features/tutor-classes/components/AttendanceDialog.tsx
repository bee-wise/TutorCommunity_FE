"use client";

import { useState } from "react";
import { Button } from "@workspace/ui/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@workspace/ui/components/ui/dialog";
import { useAttendanceForm } from "../hooks/useAttendanceForm";
import { useAttendanceStore } from "../store/attendance.store";
import type { ClassLearner, TutorClass, TutorClassSession } from "../types/classes.types";
import { formatClassDate } from "../utils/classes.utils";
import { AttendanceStateBadge, SessionStatusBadge } from "./ClassBadges";
import { AttendanceHistory } from "./AttendanceHistory";
import { AttendanceLearnerCard } from "./AttendanceLearnerCard";
import { classButton, classOutlineButton } from "./classes-ui";

interface AttendanceDialogProps {
  classInfo: TutorClass;
  session: TutorClassSession;
  learners: ClassLearner[];
  onClose: () => void;
  onRestoreFocus?: () => void;
}

export function AttendanceDialog({ classInfo, session, learners, onClose, onRestoreFocus }: AttendanceDialogProps) {
  const record = useAttendanceStore((state) => state.records[session.id]);
  const revisions = useAttendanceStore((state) => state.revisions);
  const attendance = useAttendanceForm(classInfo, session, learners, record);
  const [discardWarning, setDiscardWarning] = useState(false);
  const { form, editable } = attendance;
  const pending = form.formState.isSubmitting;

  function requestClose() {
    if (pending) return;
    if (editable && form.formState.isDirty) setDiscardWarning(true);
    else onClose();
  }

  return (
    <Dialog open onOpenChange={(open) => { if (!open) requestClose(); }}>
      <DialogContent
        className="flex max-h-[90dvh] w-[calc(100%-2rem)] max-w-4xl flex-col gap-0 overflow-hidden rounded-3xl border-border bg-card p-0 shadow-soft motion-reduce:animate-none [&>button]:size-11 [&>button]:rounded-xl [&>button]:border [&>button]:border-border [&>button]:transition-all [&>button]:active:scale-[0.98]"
        onCloseAutoFocus={(event) => { if (onRestoreFocus) { event.preventDefault(); onRestoreFocus(); } }}
      >
        <DialogHeader className="shrink-0 border-b border-border px-5 py-5 pr-20 text-left sm:px-6 sm:pr-20">
          <DialogTitle className="font-nunito text-xl font-extrabold leading-7 text-primary">{editable ? "Điểm danh buổi học" : "Xem điểm danh"}</DialogTitle>
          <DialogDescription className="space-y-1 text-xs leading-5 [overflow-wrap:anywhere]">
            <span className="block">{classInfo.code} · {session.topic}</span>
            <span className="block">{formatClassDate(session.taughtAt)} · {session.durationMinutes} phút</span>
          </DialogDescription>
        </DialogHeader>
        {discardWarning ? (
          <div className="space-y-5 overflow-y-auto p-5 sm:p-6">
            <div role="alert" className="space-y-2 rounded-2xl border border-accent/40 bg-accent/15 p-4">
              <h2 className="font-nunito text-lg font-extrabold text-warning">Bạn có thay đổi chưa lưu</h2>
              <p className="text-sm leading-relaxed">Đóng cửa sổ sẽ bỏ các thay đổi từ lần lưu gần nhất. Điểm danh đã lưu không bị xóa.</p>
            </div>
            <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <Button type="button" variant="outline" className={classOutlineButton} onClick={onClose}>Bỏ thay đổi & đóng</Button>
              <Button type="button" className={`${classButton} border-primary`} onClick={() => setDiscardWarning(false)}>Tiếp tục điểm danh</Button>
            </div>
          </div>
        ) : (
          <>
            <div className="min-h-0 space-y-5 overflow-y-auto p-5 sm:p-6">
              <div className="flex flex-wrap items-center gap-2">
                <SessionStatusBadge status={session.status} />
                <AttendanceStateBadge record={record} />
                {form.formState.isDirty && <span className="rounded-full border border-accent/40 bg-accent/15 px-2.5 py-1 text-[11px] font-bold text-warning">Có thay đổi chưa lưu</span>}
              </div>
              {!editable && <p className="rounded-2xl border border-border bg-muted/40 p-3.5 text-sm leading-relaxed text-muted-foreground">Chỉ điểm danh buổi đang diễn ra hoặc đã hoàn thành trong lớp đang học. Các trường hợp khác chỉ xem lại.</p>}
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h2 className="font-nunito text-sm font-extrabold text-foreground">{learners.length} học viên trong buổi học</h2>
                {editable && <Button type="button" variant="outline" className={classOutlineButton} disabled={pending || !learners.length} onClick={attendance.markAllPresent}>Tất cả có mặt</Button>}
              </div>
              <form onSubmit={(event) => event.preventDefault()} aria-label="Danh sách điểm danh học viên">
                <div className="grid gap-3 md:grid-cols-2">
                  {learners.map((learner, index) => <AttendanceLearnerCard key={learner.id} learner={learner} index={index} form={form} editable={editable} />)}
                </div>
                {!learners.length && <p className="rounded-2xl border border-dashed border-border p-5 text-center text-sm text-muted-foreground">Chưa có học viên trong danh sách buổi học.</p>}
              </form>
              {record && <AttendanceHistory revisions={revisions} sessionId={session.id} />}
              <p className="rounded-xl bg-muted/40 px-3.5 py-3 text-xs leading-relaxed text-muted-foreground">Bản mock · Tải lại trang sẽ mất dữ liệu điểm danh. Điểm danh không tự thay đổi học phí hoặc trạng thái hoàn thành buổi học.</p>
            </div>
            <DialogFooter className="shrink-0 flex-col-reverse gap-2 border-t border-border bg-muted/20 px-5 py-4 sm:flex-row sm:flex-wrap sm:justify-between sm:space-x-0 sm:px-6">
              <Button type="button" variant="outline" className={classOutlineButton} disabled={pending} onClick={requestClose}>Đóng</Button>
              {editable && <div className="flex flex-col-reverse gap-2 sm:flex-row">
                <Button type="button" variant="outline" className={classOutlineButton} disabled={pending || !form.formState.isDirty || record?.state === "confirmed"} onClick={() => void attendance.submit("draft")()}>Lưu bản nháp</Button>
                <Button type="button" className={`${classButton} border-primary`} disabled={pending || !learners.length || (!form.formState.isDirty && record?.state === "confirmed")} onClick={() => void attendance.submit("confirmed")()}>
                  {pending ? "Đang lưu…" : record?.state === "confirmed" ? "Lưu chỉnh sửa điểm danh" : "Xác nhận điểm danh"}
                </Button>
              </div>}
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
