"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { Button } from "@workspace/ui/components/ui/button";
import { EmptyState } from "@workspace/ui/components/ui/empty-state";
import { PlusIcon } from "@heroicons/react/24/outline";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@workspace/ui/components/ui/dialog";
import { classSessionsService as service } from "@workspace/core/lms-classes/sessions.service";
import { useLmsClassResource, useLmsClassCommand } from "@workspace/core/lms-classes/useLmsClassResource";
import type { ClassSessionDto } from "@workspace/core/lms-classes/schemas";
import { toast } from "@workspace/ui/components/ui/bee-toast";
import type { TutorClass } from "../types/classes.types";
import { ApiSessionCard, SESSION_STATUS_LABELS, type SessionActionName } from "./ApiSessionCard";
import { ClassFilterSelect } from "./ClassFilterSelect";
import { ClassPagination } from "./ClassPagination";
import { ClassQueryErrorState } from "./ClassQueryErrorState";
import { ClassWorkspaceSkeleton } from "./ClassWorkspaceSkeleton";
import { classButton, classOutlineButton } from "./classes-ui";

const Attendance = dynamic(() => import("./ApiAttendanceDialog").then((m) => m.ApiAttendanceDialog));
const Scheduler = dynamic(() => import("./SessionSchedulerDialog").then((m) => m.SessionSchedulerDialog));
const Recording = dynamic(() => import("./SessionRecordingDialog").then((m) => m.SessionRecordingDialog));

type Action = { session: ClassSessionDto; name: SessionActionName };

const ACTION_TITLES: Record<SessionActionName, string> = {
  start: "Bắt đầu buổi học?",
  complete: "Kết thúc buổi học?",
  cancel: "Hủy buổi học?",
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
    (s) => service.list(classInfo.id, page, status === "all" ? undefined : status, s),
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
      toast.error("Chưa cập nhật được buổi học", { description: "Tải lại để lấy trạng thái/phiên bản mới. Không thay đổi học phí." });
      setAction(null);
    }
  }

  return (
    <section aria-label="Danh sách buổi học" className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-4 rounded-3xl border border-border bg-card p-4 shadow-soft sm:p-5">
        <label className="grid w-full max-w-xs gap-1.5 text-xs font-bold text-foreground">
          <span>Lọc theo trạng thái</span>
          <ClassFilterSelect
            value={status}
            onValueChange={(v) => {
              setStatus(v);
              setPage(1);
            }}
            options={[{ value: "all", label: "Tất cả buổi học" }, ...Object.entries(SESSION_STATUS_LABELS).map(([value, label]) => ({ value, label }))]}
          />
        </label>

        {active && (
          <div className="flex flex-col items-end gap-1.5">
            <Button className="min-h-11 px-5" disabled={atSessionLimit} onClick={() => setSchedule(true)}>
              <PlusIcon className="size-4" aria-hidden="true" />
              {atSessionLimit ? "Đã đủ số buổi" : "Tạo buổi học"}
            </Button>
            <span className="text-xs font-semibold text-muted-foreground">{sessionCount}/{numberOfSessions} buổi đã lên lịch</span>
          </div>
        )}
      </div>

      {query.loading ? (
        <ClassWorkspaceSkeleton />
      ) : query.error ? (
        <ClassQueryErrorState error={query.error} onRetry={() => void query.refetch()} />
      ) : (
        <>
          <p className="px-1 text-xs font-semibold text-muted-foreground">{query.data?.total ?? 0} buổi học · Giờ Việt Nam</p>

          {!query.data?.items.length && (
            <EmptyState
              imageAlt=""
              title="Chưa có buổi học nào"
              description={status !== "all" ? "Không tìm thấy buổi học phù hợp với trạng thái đã chọn." : "Bắt đầu xếp lịch các buổi học cho lớp để phục vụ công tác giảng dạy."}
              action={
                status !== "all" ? (
                  <Button variant="outline" className={classOutlineButton} onClick={() => setStatus("all")}>Xem tất cả buổi học</Button>
                ) : active && !atSessionLimit ? (
                  <Button className={classButton} onClick={() => setSchedule(true)}>
                    <PlusIcon className="size-4" aria-hidden="true" />
                    Tạo buổi học ngay
                  </Button>
                ) : undefined
              }
            />
          )}

          <div className="space-y-4">
            {query.data?.items.map((session) => (
              <ApiSessionCard
                key={session.id}
                session={session}
                active={active}
                group={group}
                attendanceEnabled={Boolean(classInfo.serverDetails?.features.attendance)}
                pending={command.isPending}
                onAction={(name) => setAction({ session, name })}
                onAttendance={() => setSelected(session)}
                onRecording={() => setRecording(session.id)}
                onReschedule={() => setSchedule(session)}
              />
            ))}
          </div>

          <ClassPagination
            page={page - 1}
            pageCount={Math.max(1, Math.ceil((query.data?.total ?? 0) / (query.data?.pageSize ?? 6)))}
            label="Phân trang buổi học"
            onPageChange={(v) => setPage(v + 1)}
          />
        </>
      )}

      {selected && <Attendance classId={classInfo.id} classStatus={classInfo.serverDetails?.status} session={selected} onClose={() => setSelected(null)} />}
      {recording && <Recording classId={classInfo.id} sessionId={recording} onClose={() => setRecording(null)} />}
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

      <Dialog open={Boolean(action)} onOpenChange={(v) => { if (!v && !command.isPending) setAction(null); }}>
        <DialogContent className="rounded-3xl">
          <DialogHeader>
            <DialogTitle>{action ? ACTION_TITLES[action.name] : ""}</DialogTitle>
            <DialogDescription>Hệ thống sẽ kiểm tra trạng thái buổi học trước khi cập nhật. Thao tác này không tự thay đổi học phí.</DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2">
            <Button variant="outline" className={classOutlineButton} disabled={command.isPending} onClick={() => setAction(null)}>Đóng</Button>
            <Button className={classButton} disabled={command.isPending} onClick={() => void confirm()}>Xác nhận</Button>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}
