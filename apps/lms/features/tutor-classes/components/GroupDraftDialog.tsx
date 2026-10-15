"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  groupDraftSchema,
  type GroupDto,
  type GroupDraft,
} from "@workspace/core/lms-classes/group.schemas";
import { groupClassesService as service } from "@workspace/core/lms-classes/group.service";
import { useLmsClassCommand } from "@workspace/core/lms-classes/useLmsClassResource";
import {
  utcToVietnamInput,
  vietnamTimeToUtc,
} from "@workspace/core/lms-classes/lifecycle";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@workspace/ui/components/ui/dialog";
import { Button } from "@workspace/ui/components/ui/button";
import { DateTimePicker } from "@workspace/ui/components/ui/date-time-picker";
import { toast } from "@workspace/ui/components/ui/bee-toast";
import { ClassFilterSelect } from "./ClassFilterSelect";
import { classButton, classInput, classOutlineButton } from "./classes-ui";

function defaults(data?: GroupDto): GroupDraft {
  return {
    title: data?.title ?? "",
    description: data?.description ?? "",
    teachingOfferingId: data?.teachingOfferingId ?? "",
    teachingMode: data?.teachingMode === "OFFLINE" ? "OFFLINE" : "ONLINE",
    location: data?.location ?? "",
    openingAt: data?.openingAt ?? null,
    capacity: data?.capacity ?? 6,
    billingMode:
      data?.billingMode === "FULL_COURSE" ? "FULL_COURSE" : "MONTHLY",
    sessionDurationMinutes: data?.sessionDurationMinutes ?? 60,
    numberOfSessions: data?.numberOfSessions ?? 8,
    pricePerSession: data?.pricePerSession ?? 0,
    highlight: data?.highlight ?? "",
  };
}
export function GroupDraftDialog({
  data,
  onClose,
}: {
  data?: GroupDto;
  onClose: () => void;
}) {
  const router = useRouter();
  const [id] = useState(() => data?.id ?? crypto.randomUUID());
  const [portalContainer, setPortalContainer] = useState<HTMLElement | null>(null);
  const form = useForm<GroupDraft>({
    resolver: zodResolver(groupDraftSchema),
    defaultValues: defaults(data),
  });
  const command = useLmsClassCommand(id, (draft: GroupDraft) =>
    data
      ? service.update(id, { expectedVersion: data.version, draft })
      : service.create({ id, draft }),
  );
  const values = useWatch({ control: form.control });
  const submit = form.handleSubmit(async (draft) => {
    try {
      const result = await command.mutateAsync(draft);
      toast.success(data ? "Đã lưu thông tin lớp" : "Đã tạo lớp nhóm");
      onClose();
      if (!data) router.push(`/lms/tutor/classes/${result.id}`);
    } catch {
      toast.error("Chưa lưu được lớp", {
        description:
          "Kiểm tra mã nội dung giảng dạy đã duyệt. Nếu thông tin lớp thay đổi, tải lại trước khi chỉnh sửa.",
      });
    }
  });
  return (
    <Dialog
      open
      onOpenChange={(v) => {
        if (!v && !command.isPending) onClose();
      }}
    >
      <DialogContent ref={setPortalContainer} className="flex max-h-[90dvh] max-w-3xl flex-col overflow-hidden rounded-3xl">
        <DialogHeader>
          <DialogTitle>
            {data ? "Thông tin lớp nhóm" : "Tạo lớp nhóm"}
          </DialogTitle>
          <DialogDescription>
            Nhập mã nội dung giảng dạy đã được duyệt. Lộ trình và buổi học được thiết lập riêng.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={submit} className="flex min-h-0 flex-1 flex-col gap-4">
          <fieldset
            disabled={command.isPending}
            className="grid min-h-0 flex-1 content-start gap-4 overflow-y-auto pr-2 sm:grid-cols-2"
          >
            {(
              [
                { name: "title", label: "Tên lớp" },
                {
                  name: "teachingOfferingId",
                  label: "Mã nội dung giảng dạy đã duyệt",
                },
                { name: "location", label: "Địa điểm" },
                { name: "highlight", label: "Điểm nổi bật" },
              ] as const
            ).map((field) => (
              <label key={field.name} className="grid gap-1 text-xs font-bold">
                {field.label}
                <input className={classInput} {...form.register(field.name)} />
              </label>
            ))}
            <label className="grid gap-1 text-xs font-bold">
              Hình thức học
              <ClassFilterSelect
                value={values.teachingMode ?? "ONLINE"}
                onValueChange={(v) =>
                  form.setValue(
                    "teachingMode",
                    v === "OFFLINE" ? "OFFLINE" : "ONLINE",
                  )
                }
                options={[
                  { value: "ONLINE", label: "Trực tuyến" },
                  { value: "OFFLINE", label: "Trực tiếp" },
                ]}
              />
            </label>
            <label className="grid gap-1 text-xs font-bold">
              Cách tính phí
              <ClassFilterSelect
                value={values.billingMode ?? "MONTHLY"}
                onValueChange={(v) =>
                  form.setValue(
                    "billingMode",
                    v === "FULL_COURSE" ? "FULL_COURSE" : "MONTHLY",
                  )
                }
                options={[
                  { value: "MONTHLY", label: "Theo tháng" },
                  { value: "FULL_COURSE", label: "Cả khóa" },
                ]}
              />
            </label>
            {(
              [
                { name: "capacity", label: "Sĩ số tối đa", min: 2 },
                {
                  name: "sessionDurationMinutes",
                  label: "Phút mỗi buổi",
                  min: 1,
                },
                { name: "numberOfSessions", label: "Số buổi", min: 1 },
                {
                  name: "pricePerSession",
                  label: "Học phí mỗi buổi (VND)",
                  min: 1,
                },
              ] as const
            ).map((field) => (
              <label key={field.name} className="grid gap-1 text-xs font-bold">
                {field.label}
                <input
                  type="number"
                  min={field.min}
                  step={1}
                  className={classInput}
                  {...form.register(field.name, { valueAsNumber: true })}
                />
              </label>
            ))}
            <DateTimePicker id="group-opening-at" label="Khai giảng (giờ Việt Nam)" value={values.openingAt ? utcToVietnamInput(values.openingAt) : ""} onChange={(value) => form.setValue("openingAt", value ? vietnamTimeToUtc(value) : null, { shouldDirty: true, shouldValidate: true })} disabled={command.isPending} portalContainer={portalContainer} side="bottom" />
            <label className="grid gap-1 text-xs font-bold sm:col-span-2">
              Nội dung lớp
              <textarea
                className={`${classInput} h-24`}
                {...form.register("description")}
              />
            </label>
          </fieldset>
          {Object.entries(form.formState.errors).map(([name, error]) => (
            <p role="alert" key={name} className="text-sm text-destructive">
              {name}: {error.message}
            </p>
          ))}
          <div className="flex shrink-0 flex-wrap justify-end gap-2 border-t border-border pt-4">
            <Button
              type="button"
              variant="outline"
              className={classOutlineButton}
              disabled={command.isPending}
              onClick={onClose}
            >
              Đóng
            </Button>
            <Button className={classButton} disabled={command.isPending}>
              {command.isPending ? "Đang lưu..." : "Lưu thông tin"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
