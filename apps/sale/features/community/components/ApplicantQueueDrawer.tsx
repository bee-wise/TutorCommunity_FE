"use client";

import { CommunityPost, TutorApplication } from "../types/community";
import { useCommunityStore } from "../store/community-store";
import { useToastStore } from "@workspace/ui/components/ui/bee-toast/useToastStore";
import { Button } from "@workspace/ui/components/ui/button";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@workspace/ui/components/ui/avatar";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@workspace/ui/components/ui/sheet";
import { CheckCircle2, Clock, DollarSign, Quote } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";
import { ApplicationCard } from "./ApplicationCard";

interface ApplicantQueueDrawerProps {
  post: CommunityPost;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ApplicantQueueDrawer({
  post,
  open,
  onOpenChange,
}: ApplicantQueueDrawerProps) {
  const { acceptApplication } = useCommunityStore();
  const { add } = useToastStore();

  const handleAccept = (applicationId: string) => {
    acceptApplication(post.id, applicationId);
    add({
      title: "Đã kết nối thành công!",
      description:
        "Đang chuyển hướng vào Phòng Chat 3 bên (Học viên - Gia sư - Cố vấn)...",
      variant: "success",
    });
    onOpenChange(false);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-md overflow-y-auto">
        <SheetHeader className="mb-6">
          <SheetTitle>Danh sách hồ sơ ({post.applications.length})</SheetTitle>
          <SheetDescription>
            Xem hồ sơ các gia sư đã ứng tuyển và chọn người phù hợp nhất cho lớp{" "}
            <span className="font-semibold text-slate-800">{post.subject}</span>
            .
          </SheetDescription>
        </SheetHeader>

        {post.applications.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-slate-500">
            <div className="bg-slate-50 p-4 rounded-full mb-3">
              <Clock className="w-8 h-8 text-slate-400" />
            </div>
            <p className="text-sm text-center">
              Chưa có hồ sơ nào.
              <br />
              Vui lòng chờ thêm một thời gian nữa nhé!
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {post.applications.map((app: TutorApplication) => (
              <ApplicationCard
                key={app.id}
                application={app}
                post={post}
                onAccept={handleAccept}
              />
            ))}
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
