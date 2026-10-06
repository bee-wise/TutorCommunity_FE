import { AlertDialog } from "radix-ui";
import { actionClass, outlineActionClass } from "./materials-ui";

export function MaterialConfirmDialog({ open, onOpenChange, title, description, onConfirm }: {
  open: boolean; onOpenChange: (value: boolean) => void; title: string; description: string; onConfirm: () => void;
}) {
  return <AlertDialog.Root open={open} onOpenChange={onOpenChange}><AlertDialog.Portal><AlertDialog.Overlay className="fixed inset-0 z-50 bg-foreground/60" /><AlertDialog.Content className="fixed top-1/2 left-1/2 z-50 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-3xl border border-border bg-card p-6 shadow-soft"><AlertDialog.Title className="text-xl font-extrabold leading-[1.25] text-primary">{title}</AlertDialog.Title><AlertDialog.Description className="mt-3 text-sm leading-relaxed text-muted-foreground">{description}</AlertDialog.Description><div className="mt-6 flex flex-wrap gap-2"><AlertDialog.Cancel className={outlineActionClass}>Tiếp tục chỉnh sửa</AlertDialog.Cancel><AlertDialog.Action onClick={onConfirm} className={actionClass}>Bỏ thay đổi</AlertDialog.Action></div></AlertDialog.Content></AlertDialog.Portal></AlertDialog.Root>;
}
