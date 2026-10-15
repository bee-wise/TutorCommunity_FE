"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { Button } from "@workspace/ui/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@workspace/ui/components/ui/dropdown-menu";
import { EllipsisHorizontalIcon } from "@heroicons/react/24/outline";
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
import { formatClassDate, formatClassIdentifier } from "../utils/classes.utils";
import { classButton, classOutlineButton, classPanel } from "./classes-ui";

const Attendance = dynamic(() =>
  import("./ApiAttendanceDialog").then((m) => m.ApiAttendanceDialog),
);
const Scheduler = dynamic(() =>
  import("./SessionSchedulerDialog").then((m) => m.SessionSchedulerDialog),
);
const Recording = dynamic(() =>
  import("./SessionRecordingDialog").then((m) => m.SessionRecordingDialog),
);
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
  const [page, setPage] = useState(1),
    [status, setStatus] = useState("all");
  const [selected, setSelected] = useState<ClassSessionDto | null>(null),
    [recording, setRecording] = useState<string | null>(null);
  const [schedule, setSchedule] = useState<ClassSessionDto | true | null>(null),
    [action, setAction] = useState<Action | null>(null);
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
  const active = classInfo.status === "active",
    group = classInfo.kind === "group";
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
    <section aria-label="Danh sách buổi học" className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <label className="grid w-full max-w-xs gap-1 text-xs font-bold">
          Trạng thái buổi
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
          <div className="flex flex-col items-end gap-1">
            <Button className={classButton} disabled={atSessionLimit} onClick={() => setSchedule(true)}>
              {atSessionLimit ? "Đã đủ số buổi" : "Tạo buổi học"}
            </Button>
            <span className="text-xs font-semibold text-muted-foreground">
              {sessionCount}/{numberOfSessions} buổi học
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
          <p className="text-xs text-muted-foreground">
            {query.data?.total ?? 0} buổi · Giờ Việt Nam
          </p>
          {!query.data?.items.length && (
            <p className={`${classPanel} text-sm text-muted-foreground`}>Chưa có buổi học phù hợp với trạng thái đã chọn.</p>
          )}
          {query.data?.items.map((session) => (
            <article key={session.id} className={`${classPanel} space-y-3`}>
              <div className="flex flex-wrap justify-between gap-2">
                <h2 className="font-nunito text-base font-extrabold text-primary">
                  {formatClassDate(session.startAt)}
                </h2>
                <span className="rounded-full border border-border px-3 py-1 text-xs font-bold">
                  {labels[session.status ?? ""] ?? "Chưa xác định trạng thái"}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                Mã buổi {formatClassIdentifier(session.id)}
              </p>
              <p className="text-sm">
                {session.durationMinutes} phút
                {session.actualEndAt
                  ? ` · Kết thúc thực tế ${formatClassDate(session.actualEndAt)}`
                  : ""}
              </p>
              <div className="flex flex-wrap gap-2">
                {active && session.status === "SCHEDULED" && (
                  <Button
                    className={classButton}
                    disabled={command.isPending}
                    onClick={() => setAction({ session, name: "start" })}
                  >
                    Bắt đầu buổi học
                  </Button>
                )}
                {active && session.status === "ONGOING" && (
                  <Button
                    className={classButton}
                    disabled={command.isPending}
                    onClick={() => setAction({ session, name: "complete" })}
                  >
                    Kết thúc buổi học
                  </Button>
                )}
                {group &&
                  classInfo.serverDetails?.features.attendance &&
                  ["ONGOING", "COMPLETED"].includes(session.status ?? "") && (
                    <Button
                      variant="outline"
                      className={classOutlineButton}
                      onClick={() => setSelected(session)}
                    >
                      Điểm danh
                    </Button>
                  )}
                {group && session.status === "COMPLETED" && (
                  <Button
                    variant="outline"
                    className={classOutlineButton}
                    onClick={() => setRecording(session.id)}
                  >
                    Bản ghi
                  </Button>
                )}
                {active && session.status === "SCHEDULED" && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        className={classOutlineButton}
                        aria-label={`Thêm thao tác cho buổi ${formatClassIdentifier(session.id)}`}
                      >
                        <EllipsisHorizontalIcon className="size-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem onSelect={() => setSchedule(session)}>
                        Đổi lịch
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onSelect={() => setAction({ session, name: "cancel" })}
                      >
                        Hủy buổi học
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>
            </article>
          ))}
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
      )}{" "}
      {recording && (
        <Recording
          classId={classInfo.id}
          sessionId={recording}
          onClose={() => setRecording(null)}
        />
      )}{" "}
      {schedule && (
        <Scheduler
          classId={classInfo.id}
          group={group}
          session={schedule === true ? undefined : schedule}
          numberOfSessions={numberOfSessions}
          sessionCount={sessionCount}
          sessionDurationMinutes={classInfo.serverDetails?.sessionDurationMinutes ?? 0}
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
              Hệ thống sẽ kiểm tra trạng thái buổi học trước khi cập nhật. Thao tác này không tự thay đổi học phí.
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
