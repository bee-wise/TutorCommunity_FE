import { Button } from "@workspace/ui/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@workspace/ui/components/ui/dialog";

export function ReviewSubmitDialog({
  open,
  onOpenChange,
  selectedCount,
  isResubmission,
  pending,
  onSubmit,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedCount: number;
  isResubmission: boolean;
  pending: boolean;
  onSubmit: () => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-3xl border-border">
        <DialogHeader>
          <DialogTitle className="font-nunito text-xl font-extrabold">
            {selectedCount ? "Gửi yêu cầu chỉnh sửa hồ sơ?" : isResubmission ? "Duyệt các trường gửi lại?" : "Duyệt toàn bộ hồ sơ?"}
          </DialogTitle>
          <DialogDescription>
            {selectedCount
              ? `${selectedCount} mục sẽ bị từ chối. Gia sư sẽ nhận lý do để cập nhật.`
              : isResubmission
                ? "Các trường vừa gửi lại sẽ được phê duyệt; trường đã duyệt và không đổi được giữ nguyên."
                : "Hồ sơ sẽ được phê duyệt trong một lần xử lý."}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={pending}
            className="rounded-xl border-border bg-card font-bold text-foreground transition-all hover:bg-muted/40 active:scale-[0.98]"
          >
            Quay lại rà soát
          </Button>
          <Button
            type="button"
            onClick={onSubmit}
            disabled={pending}
            className="rounded-xl font-bold active:scale-[0.98]"
          >
            {pending ? "Đang gửi..." : "Xác nhận gửi"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
