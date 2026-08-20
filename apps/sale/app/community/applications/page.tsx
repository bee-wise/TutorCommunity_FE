"use client";

import { useCommunityStore } from "../../../features/community/store/community-store";
import { ApplicationCard } from "../../../features/community/components/ApplicationCard";
import { EmptyState } from "@workspace/ui/components/ui/empty-state";
import Link from "next/link";
import { Button } from "@workspace/ui/components/ui/button";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Inbox, Briefcase } from "lucide-react";
import { useToastStore } from "@workspace/ui/components/ui/bee-toast/useToastStore";

export default function ApplicationsPage() {
  const { posts, currentUser, acceptApplication } = useCommunityStore();
  const { add } = useToastStore();
  const router = useRouter();

  // If GUEST, redirect back
  useEffect(() => {
    if (currentUser.role === "GUEST") {
      router.push("/community");
    }
  }, [currentUser.role, router]);

  if (currentUser.role === "GUEST") {
    return null;
  }

  const isLearner = currentUser.role === "LEARNER";

  // Prepare list of { application, post }
  const displayApplications: { application: any; post: any }[] = [];

  if (isLearner) {
    posts.forEach((post) => {
      if (post.author.id === currentUser.id && post.applications.length > 0) {
        post.applications.forEach((app) => {
          displayApplications.push({ application: app, post });
        });
      }
    });
    // Sort applications by newest first (descending)
    displayApplications.sort(
      (a, b) =>
        new Date(b.application.createdAt).getTime() -
        new Date(a.application.createdAt).getTime(),
    );
  } else {
    posts.forEach((post) => {
      const myApp = post.applications.find(
        (app) => app.tutor.id === currentUser.id,
      );
      if (myApp) {
        displayApplications.push({ application: myApp, post });
      }
    });
    // Sort applications by newest first
    displayApplications.sort(
      (a, b) =>
        new Date(b.application.createdAt).getTime() -
        new Date(a.application.createdAt).getTime(),
    );
  }

  const handleAccept = (applicationId: string, postId: string) => {
    acceptApplication(postId, applicationId);
    add({
      title: "Đã kết nối thành công!",
      description:
        "Đang chuyển hướng vào Phòng Chat 3 bên (Học viên - Gia sư - Cố vấn)...",
      variant: "success",
    });
  };

  return (
    <main className="max-w-3xl mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#280f91] flex items-center gap-2">
          {isLearner ? (
            <>
              <Inbox className="w-6 h-6 text-accent" />
              Gia sư yêu cầu kết nối
            </>
          ) : (
            <>
              <Briefcase className="w-6 h-6 text-accent" />
              Hồ sơ đã gửi
            </>
          )}
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          {isLearner
            ? "Danh sách các hồ sơ gia sư đã gửi đến bài đăng của bạn."
            : "Theo dõi trạng thái các hồ sơ bạn đã gửi đến học viên."}
        </p>
      </div>

      <div className="space-y-4">
        {displayApplications.length === 0 ? (
          <EmptyState
            title={
              isLearner
                ? "Chưa có gia sư nào ứng tuyển"
                : "Bạn chưa ứng tuyển lớp nào"
            }
            description={
              isLearner
                ? "Các gia sư đang xem xét bài đăng của bạn. Vui lòng chờ thêm một chút nhé!"
                : "Hãy quay lại Trang chủ để tìm kiếm các lớp học phù hợp với chuyên môn của bạn."
            }
            action={
              <Link href="/community">
                <Button>Quay lại Trang chủ</Button>
              </Link>
            }
          />
        ) : (
          displayApplications.map(({ application, post }) => (
            <ApplicationCard
              key={application.id}
              application={application}
              post={post}
              showPostInfo={true}
              onAccept={
                isLearner ? (appId) => handleAccept(appId, post.id) : undefined
              }
            />
          ))
        )}
      </div>
    </main>
  );
}
