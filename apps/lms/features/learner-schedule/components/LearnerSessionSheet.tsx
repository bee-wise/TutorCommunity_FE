"use client";

import { useState } from "react";
import Link from "next/link";
import { useQuery, useMutation } from "@tanstack/react-query";
import {
  VideoCameraIcon as VideoCamera,
  ExclamationTriangleIcon as Warning,
  XMarkIcon as X,
  AcademicCapIcon,
  ChatBubbleLeftRightIcon,
  CalendarIcon,
  ClockIcon,
  ComputerDesktopIcon,
  MapPinIcon,
  UserIcon,
  ArrowRightIcon,
  DocumentTextIcon,
} from "@heroicons/react/24/outline";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@workspace/ui/components/ui/sheet";
import { Button } from "@workspace/ui/components/ui/button";
import { cn } from "@workspace/core/helpers/utils";
import {
  lmsCalendarService,
  lmsCalendarKeys,
  formatLmsSubject,
} from "@workspace/core/lms-calendar";
import type { LearnerSession } from "../types/learner-schedule.types";
import { LEARNER_STATUS_LABELS } from "../types/learner-schedule.types";
import { formatLearnerSessionDate } from "../utils/calendar.utils";
import { statusDot, statusTone } from "../../../components/lms-status";

const STATUS_CONFIG = {
  UPCOMING: {
    badge: statusTone.pending,
    dot: statusDot.pending,
    headerBg: "bg-accent/10",
  },
  IN_PROGRESS: {
    badge: statusTone.active,
    dot: "bg-primary motion-safe:animate-pulse",
    headerBg: "bg-muted",
  },
  COMPLETED: {
    badge: statusTone.done,
    dot: statusDot.done,
    headerBg: "bg-secondary/10",
  },
  CANCELED: {
    badge: statusTone.cancelled,
    dot: statusDot.cancelled,
    headerBg: "bg-muted",
  },
  RESCHEDULED: {
    badge: statusTone.planned,
    dot: statusDot.planned,
    headerBg: "bg-muted",
  },
} as const;

interface LearnerSessionSheetProps {
  session: LearnerSession | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function LearnerSessionSheet({
  session,
  open,
  onOpenChange,
}: LearnerSessionSheetProps) {
  const [joinError, setJoinError] = useState<string | null>(null);

  const isOfficial = session?.source === "SESSION";

  const detailQuery = useQuery({
    queryKey: lmsCalendarKeys.detail("learner", session?.id ?? ""),
    queryFn: ({ signal }) =>
      lmsCalendarService.getSessionDetail(session!.id, signal),
    enabled: Boolean(open && session && isOfficial),
    staleTime: 0,
  });

  const detail = detailQuery.data;

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
      const errObj = err as {
        status?: number;
        response?: { status?: number };
        message?: string;
      };
      const status = errObj?.status ?? errObj?.response?.status;
      if (status === 404) {
        setJoinError(
          "Buổi học không tồn tại hoặc bạn không còn quyền truy cập phòng.",
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

  if (!session) return null;

  const statusStyle = STATUS_CONFIG[session.status] || STATUS_CONFIG.UPCOMING;
  const canJoin =
    isOfficial &&
    session.teachingMode === "ONLINE" &&
    session.status === "IN_PROGRESS";

  const subjectTitle = detail
    ? formatLmsSubject(detail)
    : session.subject;

  const topicName = detail?.name || session.topic;
  const hasDistinctTopic =
    Boolean(topicName) &&
    topicName !== "Nội dung buổi học" &&
    topicName !== subjectTitle;

  const programOrLevel = detail?.programName || session.level;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        showCloseButton={false}
        className="flex w-full flex-col border-l border-border bg-card p-0 sm:max-w-md shadow-pop"
      >
        {/* ── Header ── */}
        <SheetHeader className="p-0">
          <div
            className={cn(
              "px-6 pt-5 pb-4 border-b border-border/40 transition-colors",
              statusStyle.headerBg,
            )}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                {/* Status pill + Planned tag */}
                <div className="flex items-center gap-2">
                  <span
                    className={cn(
                      "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border",
                      statusStyle.badge,
                    )}
                  >
                    <span
                      className={cn(
                        "size-1.5 rounded-full shrink-0",
                        statusStyle.dot,
                      )}
                    />
                    {LEARNER_STATUS_LABELS[session.status]}
                  </span>
                  {!isOfficial && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold bg-muted text-muted-foreground border border-border">
                      Lịch dự kiến
                    </span>
                  )}
                </div>

                {/* Subject Title */}
                <SheetTitle className="mt-3 text-xl font-extrabold font-lms text-foreground leading-tight">
                  {subjectTitle}
                </SheetTitle>

                {/* Distinct Topic / Subtitle */}
                {hasDistinctTopic && (
                  <p className="mt-1 text-sm font-semibold text-primary/90">
                    {topicName}
                  </p>
                )}

                {/* Program / Level */}
                {programOrLevel && programOrLevel !== "Khóa học" && (
                  <SheetDescription className="mt-1 text-xs text-muted-foreground">
                    {programOrLevel}
                  </SheetDescription>
                )}
              </div>

              {/* Close button */}
              <button
                type="button"
                onClick={() => onOpenChange(false)}
                aria-label="Đóng chi tiết"
                className="size-8 rounded-lg flex items-center justify-center text-muted-foreground hover:bg-muted/60 hover:text-foreground transition-colors shrink-0"
              >
                <X className="size-4" />
              </button>
            </div>
          </div>
        </SheetHeader>

        {/* ── Body ── */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
          {/* Tutor Profile Card */}
          <div className="flex items-center gap-3.5 rounded-2xl border border-border/70 p-4 bg-muted/20">
            <div className="size-11 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0 text-primary font-extrabold text-sm">
              {session.tutorInitials}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
                <AcademicCapIcon className="size-3.5 text-primary" />
                <span>Gia sư phụ trách</span>
              </div>
              <p className="mt-0.5 font-extrabold text-foreground text-sm capitalize truncate">
                {detail?.tutorName || session.tutorName}
              </p>
            </div>
          </div>

          {/* Session Details List */}
          <div className="rounded-2xl border border-border/60 p-4 bg-card space-y-1">
            {/* Date */}
            <InfoRow icon={CalendarIcon} label="Ngày học">
              <span>{formatLearnerSessionDate(session.date)}</span>
            </InfoRow>

            {/* Time */}
            <InfoRow icon={ClockIcon} label="Khung giờ">
              <span>
                {session.startTime} – {session.endTime}
              </span>
            </InfoRow>

            {/* Mode & Location */}
            <InfoRow
              icon={
                session.teachingMode === "ONLINE"
                  ? ComputerDesktopIcon
                  : MapPinIcon
              }
              label="Hình thức học"
            >
              <span>
                {session.teachingMode === "ONLINE"
                  ? "Học trực tuyến"
                  : detail?.location || session.rawItem?.location || "Học trực tiếp"}
              </span>
            </InfoRow>

            {/* Class code & link to class overview */}
            <InfoRow
              icon={AcademicCapIcon}
              label="Lớp học"
              action={
                session.classId ? (
                  <Link
                    href={`/lms/learner/classes/${session.classId}`}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-background px-2.5 py-1 text-xs font-bold text-primary transition-colors hover:bg-muted active:scale-95"
                  >
                    <span>Xem lớp</span>
                    <ArrowRightIcon className="size-3.5" aria-hidden />
                  </Link>
                ) : null
              }
            >
              <span
                className="font-mono text-xs font-bold text-foreground bg-muted px-2 py-0.5 rounded max-w-[170px] truncate block"
                title={detail?.classCode || session.classCode || "Chưa có mã lớp"}
              >
                {detail?.classCode || session.classCode || "Chưa có mã lớp"}
              </span>
            </InfoRow>

            {/* Consultant */}
            <InfoRow icon={UserIcon} label="Tư vấn viên phụ trách">
              <span className="text-muted-foreground font-medium">
                {detail?.consultantName || session.consultantName || "Chưa phân công"}
              </span>
            </InfoRow>
          </div>

          {/* Planned Notice */}
          {!isOfficial && (
            <div className="rounded-2xl border border-accent/40 bg-accent/10 p-4">
              <p className="text-xs font-bold uppercase tracking-wider text-warning mb-1">
                Lịch học dự kiến
              </p>
              <p className="text-xs text-foreground leading-relaxed">
                Đây là buổi học theo kế hoạch dự kiến của lớp học. Khi buổi học
                được xếp lịch chính thức, bạn sẽ có thể vào phòng học trực tuyến.
              </p>
            </div>
          )}

          {/* Notes */}
          {(detail?.description || session.notes) && (
            <div className="rounded-2xl border border-border/60 bg-muted/20 p-4">
              <div className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground mb-1">
                <DocumentTextIcon className="size-3.5 text-primary" />
                <span>Ghi chú buổi học</span>
              </div>
              <p className="text-xs leading-relaxed text-foreground whitespace-pre-line">
                {detail?.description || session.notes}
              </p>
            </div>
          )}
        </div>

        {/* ── Footer ── */}
        <div className="border-t border-border p-5 sm:px-6 bg-card space-y-3">
          {/* Join room action button */}
          {isOfficial && (
            <div>
              <Button
                type="button"
                disabled={joinMutation.isPending || !canJoin}
                onClick={() => joinMutation.mutate(session.id)}
                className={cn(
                  "w-full h-11 rounded-xl font-bold text-sm transition-all duration-200 active:scale-[0.98]",
                  canJoin
                    ? "bg-primary text-primary-foreground hover:bg-primary/90 shadow-md shadow-primary/20"
                    : "bg-muted/70 text-muted-foreground cursor-not-allowed border border-border/60",
                )}
              >
                <VideoCamera className="size-4 mr-2" />
                {joinMutation.isPending
                  ? "Đang kết nối phòng học..."
                  : canJoin
                    ? "Vào lớp học ngay"
                    : session.status === "COMPLETED"
                      ? "Buổi học đã kết thúc"
                      : session.status === "CANCELED"
                        ? "Buổi học đã hủy"
                        : "Chưa đến giờ học"}
              </Button>

              {!canJoin && session.status === "UPCOMING" && (
                <p className="text-center text-[11px] text-muted-foreground mt-1.5">
                  Phòng học trực tuyến sẽ mở khi đến giờ học theo lịch.
                </p>
              )}

              {joinError && (
                <div className="mt-2.5 flex items-start gap-1.5 p-2.5 rounded-xl bg-destructive/10 text-destructive text-xs border border-destructive/20">
                  <Warning className="size-4 shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{joinError}</span>
                </div>
              )}
            </div>
          )}

          {/* Cancellation & Rescheduling Note */}
          <div className="rounded-2xl border border-border/70 bg-muted/40 p-3.5 text-muted-foreground text-xs leading-relaxed">
            <div className="flex items-center gap-1.5 font-bold text-foreground mb-1">
              <ChatBubbleLeftRightIcon className="size-4 text-primary" />
              Lưu ý về đổi hoặc hủy lịch
            </div>
            Học viên không hủy hoặc đổi lịch trực tiếp trên hệ thống. Nếu có việc bận
            đột xuất, bạn vui lòng liên hệ tư vấn viên{" "}
            <strong className="text-foreground">
              {detail?.consultantName || session.consultantName || "phụ trách"}
            </strong>{" "}
            để được hỗ trợ sắp xếp lại lịch học.
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

function InfoRow({
  icon: Icon,
  label,
  children,
  action,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  children: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-3 py-2.5 border-b border-border/30 last:border-0">
      <div className="flex items-center gap-2.5 min-w-0">
        <div className="size-7 rounded-lg bg-muted flex items-center justify-center shrink-0 text-muted-foreground">
          <Icon className="size-3.5" />
        </div>
        <div className="min-w-0">
          <p className="text-[11px] text-muted-foreground font-medium">{label}</p>
          <div className="text-xs font-bold text-foreground mt-0.5">
            {children}
          </div>
        </div>
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
