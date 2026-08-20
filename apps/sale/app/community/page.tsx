"use client";

import { FilterSidebar } from "../../features/community/components/FilterSidebar";
import { PostCreateBox } from "../../features/community/components/PostCreateBox";
import { InfiniteFeedList } from "../../features/community/components/InfiniteFeedList";
import { useCommunityStore } from "../../features/community/store/community-store";
import { Award, BookOpen } from "lucide-react";

export default function CommunityPage() {
  const { currentUser, posts } = useCommunityStore();
  const myPostsCount = posts.filter(
    (p) => p.author.id === currentUser.id,
  ).length;

  return (
    <main className="max-w-7xl mx-auto px-4 py-6">
      {/* Tiêu đề trang */}
      <div className="mb-6">
        <h1 className="text-2xl font-google-sans font-bold text-[#280f91]">
          Cộng đồng tìm gia sư
        </h1>
        <p className="text-slate-500 mt-1">
          Kết nối nhanh chóng với hàng ngàn gia sư chất lượng cao
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 relative">
        {/* Cột trái: Bộ lọc (Desktop) */}
        <div className="hidden lg:block lg:col-span-3">
          <div className="sticky top-20">
            <FilterSidebar />
          </div>
        </div>

        {/* Cột giữa: Feed chính */}
        <div className="lg:col-span-6">
          <PostCreateBox />

          {/* Bộ lọc trên Mobile (Có thể mở rộng thành Drawer sau, tạm thời hiện inline) */}
          <div className="lg:hidden mb-6">
            <FilterSidebar />
          </div>

          <InfiniteFeedList />
        </div>

        {/* Cột phải: Widget phụ trợ */}
        <div className="hidden lg:block lg:col-span-3">
          <div className="sticky top-20 space-y-6">
            {/* Widget: Bài đăng của tôi (Chỉ Learner mới thấy có ý nghĩa) */}
            {currentUser.role === "LEARNER" && (
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
                <h3 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-primary" />
                  Quản lý bài đăng
                </h3>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-600">Bài đăng của tôi:</span>
                  <span className="font-semibold text-primary">
                    {myPostsCount} bài
                  </span>
                </div>
                {myPostsCount > 0 && (
                  <button className="w-full mt-3 text-xs text-primary font-medium hover:underline text-left">
                    Xem tất cả bài đăng
                  </button>
                )}
              </div>
            )}

            {/* Widget: Gia sư tiêu biểu */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
              <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-500" />
                Gia sư tiêu biểu tuần
              </h3>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <img
                    src="https://i.pravatar.cc/150?u=tutor-top-1"
                    alt="Tutor"
                    className="w-10 h-10 rounded-full border border-slate-100"
                  />
                  <div>
                    <div className="text-sm font-semibold text-slate-800">
                      Trần Lê Huy
                    </div>
                    <div className="text-xs text-slate-500">
                      IELTS 8.0 • 50+ giờ dạy
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <img
                    src="https://i.pravatar.cc/150?u=tutor-top-2"
                    alt="Tutor"
                    className="w-10 h-10 rounded-full border border-slate-100"
                  />
                  <div>
                    <div className="text-sm font-semibold text-slate-800">
                      Nguyễn Mai Hoa
                    </div>
                    <div className="text-xs text-slate-500">
                      Toán LTĐH • Đánh giá 5.0
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <img
                    src="https://i.pravatar.cc/150?u=tutor-top-3"
                    alt="Tutor"
                    className="w-10 h-10 rounded-full border border-slate-100"
                  />
                  <div>
                    <div className="text-sm font-semibold text-slate-800">
                      Phạm Văn A
                    </div>
                    <div className="text-xs text-slate-500">
                      Lập trình cơ bản • 30+ hs
                    </div>
                  </div>
                </div>
              </div>

              <button className="w-full mt-4 text-sm text-center text-primary hover:text-primary/80 font-medium">
                Xem thêm
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
