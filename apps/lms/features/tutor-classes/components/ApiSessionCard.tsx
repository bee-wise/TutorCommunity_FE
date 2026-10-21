"use client";

import { useState } from "react";
import { Button } from "@workspace/ui/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@workspace/ui/components/ui/dropdown-menu";
import {
  ArrowRightIcon,
  CalendarDaysIcon,
  CheckCircleIcon,
  ClipboardDocumentCheckIcon,
  ClockIcon,
  EllipsisHorizontalIcon,
  MapPinIcon,
  PlayIcon,
  StopIcon,
  VideoCameraIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/20/solid";
import type { ClassSessionDto } from "@workspace/core/lms-classes/schemas";
import { LmsStatusBadge } from "../../../components/LmsStatusBadge";
import type { StatusTone } from "../../../components/lms-status";
import { formatClassDate } from "../utils/classes.utils";

export const SESSION_STATUS_LABELS: Record<string, string> = {
  SCHEDULED: "Chưa bắt đầu",
  ONGOING: "Đang diễn ra",
  COMPLETED: "Đã hoàn thành",
  CANCELLED: "Đã hủy",
  RESCHEDULED: "Đã đổi lịch",
};

const SESSION_STATUS_TONES: Record<string, StatusTone> = {
  SCHEDULED: "pending",
  ONGOING: "active",
  COMPLETED: "done",
  CANCELLED: "cancelled",
  RESCHEDULED: "planned",
};

export type SessionActionName = "start" | "complete" | "cancel";

function SessionDescription({ description }: { description: string }) {
  const [expanded, setExpanded] = useState(false);
  const isLong = description.length > 120 || description.includes("\n");

  return (
    <div className="mt-3.5 rounded-2xl border border-border bg-muted px-3.5 py-2.5 text-xs leading-relaxed [overflow-wrap:anywhere]">
      <p className={`whitespace-pre-line ${!expanded ? "line-clamp-3" : ""}`}>{description}</p>
      {isLong && (
        <button type="button" aria-expanded={expanded} onClick={() => setExpanded((prev) => !prev)} className="mt-1.5 inline-flex min-h-8 items-center gap-1 font-bold text-primary transition-colors hover:text-primary/80 active:scale-95">
          <span>{expanded ? "Thu gọn mô tả" : "Xem toàn bộ mô tả"}</span>
          {expanded ? <ChevronUpIcon className="size-4" aria-hidden="true" /> : <ChevronDownIcon className="size-4" aria-hidden="true" />}
        </button>
      )}
    </div>
  );
}

interface ApiSessionCardProps {
  session: ClassSessionDto;
  /** The class accepts schedule changes (status active). */
  active: boolean;
  group: boolean;
  attendanceEnabled: boolean;
  pending: boolean;
  onAction: (action: SessionActionName) => void;
  onAttendance: () => void;
  onRecording: () => void;
  onReschedule: () => void;
}

export function ApiSessionCard({ session, active, group, attendanceEnabled, pending, onAction, onAttendance, onRecording, onReschedule }: ApiSessionCardProps) {
  const isOngoing = session.status === "ONGOING";
  const isScheduled = session.status === "SCHEDULED";
  const isCompleted = session.status === "COMPLETED";
  const isCancelled = session.status === "CANCELLED";
  const statusKey = session.status ?? "";

  return (
    <article className={`rounded-3xl border bg-card p-5 shadow-soft sm:p-6 ${isOngoing ? "border-primary" : "border-border"} ${isCancelled ? "opacity-80" : ""}`}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <span className={`flex size-10 shrink-0 items-center justify-center rounded-xl ${isOngoing ? "bg-primary text-primary-foreground" : isCompleted ? "bg-secondary/15 text-foreground" : isCancelled ? "bg-muted text-muted-foreground" : "bg-accent/20 text-warning"}`}>
            <CalendarDaysIcon className="size-5" aria-hidden="true" />
          </span>
          <div className="min-w-0 flex-1">
            <h2 className="font-lms text-base font-extrabold sm:text-lg [overflow-wrap:anywhere]">{session.name ? session.name : formatClassDate(session.startAt)}</h2>
            <div className="mt-0.5 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
              {session.name && (
                <>
                  <span className="font-medium text-foreground">{formatClassDate(session.startAt)}</span>
                  <span aria-hidden="true">·</span>
                </>
              )}
              <span className="flex items-center gap-1 font-semibold text-foreground">
                <ClockIcon className="size-3.5 text-muted-foreground" aria-hidden="true" />
                {session.durationMinutes} phút
              </span>
            </div>
          </div>
        </div>
        <LmsStatusBadge status={SESSION_STATUS_TONES[statusKey] ?? "planned"} label={SESSION_STATUS_LABELS[statusKey] ?? "Chưa xác định trạng thái"} />
      </div>

      {session.description && <SessionDescription description={session.description} />}

      {(session.locationOrMeetingInfo || session.actualEndAt) && (
        <div className="mt-4 flex flex-wrap items-center gap-3 rounded-2xl border border-border bg-muted px-3.5 py-2.5 text-xs text-muted-foreground">
          {session.locationOrMeetingInfo &&
            (session.locationOrMeetingInfo.startsWith("http") ? (
              <a href={session.locationOrMeetingInfo} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-8 items-center gap-1 font-bold text-primary transition-colors hover:text-primary/80">
                <VideoCameraIcon className="size-4 shrink-0" aria-hidden="true" />
                <span>Vào phòng học trực tuyến</span>
                <ArrowRightIcon className="size-3.5 shrink-0" aria-hidden="true" />
              </a>
            ) : (
              <span className="inline-flex items-center gap-1 font-medium text-foreground">
                <MapPinIcon className="size-4 shrink-0 text-primary" aria-hidden="true" />
                <span>{session.locationOrMeetingInfo}</span>
              </span>
            ))}
          {session.actualEndAt && (
            <span className="flex items-center gap-1.5 font-medium">
              <CheckCircleIcon className="size-4 shrink-0 text-secondary" aria-hidden="true" />
              Kết thúc thực tế: {formatClassDate(session.actualEndAt)}
            </span>
          )}
        </div>
      )}

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4">
        <div className="flex flex-wrap items-center gap-2">
          {active && isScheduled && (
            <Button className="min-h-11 px-4 text-xs" disabled={pending} onClick={() => onAction("start")}>
              <PlayIcon className="size-4" aria-hidden="true" />
              Bắt đầu buổi học
            </Button>
          )}
          {active && isOngoing && (
            <Button className="min-h-11 px-4 text-xs" disabled={pending} onClick={() => onAction("complete")}>
              <StopIcon className="size-4" aria-hidden="true" />
              Kết thúc buổi học
            </Button>
          )}
          {group && attendanceEnabled && (isOngoing || isCompleted) && (
            <Button variant="outline" className="min-h-11 px-4 text-xs" onClick={onAttendance}>
              <ClipboardDocumentCheckIcon className="size-4 text-primary" aria-hidden="true" />
              Điểm danh
            </Button>
          )}
          {group && isCompleted && (
            <Button variant="outline" className="min-h-11 px-4 text-xs" onClick={onRecording}>
              <VideoCameraIcon className="size-4 text-muted-foreground" aria-hidden="true" />
              Bản ghi
            </Button>
          )}
        </div>

        {active && isScheduled && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" className="size-11" aria-label="Thao tác khác cho buổi học">
                <EllipsisHorizontalIcon className="size-5 text-muted-foreground" aria-hidden="true" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="rounded-2xl border-border bg-popover p-2 shadow-pop">
              <DropdownMenuItem className="min-h-11 cursor-pointer rounded-xl text-xs font-bold" onSelect={onReschedule}>
                <CalendarDaysIcon className="mr-2 size-4 text-primary" aria-hidden="true" />
                Đổi lịch buổi học
              </DropdownMenuItem>
              <DropdownMenuItem className="min-h-11 cursor-pointer rounded-xl text-xs font-bold text-destructive focus:text-destructive" onSelect={() => onAction("cancel")}>
                <XMarkIcon className="mr-2 size-4 text-destructive" aria-hidden="true" />
                Hủy buổi học
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </article>
  );
}
