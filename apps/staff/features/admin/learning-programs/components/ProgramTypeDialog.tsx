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
  programTypeFormSchema,
  type LearningCatalogItem,
  type ProgramTypeFormValues,
} from "../schemas/learning-program.schema";
import { Field, fieldClass } from "./CatalogDialogs";

export function ProgramTypeDialog({
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
  onSave: (values: ProgramTypeFormValues) => Promise<unknown>;
}) {
  const form = useForm<ProgramTypeFormValues>({
    resolver: zodResolver(programTypeFormSchema),
    defaultValues: { code: "", name: "" },
  });
  const { reset } = form;

  useEffect(() => {
    if (open) reset({ code: item?.code ?? "", name: item?.name ?? "" });
  }, [open, item, reset]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{item ? "Sửa loại chương trình" : "Tạo loại chương trình"}</DialogTitle>
          <DialogDescription>
            Loại chương trình xác định nhóm mà Admin có thể gán cho một chương trình học.
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
          <Field label="Mã loại" error={form.formState.errors.code?.message}>
            <input
              {...form.register("code")}
              className={fieldClass}
              placeholder="VD: VIETNAM"
              readOnly={Boolean(item)}
              aria-readonly={Boolean(item)}
            />
          </Field>
          {item ? <p className="text-xs text-muted-foreground">Mã loại không thể thay đổi sau khi tạo.</p> : null}
          <Field label="Tên hiển thị" error={form.formState.errors.name?.message}>
            <input
              {...form.register("name")}
              className={fieldClass}
              placeholder="VD: Việt Nam"
            />
          </Field>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Hủy
            </Button>
            <Button type="submit" disabled={busy || form.formState.isSubmitting}>
              {busy ? "Đang lưu..." : item ? "Lưu thay đổi" : "Tạo loại"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
