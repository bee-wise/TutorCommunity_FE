"use client";

import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@workspace/ui/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@workspace/ui/components/ui/dialog";
import {
  contextFormSchema,
  contextTypes,
  contextTypeLabels,
  mappingFormSchema,
  type ContextFormValues,
  type LearningCatalogItem,
  type MappingFormValues,
} from "../schemas/learning-program.schema";
import { Field, fieldClass } from "./CatalogDialogs";

export function ContextDialog({
  open,
  item,
  busy,
  onOpenChange,
  onSave,
}: {
  open: boolean;
  item: LearningCatalogItem | null;
  busy: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (values: ContextFormValues) => Promise<unknown>;
}) {
  const form = useForm<ContextFormValues>({
    resolver: zodResolver(contextFormSchema),
    defaultValues: { code: "", name: "", type: "GRADE" },
  });
  const { reset } = form;
  useEffect(() => {
    if (!open) return;
    reset({
      code: item?.code ?? "",
      name: item?.name ?? "",
      type: contextTypes.find((type) => type === item?.type) ?? "GRADE",
    });
  }, [open, item, reset]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {item ? "Chỉnh sửa cấp học" : "Thêm cấp học"}
          </DialogTitle>
          <DialogDescription>
            Context xác định cấp học, trình độ hoặc hướng thi được dùng trong tổ
            hợp giảng dạy.
          </DialogDescription>
        </DialogHeader>
        <form
          className="space-y-4"
          onSubmit={form.handleSubmit(async (values) => {
            try {
              await onSave(values);
              onOpenChange(false);
            } catch {
              /* Toast is handled by the mutation. */
            }
          })}
        >
          <Field
            label="Mã ngữ cảnh"
            error={form.formState.errors.code?.message}
          >
            <input
              {...form.register("code")}
              className={fieldClass}
              placeholder="VD: GRADE_8"
            />
          </Field>
          <Field
            label="Tên hiển thị"
            error={form.formState.errors.name?.message}
          >
            <input
              {...form.register("name")}
              className={fieldClass}
              placeholder="VD: Lớp 8"
            />
          </Field>
          <Field
            label="Loại ngữ cảnh"
            error={form.formState.errors.type?.message}
          >
            <select {...form.register("type")} className={fieldClass}>
              {contextTypes.map((type) => (
                <option key={type} value={type}>
                  {contextTypeLabels[type]}
                </option>
              ))}
            </select>
          </Field>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Hủy
            </Button>
            <Button
              type="submit"
              disabled={busy || form.formState.isSubmitting}
            >
              {busy ? "Đang lưu..." : item ? "Lưu thay đổi" : "Thêm ngữ cảnh"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export function MappingDialog({
  open,
  item,
  teachingItems,
  contexts,
  mappings,
  busy,
  onOpenChange,
  onSave,
}: {
  open: boolean;
  item: LearningCatalogItem | null;
  teachingItems: LearningCatalogItem[];
  contexts: LearningCatalogItem[];
  mappings: LearningCatalogItem[];
  busy: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (values: MappingFormValues) => Promise<unknown>;
}) {
  const form = useForm<MappingFormValues>({
    resolver: zodResolver(mappingFormSchema),
    defaultValues: { teachingItemId: "", contextId: "__none__" },
  });
  const { reset } = form;
  useEffect(() => {
    if (open)
      reset({
        teachingItemId: item?.teachingItemId ?? "",
        contextId: item?.contextId ?? "__none__",
      });
  }, [open, item, reset]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {item ? "Chỉnh sửa tổ hợp" : "Thêm tổ hợp giảng dạy"}
          </DialogTitle>
          <DialogDescription>
            Liên kết một nội dung dạy với ngữ cảnh hợp lệ trong phiên bản này.
            Có thể để trống ngữ cảnh cho TOEIC và các nội dung tương tự.
          </DialogDescription>
        </DialogHeader>
        <form
          className="space-y-4"
          onSubmit={form.handleSubmit(async (values) => {
            const contextId =
              values.contextId === "__none__" ? null : values.contextId;
            if (
              mappings.some(
                (mapping) =>
                  mapping.id !== item?.id &&
                  mapping.teachingItemId === values.teachingItemId &&
                  mapping.contextId === contextId,
              )
            ) {
              form.setError("contextId", {
                message: "Tổ hợp này đã có trong phiên bản.",
              });
              return;
            }
            try {
              await onSave(values);
              onOpenChange(false);
            } catch {
              /* Toast is handled by the mutation. */
            }
          })}
        >
          <Field
            label="Môn / nội dung dạy"
            error={form.formState.errors.teachingItemId?.message}
          >
            <select {...form.register("teachingItemId")} className={fieldClass}>
              <option value="">Chọn nội dung dạy</option>
              {teachingItems.map((teachingItem) => (
                <option key={teachingItem.id} value={teachingItem.id}>
                  {teachingItem.name || teachingItem.code || teachingItem.id}
                </option>
              ))}
            </select>
          </Field>
          <Field
            label="Cấp học"
            error={form.formState.errors.contextId?.message}
          >
            <select {...form.register("contextId")} className={fieldClass}>
              <option value="__none__">Không áp dụng cấp học</option>
              {contexts.map((context) => (
                <option key={context.id} value={context.id}>
                  {context.name || context.code || context.id}
                </option>
              ))}
            </select>
          </Field>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Hủy
            </Button>
            <Button
              type="submit"
              disabled={
                busy || form.formState.isSubmitting || !teachingItems.length
              }
            >
              {busy ? "Đang lưu..." : item ? "Lưu thay đổi" : "Thêm tổ hợp"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export function ConfirmActionDialog({
  open,
  title,
  description,
  actionLabel,
  busy,
  onOpenChange,
  onConfirm,
}: {
  open: boolean;
  title: string;
  description: string;
  actionLabel: string;
  busy: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => Promise<unknown>;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Hủy
          </Button>
          <Button
            type="button"
            disabled={busy}
            onClick={async () => {
              try {
                await onConfirm();
                onOpenChange(false);
              } catch {
                /* Toast is handled by the mutation. */
              }
            }}
          >
            {busy ? "Đang xử lý..." : actionLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
