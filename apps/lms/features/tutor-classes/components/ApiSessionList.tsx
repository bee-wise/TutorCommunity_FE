"use client";

import { useState } from "react";
import { statusTone } from "../../../components/lms-status";
import dynamic from "next/dynamic";
import { Button } from "@workspace/ui/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@workspace/ui/components/ui/dropdown-menu";
import {
  ArrowRightIcon,
  CalendarDaysIcon,
  CheckCircleIcon,
  ClipboardDocumentCheckIcon,
  ClockIcon,
  EllipsisHorizontalIcon,
  MapPinIcon,
  PlayIcon,
  PlusIcon,
  StopIcon,
  VideoCameraIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import {
  ChevronDownIcon,
  ChevronUpIcon,
} from "@heroicons/react/20/solid";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@workspace/ui/components/ui/dialog";
import { classSessionsService as service } from "@workspace/core/lms-classes/sessions.service";
import {
  useLmsClassResource,
  useLmsClassCommand,
} from "@workspace/core/lms-classes/useLmsClassResource";
import type { ClassSessionDto } from "@workspace/core/lms-classes/schemas";
import { toast } from "@workspace/ui/components/ui/bee-toast";
import type { TutorClass } from "../types/classes.types";
import { ClassFilterSelect } from "./ClassFilterSelect";
import { ClassPagination } from "./ClassPagination";
import { ClassQueryErrorState } from "./ClassQueryErrorState";
import { ClassWorkspaceSkeleton } from "./ClassWorkspaceSkeleton";
import { formatClassDate } from "../utils/classes.utils";
import { classButton, classOutlineButton } from "./classes-ui";

const Attendance = dynamic(() =>
  import("./ApiAttendanceDialog").then((m) => m.ApiAttendanceDialog),
);
const Scheduler = dynamic(() =>
  import("./SessionSchedulerDialog").then((m) => m.SessionSchedulerDialog),
);
const Recording = dynamic(() =>
  import("./SessionRecordingDialog").then((m) => m.SessionRecordingDialog),
);

function SessionDescription({ description }: { description: string }) {
  const [expanded, setExpanded] = useState(false);
  const isLong = description.length > 120 || description.includes("\n");

  return (
    <div className="mt-3.5 rounded-2xl border border-border/60 bg-muted/20 px-3.5 py-2.5 text-xs text-foreground/90 leading-relaxed [overflow-wrap:anywhere]">
      <p className={`whitespace-pre-line ${!expanded ? "line-clamp-3" : ""}`}>
        {description}
      </p>
      {isLong && (
        <button
          type="button"
          aria-expanded={expanded}
          onClick={() => setExpanded((prev) => !prev)}
          className="mt-1.5 inline-flex items-center gap-1 font-bold text-primary transition-colors hover:text-primary/80 active:scale-95"
        >
          <span>{expanded ? "Thu gọn mô tả" : "Xem toàn bộ mô tả"}</span>
          {expanded ? (
            <ChevronUpIcon className="size-4" aria-hidden="true" />
          ) : (
            <ChevronDownIcon className="size-4" aria-hidden="true" />
          )}
        </button>
      )}
    </div>
  );
}

const labels: Record<string, string> = {
  SCHEDULED: "Chưa bắt đầu",
  ONGOING: "Đang diễn ra",
  COMPLETED: "Đã hoàn thành",
  CANCELLED: "Đã hủy",
  RESCHEDULED: "Đã đổi lịch",
};

type Action = {
  session: ClassSessionDto;
  name: "start" | "complete" | "cancel";
};

export function ApiSessionList({ classInfo }: { classInfo: TutorClass }) {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState("all");
  const [selected, setSelected] = useState<ClassSessionDto | null>(null);
  const [recording, setRecording] = useState<string | null>(null);
  const [schedule, setSchedule] = useState<ClassSessionDto | true | null>(null);
  const [action, setAction] = useState<Action | null>(null);

  const query = useLmsClassResource(
    classInfo.id,
    "sessions",
    (s) =>
      service.list(
        classInfo.id,
        page,
        status === "all" ? undefined : status,
        s,
      ),
    { params: [page, status] },
  );

  const command = useLmsClassCommand(classInfo.id, (value: Action) =>
    value.name === "start"
      ? service.start(value.session.id, value.session.version)
      : value.name === "cancel"
        ? service.cancel(value.session.id, value.session.version)
        : service.complete(value.session.id),
  );

  const active = classInfo.status === "active";
  const group = classInfo.kind === "group";
  const numberOfSessions = classInfo.serverDetails?.numberOfSessions ?? 0;
  const sessionCount = classInfo.serverDetails?.sessionCount ?? 0;
  const atSessionLimit = sessionCount >= numberOfSessions;

  async function confirm() {
    if (!action || command.isPending) return;
    try {
      await command.mutateAsync(action);
      setAction(null);
      toast.success("Đã cập nhật buổi học");
    } catch {
      toast.error("Chưa cập nhật được buổi học", {
        description:
          "Tải lại để lấy trạng thái/phiên bản mới. Không thay đổi học phí.",
      });
      setAction(null);
    }
  }

  return (
    <section aria-label="Danh sách buổi học" className="space-y-5">
      {/* Filters & Actions Toolbar */}
      <div className="flex flex-wrap items-end justify-between gap-4 rounded-3xl border border-border bg-card p-4 sm:p-5 shadow-soft">
        <label className="grid w-full max-w-xs gap-1.5 text-xs font-bold text-foreground">
          <span>Lọc theo trạng thái</span>
          <ClassFilterSelect
            value={status}
            onValueChange={(v) => {
              setStatus(v);
              setPage(1);
            }}
            options={[
              { value: "all", label: "Tất cả buổi học" },
              ...Object.entries(labels).map(([value, label]) => ({
                value,
                label,
              })),
            ]}
          />
        </label>

        {active && (
          <div className="flex flex-col items-end gap-1.5">
            <Button
              className="min-h-11 rounded-xl px-5 text-sm font-bold shadow-soft transition-all active:scale-[0.98]"
              disabled={atSessionLimit}
              onClick={() => setSchedule(true)}
            >
              <PlusIcon className="mr-1.5 size-4.5" aria-hidden="true" />
              {atSessionLimit ? "Đã đủ số buổi" : "Tạo buổi học"}
            </Button>
            <span className="text-xs font-semibold text-muted-foreground">
              {sessionCount}/{numberOfSessions} buổi đã lên lịch
            </span>
          </div>
        )}
      </div>

      {query.loading ? (
        <ClassWorkspaceSkeleton />
      ) : query.error ? (
        <ClassQueryErrorState
          error={query.error}
          onRetry={() => void query.refetch()}
        />
      ) : (
        <>
          <div className="flex items-center justify-between px-1 text-xs text-muted-foreground">
            <p className="font-semibold">
              {query.data?.total ?? 0} buổi học · Giờ Việt Nam
            </p>
          </div>

          {!query.data?.items.length && (
            <div className="space-y-4 rounded-3xl border border-dashed border-border bg-card p-8 text-center shadow-2xs">
              <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
                <CalendarDaysIcon className="size-6" aria-hidden="true" />
              </div>
              <div className="space-y-1">
                <h3 className="font-lms text-base font-extrabold text-foreground">
                  Chưa có buổi học nào
                </h3>
                <p className="text-sm text-muted-foreground">
                  {status !== "all"
                    ? "Không tìm thấy buổi học phù hợp với trạng thái đã chọn."
                    : "Bắt đầu xếp lịch các buổi học cho lớp để phục vụ công tác giảng dạy."}
                </p>
              </div>
              {status !== "all" ? (
                <Button
                  variant="outline"
                  className={classOutlineButton}
                  onClick={() => setStatus("all")}
                >
                  Xem tất cả buổi học
                </Button>
              ) : active && !atSessionLimit ? (
                <Button
                  className={classButton}
                  onClick={() => setSchedule(true)}
                >
                  <PlusIcon className="mr-1.5 size-4" aria-hidden="true" />
                  Tạo buổi học ngay
                </Button>
              ) : null}
            </div>
          )}

          <div className="space-y-4">
            {query.data?.items.map((session) => {
              const isOngoing = session.status === "ONGOING";
              const isScheduled = session.status === "SCHEDULED";
              const isCompleted = session.status === "COMPLETED";
              const isCancelled = session.status === "CANCELLED";

              return (
                <article
                  key={session.id}
                  className={`group rounded-3xl border bg-card p-5 sm:p-6 shadow-soft transition-all duration-200 hover:shadow-soft-hover ${
                    isOngoing
                      ? "border-primary/50 ring-2 ring-primary/10"
                      : isCancelled
                        ? "border-border/60 bg-muted/20 opacity-80"
                        : "border-border"
                  }`}
                >
                  {/* Top Bar: Date, Time & Status Pill */}
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-3">
                      <span
                        className={`flex size-10 shrink-0 items-center justify-center rounded-2xl ${
                          isOngoing
                            ? "bg-primary text-primary-foreground"
                            : isCompleted
                              ? "bg-secondary/15 text-foreground"
                              : isCancelled
                                ? "bg-muted text-muted-foreground"
                                : "bg-accent/20 text-warning"
                        }`}
                      >
                        <CalendarDaysIcon className="size-5" aria-hidden="true" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <h2 className="font-lms text-base font-extrabold text-foreground sm:text-lg [overflow-wrap:anywhere] break-words">
                          {session.name ? session.name : formatClassDate(session.startAt)}
                        </h2>
                        <div className="mt-0.5 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                          {session.name && (
                            <>
                              <span className="font-medium text-foreground">
                                {formatClassDate(session.startAt)}
                              </span>
                              <span>·</span>
                            </>
                          )}
                          <span className="flex items-center gap-1 font-semibold text-foreground">
                            <ClockIcon
                              className="size-3.5 text-muted-foreground"
                              aria-hidden="true"
                            />
                            {session.durationMinutes} phút
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-bold ${
                          isOngoing
                            ? statusTone.active
                            : isCompleted
                              ? statusTone.done
                              : isCancelled
                                ? statusTone.cancelled
                                : statusTone.pending
                        }`}
                      >
                        {isOngoing && (
                          <span className="relative flex size-2">
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
                            <span className="relative inline-flex size-2 rounded-full bg-primary" />
                          </span>
                        )}
                        {isCompleted && (
                          <CheckCircleIcon
                            className="size-3.5 text-secondary"
                            aria-hidden="true"
                          />
                        )}
                        {labels[session.status ?? ""] ?? "Chưa xác định trạng thái"}
                      </span>
                    </div>
                  </div>

                  {/* Session Description */}
                  {session.description && (
                    <SessionDescription description={session.description} />
                  )}

                  {/* Metadata: Location / Link & Actual End */}
                  {(session.locationOrMeetingInfo || session.actualEndAt) && (
                    <div className="mt-4 flex flex-wrap items-center gap-3 rounded-2xl border border-border/60 bg-muted/30 px-3.5 py-2.5 text-xs text-muted-foreground">
                      {session.locationOrMeetingInfo && (
                        <div className="flex items-center gap-1.5">
                          {session.locationOrMeetingInfo.startsWith("http") ? (
                            <a
                              href={session.locationOrMeetingInfo}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 font-bold text-primary transition-colors hover:text-primary/80"
                            >
                              <VideoCameraIcon
                                className="size-4 shrink-0"
                                aria-hidden="true"
                              />
                              <span>Vào phòng học trực tuyến</span>
                              <ArrowRightIcon
                                className="size-3.5 shrink-0"
                                aria-hidden="true"
                              />
                            </a>
                          ) : (
                            <span className="inline-flex items-center gap-1 font-medium text-foreground">
                              <MapPinIcon
                                className="size-4 shrink-0 text-primary"
                                aria-hidden="true"
                              />
                              <span>{session.locationOrMeetingInfo}</span>
                            </span>
                          )}
                        </div>
                      )}
                      {session.actualEndAt && (
                        <div className="flex items-center gap-1.5 font-medium text-muted-foreground">
                          <CheckCircleIcon
                            className="size-4 shrink-0 text-secondary"
                            aria-hidden="true"
                          />
                          <span>
                            Kết thúc thực tế: {formatClassDate(session.actualEndAt)}
                          </span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-border/70 pt-4">
                    <div className="flex flex-wrap items-center gap-2">
                      {active && isScheduled && (
                        <Button
                          variant="default"
                          className="min-h-10 rounded-xl px-4 text-xs font-bold shadow-soft transition-all active:scale-[0.98]"
                          disabled={command.isPending}
                          onClick={() => setAction({ session, name: "start" })}
                        >
                          <PlayIcon className="mr-1.5 size-4" aria-hidden="true" />
                          Bắt đầu buổi học
                        </Button>
                      )}

                      {active && isOngoing && (
                        <Button
                          variant="default"
                          className="min-h-10 rounded-xl px-4 text-xs font-bold shadow-soft transition-all active:scale-[0.98]"
                          disabled={command.isPending}
                          onClick={() => setAction({ session, name: "complete" })}
                        >
                          <StopIcon className="mr-1.5 size-4" aria-hidden="true" />
                          Kết thúc buổi học
                        </Button>
                      )}

                      {group &&
                        classInfo.serverDetails?.features.attendance &&
                        (isOngoing || isCompleted) && (
                          <Button
                            variant="outline"
                            className="min-h-10 rounded-xl border-border bg-card px-4 text-xs font-bold text-foreground shadow-2xs transition-all hover:border-primary/40 hover:bg-muted active:scale-[0.98]"
                            onClick={() => setSelected(session)}
                          >
                            <ClipboardDocumentCheckIcon
                              className="mr-1.5 size-4 text-primary"
                              aria-hidden="true"
                            />
                            Điểm danh
                          </Button>
                        )}

                      {group && isCompleted && (
                        <Button
                          variant="outline"
                          className="min-h-10 rounded-xl border-border bg-card px-4 text-xs font-bold text-foreground shadow-2xs transition-all hover:border-primary/40 hover:bg-muted active:scale-[0.98]"
                          onClick={() => setRecording(session.id)}
                        >
                          <VideoCameraIcon
                            className="mr-1.5 size-4 text-muted-foreground"
                            aria-hidden="true"
                          />
                          Bản ghi
                        </Button>
                      )}
                    </div>

                    {active && isScheduled && (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="outline"
                            size="icon"
                            className="size-11 rounded-xl border-border bg-card shadow-2xs transition-all hover:bg-muted active:scale-[0.98]"
                            aria-label="Thao tác khác cho buổi học"
                          >
                            <EllipsisHorizontalIcon
                              className="size-4.5 text-muted-foreground"
                              aria-hidden="true"
                            />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          align="end"
                          className="rounded-2xl border-border bg-card shadow-soft"
                        >
                          <DropdownMenuItem
                            className="cursor-pointer rounded-xl py-2 text-xs font-bold"
                            onSelect={() => setSchedule(session)}
                          >
                            <CalendarDaysIcon
                              className="mr-2 size-4 text-primary"
                              aria-hidden="true"
                            />
                            Đổi lịch buổi học
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="cursor-pointer rounded-xl py-2 text-xs font-bold text-destructive hover:bg-destructive/10"
                            onSelect={() => setAction({ session, name: "cancel" })}
                          >
                            <XMarkIcon
                              className="mr-2 size-4 text-destructive"
                              aria-hidden="true"
                            />
                            Hủy buổi học
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </div>
                </article>
              );
            })}
          </div>

          <ClassPagination
            page={page - 1}
            pageCount={Math.max(
              1,
              Math.ceil((query.data?.total ?? 0) / (query.data?.pageSize ?? 6)),
            )}
            label="Phân trang buổi học"
            onPageChange={(v) => setPage(v + 1)}
          />
        </>
      )}

      {selected && (
        <Attendance
          classId={classInfo.id}
          classStatus={classInfo.serverDetails?.status}
          session={selected}
          onClose={() => setSelected(null)}
        />
      )}

      {recording && (
        <Recording
          classId={classInfo.id}
          sessionId={recording}
          onClose={() => setRecording(null)}
        />
      )}

      {schedule && (
        <Scheduler
          classId={classInfo.id}
          group={group}
          session={schedule === true ? undefined : schedule}
          numberOfSessions={numberOfSessions}
          sessionCount={sessionCount}
          sessionDurationMinutes={
            classInfo.serverDetails?.sessionDurationMinutes ?? 0
          }
          onClose={() => setSchedule(null)}
        />
      )}

      <Dialog
        open={Boolean(action)}
        onOpenChange={(v) => {
          if (!v && !command.isPending) setAction(null);
        }}
      >
        <DialogContent className="rounded-3xl">
          <DialogHeader>
            <DialogTitle>
              {action?.name === "start"
                ? "Bắt đầu buổi học?"
                : action?.name === "complete"
                  ? "Kết thúc buổi học?"
                  : "Hủy buổi học?"}
            </DialogTitle>
            <DialogDescription>
              Hệ thống sẽ kiểm tra trạng thái buổi học trước khi cập nhật. Thao
              tác này không tự thay đổi học phí.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              className={classOutlineButton}
              disabled={command.isPending}
              onClick={() => setAction(null)}
            >
              Đóng
            </Button>
            <Button
              className={classButton}
              disabled={command.isPending}
              onClick={() => void confirm()}
            >
              Xác nhận
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}
