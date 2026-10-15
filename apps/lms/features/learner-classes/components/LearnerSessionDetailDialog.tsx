"use client";
import { Button } from "@workspace/ui/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@workspace/ui/components/ui/dialog";
import { useLearnerSessionResources } from "../hooks/useLearnerSessionResources";
import {
  displaySessionTime,
  learnerSessionLabels,
  vietnamDate,
} from "../utils/learner-api-calendar";
import { learnerAction } from "./LearnerApiClassCard";
import { LearnerClassQueryError } from "./LearnerClassQueryError";

export function LearnerSessionDetailDialog({
  classId,
  sessionId,
  group,
  attendanceEnabled,
  onClose,
}: {
  classId: string;
  sessionId: string;
  group: boolean;
  attendanceEnabled: boolean;
  onClose: () => void;
}) {
  const state = useLearnerSessionResources(
      classId,
      sessionId,
      group,
      attendanceEnabled,
    ),
    data = state.session.data;
  return (
    <Dialog
      open
      onOpenChange={(v) => {
        if (!v) onClose();
      }}
    >
      <DialogContent className="max-h-[90dvh] max-w-2xl overflow-y-auto rounded-3xl">
        <DialogHeader>
          <DialogTitle>Chi tiết buổi học</DialogTitle>
          <DialogDescription>Giờ Việt Nam (UTC+7)</DialogDescription>
        </DialogHeader>
        {state.session.loading ? (
          <p role="status">Đang tải buổi học...</p>
        ) : state.session.error || !data ? (
          <LearnerClassQueryError
            error={state.session.error}
            onRetry={() => void state.session.refetch()}
          />
        ) : (
          <div className="space-y-5">
            <div>
              <h2 className="font-nunito text-lg font-extrabold text-primary">
                {vietnamDate(data.startAt)}
              </h2>
              <p className="mt-2 text-sm">
                {displaySessionTime(data.startAt, data.endAt)} ·{" "}
                {learnerSessionLabels[data.status ?? ""] ?? "Chưa xác định"}
              </p>
              <p className="mt-2 break-words text-sm">
                {data.locationOrMeetingInfo ?? "Chưa có thông tin phòng học"}
              </p>
            </div>
            {group &&
              attendanceEnabled &&
              ["ONGOING", "COMPLETED"].includes(data.status ?? "") && (
                <section className="space-y-2 rounded-2xl border border-border p-4">
                  <h3 className="font-bold text-primary">Điểm danh của bạn</h3>
                  {state.attendance.loading ? (
                    <p role="status">Đang tải...</p>
                  ) : state.attendance.error ? (
                    <p role="alert">
                      Không xem được điểm danh hoặc bạn không còn quyền truy
                      cập.
                    </p>
                  ) : state.mark ? (
                    <>
                      <p className="font-semibold">
                        {
                          {
                            PRESENT: "Có mặt",
                            ABSENT: "Vắng",
                            UNMARKED: "Chưa điểm danh",
                          }[state.mark.status]
                        }
                      </p>
                      <p className="text-sm">
                        {state.mark.isLate ? "Đi muộn. " : ""}
                        {state.mark.leftEarly ? "Rời sớm. " : ""}
                        {state.mark.note ?? ""}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {state.attendance.data?.status === "CONFIRMED"
                          ? "Đã xác nhận"
                          : "Chưa xác nhận"}
                        . Điểm danh không tự thay đổi học phí.
                      </p>
                    </>
                  ) : (
                    <p>Chưa có điểm danh của bạn.</p>
                  )}
                </section>
              )}
            {group && data.status === "COMPLETED" && (
              <section className="space-y-3">
                <h3 className="font-bold text-primary">Bản ghi buổi học</h3>
                <Button
                  variant="outline"
                  className={learnerAction}
                  disabled={state.playback.loading}
                  onClick={state.checkPlayback}
                >
                  {state.playback.loading
                    ? "Đang kiểm tra..."
                    : "Kiểm tra quyền xem bản ghi"}
                </Button>
                {state.attempt &&
                  (state.playback.error ? (
                    <p role="alert" className="text-sm">
                      Bản ghi chưa khả dụng hoặc bạn không còn quyền xem.
                    </p>
                  ) : state.url ? (
                    <Button asChild className={learnerAction}>
                      <a
                        href={state.url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Mở bản ghi
                      </a>
                    </Button>
                  ) : (
                    !state.playback.loading && (
                      <p className="text-sm">
                        Chưa có bản ghi PUBLIC khả dụng.
                      </p>
                    )
                  ))}
                <p className="text-xs text-muted-foreground">
                  Chỉ thành viên hiện tại có trong roster được xem bản ghi
                  PUBLIC. Không áp dụng hạn 30 ngày; BeeWise không thu hồi được
                  link đã sao chép tại Zoom.
                </p>
              </section>
            )}
          </div>
        )}
        <Button variant="outline" className={learnerAction} onClick={onClose}>
          Đóng
        </Button>
      </DialogContent>
    </Dialog>
  );
}
