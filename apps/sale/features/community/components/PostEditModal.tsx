"use client";

import { useState } from "react";
import { CommunityPost } from "../types/community";
import { useCommunityStore } from "../store/community-store";
import { useToastStore } from "@workspace/ui/components/ui/bee-toast/useToastStore";
import { Button } from "@workspace/ui/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@workspace/ui/components/ui/dialog";
import { Input } from "@workspace/ui/components/ui/input";

interface PostEditModalProps {
  post: CommunityPost;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PostEditModal({ post, open, onOpenChange }: PostEditModalProps) {
  const { updatePost } = useCommunityStore();
  const { add } = useToastStore();

  const [subject, setSubject] = useState(post.subject);
  const [content, setContent] = useState(post.content);
  const [budgetPerSession, setBudgetPerSession] = useState(post.budgetPerSession.toString());

  const handleUpdate = () => {
    if (!subject.trim() || !content.trim() || !budgetPerSession) return;

    updatePost(post.id, {
      subject,
      content,
      budgetPerSession: parseInt(budgetPerSession),
    });

    add({
      title: "Cập nhật thành công",
      description: "Bài đăng của bạn đã được cập nhật.",
      variant: "success",
    });

    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Sửa bài đăng</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Tiêu đề / Môn học</label>
            <Input
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="VD: Tìm gia sư Toán 12"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Nội dung chi tiết</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Mô tả yêu cầu chi tiết..."
              className="flex min-h-[120px] w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Ngân sách (VNĐ / buổi)</label>
            <Input
              type="number"
              value={budgetPerSession}
              onChange={(e) => setBudgetPerSession(e.target.value)}
              placeholder="VD: 200000"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Hủy
          </Button>
          <Button onClick={handleUpdate} className="bg-primary text-white">
            Lưu thay đổi
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
