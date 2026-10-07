"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@workspace/ui/components/ui/dialog";
import { actionClass, primaryActionClass } from "@/components/lms-page-ui";
import { useAttendanceForm } from "../hooks/useAttendanceForm";
import { useAttendanceStore } from "../store/attendance.store";
import {
  type ClassLearner,
  type TutorClass,
  type TutorClassSession,
} from "../types/classes.types";
import { formatClassDate } from "../utils/classes.utils";
import { AttendanceStateBadge, SessionStatusBadge } from "./ClassBadges";
import { AttendanceLearnerCard } from "./AttendanceLearnerCard";

interface AttendanceDialogProps {
  classInfo: TutorClass;
  session: TutorClassSession;
  learners: ClassLearner[];
  onClose: () => void;
}

export function AttendanceDialog({
  classInfo,
  session,
  learners,
  onClose,
}: AttendanceDialogProps) {
  const record = useAttendanceStore((state) => state.records[session.id]);
  const revisions = useAttendanceStore((state) => state.revisions);
  const attendance = useAttendanceForm(classInfo, session, learners, record);
  const [discardWarning, setDiscardWarning] = useState(false);
  const { form, editable } = attendance;
  function requestClose() {
    if (form.formState.isSubmitting) return;
    if (editable && form.formState.isDirty) setDiscardWarning(true);
    else onClose();
  }
  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open) requestClose();
      }}
    >
      <DialogContent className="flex max-h-[90dvh] w-[calc(100%-2rem)] max-w-7xl flex-col gap-0 overflow-hidden rounded-3xl border-border bg-card p-0 shadow-soft">
        <DialogHeader className="shrink-0 border-b border-border px-5 py-5 pr-12 text-left sm:px-6">
          <DialogTitle className="font-nunito text-xl font-extrabold leading-relaxed text-primary">
            {editable ? "Điểm danh buổi học" : "Xem điểm danh"}
          </DialogTitle>
          <DialogDescription>
            {classInfo.code} · {session.topic}
            <br />
            {formatClassDate(session.taughtAt)} ({session.durationMinutes} phút)
          </DialogDescription>
        </DialogHeader>
        {discardWarning ? (
          <div className="space-y-5 overflow-y-auto p-5 sm:p-6">
            <h2 className="font-nunito text-lg font-extrabold text-primary">
              Bạn có thay đổi chưa lưu
            </h2>
            <p className="text-sm leading-relaxed">
              Đóng cửa sổ sẽ bỏ các thay đổi từ lần lưu gần nhất. Điểm danh đã
              lưu không bị xóa.
            </p>
            <div className="flex flex-wrap justify-end gap-2">
              <button type="button" className={actionClass} onClick={onClose}>
                Bỏ thay đổi & đóng
              </button>
              <button
                type="button"
                className={primaryActionClass}
                onClick={() => setDiscardWarning(false)}
              >
                Tiếp tục điểm danh
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="min-h-0 space-y-5 overflow-y-auto p-5 sm:p-6">
              <div className="flex flex-wrap items-center gap-2">
                <SessionStatusBadge status={session.status} />
                <AttendanceStateBadge record={record} />
                {form.formState.isDirty && (
                  <span className="text-xs font-bold text-warning">
                    Có thay đổi chưa lưu
                  </span>
                )}
              </div>
              {!editable && (
                <p className="rounded-2xl border border-border p-3 text-sm leading-relaxed text-muted-foreground">
                  Chỉ điểm danh buổi đang diễn ra hoặc đã hoàn thành trong lớp
                  đang học. Các trường hợp khác chỉ xem lại.
                </p>
              )}
              {editable && (
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="text-sm text-muted-foreground">
                    {learners.length} học viên trong danh sách buổi học
                  </p>
                  <button
                    type="button"
                    className={actionClass}
                    disabled={form.formState.isSubmitting}
                    onClick={attendance.markAllPresent}
                  >
                    Tất cả có mặt
                  </button>
                </div>
              )}
              <form onSubmit={(event) => event.preventDefault()}>
                <div className="overflow-x-auto rounded-2xl border border-border bg-card">
                  <table className="w-full text-left text-sm">
                    <thead className="border-b border-border bg-muted/40 text-xs font-bold text-muted-foreground">
                      <tr>
                        <th
                          scope="col"
                          className="w-12 px-4 py-3.5 text-center"
                        >
                          STT
                        </th>
                        <th scope="col" className="min-w-[200px] px-4 py-3.5">
                          Học viên
                        </th>
                        <th scope="col" className="min-w-[260px] px-4 py-3.5">
                          Trạng thái điểm danh
                        </th>
                        <th scope="col" className="min-w-[200px] px-4 py-3.5">
                          Ghi chú
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {learners.map((learner, index) => (
                        <AttendanceLearnerCard
                          key={learner.id}
                          learner={learner}
                          index={index}
                          form={form}
                          editable={editable}
                        />
                      ))}
                    </tbody>
                  </table>
                </div>
              </form>
              {record && (
                <details className="group">
                  <summary
                    className={`${actionClass} w-fit cursor-pointer list-none [&::-webkit-details-marker]:hidden`}
                  >
                    Lịch sử lưu điểm danh
                  </summary>
                  <ol className="mt-3 space-y-3 text-sm">
                    {revisions
                      .filter(
                        (revision) => revision.next.sessionId === session.id,
                      )
                      .slice(-5)
                      .reverse()
                      .map((revision) => (
                        <li key={revision.next.version}>
                          <p className="font-bold">
                            Phiên bản {revision.next.version}:{" "}
                            {revision.next.state === "confirmed"
                              ? "Đã xác nhận"
                              : "Bản nháp"}
                          </p>
                          <p className="mt-1 text-xs text-muted-foreground">
                            {formatClassDate(revision.next.updatedAt)}
                          </p>
                        </li>
                      ))}
                  </ol>
                </details>
              )}
              <p className="text-xs leading-relaxed text-muted-foreground">
                Bản mock: lưu trong phiên hiện tại, tải lại trang sẽ mất dữ
                liệu. Điểm danh không tự thay đổi học phí hoặc trạng thái hoàn
                thành buổi học.
              </p>
            </div>
            <DialogFooter className="shrink-0 gap-2 border-t border-border px-5 py-4 sm:flex-wrap sm:px-6">
              <button
                type="button"
                className={actionClass}
                disabled={form.formState.isSubmitting}
                onClick={requestClose}
              >
                Đóng
              </button>
              {editable && (
                <>
                  <button
                    type="button"
                    className={actionClass}
                    disabled={
                      form.formState.isSubmitting ||
                      !form.formState.isDirty ||
                      record?.state === "confirmed"
                    }
                    onClick={() => void attendance.submit("draft")()}
                  >
                    Lưu bản nháp
                  </button>
                  <button
                    type="button"
                    className={primaryActionClass}
                    disabled={
                      form.formState.isSubmitting ||
                      !learners.length ||
                      (!form.formState.isDirty && record?.state === "confirmed")
                    }
                    onClick={() => void attendance.submit("confirmed")()}
                  >
                    {form.formState.isSubmitting
                      ? "Đang lưu…"
                      : record?.state === "confirmed"
                        ? "Lưu chỉnh sửa điểm danh"
                        : "Xác nhận điểm danh"}
                  </button>
                </>
              )}
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
