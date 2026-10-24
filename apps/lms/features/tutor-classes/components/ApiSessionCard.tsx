"use client";

import { useEffect, useState } from "react";
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
import { normalizeSessionStatus } from "@workspace/core/lms-classes/lifecycle";
import { LmsStatusBadge } from "../../../components/LmsStatusBadge";
import type { StatusTone } from "../../../components/lms-status";
import { formatClassDate, getSessionStartOpensAt, SESSION_START_LEAD_MINUTES } from "../utils/classes.utils";

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

/** Color of the calendar tile header, one per session status. */
const TILE_HEADER: Record<string, string> = {
  SCHEDULED: "bg-accent text-accent-foreground",
  ONGOING: "bg-primary text-primary-foreground",
  COMPLETED: "bg-secondary text-secondary-foreground",
  CANCELLED: "bg-muted text-muted-foreground",
  RESCHEDULED: "bg-muted text-muted-foreground",
};

export type SessionActionName = "start" | "complete" | "cancel";

const TIME_ZONE = "Asia/Ho_Chi_Minh";

function dateParts(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  const parts = new Intl.DateTimeFormat("vi-VN", { timeZone: TIME_ZONE, weekday: "short", day: "2-digit", month: "numeric" }).formatToParts(date);
  const pick = (type: string) => parts.find((part) => part.type === type)?.value ?? "";
  return { weekday: pick("weekday"), day: pick("day"), month: pick("month") };
}

function formatTime(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "--:--" : new Intl.DateTimeFormat("vi-VN", { timeZone: TIME_ZONE, hour: "2-digit", minute: "2-digit", hour12: false }).format(date);
}

/** True once `at` (epoch ms) has passed; flips without polling the moment it does. */
function useTimeReached(at: number | null, enabled: boolean) {
  const reached = () => at !== null && Date.now() >= at;
  const [open, setOpen] = useState(reached);
  useEffect(() => {
    if (!enabled) return;
    setOpen(reached());
    const wait = at === null ? 0 : at - Date.now();
    // setTimeout overflows past ~24.8 days; the next render re-checks anyway.
    if (wait <= 0 || wait > 2 ** 31 - 1) return;
    const timer = window.setTimeout(() => setOpen(true), wait);
    return () => window.clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [at, enabled]);
  return open;
}

/** Calendar-style tile: coloured weekday band, big day number, month. */
function SessionDateTile({ startAt, status }: { startAt: string; status: string }) {
  const parts = dateParts(startAt);
  return (
    <div className="flex w-[4.5rem] shrink-0 flex-col items-center self-start overflow-hidden rounded-2xl border border-border bg-card text-center shadow-xs" aria-hidden="true">
      <span className={`w-full py-1 text-[11px] font-extrabold uppercase ${TILE_HEADER[status] ?? TILE_HEADER.RESCHEDULED}`}>{parts?.weekday ?? "—"}</span>
      <span className="font-lms text-3xl font-black leading-[1.15] tabular-nums text-foreground">{parts?.day ?? "--"}</span>
      <span className="pb-1.5 text-[11px] font-bold text-muted-foreground">{parts ? `Tháng ${parts.month}` : ""}</span>
    </div>
  );
}

function SessionDescription({ description }: { description: string }) {
  const [expanded, setExpanded] = useState(false);
  const isLong = description.length > 120 || description.includes("\n");

  return (
    <div className="mt-3 text-sm leading-relaxed text-foreground [overflow-wrap:anywhere]">
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
  const statusKey = normalizeSessionStatus(session.status) ?? "";
  const isOngoing = statusKey === "ONGOING";
  const isScheduled = statusKey === "SCHEDULED";
  const isCompleted = statusKey === "COMPLETED";
  const isCancelled = statusKey === "CANCELLED";
  const isOnline = Boolean(session.locationOrMeetingInfo?.startsWith("http")) || session.teachingMode === "ONLINE";
  const endAtMs = new Date(session.endAt).getTime();
  const startOpen = useTimeReached(getSessionStartOpensAt(session.startAt)?.getTime() ?? null, isScheduled);
  // Complete is only offered after the scheduled end; the session's own end time gates cancel too.
  const ended = useTimeReached(Number.isNaN(endAtMs) ? null : endAtMs, isScheduled || isOngoing);

  return (
    <article className={`flex flex-col gap-4 rounded-3xl border bg-card p-4 shadow-soft sm:flex-row sm:p-5 ${isOngoing ? "border-primary" : "border-border"} ${isCancelled ? "opacity-80" : ""}`}>
      <SessionDateTile startAt={session.startAt} status={statusKey} />

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div className="min-w-0">
            <h2 className="font-lms text-base font-extrabold leading-snug sm:text-lg [overflow-wrap:anywhere]">{session.name ? session.name : formatClassDate(session.startAt)}</h2>
            <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1 font-extrabold tabular-nums text-foreground">
                <ClockIcon className="size-4 text-primary" aria-hidden="true" />
                {formatTime(session.startAt)} – {formatTime(session.endAt)}
              </span>
              <span className="font-semibold">{session.durationMinutes} phút</span>
            </p>
          </div>
          <LmsStatusBadge status={SESSION_STATUS_TONES[statusKey] ?? "planned"} label={SESSION_STATUS_LABELS[statusKey] ?? "Chưa xác định trạng thái"} />
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-1.5">
          <span className={`inline-flex items-center gap-1 rounded-lg px-2 py-1 text-[11px] font-bold ${isOnline ? "bg-primary text-primary-foreground" : "bg-accent text-accent-foreground"}`}>
            {isOnline ? <VideoCameraIcon className="size-3.5" aria-hidden="true" /> : <MapPinIcon className="size-3.5" aria-hidden="true" />}
            {isOnline ? "Trực tuyến" : "Trực tiếp"}
          </span>
          {session.teachingItemName && <span className="rounded-lg bg-muted px-2 py-1 text-[11px] font-bold text-muted-foreground">{session.teachingItemName}</span>}
          {session.replacesSessionId && <span className="rounded-lg border border-dashed border-border px-2 py-1 text-[11px] font-bold text-muted-foreground">Buổi đã đổi lịch</span>}
        </div>

        {session.description && <SessionDescription description={session.description} />}

        {(session.locationOrMeetingInfo || session.actualEndAt) && (
          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted-foreground">
            {session.locationOrMeetingInfo &&
              (session.locationOrMeetingInfo.startsWith("http") ? (
                <a href={session.locationOrMeetingInfo} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-9 items-center gap-1.5 rounded-full border border-primary bg-card px-3.5 font-bold text-primary transition-all hover:bg-muted active:scale-[0.98]">
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

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4">
          <div className="flex flex-wrap items-center gap-2">
            {active && isScheduled && (
              <>
                <Button className="min-h-11 px-4 text-xs" disabled={pending || !startOpen} aria-describedby={startOpen ? undefined : `start-hint-${session.id}`} onClick={() => onAction("start")}>
                  <PlayIcon className="size-4" aria-hidden="true" />
                  Bắt đầu buổi học
                </Button>
                {!startOpen && (
                  <span id={`start-hint-${session.id}`} className="text-xs font-semibold text-muted-foreground">
                    Mở lúc {formatTime(getSessionStartOpensAt(session.startAt)?.toISOString() ?? session.startAt)}, trước giờ học {SESSION_START_LEAD_MINUTES} phút
                  </span>
                )}
              </>
            )}
            {active && isOngoing && (
              ended ? (
                <Button className="min-h-11 px-4 text-xs" disabled={pending} onClick={() => onAction("complete")}>
                  <StopIcon className="size-4" aria-hidden="true" />
                  Kết thúc buổi học
                </Button>
              ) : (
                <span className="text-xs font-semibold text-muted-foreground">Có thể kết thúc buổi học sau {formatTime(session.endAt)}</span>
              )
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
                {!ended && (
                  <DropdownMenuItem className="min-h-11 cursor-pointer rounded-xl text-xs font-bold text-destructive focus:text-destructive" onSelect={() => onAction("cancel")}>
                    <XMarkIcon className="mr-2 size-4 text-destructive" aria-hidden="true" />
                    Hủy buổi học
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </article>
  );
}
