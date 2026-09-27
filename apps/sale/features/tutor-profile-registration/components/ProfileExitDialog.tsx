"use client";

import { Button } from "@workspace/ui/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@workspace/ui/components/ui/dialog";

export function ProfileExitDialog({ open, isSaving, onCancel, onSaveAndLeave }: { open: boolean; isSaving: boolean; onCancel: () => void; onSaveAndLeave: () => void }) {
  return (
    <Dialog open={open} onOpenChange={(nextOpen) => { if (!nextOpen && !isSaving) onCancel(); }}>
      <DialogContent className="rounded-2xl border-slate-200 sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Rời trang và lưu bản nháp?</DialogTitle>
          <DialogDescription>BeeWise sẽ lưu các thông tin bạn đã nhập trước khi chuyển sang trang khác.</DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2">
          <Button type="button" variant="outline" disabled={isSaving} onClick={onCancel}>Ở lại chỉnh sửa</Button>
          <Button type="button" disabled={isSaving} onClick={onSaveAndLeave} className="bg-[#280f91] text-white hover:bg-[#1f0b70]">{isSaving ? "Đang lưu..." : "Lưu nháp và rời trang"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
