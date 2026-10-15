"use client";

import { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { recordingCommandSchema } from "@workspace/core/lms-classes/schemas";
import { classSessionsService as service } from "@workspace/core/lms-classes/sessions.service";
import {
  useLmsClassResource,
  useLmsClassCommand,
} from "@workspace/core/lms-classes/useLmsClassResource";
import { toast } from "@workspace/ui/components/ui/bee-toast";
import { Button } from "@workspace/ui/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@workspace/ui/components/ui/dialog";
import { ClassFilterSelect } from "./ClassFilterSelect";
import { ClassQueryErrorState } from "./ClassQueryErrorState";
import { classButton, classInput, classOutlineButton } from "./classes-ui";

export function SessionRecordingDialog({
  classId,
  sessionId,
  onClose,
}: {
  classId: string;
  sessionId: string;
  onClose: () => void;
}) {
  const data = useLmsClassResource(
    classId,
    "recording",
    (s) => service.recording(sessionId, s),
    { params: [sessionId] },
  );
  const save = useLmsClassCommand(
    classId,
    (v: z.infer<typeof recordingCommandSchema>) =>
      service.saveRecording(sessionId, v),
  );
  const form = useForm<z.infer<typeof recordingCommandSchema>>({
    resolver: zodResolver(recordingCommandSchema),
    defaultValues: { expectedVersion: 0, url: null, visibility: "PRIVATE" },
  });
  useEffect(() => {
    if (data.data && !form.formState.isDirty)
      form.reset({
        expectedVersion: data.data.version,
        url: data.data.url ?? null,
        visibility: data.data.visibility === "PUBLIC" ? "PUBLIC" : "PRIVATE",
      });
  }, [data.data, form, form.formState.isDirty]);
  const values = useWatch({ control: form.control });
  const submit = form.handleSubmit(async (v) => {
    try {
      await save.mutateAsync(v);
      toast.success("Đã lưu bản ghi");
      onClose();
    } catch {
      toast.error("Chưa lưu được bản ghi", {
        description:
          "Tải lại phiên bản khi xung đột. Kiểm tra quyền và trạng thái buổi học.",
      });
    }
  });
  return (
    <Dialog
      open
      onOpenChange={(v) => {
        if (!v && !save.isPending) onClose();
      }}
    >
      <DialogContent className="max-w-xl rounded-3xl">
        <DialogHeader>
          <DialogTitle>Bản ghi buổi học</DialogTitle>
          <DialogDescription>
            PUBLIC vẫn cần quyền thành viên và roster. Gỡ link BeeWise không xóa
            video Zoom hoặc link đã sao chép.
          </DialogDescription>
        </DialogHeader>
        {data.loading ? (
          <p role="status">Đang tải...</p>
        ) : data.error ? (
          <ClassQueryErrorState
            error={data.error}
            onRetry={() => void data.refetch()}
          />
        ) : (
          <form className="space-y-4" onSubmit={submit}>
            <label className="grid gap-2 text-sm font-bold">
              Link HTTPS
              <input
                className={classInput}
                disabled={save.isPending}
                value={values.url ?? ""}
                onChange={(e) =>
                  form.setValue("url", e.target.value || null, {
                    shouldDirty: true,
                  })
                }
              />
            </label>
            <label className="grid gap-2 text-sm font-bold">
              Quyền xem
              <ClassFilterSelect
                value={values.visibility ?? "PRIVATE"}
                disabled={save.isPending}
                onValueChange={(v) =>
                  form.setValue(
                    "visibility",
                    v === "PUBLIC" ? "PUBLIC" : "PRIVATE",
                    { shouldDirty: true },
                  )
                }
                options={[
                  { value: "PRIVATE", label: "Riêng gia sư" },
                  { value: "PUBLIC", label: "Học viên có quyền xem" },
                ]}
              />
            </label>
            {form.formState.errors.url && (
              <p role="alert" className="text-sm text-destructive">
                {form.formState.errors.url.message}
              </p>
            )}
            <div className="flex flex-wrap justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                className={classOutlineButton}
                onClick={async () => {
                  const fresh = await data.refetch();
                  if (fresh.data) form.reset({expectedVersion:fresh.data.version,url:fresh.data.url??null,visibility:fresh.data.visibility==="PUBLIC"?"PUBLIC":"PRIVATE"});
                }}
                disabled={save.isPending}
              >
                Tải lại
              </Button>
              <Button
                type="button"
                variant="outline"
                className={classOutlineButton}
                disabled={save.isPending}
                onClick={() => {
                  form.setValue("url", null);
                  void submit();
                }}
              >
                Gỡ link BeeWise
              </Button>
              <Button className={classButton} disabled={save.isPending}>
                Lưu bản ghi
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
