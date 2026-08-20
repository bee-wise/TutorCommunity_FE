"use client";

import { useState } from "react";
import { useCommunityStore } from "../store/community-store";
import { Avatar, AvatarFallback, AvatarImage } from "@workspace/ui/components/ui/avatar";
import { AlertCircle } from "lucide-react";
import { Button } from "@workspace/ui/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@workspace/ui/components/ui/dialog";
import { PostCreateModal } from "./PostCreateModal";

export function PostCreateBox() {
  const { currentUser } = useCommunityStore();
  const [showActiveSessionWarning, setShowActiveSessionWarning] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (currentUser.role !== "LEARNER") {
    return null; // Only Learner can see this box
  }

  const handleFocus = () => {
    if (currentUser.hasActiveLearnerClass) {
      setShowActiveSessionWarning(true);
    } else {
      setIsModalOpen(true);
    }
  };

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 mb-6">
        <div className="flex gap-4 items-center">
          <Avatar className="w-10 h-10 border border-slate-100">
            <AvatarImage src={currentUser.avatarUrl || ""} />
            <AvatarFallback>{currentUser.displayName?.charAt(0) || "U"}</AvatarFallback>
          </Avatar>
          <div className="flex-1 cursor-text" onClick={handleFocus}>
            <div className="w-full bg-slate-50 border border-slate-100 rounded-full px-4 py-2.5 text-slate-500 hover:bg-slate-100 transition-colors">
              Bạn cần tìm gia sư môn gì, mục tiêu học tập ra sao?
            </div>
          </div>
        </div>
      </div>

      <Dialog open={showActiveSessionWarning} onOpenChange={setShowActiveSessionWarning}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-red-100 p-2 rounded-full">
                <AlertCircle className="w-6 h-6 text-red-600" />
              </div>
              <DialogTitle className="text-red-700">Không thể đăng bài mới</DialogTitle>
            </div>
            <DialogDescription className="text-base text-slate-700">
              Bạn đang có 1 phiên kết nối học tập chưa hoàn tất. Vui lòng xử lý phiên chat hiện tại hoặc hoàn thành lớp học trước khi tạo bài đăng mới.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-end mt-4">
            <Button
              type="button"
              variant="default"
              className="bg-slate-800 hover:bg-slate-700 text-white"
              onClick={() => setShowActiveSessionWarning(false)}
            >
              Đã hiểu
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <PostCreateModal open={isModalOpen} onOpenChange={setIsModalOpen} />
    </>
  );
}
