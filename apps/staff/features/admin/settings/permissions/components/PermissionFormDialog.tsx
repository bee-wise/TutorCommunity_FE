"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@workspace/ui/components/ui/button";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@workspace/ui/components/ui/dialog";
import { Input } from "@workspace/ui/components/ui/input";
import {
  permissionFormSchema,
  type Permission,
  type PermissionFormValues,
  type PermissionPage,
} from "../schemas/permission.schema";

const flags = [
  { key: "isCreate", label: "Tạo" },
  { key: "isRead", label: "Xem" },
  { key: "isUpdate", label: "Sửa" },
  { key: "isDelete", label: "Xóa" },
] as const;

type Props = {
  permission: Permission | null;
  modules: NonNullable<PermissionPage["modules"]>;
  open: boolean;
  busy: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: PermissionFormValues) => Promise<void>;
};

export function PermissionFormDialog({ permission, modules, open, busy, onOpenChange, onSubmit }: Props) {
  const form = useForm<PermissionFormValues>({
    resolver: zodResolver(permissionFormSchema),
    defaultValues: {
      name: permission?.name ?? "",
      moduleId: permission?.moduleId ?? "",
      isCreate: permission?.isCreate ?? false,
      isRead: permission?.isRead ?? true,
      isUpdate: permission?.isUpdate ?? false,
      isDelete: permission?.isDelete ?? false,
    },
  });

  const handleOpenChange = (next: boolean) => {
    if (busy) return;
    onOpenChange(next);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-xl rounded-2xl border-border/70">
        <DialogHeader>
          <DialogTitle>{permission ? "Chỉnh sửa định nghĩa quyền" : "Tạo định nghĩa quyền"}</DialogTitle>
          <DialogDescription>Các thao tác của định nghĩa này được dùng chung cho mọi vai trò được gán.</DialogDescription>
        </DialogHeader>
        <form className="space-y-5" onSubmit={form.handleSubmit(async (values) => { try { await onSubmit(values); onOpenChange(false); } catch { /* Error toast is shown by the mutation. */ } })}>
          <div className="space-y-1.5">
            <label className="text-sm font-medium" htmlFor="permission-name">Tên quyền</label>
            <Input id="permission-name" placeholder="Ví dụ: PERMISSION_MATRIX_READ" aria-invalid={Boolean(form.formState.errors.name)} {...form.register("name")} />
            {form.formState.errors.name && <p className="text-xs text-destructive">{form.formState.errors.name.message}</p>}
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium" htmlFor="permission-module">Module</label>
            <select id="permission-module" className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary" {...form.register("moduleId")}>
              <option value="">Không thuộc module</option>
              {modules.map((module) => <option key={module.id} value={module.id}>{module.name || module.id}</option>)}
            </select>
          </div>
          <fieldset className="space-y-3">
            <legend className="text-sm font-medium">Thao tác được phép</legend>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {flags.map(({ key, label }) => (
                <label key={key} className="flex cursor-pointer items-center gap-2 rounded-lg border border-border px-3 py-2.5 text-sm hover:bg-muted/50">
                  <input type="checkbox" className="accent-primary" {...form.register(key)} />{label}
                </label>
              ))}
            </div>
          </fieldset>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={busy}>Hủy</Button>
            <Button type="submit" disabled={busy}>{busy ? "Đang lưu..." : "Lưu quyền"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
