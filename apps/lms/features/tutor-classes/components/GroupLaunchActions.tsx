"use client";

import { useState } from "react";
import { MegaphoneIcon, RocketLaunchIcon } from "@heroicons/react/24/outline";
import { groupClassesService as service } from "@workspace/core/lms-classes/group.service";
import {
  useLmsClassCommand,
  useLmsClassResource,
} from "@workspace/core/lms-classes/useLmsClassResource";
import { Button } from "@workspace/ui/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@workspace/ui/components/ui/dialog";
import { toast } from "@workspace/ui/components/ui/bee-toast";
import { classButton, classOutlineButton } from "./classes-ui";

type Action = "publish" | "activate";
const labels: Record<Action, string> = {
  publish: "Công khai tuyển sinh",
  activate: "Khai giảng lớp",
};

// Next steps once a group class is approved: open recruitment, then start the class.
export function GroupLaunchActions({ classId }: { classId: string }) {
  const [action, setAction] = useState<Action | null>(null);
  const query = useLmsClassResource(classId, "group", (s) =>
    service.get(classId, s),
  );
  const command = useLmsClassCommand(
    classId,
    async (v: { action: Action; version: number }) =>
      await service[v.action](classId, v.version),
  );
  const data = query.data;
  if (!data || data.status !== "UPCOMING" || data.approvalStatus !== "APPROVED")
    return null;
  async function confirm() {
    if (!data || !action) return;
    try {
      await command.mutateAsync({ action, version: data.version });
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
  return (
    <>
      <section
        aria-label="Bước tiếp theo của lớp nhóm"
        className="flex flex-wrap items-center gap-4 rounded-3xl bg-primary p-5 text-primary-foreground shadow-soft sm:p-6"
      >
        <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-card text-primary">
          <MegaphoneIcon className="size-6" aria-hidden="true" />
        </span>
        <div className="min-w-0 flex-1 basis-64">
          <h2 className="font-lms text-lg font-extrabold leading-[1.25]">
            {data.isPublished
              ? "Lớp đang công khai tuyển sinh"
              : "Lớp của bạn đã được duyệt"}
          </h2>
          <p className="mt-1 text-sm opacity-90">
            {data.isPublished
              ? "Học viên có thể đăng ký học thử. Khai giảng lớp khi bạn đã sẵn sàng."
              : "Công khai tuyển sinh ngay nào!"}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {!data.isPublished && (
            <Button
              className={`${classButton} border-card bg-card text-primary hover:bg-muted`}
              onClick={() => setAction("publish")}
            >
              <MegaphoneIcon className="size-4" aria-hidden="true" />
              {labels.publish}
            </Button>
          )}
          <Button
            variant="outline"
            className={`${classButton} border-primary-foreground bg-primary text-primary-foreground hover:bg-primary-foreground hover:text-primary`}
            onClick={() => setAction("activate")}
          >
            <RocketLaunchIcon className="size-4" aria-hidden="true" />
            {labels.activate}
          </Button>
        </div>
      </section>
      <Dialog
        open={Boolean(action)}
        onOpenChange={(open) => {
          if (!open && !command.isPending) setAction(null);
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
    </>
  );
}
