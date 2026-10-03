"use client";

import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@workspace/ui/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@workspace/ui/components/ui/dialog";
import { versionFormSchema, type LearningCatalogItem, type VersionFormValues } from "../schemas/learning-program.schema";
import { Field, fieldClass } from "./CatalogDialogs";

export function VersionDialog({ open, mode, item, busy, onOpenChange, onSave }: {
  open: boolean;
  mode: "create" | "edit" | "clone";
  item: LearningCatalogItem | null;
  busy: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (values: VersionFormValues) => Promise<unknown>;
}) {
  const form = useForm<VersionFormValues>({
    resolver: zodResolver(versionFormSchema),
    defaultValues: { name: "", effectiveFrom: "" },
  });
  const { reset } = form;
  useEffect(() => {
    if (!open) return;
    reset({
      name: mode === "clone" ? `${item?.name ?? "Phiên bản"} - bản nháp` : mode === "edit" ? item?.name ?? "" : "",
      effectiveFrom: mode === "edit" ? item?.effectiveFrom?.slice(0, 10) ?? "" : "",
    });
  }, [open, mode, item, reset]);

  const title = mode === "clone" ? "Tạo bản nháp từ phiên bản" : mode === "edit" ? "Chỉnh sửa phiên bản nháp" : "Tạo phiên bản nháp";
  return <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent className="sm:max-w-lg">
      <DialogHeader>
        <DialogTitle>{title}</DialogTitle>
        <DialogDescription>{mode === "clone" ? "Sao chép context và tổ hợp hiện có để chỉnh sửa mà không ảnh hưởng phiên bản đã xuất bản." : "Phiên bản nháp có thể chỉnh sửa trước khi xuất bản."}</DialogDescription>
      </DialogHeader>
      <form className="space-y-4" onSubmit={form.handleSubmit(async (values) => {
        try { await onSave(values); onOpenChange(false); } catch { /* Toast is handled by the mutation. */ }
      })}>
        <Field label="Tên phiên bản" error={form.formState.errors.name?.message}>
          <input {...form.register("name")} className={fieldClass} placeholder="VD: Chương trình 2026" />
        </Field>
        <Field label="Ngày hiệu lực" error={form.formState.errors.effectiveFrom?.message}>
          <input {...form.register("effectiveFrom")} type="date" className={fieldClass} />
        </Field>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Hủy</Button>
          <Button type="submit" disabled={busy || form.formState.isSubmitting}>{busy ? "Đang lưu..." : mode === "clone" ? "Tạo bản nháp" : mode === "edit" ? "Lưu thay đổi" : "Tạo phiên bản"}</Button>
        </DialogFooter>
      </form>
    </DialogContent>
  </Dialog>;
}
