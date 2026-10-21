"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { groupClassesService as service } from "@workspace/core/lms-classes/group.service";
import {
  useLmsClassResource,
  useLmsClassCommand,
} from "@workspace/core/lms-classes/useLmsClassResource";
import { Button } from "@workspace/ui/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@workspace/ui/components/ui/dialog";
import { toast } from "@workspace/ui/components/ui/bee-toast";
import { ClassQueryErrorState } from "./ClassQueryErrorState";
import { GroupAdmissionsPanel } from "./GroupAdmissionsPanel";
import { classButton, classOutlineButton, classPanel } from "./classes-ui";

const Draft = dynamic(() =>
  import("./GroupDraftDialog").then((m) => m.GroupDraftDialog),
);
const Roadmap = dynamic(() =>
  import("./GroupRoadmapDialog").then((m) => m.GroupRoadmapDialog),
);
type Action = "submit" | "publish" | "activate" | "complete";
const labels = {
  submit: "Gửi tư vấn viên duyệt",
  publish: "Công khai tuyển sinh",
  activate: "Khai giảng lớp",
  complete: "Kết thúc lớp",
};
const approvalLabels: Record<string, string> = {
  DRAFT: "Bản nháp",
  SUBMITTED: "Chờ duyệt",
  PENDING: "Chờ duyệt",
  APPROVED: "Đã duyệt",
  REJECTED: "Không được duyệt",
  CHANGES_REQUESTED: "Cần chỉnh sửa",
  REQUEST_CHANGES: "Cần chỉnh sửa",
};
export function GroupClassManagement({ classId }: { classId: string }) {
  const [editing, setEditing] = useState(false),
    [roadmap, setRoadmap] = useState(false),
    [action, setAction] = useState<Action | null>(null);
  const query = useLmsClassResource(classId, "group", (s) =>
    service.get(classId, s),
  );
  const history = useLmsClassResource(classId, "group-history", (s) =>
    service.history(classId, s),
  );
  const command = useLmsClassCommand(
    classId,
    async (v: { action: Action; version: number }) =>
      await service[v.action](classId, v.version),
  );
  async function confirm() {
    if (!query.data || !action) return;
    try {
      await command.mutateAsync({ action, version: query.data.version });
      setAction(null);
      toast.success("Đã cập nhật lớp nhóm");
    } catch {
      setAction(null);
      toast.error("Chưa cập nhật được lớp", {
        description:
          "Tải lại trang nếu thông tin lớp đã thay đổi, rồi thử lại.",
      });
    }
  }
  if (query.loading) return <p role="status">Đang tải quản lý lớp nhóm...</p>;
  if (query.error || !query.data)
    return (
      <ClassQueryErrorState
        error={query.error}
        onRetry={() => void query.refetch()}
      />
    );
  const data = query.data,
    editable =
      data.status === "UPCOMING" &&
      ["ONLINE", "OFFLINE"].includes(data.teachingMode ?? "") &&
      ["MONTHLY", "FULL_COURSE"].includes(data.billingMode ?? "") &&
      ["DRAFT", "REJECTED", "CHANGES_REQUESTED", "REQUEST_CHANGES"].includes(
        data.approvalStatus ?? "",
      );
  return (
    <section className="space-y-5">
      <div className={`${classPanel} space-y-4`}>
        <h2 className="font-lms text-lg font-extrabold text-foreground">
          Vận hành lớp nhóm
        </h2>
        <div className="flex flex-wrap gap-2">
          <span
            className={`rounded-full border px-3 py-0.5 text-xs font-bold ${
              data.approvalStatus === "APPROVED"
                ? "border-secondary/40 bg-secondary/15 text-foreground"
                : data.approvalStatus === "REJECTED"
                  ? "border-destructive/30 bg-destructive/10 text-destructive"
                  : data.approvalStatus === "DRAFT"
                    ? "border-border bg-card text-muted-foreground"
                    : "border-accent/40 bg-accent/20 text-warning"
            }`}
          >
            {approvalLabels[data.approvalStatus ?? ""] ?? "Chưa có trạng thái duyệt"}
          </span>
          <span
            className={`rounded-full border px-3 py-0.5 text-xs font-bold ${
              data.isPublished
                ? "border-primary bg-card text-primary"
                : "border-border bg-muted text-muted-foreground"
            }`}
          >
            {data.isPublished ? "Đã công khai tuyển sinh" : "Không công khai"}
          </span>
        </div>
        {data.approvalNote && (
          <p className="rounded-xl border border-accent/30 bg-accent/15 px-3 py-2 text-sm text-foreground">
            Phản hồi tư vấn viên: {data.approvalNote}
          </p>
        )}
        <div className="flex flex-wrap gap-2">
          {editable && (
            <>
              <Button
                variant="outline"
                className={classOutlineButton}
                onClick={() => setEditing(true)}
              >
                Sửa thông tin
              </Button>
              <Button
                variant="outline"
                className={classOutlineButton}
                onClick={() => setRoadmap(true)}
              >
                Sửa lộ trình
              </Button>
              <Button
                className={classButton}
                onClick={() => setAction("submit")}
              >
                {labels.submit}
              </Button>
            </>
          )}
          {data.status === "UPCOMING" && data.approvalStatus === "APPROVED" && (
            <>
              {!data.isPublished && (
                <Button
                  className={classButton}
                  onClick={() => setAction("publish")}
                >
                  {labels.publish}
                </Button>
              )}
              <Button
                variant="outline"
                className={classOutlineButton}
                onClick={() => setAction("activate")}
              >
                {labels.activate}
              </Button>
            </>
          )}
          {data.status === "ACTIVE" && (
            <Button
              variant="outline"
              className={classOutlineButton}
              onClick={() => setAction("complete")}
            >
              {labels.complete}
            </Button>
          )}
        </div>
        <p className="text-xs text-muted-foreground">
          Công khai tuyển sinh không tự khai giảng hoặc thêm học viên. Học viên đã thanh toán vẫn cần tư vấn viên duyệt yêu cầu tham gia.
        </p>
        <section className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <h3 className="font-lms text-sm font-extrabold text-foreground">Lộ trình học tập</h3>
            <span className="text-xs text-muted-foreground">{data.roadmap.length} chặng đào tạo</span>
          </div>
          {!data.roadmap.length && (
            <p className="rounded-2xl border border-dashed border-border px-4 py-3 text-sm text-muted-foreground">
              Chưa có lộ trình cho lớp này.
            </p>
          )}
          <div className="grid gap-3 sm:grid-cols-2">
            {data.roadmap.map((stage, idx) => (
              <div
                key={stage.id}
                className="space-y-2 rounded-2xl border border-border/70 bg-muted/20 p-4 transition-colors hover:bg-muted/40"
              >
                <div className="flex items-center gap-2">
                  <span className="rounded-lg bg-card px-2 py-0.5 font-mono text-[10px] font-extrabold text-primary shadow-2xs">
                    Chặng {idx + 1}
                  </span>
                  <h4 className="font-lms text-sm font-extrabold text-foreground">{stage.title}</h4>
                </div>
                {stage.objective && <p className="text-xs text-muted-foreground">{stage.objective}</p>}
                <div className="mt-2 space-y-1.5 border-t border-border/60 pt-2">
                  {stage.lessons.map((l) => (
                    <div key={l.id} className="flex items-center gap-2 text-xs font-medium text-foreground">
                      <span className="flex size-5 shrink-0 items-center justify-center rounded-full border border-border/80 bg-card text-[10px] font-bold text-muted-foreground">
                        {l.order}
                      </span>
                      <span className="truncate">{l.title}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
        <section className="space-y-2">
          <h3 className="text-sm font-bold">Lịch sử duyệt</h3>
          {!history.loading && !history.error && !history.data?.length && <p className="text-sm text-muted-foreground">Chưa có lần xét duyệt nào.</p>}
          {history.data?.map((h, i) => (
            <p key={i} className="text-xs">
              {h.action}: {h.changes}
            </p>
          ))}
        </section>
      </div>
      {data.status !== "COMPLETED" && (
        <GroupAdmissionsPanel
          classId={classId}
          active={data.status === "ACTIVE"}
        />
      )}
      {editing && <Draft data={data} onClose={() => setEditing(false)} />}{" "}
      {roadmap && <Roadmap data={data} onClose={() => setRoadmap(false)} />}
      <Dialog
        open={Boolean(action)}
        onOpenChange={(v) => {
          if (!v && !command.isPending) setAction(null);
        }}
      >
        <DialogContent className="rounded-3xl">
          <DialogHeader>
            <DialogTitle>{action ? labels[action] : "Xác nhận"}?</DialogTitle>
            <DialogDescription>
              Hệ thống sẽ kiểm tra điều kiện của lớp trước khi cập nhật. Thao tác này không tự tạo buổi học hoặc thay đổi học phí.
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
