"use client";

import { useState } from "react";
import { CommunityPost } from "../types/community";
import { useCommunityStore } from "../store/community-store";
import { useToastStore } from "@workspace/ui/components/ui/bee-toast/useToastStore";
import { Button } from "@workspace/ui/components/ui/button";
import { Input } from "@workspace/ui/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@workspace/ui/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@workspace/ui/components/ui/avatar";

interface TutorApplyModalProps {
  post: CommunityPost;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function TutorApplyModal({ post, open, onOpenChange }: TutorApplyModalProps) {
  const { currentUser, applyForPost } = useCommunityStore();
  const { add } = useToastStore();
  
  const [pitchNote, setPitchNote] = useState("");
  const [proposedRate, setProposedRate] = useState<string>(post.budgetPerSession.toString());
  const [availableSlots, setAvailableSlots] = useState("");

  const handleSubmit = () => {
    if (!pitchNote.trim() || !proposedRate) return;

    applyForPost(
      post.id, 
      pitchNote, 
      parseInt(proposedRate), 
      availableSlots.split(",").map(s => s.trim()).filter(Boolean)
    );

    add({
      title: "Đã gửi hồ sơ",
      description: "Hồ sơ của bạn đã được gửi đến học viên.",
      variant: "success",
    });

    onOpenChange(false);
    
    // Reset form
    setPitchNote("");
    setProposedRate(post.budgetPerSession.toString());
    setAvailableSlots("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Ứng tuyển lớp học</DialogTitle>
          <DialogDescription>
            Gửi thông tin ứng tuyển của bạn cho lớp <span className="font-semibold text-slate-800">{post.subject}</span> của học viên {post.author.displayName}.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4 space-y-4">
          <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-lg border border-slate-100">
            <Avatar className="w-12 h-12 border border-slate-200">
              <AvatarImage src={currentUser.avatarUrl || ""} />
              <AvatarFallback>{currentUser.displayName?.charAt(0) || "U"}</AvatarFallback>
            </Avatar>
            <div>
              <div className="font-semibold text-slate-800 text-sm">{currentUser.displayName}</div>
              <div className="text-xs text-slate-500">Gia sư • Đang ứng tuyển</div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Lời chào (Pitch note) <span className="text-red-500">*</span></label>
            <textarea
              className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 resize-none"
              placeholder="Giới thiệu ngắn gọn kinh nghiệm và lý do bạn phù hợp với lớp học này..."
              rows={3}
              value={pitchNote}
              onChange={(e) => setPitchNote(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Mức thù lao đề xuất (VNĐ/buổi) <span className="text-red-500">*</span></label>
            <Input
              type="number"
              placeholder="Ví dụ: 250000"
              value={proposedRate}
              onChange={(e) => setProposedRate(e.target.value)}
            />
            <p className="text-xs text-slate-500">Ngân sách của học viên: {new Intl.NumberFormat('vi-VN').format(post.budgetPerSession)}đ</p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Khung giờ rảnh (tùy chọn)</label>
            <Input
              placeholder="VD: Tối thứ 2,4,6 hoặc Sáng cuối tuần..."
              value={availableSlots}
              onChange={(e) => setAvailableSlots(e.target.value)}
            />
          </div>
        </div>

        <DialogFooter className="sm:justify-end">
          <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
            Hủy
          </Button>
          <Button 
            type="button" 
            className="bg-primary text-white"
            onClick={handleSubmit}
            disabled={!pitchNote.trim() || !proposedRate}
          >
            Gửi hồ sơ
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
