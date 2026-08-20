"use client";

import { useState } from "react";
import { CommunityPost } from "../types/community";
import { useCommunityStore } from "../store/community-store";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@workspace/ui/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@workspace/ui/components/ui/dropdown-menu";
import { Button } from "@workspace/ui/components/ui/button";
import {
  BookOpen,
  GraduationCap,
  MapPin,
  Video,
  Users,
  CheckCircle2,
  MoreVertical,
  Edit,
  Trash2,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";
import { TutorApplyModal } from "./TutorApplyModal";
import { ApplicantQueueDrawer } from "./ApplicantQueueDrawer";
import { PostEditModal } from "./PostEditModal";
import { useToastStore } from "@workspace/ui/components/ui/bee-toast/useToastStore";

interface PostCardProps {
  post: CommunityPost;
}

export function PostCard({ post }: PostCardProps) {
  const { currentUser, deletePost } = useCommunityStore();
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [isQueueDrawerOpen, setIsQueueDrawerOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const { add } = useToastStore();

  const isAuthor = currentUser.id === post.author.id;
  const isTutor = currentUser.role === "TUTOR";
  const isGuest = currentUser.role === "GUEST";

  const hasApplied = post.applications.some(
    (app) => app.tutor.id === currentUser.id,
  );

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const handleActionClick = () => {
    if (isGuest) {
      add({
        title: "Yêu cầu đăng nhập",
        description: "Vui lòng đăng nhập để thực hiện chức năng này.",
        variant: "warning",
      });
      return;
    }

    if (isTutor) {
      setIsApplyModalOpen(true);
    } else if (isAuthor) {
      setIsQueueDrawerOpen(true);
    }
  };

  const handleDelete = () => {
    if (window.confirm("Bạn có chắc chắn muốn xóa bài đăng này?")) {
      deletePost(post.id);
      add({
        title: "Đã xóa",
        description: "Bài đăng đã được xóa thành công.",
        variant: "success",
      });
    }
  };

  const renderStatusBadge = () => {
    switch (post.status) {
      case "OPEN":
        return (
          <span className="bg-emerald-100 text-emerald-700 text-xs px-2.5 py-0.5 rounded-full font-medium border border-emerald-200">
            Đang tìm gia sư
          </span>
        );
      case "IN_SESSION":
        return (
          <span className="bg-amber-100 text-amber-700 text-xs px-2.5 py-0.5 rounded-full font-medium border border-amber-200">
            Đã kết nối
          </span>
        );
      case "CLOSED":
        return (
          <span className="bg-slate-100 text-slate-700 text-xs px-2.5 py-0.5 rounded-full font-medium border border-slate-200">
            Đã đóng
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 mb-4 hover:shadow-md transition-shadow">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <Avatar className="w-10 h-10 border border-slate-100">
              <AvatarImage src={post.author.avatarUrl || ""} />
              <AvatarFallback>
                {post.author.displayName?.charAt(0) || "U"}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="font-semibold text-slate-800 text-sm">
                {post.author.displayName}
              </div>
              <div className="text-xs text-slate-500 flex items-center gap-1.5">
                <span>
                  {formatDistanceToNow(new Date(post.createdAt), {
                    addSuffix: true,
                    locale: vi,
                  })}
                </span>
                {post.city && post.teachingMode !== "ONLINE" && (
                  <>
                    <span className="w-1 h-1 rounded-full bg-slate-300" />
                    <span className="flex items-center gap-0.5">
                      <MapPin className="w-3 h-3" />
                      {post.city}
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1">
            {renderStatusBadge()}
            {isAuthor && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-slate-500 hover:text-slate-800"
                  >
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setIsEditModalOpen(true)}>
                    <Edit className="w-4 h-4 mr-2" />
                    Sửa bài đăng
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={handleDelete}
                    className="text-red-600 focus:text-red-600"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Xóa bài đăng
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="mb-4 text-slate-700 text-sm leading-relaxed whitespace-pre-wrap">
          {post.content}
        </div>

        {/* Images if any */}
        {post.imageUrls && post.imageUrls.length > 0 && (
          <div
            className={`grid gap-2 mb-4 ${post.imageUrls.length > 1 ? "grid-cols-2" : "grid-cols-1"}`}
          >
            {post.imageUrls.map((url, index) => (
              <img
                key={index}
                src={url}
                alt="Post image"
                className="rounded-lg object-cover max-h-60 w-full border border-slate-100"
              />
            ))}
          </div>
        )}

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-6">
          <div className="flex items-center gap-1.5 bg-slate-50 text-slate-600 text-xs px-2.5 py-1 rounded-md border border-slate-200">
            <BookOpen className="w-3.5 h-3.5" /> {post.subject}
          </div>
          <div className="flex items-center gap-1.5 bg-slate-50 text-slate-600 text-xs px-2.5 py-1 rounded-md border border-slate-200">
            <GraduationCap className="w-3.5 h-3.5" /> Lớp {post.gradeLevel}
          </div>
          <div className="flex items-center gap-1.5 bg-slate-50 text-slate-600 text-xs px-2.5 py-1 rounded-md border border-slate-200">
            {post.teachingMode === "ONLINE" ? (
              <Video className="w-3.5 h-3.5" />
            ) : (
              <MapPin className="w-3.5 h-3.5" />
            )}
            {post.teachingMode === "ONLINE"
              ? "Online"
              : post.teachingMode === "HYBRID"
                ? "Linh hoạt"
                : "Tại nhà"}
          </div>
          {(post.district || post.city) && post.teachingMode !== "ONLINE" && (
            <div className="flex items-center gap-1.5 bg-slate-50 text-slate-600 text-xs px-2.5 py-1 rounded-md border border-slate-200">
              <MapPin className="w-3.5 h-3.5" /> {post.district}
              {post.district && post.city ? ", " : ""}
              {post.city}
            </div>
          )}
          <div className="flex items-center gap-1.5 bg-amber-50 text-amber-700 text-xs px-2.5 py-1 rounded-md border border-amber-200 font-medium">
            {formatCurrency(post.budgetPerSession)}/buổi
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <Users className="w-4 h-4" />
            <span>{post.applicationsCount} hồ sơ đã gửi</span>
          </div>

          <div>
            {isAuthor && (
              <Button
                variant="outline"
                size="sm"
                className="border-primary text-primary hover:bg-primary/5"
                onClick={handleActionClick}
              >
                Xem danh sách hồ sơ ứng tuyển ({post.applicationsCount})
              </Button>
            )}

            {!isAuthor && (isTutor || isGuest) && (
              <Button
                size="sm"
                className="bg-[#ffc500] hover:bg-[#e6b200] text-slate-900 font-semibold"
                disabled={post.status !== "OPEN" || hasApplied}
                onClick={handleActionClick}
              >
                {hasApplied ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    Đã ứng tuyển
                  </>
                ) : post.status !== "OPEN" ? (
                  "Đã đóng / Đã kết nối"
                ) : (
                  "Gửi hồ sơ kết nối"
                )}
              </Button>
            )}
          </div>
        </div>
      </div>

      <TutorApplyModal
        post={post}
        open={isApplyModalOpen}
        onOpenChange={setIsApplyModalOpen}
      />
      <ApplicantQueueDrawer
        post={post}
        open={isQueueDrawerOpen}
        onOpenChange={setIsQueueDrawerOpen}
      />
      <PostEditModal
        post={post}
        open={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
      />
    </>
  );
}
