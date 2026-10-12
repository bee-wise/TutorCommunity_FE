import { Button } from "@workspace/ui/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@workspace/ui/components/ui/dialog";
import { actionClass } from "./InterviewUi";

export function InterviewActivationDialog({
  kind,
  version,
  pending,
  onClose,
  onConfirm,
}: {
  kind: "policy" | "rubric";
  version: string;
  pending: boolean;
  onClose: () => void;
  onConfirm: () => void;
}) {
  return (
    <Dialog
      open={Boolean(version)}
      onOpenChange={(open) => {
        if (!open && !pending) onClose();
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Áp dụng {kind === "policy" ? "quy định" : "rubric"} {version}?
          </DialogTitle>
          <DialogDescription>
            {kind === "policy"
              ? "Gia sư cần đọc và xác nhận bản mới trước lượt phỏng vấn tiếp theo."
              : "Chỉ các buổi phỏng vấn mới dùng bộ câu hỏi này. Buổi đang làm hoặc đã chấm giữ nguyên phiên bản cũ."}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="outline"
            className={actionClass}
            disabled={pending}
            onClick={onClose}
          >
            Hủy
          </Button>
          <Button
            className={actionClass}
            disabled={pending}
            onClick={onConfirm}
          >
            {pending ? "Đang áp dụng…" : "Xác nhận áp dụng"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
