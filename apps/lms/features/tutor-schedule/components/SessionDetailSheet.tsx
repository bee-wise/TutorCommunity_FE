"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ChatBubbleLeftRightIcon } from "@heroicons/react/24/outline";
import { Button } from "@workspace/ui/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@workspace/ui/components/ui/dialog";
import { hasSessionEnded, lmsCalendarKeys, lmsCalendarService } from "@/features/lms-calendar";
import { classSessionsService } from "@workspace/core/lms-classes/sessions.service";
import { lmsClassKeys } from "@workspace/core/lms-classes/query-keys";
import { LmsSessionDetailSheet } from "@/components/LmsSessionDetailSheet";
import type { Session } from "../types/schedule.types";

interface SessionDetailSheetProps {
  session: Session | null;
  open: boolean;
  onClose: () => void;
}

export function SessionDetailSheet({ session, open, onClose }: SessionDetailSheetProps) {
  const queryClient = useQueryClient();
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [cancelError, setCancelError] = useState<string | null>(null);

  const isOfficial = session?.source === "SESSION";

  // Same key as the shared sheet, so this reuses its request; only needed for the optimistic-lock version.
  const detail = useQuery({
    queryKey: lmsCalendarKeys.detail("tutor", session?.id ?? ""),
    queryFn: ({ signal }) => lmsCalendarService.getSessionDetail(session!.id, signal),
    enabled: Boolean(open && session && isOfficial),
    staleTime: 0,
  }).data;
  const currentVersion = detail?.version ?? session?.version ?? 0;

  const cancelMutation = useMutation({
    mutationFn: () => {
      if (hasSessionEnded(session!.date, session!.endTime)) throw new Error("Buổi học đã kết thúc, không thể hủy.");
      return classSessionsService.cancel(session!.id, currentVersion);
    },
    onSuccess: () => {
      setCancelDialogOpen(false);
      queryClient.invalidateQueries({ queryKey: lmsCalendarKeys.all });
      queryClient.invalidateQueries({ queryKey: lmsClassKeys.all });
      onClose();
    },
    onError: (error: unknown) => {
      setCancelError((error as { message?: string })?.message || "Hủy buổi học thất bại do phiên bản dữ liệu đã thay đổi.");
      queryClient.invalidateQueries({ queryKey: lmsCalendarKeys.all });
    },
  });

  if (!session) return null;

  // A session that already ended can no longer be cancelled.
  const canCancel = isOfficial && (session.status === "UPCOMING" || session.status === "IN_PROGRESS") && !hasSessionEnded(session.date, session.endTime);
  const [year, month, day] = session.date.split("-");

  return (
    <>
      <LmsSessionDetailSheet
        role="tutor"
        session={{ ...session, level: session.subjectLevel, location: session.location }}
        open={open}
        onOpenChange={(next) => !next && onClose()}
        getPerson={(sessionDetail) => ({ label: "Học viên", name: sessionDetail?.learnerName || session.studentFullName })}
        footer={(sessionDetail) => (
          <div className="space-y-3">
            {canCancel && (
              <Button type="button" variant="destructive" className="min-h-11 w-full" onClick={() => { setCancelError(null); setCancelDialogOpen(true); }}>
                Hủy buổi học này
              </Button>
            )}
            <div className="rounded-2xl border border-border bg-muted p-3.5 text-xs leading-relaxed text-muted-foreground">
              <div className="mb-1 flex items-center gap-1.5 font-bold text-foreground">
                <ChatBubbleLeftRightIcon className="size-4 text-primary" aria-hidden />
                Yêu cầu đổi lịch
              </div>
              Gửi tin nhắn đến tư vấn viên <strong className="text-foreground">{sessionDetail?.consultantName || session.consultantName}</strong> qua mục Tin Nhắn.
            </div>
          </div>
        )}
      />

      <Dialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
        <DialogContent className="max-w-md rounded-3xl border-border bg-popover p-6 shadow-pop">
          <DialogHeader>
            <DialogTitle className="text-lg font-extrabold">Hủy buổi học này?</DialogTitle>
            <DialogDescription>
              Buổi <strong>{session.subject}</strong> lúc <strong>{session.startTime} ngày {day}/{month}/{year}</strong> sẽ được đánh dấu đã hủy trên hệ thống.
            </DialogDescription>
          </DialogHeader>
          {cancelError && <p role="alert" className="text-sm text-destructive">{cancelError}</p>}
          <DialogFooter className="gap-2">
            <Button type="button" variant="outline" className="min-h-11" disabled={cancelMutation.isPending} onClick={() => setCancelDialogOpen(false)}>Giữ buổi học</Button>
            <Button type="button" variant="destructive" className="min-h-11" disabled={cancelMutation.isPending} onClick={() => cancelMutation.mutate()}>
              {cancelMutation.isPending ? "Đang hủy..." : "Hủy buổi học"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
