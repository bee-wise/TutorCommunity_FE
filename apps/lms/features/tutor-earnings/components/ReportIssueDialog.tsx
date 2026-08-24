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
import type { EarningSession } from "../types/earnings.types";

interface ReportDialogProps {
  session: EarningSession | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (title: string, description: string) => void;
}

export function ReportIssueDialog({ session, open, onOpenChange, onSubmit }: ReportDialogProps) {
  const [title, setTitle] = useState("Trạng thái quyết toán chưa chính xác");
  const [description, setDescription] = useState("");

  if (!session) return null;

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!description.trim()) return;
    onSubmit(title, description.trim());
    setDescription("");
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[calc(100%-2rem)] max-w-lg rounded-2xl border-border">
        <form onSubmit={handleSubmit}>
          <DialogHeader className="text-left">
            <DialogTitle className="text-xl font-extrabold">Báo cáo vấn đề</DialogTitle>
            <DialogDescription>
              Gửi yêu cầu hỗ trợ cho buổi {session.sessionCode}. Admin sẽ phản hồi trong danh sách đơn báo cáo.
            </DialogDescription>
          </DialogHeader>

          <div className="mt-5 space-y-4">
            <label className="grid gap-2">
              <span className="text-sm font-bold text-foreground">Vấn đề cần hỗ trợ</span>
              <select
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                className="h-11 rounded-xl border border-input bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-[#280F91]/25"
              >
                <option>Trạng thái quyết toán chưa chính xác</option>
                <option>Học phí buổi học chưa đúng</option>
                <option>Thời lượng buổi học chưa đúng</option>
                <option>Chưa nhận được khoản quyết toán</option>
              </select>
            </label>
            <label className="grid gap-2">
              <span className="text-sm font-bold text-foreground">Mô tả chi tiết</span>
              <textarea
                required
                minLength={10}
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                placeholder="Mô tả thông tin cần admin kiểm tra..."
                className="min-h-28 resize-y rounded-xl border border-input bg-white p-3 text-sm outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-[#280F91]/25"
              />
              <span className="text-xs text-muted-foreground">Tối thiểu 10 ký tự.</span>
            </label>
          </div>

          <DialogFooter className="mt-6 gap-2">
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="h-10 rounded-xl border border-input px-4 text-sm font-bold hover:bg-muted"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="h-10 rounded-xl bg-[#280F91] px-5 text-sm font-bold text-white hover:bg-[#280F91]/90"
            >
              Gửi báo cáo
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
