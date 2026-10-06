import { AlertDialog } from "radix-ui";
import { actionClass, outlineActionClass } from "./materials-ui";

export function AIBackgroundWarning({
  open,
  onOpenChange,
  onConfirm,
}: {
  open: boolean;
  onOpenChange: (value: boolean) => void;
  onConfirm: () => void;
}) {
  return (
    <AlertDialog.Root open={open} onOpenChange={onOpenChange}>
      <AlertDialog.Portal>
        <AlertDialog.Overlay className="fixed inset-0 z-50 bg-foreground/60" />
        <AlertDialog.Content className="fixed top-1/2 left-1/2 z-50 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-3xl border border-border bg-card p-6 shadow-soft">
          <span className="inline-flex rounded-full bg-accent px-3 py-1 text-xs font-bold text-accent-foreground">
            AI đang xử lý
          </span>
          <AlertDialog.Title className="mt-4 text-xl font-extrabold leading-[1.25] text-primary">
            Đóng cửa sổ tạo tài liệu?
          </AlertDialog.Title>
          <AlertDialog.Description className="mt-3 text-sm leading-relaxed text-muted-foreground">
            Tác vụ AI vẫn tiếp tục chạy nền. Kết quả sẽ được lưu thành bản nháp
            và bạn có thể mở lại tại lớp này. Không tải lại hoặc đóng tab trình
            duyệt khi AI đang xử lý.
          </AlertDialog.Description>
          <div className="mt-6 flex flex-col gap-2 sm:flex-row">
            <AlertDialog.Cancel className={`${outlineActionClass} flex-1`}>
              Ở lại
            </AlertDialog.Cancel>
            <AlertDialog.Action
              className={`${actionClass} flex-1`}
              onClick={onConfirm}
            >
              Đóng, chạy nền
            </AlertDialog.Action>
          </div>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  );
}
