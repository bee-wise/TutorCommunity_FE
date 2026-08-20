"use client";

import { useCommunityStore } from "../store/community-store";
import { PostCard } from "./PostCard";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { EmptyState } from "@workspace/ui/components/ui/empty-state";

export function InfiniteFeedList() {
  const { posts, filters } = useCommunityStore();
  const [isLoading, setIsLoading] = useState(true);

  // Giả lập loading lần đầu
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  const filteredPosts = posts.filter(post => {
    // Lọc theo search query
    if (filters.searchQuery) {
      const q = filters.searchQuery.toLowerCase();
      const matchSearch = 
        post.content.toLowerCase().includes(q) || 
        post.subject.toLowerCase().includes(q) ||
        (post.district && post.district.toLowerCase().includes(q));
      if (!matchSearch) return false;
    }

    // Lọc theo môn học
    if (filters.subject && post.subject !== filters.subject) return false;

    // Lọc theo hình thức học
    if (filters.teachingMode && filters.teachingMode !== "ALL" && post.teachingMode !== filters.teachingMode) return false;

    // Lọc theo ngân sách
    if (filters.minBudget && post.budgetPerSession < filters.minBudget) return false;
    if (filters.maxBudget && post.budgetPerSession > filters.maxBudget) return false;

    return true;
  });

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-slate-500">
        <Loader2 className="w-8 h-8 animate-spin text-primary mb-4" />
        <p>Đang tải danh sách bài đăng...</p>
      </div>
    );
  }

  if (filteredPosts.length === 0) {
    return (
      <EmptyState
        title="Không tìm thấy kết quả"
        description="Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm để xem các bài đăng khác."
      />
    );
  }

  return (
    <div className="space-y-4 pb-20">
      {filteredPosts.map(post => (
        <PostCard key={post.id} post={post} />
      ))}

      {/* Mock Infinite Scroll Loader */}
      {filteredPosts.length > 0 && (
        <div className="py-8 text-center text-slate-500 text-sm flex items-center justify-center gap-2">
          <Loader2 className="w-4 h-4 animate-spin" />
          Đang tải thêm...
        </div>
      )}
    </div>
  );
}
