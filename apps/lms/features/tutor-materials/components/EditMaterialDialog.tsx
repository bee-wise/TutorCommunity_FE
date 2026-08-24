"use client";

import { useState, type FormEvent } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@workspace/ui/components/ui/dialog";
import type { LibraryMaterialStatus, TutorMaterial } from "../types";

interface EditMaterialDialogProps {
  material: TutorMaterial;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (id: string, title: string, status: LibraryMaterialStatus) => void;
}

export function EditMaterialDialog({ material, open, onOpenChange, onSave }: EditMaterialDialogProps) {
  const [title, setTitle] = useState(material.title);
  const [status, setStatus] = useState<LibraryMaterialStatus>(material.status);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!title.trim()) return;
    onSave(material.id, title.trim(), status);
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[calc(100%-2rem)] max-w-md rounded-2xl border-border">
        <form onSubmit={handleSubmit}>
          <DialogHeader className="text-left">
            <DialogTitle className="text-xl font-extrabold">Chỉnh sửa tài liệu</DialogTitle>
            <DialogDescription>Cập nhật tên và trạng thái hiển thị của tài liệu.</DialogDescription>
          </DialogHeader>
          <div className="mt-5 space-y-4">
            <label className="grid gap-2">
              <span className="text-sm font-bold">Tên tài liệu</span>
              <input required value={title} onChange={(event) => setTitle(event.target.value)} className="h-11 rounded-xl border border-input px-3 text-sm outline-none focus:ring-2 focus:ring-[#280F91]/25" />
            </label>
            <label className="grid gap-2">
              <span className="text-sm font-bold">Trạng thái</span>
              <select value={status} onChange={(event) => setStatus(event.target.value as LibraryMaterialStatus)} className="h-11 rounded-xl border border-input bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-[#280F91]/25">
                <option value="draft">Bản nháp</option>
                <option value="published">Chia sẻ với học viên</option>
                <option value="hidden">Ẩn với học viên</option>
              </select>
            </label>
          </div>
          <DialogFooter className="mt-6 gap-2">
            <button type="button" onClick={() => onOpenChange(false)} className="h-10 rounded-xl border border-input px-4 text-sm font-bold hover:bg-muted">Hủy</button>
            <button type="submit" className="h-10 rounded-xl bg-[#280F91] px-5 text-sm font-bold text-white hover:bg-[#280F91]/90">Lưu thay đổi</button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
