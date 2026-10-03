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
  programFormSchema,
  getProgramTypeLabel,
  teachingItemFormSchema,
  type LearningCatalogItem,
  type ProgramFormValues,
  type TeachingItemFormValues,
} from "../schemas/learning-program.schema";

export const fieldClass =
  "h-11 w-full rounded-xl border border-input bg-background px-3 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/15 disabled:opacity-60";

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="grid gap-1.5 text-sm font-semibold text-foreground">
      <span>{label}</span>
      {children}
      {error ? (
        <span className="text-xs font-medium text-destructive">{error}</span>
      ) : null}
    </label>
  );
}

export function ProgramDialog({
  open,
  item,
  busy,
  availableTypes,
  allTypes,
  typesPending,
  typesError,
  onRetryTypes,
  onOpenChange,
  onSave,
}: {
  open: boolean;
  item: LearningCatalogItem | null;
  busy: boolean;
  availableTypes: LearningCatalogItem[];
  allTypes: LearningCatalogItem[];
  typesPending: boolean;
  typesError: boolean;
  onRetryTypes: () => void;
  onOpenChange: (open: boolean) => void;
  onSave: (values: ProgramFormValues) => Promise<unknown>;
}) {
  const form = useForm<ProgramFormValues>({
    resolver: zodResolver(programFormSchema),
    defaultValues: { code: "", name: "", type: "" },
  });
  const { reset } = form;
  useEffect(() => {
    if (!open) return;
    const type = item?.type || "";
    reset({ code: item?.code ?? "", name: item?.name ?? "", type });
  }, [open, item, reset]);
  const existingTypeIsInactive = Boolean(
    item?.type && !availableTypes.some((type) => type.code === item.type),
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {item ? "Chỉnh sửa chương trình" : "Tạo chương trình học"}
          </DialogTitle>
          <DialogDescription>
            Chương trình là nhóm nội dung mà gia sư sẽ chọn khi tạo tổ hợp dạy.
          </DialogDescription>
        </DialogHeader>
        <form
          className="space-y-4"
          onSubmit={form.handleSubmit(async (values) => {
            if (values.type !== item?.type && !availableTypes.some((type) => type.code === values.type)) {
              form.setError("type", { message: "Chọn loại chương trình đang hoạt động." });
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
            label="Mã chương trình"
            error={form.formState.errors.code?.message}
          >
            <input
              {...form.register("code")}
              className={fieldClass}
              placeholder="VD: GDPT_VN"
            />
          </Field>
          <Field
            label="Tên chương trình"
            error={form.formState.errors.name?.message}
          >
            <input
              {...form.register("name")}
              className={fieldClass}
              placeholder="VD: Giáo dục phổ thông Việt Nam"
            />
          </Field>
          <Field
            label="Loại chương trình"
            error={form.formState.errors.type?.message}
          >
            <select {...form.register("type")} className={fieldClass} disabled={typesPending || typesError}>
              <option value="" disabled>Chọn loại chương trình</option>
              {existingTypeIsInactive ? (
                <option value={item?.type ?? ""}>
                  {getProgramTypeLabel(item?.type, allTypes)} (đã ngừng hoạt động)
                </option>
              ) : null}
              {availableTypes.map((type) => (
                <option key={type.id} value={type.code ?? ""}>
                  {type.name || type.code}
                </option>
              ))}
            </select>
          </Field>
          {typesPending ? <p className="text-xs text-muted-foreground">Đang tải loại chương trình...</p> : typesError ? <p className="text-xs text-destructive">Không tải được loại chương trình. <button type="button" className="underline" onClick={onRetryTypes}>Thử lại</button></p> : !availableTypes.length ? <p className="text-xs text-amber-800">Chưa có loại chương trình đang hoạt động. Hãy tạo trong tab Loại chương trình trước.</p> : null}
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
              disabled={busy || form.formState.isSubmitting || typesPending || typesError || (!availableTypes.length && !item?.type)}
            >
              {busy
                ? "Đang lưu..."
                : item
                  ? "Lưu thay đổi"
                  : "Tạo chương trình"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export function TeachingItemDialog({
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
  onSave: (values: TeachingItemFormValues) => Promise<unknown>;
}) {
  const form = useForm<TeachingItemFormValues>({
    resolver: zodResolver(teachingItemFormSchema),
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
          <DialogTitle>
            {item ? "Chỉnh sửa nội dung dạy" : "Tạo nội dung dạy"}
          </DialogTitle>
          <DialogDescription>
            Nội dung dạy có thể được đưa vào nhiều chương trình thông qua các tổ
            hợp.
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
            label="Mã nội dung"
            error={form.formState.errors.code?.message}
          >
            <input
              {...form.register("code")}
              className={fieldClass}
              placeholder="VD: TOAN"
            />
          </Field>
          <Field
            label="Tên nội dung dạy"
            error={form.formState.errors.name?.message}
          >
            <input
              {...form.register("name")}
              className={fieldClass}
              placeholder="VD: Toán"
            />
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
              {busy ? "Đang lưu..." : item ? "Lưu thay đổi" : "Tạo nội dung"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export { Field };
