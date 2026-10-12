"use client";

import { Button } from "@workspace/ui/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@workspace/ui/components/ui/dialog";

export function ProfileExitDialog({ open, isSaving, discardChanges = false, onCancel, onSaveAndLeave }: { open: boolean; isSaving: boolean; discardChanges?: boolean; onCancel: () => void; onSaveAndLeave: () => void }) {
  return (
    <Dialog open={open} onOpenChange={(nextOpen) => { if (!nextOpen && !isSaving) onCancel(); }}>
      <DialogContent className="rounded-2xl border-border sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{discardChanges ? "Rời trang và bỏ thay đổi?" : "Rời trang và lưu bản nháp?"}</DialogTitle>
          <DialogDescription>{discardChanges ? "Các chỉnh sửa chưa gửi xét duyệt sẽ không được lưu." : "BeeWise sẽ lưu các thông tin bạn đã nhập trước khi chuyển sang trang khác."}</DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2">
          <Button type="button" variant="outline" disabled={isSaving} onClick={onCancel} className="rounded-xl transition-all active:scale-[0.98]">Ở lại chỉnh sửa</Button>
          <Button type="button" disabled={isSaving} onClick={onSaveAndLeave} className="rounded-xl bg-primary text-primary-foreground transition-all hover:bg-primary/90 active:scale-[0.98]">{isSaving ? (discardChanges ? "Đang chuyển..." : "Đang lưu...") : discardChanges ? "Bỏ thay đổi và rời trang" : "Lưu nháp và rời trang"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
