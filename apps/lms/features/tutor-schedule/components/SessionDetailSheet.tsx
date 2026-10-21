"use client";

import { useState } from "react";
import Link from "next/link";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  CalendarDaysIcon as Calendar,
  ClockIcon as Clock,
  UserIcon as User,
  UserCircleIcon as UserCheck,
  ArrowRightCircleIcon as ExternalLink,
  ChatBubbleLeftRightIcon as MessageCircle,
  XMarkIcon as X,
  VideoCameraIcon as Video,
  ExclamationTriangleIcon as Warning,
  AcademicCapIcon,
} from "@heroicons/react/24/outline";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@workspace/ui/components/ui/sheet";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@workspace/ui/components/ui/dialog";
import { Button } from "@workspace/ui/components/ui/button";
import { cn } from "@workspace/core/helpers/utils";
import {
  lmsCalendarService,
  lmsCalendarKeys,
  formatLmsSubject,
} from "@workspace/core/lms-calendar";
import { classSessionsService } from "@workspace/core/lms-classes/sessions.service";
import { lmsClassKeys } from "@workspace/core/lms-classes/query-keys";
import type { Session } from "../types/schedule.types";
import { STATUS_COLORS, STATUS_LABELS } from "../types/schedule.types";

interface SessionDetailSheetProps {
  session: Session | null;
  open: boolean;
  onClose: () => void;
}

function formatDate(dateStr: string): string {
  const parts = dateStr.split("-");
  if (parts.length === 3) {
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
  }
  return dateStr;
}

function InfoRow({
  icon: Icon,
  label,
  children,
}: {
  icon: React.ElementType;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="size-8 rounded-lg bg-muted/60 flex items-center justify-center shrink-0 mt-0.5">
        <Icon className="size-4 text-muted-foreground" strokeWidth={1.75} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground mb-0.5">
          {label}
        </p>
        <div className="text-sm font-medium text-foreground">{children}</div>
      </div>
    </div>
  );
}

export function SessionDetailSheet({
  session,
  open,
  onClose,
}: SessionDetailSheetProps) {
  const queryClient = useQueryClient();
  const [showTooltip, setShowTooltip] = useState(false);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [joinError, setJoinError] = useState<string | null>(null);

  const isOfficial = session?.source === "SESSION";

  // Fresh detail query for official sessions on open
  const detailQuery = useQuery({
    queryKey: lmsCalendarKeys.detail("tutor", session?.id ?? ""),
    queryFn: ({ signal }) =>
      lmsCalendarService.getSessionDetail(session!.id, signal),
    enabled: Boolean(open && session && isOfficial),
    staleTime: 0,
  });

  const detail = detailQuery.data;
  const currentVersion = detail?.version ?? session?.version ?? 0;

  // On-demand Join mutation - never caches room URL
  const joinMutation = useMutation({
    mutationFn: async (id: string) => {
      setJoinError(null);
      return lmsCalendarService.joinSession(id);
    },
    onSuccess: (res) => {
      if (res.url) {
        window.open(res.url, "_blank", "noopener,noreferrer");
      } else {
        setJoinError("Phòng học chưa có URL hợp lệ.");
      }
    },
    onError: (err: unknown) => {
      const errObj = err as { status?: number; response?: { status?: number }; message?: string };
      const status = errObj?.status ?? errObj?.response?.status;
      if (status === 404) {
        setJoinError(
          "Buổi học không tồn tại hoặc bạn không còn quyền truy cập.",
        );
      } else if (status === 409) {
        setJoinError(
          "Chưa đến giờ vào phòng học hoặc phòng học chưa sẵn sàng.",
        );
      } else {
        setJoinError(errObj?.message || "Không thể vào phòng học lúc này.");
      }
    },
  });

  // Cancel mutation for tutor
  const cancelMutation = useMutation({
    mutationFn: async () => {
      if (!session) return;
      return classSessionsService.cancel(session.id, currentVersion);
    },
    onSuccess: () => {
      setCancelDialogOpen(false);
      queryClient.invalidateQueries({ queryKey: lmsCalendarKeys.all });
      queryClient.invalidateQueries({ queryKey: lmsClassKeys.all });
      onClose();
    },
    onError: (err: unknown) => {
      const errObj = err as { message?: string };
      alert(
        errObj?.message ||
          "Hủy buổi học thất bại do phiên bản dữ liệu đã thay đổi.",
      );
      queryClient.invalidateQueries({ queryKey: lmsCalendarKeys.all });
    },
  });

  if (!session) return null;

  const colors = STATUS_COLORS[session.status];
  const canJoin =
    isOfficial &&
    session.teachingMode === "ONLINE" &&
    session.status === "IN_PROGRESS";

  const canCancel =
    isOfficial &&
    (session.status === "UPCOMING" || session.status === "IN_PROGRESS");

  return (
    <>
      <Sheet open={open} onOpenChange={(v) => !v && onClose()}>
        <SheetContent
          side="right"
          showCloseButton={false}
          className="w-full sm:max-w-md p-0 flex flex-col bg-card border-l border-border/60 shadow-pop"
        >
          {/* ── Header ── */}
          <SheetHeader className="p-0">
            <div
              className={cn(
                "px-6 pt-5 pb-4 border-b border-border/40",
                session.status === "UPCOMING" && "bg-accent/10",
                session.status === "IN_PROGRESS" && "bg-muted",
                session.status === "COMPLETED" && "bg-secondary/10",
                session.status === "CANCELED" && "bg-muted",
              )}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <SheetTitle className="text-xl font-extrabold font-lms text-foreground leading-tight">
                      {detail ? formatLmsSubject(detail) : session.subject}
                      {detail?.programName ? ` · ${detail.programName}` : session.subjectLevel ? ` · ${session.subjectLevel}` : ""}
                    </SheetTitle>
                  </div>
                  <SheetDescription className="mt-1 text-sm text-muted-foreground">
                    Học viên:{" "}
                    <span className="font-semibold text-foreground">
                      {detail?.learnerName || session.studentFullName}
                    </span>
                  </SheetDescription>
                  <div className="flex items-center gap-2 mt-2">
                    <span
                      className={cn(
                        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border",
                        colors.bg,
                        colors.text,
                        colors.border,
                      )}
                    >
                      <span
                        className={cn(
                          "size-1.5 rounded-full shrink-0",
                          colors.dot,
                        )}
                      />
                      {STATUS_LABELS[session.status]}
                    </span>
                    {!isOfficial && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold bg-muted text-muted-foreground border border-border">
                        Lịch dự kiến
                      </span>
                    )}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  className="size-11 rounded-lg flex items-center justify-center text-muted-foreground hover:bg-muted/60 hover:text-foreground transition-colors shrink-0"
                >
                  <X className="size-4" />
                </button>
              </div>
            </div>
          </SheetHeader>

          {/* ── Body ── */}
          <div className="flex-1 overflow-y-auto">
            <div className="px-6 py-5 space-y-5">
              {/* Consultant */}
              <InfoRow icon={UserCheck} label="Tư vấn viên phụ trách">
                {detail?.consultantName || session.consultantName}
              </InfoRow>

              {/* Date */}
              <InfoRow icon={Calendar} label="Ngày học">
                {formatDate(session.date)}
              </InfoRow>

              {/* Time */}
              <InfoRow icon={Clock} label="Khung giờ">
                {session.startTime} – {session.endTime}
              </InfoRow>

              {/* Class code / navigation */}
              <InfoRow icon={User} label="Lớp học">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs bg-muted/60 px-2 py-0.5 rounded-md text-foreground">
                    {detail?.classCode || session.classCode || session.classId}
                  </span>
                  <Link
                    href={`/lms/tutor/classes/${session.classId}`}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-background px-2.5 py-1 text-xs font-bold text-primary transition-colors hover:bg-muted active:scale-95"
                  >
                    <AcademicCapIcon className="size-3.5" />
                    Mở lớp
                  </Link>
                </div>
              </InfoRow>

              <div className="h-px bg-border/40" />

              {/* Planned Notice */}
              {!isOfficial && (
                <div className="rounded-xl border border-border/60 bg-muted/30 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1">
                    Thông tin kế hoạch
                  </p>
                  <p className="text-sm text-foreground leading-relaxed">
                    Đây là buổi học dự kiến từ lộ trình lớp học chưa được thay
                    thế. Khi lớp kích hoạt hoặc xếp lịch chính thức, buổi học sẽ
                    trở thành lịch chính thức có thể vào phòng và thao tác.
                  </p>
                </div>
              )}

              {/* Classroom Link CTA for official sessions */}
              {isOfficial && (
                <div className="rounded-xl border border-border/50 bg-muted/20 p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Video className="size-4 text-muted-foreground" />
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      Phòng học trực tuyến
                    </p>
                  </div>

                  {session.status === "CANCELED" ? (
                    <p className="text-sm text-muted-foreground">
                      Buổi học đã bị hủy. Không thể vào phòng học.
                    </p>
                  ) : (
                    <>
                      <Button
                        type="button"
                        disabled={joinMutation.isPending || !canJoin}
                        onClick={() => joinMutation.mutate(session.id)}
                        className={cn(
                          "w-full py-2.5 px-4 font-semibold text-sm transition-all duration-150",
                          canJoin
                            ? "bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm"
                            : "bg-muted/50 text-muted-foreground cursor-not-allowed border border-border/50",
                        )}
                      >
                        <ExternalLink className="size-4 mr-2" />
                        {joinMutation.isPending
                          ? "Đang kiểm tra phòng..."
                          : canJoin
                            ? "Vào lớp học ngay"
                            : session.status === "COMPLETED"
                              ? "Buổi học đã kết thúc"
                              : "Chưa đến giờ học"}
                      </Button>

                      {joinError && (
                        <div className="mt-2.5 flex items-start gap-1.5 p-2.5 rounded-lg bg-destructive/10 text-destructive text-xs">
                          <Warning className="size-4 shrink-0 mt-0.5" />
                          <span>{joinError}</span>
                        </div>
                      )}

                      {!canJoin && session.status === "UPCOMING" && (
                        <p className="text-[11px] text-muted-foreground text-center mt-2">
                          Nút vào lớp sẽ khả dụng khi buổi học chuyển sang trạng
                          thái đang diễn ra.
                        </p>
                      )}
                    </>
                  )}
                </div>
              )}

              {/* Notes */}
              {(detail?.description || session.notes) && (
                <div className="rounded-xl border border-border/40 bg-muted/20 px-4 py-3">
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground mb-1.5">
                    Ghi chú
                  </p>
                  <p className="text-sm text-foreground leading-relaxed">
                    {detail?.description || session.notes}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* ── Footer Actions ── */}
          <div className="border-t border-border/40 px-6 py-4 space-y-2 bg-card">
            {/* Cancel Session button for Tutor */}
            {canCancel && (
              <Button
                type="button"
                variant="destructive"
                onClick={() => setCancelDialogOpen(true)}
                className="w-full font-semibold text-sm"
              >
                Hủy buổi học này
              </Button>
            )}

            {/* Reschedule info with consultant tooltip */}
            <div className="relative">
              <button
                type="button"
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
                onFocus={() => setShowTooltip(true)}
                onBlur={() => setShowTooltip(false)}
                className="flex items-center justify-center gap-1.5 w-full py-2 text-sm text-muted-foreground hover:text-primary transition-colors font-medium"
              >
                <MessageCircle className="size-4" />
                Yêu cầu đổi lịch / Liên hệ tư vấn viên
              </button>

              {showTooltip && (
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50 w-64 rounded-xl bg-foreground text-background text-xs px-3 py-2.5 text-center shadow-pop pointer-events-none">
                  Gửi tin nhắn trực tiếp đến tư vấn viên{" "}
                  <strong>{session.consultantName}</strong> qua mục Tin Nhắn.
                  <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-px border-4 border-transparent border-t-foreground" />
                </div>
              )}
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Confirmation Dialog for Tutor Cancel */}
      <Dialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-destructive">
              Xác nhận hủy buổi học
            </DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground mt-2">
              Bạn có chắc chắn muốn hủy buổi học{" "}
              <strong>{session.subject}</strong> vào lúc{" "}
              <strong>
                {session.startTime} ngày {formatDate(session.date)}
              </strong>
              ? Buổi học sẽ được đánh dấu đã hủy trên hệ thống.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4 gap-2">
            <Button
              type="button"
              variant="outline"
              disabled={cancelMutation.isPending}
              onClick={() => setCancelDialogOpen(false)}
            >
              Quay lại
            </Button>
            <Button
              type="button"
              variant="destructive"
              disabled={cancelMutation.isPending}
              onClick={() => cancelMutation.mutate()}
            >
              {cancelMutation.isPending ? "Đang hủy..." : "Xác nhận hủy"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
