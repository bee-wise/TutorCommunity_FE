"use client";

import { useState, type ElementType, type ReactNode } from "react";
import Link from "next/link";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AcademicCapIcon, ArrowRightIcon, CalendarIcon, ClockIcon, ComputerDesktopIcon, ExclamationTriangleIcon, MapPinIcon, UserIcon, VideoCameraIcon } from "@heroicons/react/24/outline";
import { formatLmsSubject, lmsCalendarKeys, lmsCalendarService, type LmsScheduleView } from "@/features/lms-calendar";
import { Button } from "@workspace/ui/components/ui/button";
import { LmsResponsiveSheet } from "./LmsResponsiveSheet";
import { LmsStatusBadge } from "./LmsStatusBadge";
import { LMS_SESSION_STATUS, type LmsSessionStatus } from "./lms-session-status";

/** Fields both roles can supply; role-specific mapping happens in the feature wrapper. */
export interface LmsSessionDetailItem {
  id: string;
  source?: "SESSION" | "PLANNED";
  status: LmsSessionStatus;
  teachingMode?: string;
  /** "YYYY-MM-DD" */
  date: string;
  startTime: string;
  endTime: string;
  subject: string;
  topic?: string;
  level?: string;
  classId?: string;
  classCode?: string;
  consultantName?: string;
  location?: string;
  notes?: string;
}

export interface LmsSessionPerson {
  label: string;
  name: string;
}

interface LmsSessionDetailSheetProps {
  role: "tutor" | "learner";
  session: LmsSessionDetailItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** The other party in the session (learner for tutors, tutor for learners). */
  getPerson: (detail: LmsScheduleView | undefined) => LmsSessionPerson;
  /** Role-specific actions rendered under the join button (cancel, reschedule note...). */
  footer?: (detail: LmsScheduleView | undefined) => ReactNode;
}

function formatDate(date: string) {
  const [year, month, day] = date.split("-");
  return year && month && day ? `${day}/${month}/${year}` : date;
}

function joinErrorMessage(error: unknown) {
  const { status, response, message } = error as { status?: number; response?: { status?: number }; message?: string };
  const code = status ?? response?.status;
  if (code === 404) return "Buổi học không tồn tại hoặc bạn không còn quyền truy cập phòng.";
  if (code === 409) return "Chưa đến giờ vào phòng học hoặc phòng học chưa sẵn sàng.";
  return message || "Không thể vào phòng học lúc này.";
}

function InfoRow({ icon: Icon, label, children, action }: { icon: ElementType; label: string; children: ReactNode; action?: ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-border py-2.5 last:border-0">
      <div className="flex min-w-0 items-center gap-2.5">
        <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground"><Icon className="size-4" aria-hidden /></span>
        <div className="min-w-0">
          <p className="text-[11px] font-medium text-muted-foreground">{label}</p>
          <div className="mt-0.5 text-sm font-bold">{children}</div>
        </div>
      </div>
      {action}
    </div>
  );
}

export function LmsSessionDetailSheet({ role, session, open, onOpenChange, getPerson, footer }: LmsSessionDetailSheetProps) {
  const [joinError, setJoinError] = useState<string | null>(null);
  const isOfficial = session?.source === "SESSION";

  const detailQuery = useQuery({
    queryKey: lmsCalendarKeys.detail(role, session?.id ?? ""),
    queryFn: ({ signal }) => lmsCalendarService.getSessionDetail(session!.id, signal),
    enabled: Boolean(open && session && isOfficial),
    staleTime: 0,
  });
  const detail = detailQuery.data;

  // The room URL is never cached: it is fetched on demand each time.
  const joinMutation = useMutation({
    mutationFn: (id: string) => {
      setJoinError(null);
      return lmsCalendarService.joinSession(id);
    },
    onSuccess: (res) => {
      if (res.url) window.open(res.url, "_blank", "noopener,noreferrer");
      else setJoinError("Phòng học chưa có URL hợp lệ.");
    },
    onError: (error: unknown) => setJoinError(joinErrorMessage(error)),
  });

  if (!session) return null;

  const status = LMS_SESSION_STATUS[session.status] ?? LMS_SESSION_STATUS.UPCOMING;
  const person = getPerson(detail);
  const title = detail ? formatLmsSubject(detail) : session.subject;
  const topic = detail?.name || session.topic;
  const hasTopic = Boolean(topic) && topic !== "Nội dung buổi học" && topic !== title;
  const level = detail?.programName || session.level;
  const subtitle = [hasTopic ? topic : null, level && level !== "Khóa học" ? level : null].filter(Boolean).join(" · ");
  const canJoin = isOfficial && session.teachingMode === "ONLINE" && session.status === "IN_PROGRESS";
  const classCode = detail?.classCode || session.classCode || "Chưa có mã lớp";
  const notes = detail?.description || session.notes;
  const consultant = detail?.consultantName || session.consultantName || "Chưa phân công";
  const classHref = session.classId ? `/lms/${role}/classes/${session.classId}` : null;

  const joinLabel = joinMutation.isPending
    ? "Đang kết nối phòng học..."
    : canJoin ? "Vào lớp học ngay"
    : session.status === "COMPLETED" ? "Buổi học đã kết thúc"
    : session.status === "CANCELED" ? "Buổi học đã hủy"
    : "Chưa đến giờ học";

  return (
    <LmsResponsiveSheet
      open={open}
      onOpenChange={onOpenChange}
      title={title}
      description={subtitle || undefined}
      footer={
        <div className="w-full space-y-3">
          {isOfficial && (
            <div>
              <Button type="button" className="min-h-11 w-full" disabled={joinMutation.isPending || !canJoin} aria-busy={joinMutation.isPending} onClick={() => joinMutation.mutate(session.id)}>
                <VideoCameraIcon className="size-4" aria-hidden />
                {joinLabel}
              </Button>
              {!canJoin && session.status === "UPCOMING" && <p className="mt-1.5 text-center text-[11px] text-muted-foreground">Phòng học trực tuyến sẽ mở khi đến giờ học theo lịch.</p>}
              {joinError && (
                <div role="alert" className="mt-2.5 flex items-start gap-1.5 rounded-2xl border border-error bg-card p-2.5 text-xs text-destructive">
                  <ExclamationTriangleIcon className="mt-0.5 size-4 shrink-0" aria-hidden />
                  <span>{joinError}</span>
                </div>
              )}
            </div>
          )}
          {footer?.(detail)}
        </div>
      }
    >
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <LmsStatusBadge status={status.tone} label={status.label} />
          {!isOfficial && <span className="rounded-lg bg-muted px-2 py-1 text-[11px] font-bold text-muted-foreground">Lịch dự kiến</span>}
        </div>

        <div className="flex items-center gap-3.5 rounded-2xl border border-border bg-muted p-4">
          <span className="flex size-11 shrink-0 items-center justify-center rounded-full border border-border bg-card text-primary"><UserIcon className="size-5" aria-hidden /></span>
          <div className="min-w-0">
            <p className="text-xs font-medium text-muted-foreground">{person.label}</p>
            <p className="mt-0.5 truncate text-sm font-extrabold">{person.name}</p>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card px-4 py-1">
          <InfoRow icon={CalendarIcon} label="Ngày học">{formatDate(session.date)}</InfoRow>
          <InfoRow icon={ClockIcon} label="Khung giờ"><span className="tabular-nums">{session.startTime} – {session.endTime}</span></InfoRow>
          <InfoRow icon={session.teachingMode === "ONLINE" ? ComputerDesktopIcon : MapPinIcon} label="Hình thức học">
            {session.teachingMode === "ONLINE" ? "Học trực tuyến" : detail?.location || session.location || "Học trực tiếp"}
          </InfoRow>
          <InfoRow
            icon={AcademicCapIcon}
            label="Lớp học"
            action={classHref && (
              <Link href={classHref} className="inline-flex min-h-8 items-center gap-1.5 rounded-lg border border-border bg-background px-2.5 py-1 text-xs font-bold outline-none hover:bg-muted focus-visible:ring-[3px] focus-visible:ring-ring/50 active:scale-95">
                {role === "tutor" ? "Mở lớp" : "Xem lớp"}
                <ArrowRightIcon className="size-3.5" aria-hidden />
              </Link>
            )}
          >
            <span className="block max-w-[170px] truncate rounded bg-muted px-2 py-0.5 font-mono text-xs" title={classCode}>{classCode}</span>
          </InfoRow>
          <InfoRow icon={UserIcon} label="Tư vấn viên phụ trách"><span className="font-medium text-muted-foreground">{consultant}</span></InfoRow>
        </div>

        {!isOfficial && (
          <div className="rounded-2xl border border-accent/40 bg-accent/10 p-4">
            <p className="mb-1 text-xs font-bold uppercase tracking-wider text-warning">Lịch học dự kiến</p>
            <p className="text-xs leading-relaxed">Đây là buổi học theo kế hoạch dự kiến của lớp học. Khi buổi học được xếp lịch chính thức, bạn sẽ có thể vào phòng học trực tuyến.</p>
          </div>
        )}

        {notes && (
          <div className="rounded-2xl border border-border bg-muted p-4">
            <p className="mb-1 text-xs font-bold text-muted-foreground">Ghi chú buổi học</p>
            <p className="whitespace-pre-line text-xs leading-relaxed">{notes}</p>
          </div>
        )}
      </div>
    </LmsResponsiveSheet>
  );
}
