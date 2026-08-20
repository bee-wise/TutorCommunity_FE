"use client";

import { useCommunityStore } from "../../../features/community/store/community-store";
import { PostCard } from "../../../features/community/components/PostCard";
import { EmptyState } from "@workspace/ui/components/ui/empty-state";
import { PlusCircle } from "lucide-react";
import Link from "next/link";
import { Button } from "@workspace/ui/components/ui/button";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function MyPostsPage() {
  const { posts, currentUser } = useCommunityStore();
  const router = useRouter();

  // If not a learner, redirect back
  useEffect(() => {
    if (currentUser.role !== "LEARNER") {
      router.push("/community");
    }
  }, [currentUser.role, router]);

  const myPosts = posts.filter(post => post.author.id === currentUser.id);

  if (currentUser.role !== "LEARNER") {
    return null;
  }

  return (
    <main className="max-w-3xl mx-auto px-4 py-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[#280f91]">Bài đăng của tôi</h1>
        <Link href="/community">
          <Button variant="outline" size="sm">
            <PlusCircle className="w-4 h-4 mr-2" />
            Đăng bài mới
          </Button>
        </Link>
      </div>

      <div className="space-y-4">
        {myPosts.length === 0 ? (
          <EmptyState
            title="Bạn chưa có bài đăng nào"
            description="Hãy quay lại Trang chủ để tạo bài đăng tìm gia sư đầu tiên của bạn nhé!"
            action={
              <Link href="/community">
                <Button>
                  Quay lại Trang chủ
                </Button>
              </Link>
            }
          />
        ) : (
          myPosts.map(post => (
            <PostCard key={post.id} post={post} />
          ))
        )}
      </div>
    </main>
  );
}
