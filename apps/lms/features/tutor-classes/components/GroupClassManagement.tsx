"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { groupClassesService as service } from "@workspace/core/lms-classes/group.service";
import {
  useLmsClassResource,
  useLmsClassCommand,
} from "@workspace/core/lms-classes/useLmsClassResource";
import { ClockIcon } from "@heroicons/react/24/outline";
import { Button } from "@workspace/ui/components/ui/button";
import { DisclosureCard } from "@workspace/ui/components/ui/collapsible";
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
import { GroupApprovalHistory } from "./GroupApprovalHistory";
import { GroupRoadmapView } from "./GroupRoadmapView";
import { classButton, classOutlineButton, classPanel } from "./classes-ui";
import {
  GROUP_WIZARD_ROADMAP_STEP,
  isGroupClassEditable,
} from "../utils/group-class-draft";

const Wizard = dynamic(() =>
  import("./GroupClassWizard").then((m) => m.GroupClassWizard),
);
type Action = "submit" | "complete";
const labels = {
  submit: "Gửi BeeWise duyệt",
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
  const [editStep, setEditStep] = useState<number | null>(null),
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
    editable = isGroupClassEditable(data);
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
            {approvalLabels[data.approvalStatus ?? ""] ??
              "Chưa có trạng thái duyệt"}
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
                onClick={() => setEditStep(1)}
              >
                Sửa thông tin
              </Button>
              <Button
                variant="outline"
                className={classOutlineButton}
                onClick={() => setEditStep(GROUP_WIZARD_ROADMAP_STEP)}
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
          Công khai tuyển sinh không tự khai giảng hoặc thêm học viên. Học viên
          đã thanh toán vẫn cần tư vấn viên duyệt yêu cầu tham gia.
        </p>
        <section className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <h3 className="font-lms text-sm font-extrabold text-foreground">
              Lộ trình học tập
            </h3>
            <span className="text-xs text-muted-foreground">
              {data.roadmap.length} chặng đào tạo
            </span>
          </div>
          {data.roadmap.length ? (
            <GroupRoadmapView stages={data.roadmap} />
          ) : (
            <p className="rounded-2xl border border-dashed border-border px-4 py-3 text-sm text-muted-foreground">
              Chưa có lộ trình cho lớp này.
            </p>
          )}
        </section>
        {history.data && history.data.length > 0 ? (
          <DisclosureCard
            variant="outline"
            title="Lịch sử duyệt"
            icon={<ClockIcon className="size-5" aria-hidden="true" />}
            badge={
              <span className="rounded-full border border-border bg-card px-2.5 py-0.5 text-[11px] font-bold tabular-nums text-muted-foreground">
                {history.data.length} lần
              </span>
            }
          >
            <GroupApprovalHistory items={history.data} />
          </DisclosureCard>
        ) : (
          !history.loading &&
          !history.error && (
            <section className="space-y-2">
              <h3 className="font-lms text-sm font-extrabold text-foreground">
                Lịch sử duyệt
              </h3>
              <p className="text-sm text-muted-foreground">
                Chưa có lần xét duyệt nào.
              </p>
            </section>
          )
        )}
      </div>
      {data.status !== "COMPLETED" && (
        <GroupAdmissionsPanel
          classId={classId}
          active={data.status === "ACTIVE"}
        />
      )}
      {editStep !== null && (
        <Wizard
          mode="edit"
          initial={data}
          initialStep={editStep}
          onClose={() => setEditStep(null)}
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
            <DialogTitle>{action ? labels[action] : "Xác nhận"}?</DialogTitle>
            <DialogDescription>
              Hệ thống sẽ kiểm tra điều kiện của lớp trước khi cập nhật.
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
