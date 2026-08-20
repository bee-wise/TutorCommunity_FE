"use client";

import { useCommunityStore } from "../store/community-store";
import { Search, RotateCcw, ShieldAlert } from "lucide-react";
import { Button } from "@workspace/ui/components/ui/button";
import { Input } from "@workspace/ui/components/ui/input";
import { TeachingMode } from "../types/community";

export function FilterSidebar() {
  const { filters, setFilters } = useCommunityStore();

  const handleReset = () => {
    setFilters({
      searchQuery: "",
      subject: "",
      gradeLevel: "",
      teachingMode: "ALL",
      district: "",
      minBudget: undefined,
      maxBudget: undefined,
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 space-y-6">
      <div>
        <h3 className="font-semibold text-lg text-slate-800 mb-4">Bộ lọc tìm kiếm</h3>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            placeholder="Tìm kiếm môn học, yêu cầu..."
            className="pl-9 bg-slate-50 border-slate-200"
            value={filters.searchQuery || ""}
            onChange={(e) => setFilters({ searchQuery: e.target.value })}
          />
        </div>
      </div>

      <div className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-slate-700">Môn học</label>
          <select
            className="w-full flex h-10 w-full items-center justify-between rounded-md border border-slate-200 bg-white px-3 py-2 text-sm placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            value={filters.subject || ""}
            onChange={(e) => setFilters({ subject: e.target.value })}
          >
            <option value="">Tất cả môn học</option>
            <option value="Toán">Toán</option>
            <option value="Tiếng Anh">Tiếng Anh</option>
            <option value="Vật lý">Vật lý</option>
            <option value="Hóa học">Hóa học</option>
            <option value="Ngữ Văn">Ngữ Văn</option>
            <option value="IELTS">IELTS</option>
          </select>
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium text-slate-700">Hình thức học</label>
          <select
            className="w-full flex h-10 w-full items-center justify-between rounded-md border border-slate-200 bg-white px-3 py-2 text-sm placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            value={filters.teachingMode || "ALL"}
            onChange={(e) => setFilters({ teachingMode: e.target.value as TeachingMode })}
          >
            <option value="ALL">Tất cả</option>
            <option value="ONLINE">Online</option>
            <option value="OFFLINE">Offline (Tại nhà)</option>
            <option value="HYBRID">Linh hoạt</option>
          </select>
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium text-slate-700">Ngân sách (VNĐ/buổi)</label>
          <select
            className="w-full flex h-10 w-full items-center justify-between rounded-md border border-slate-200 bg-white px-3 py-2 text-sm placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            onChange={(e) => {
              const val = e.target.value;
              if (!val) {
                setFilters({ minBudget: undefined, maxBudget: undefined });
              } else if (val === "under200") {
                setFilters({ minBudget: undefined, maxBudget: 200000 });
              } else if (val === "200-350") {
                setFilters({ minBudget: 200000, maxBudget: 350000 });
              } else if (val === "over350") {
                setFilters({ minBudget: 350000, maxBudget: undefined });
              }
            }}
          >
            <option value="">Tất cả mức giá</option>
            <option value="under200">Dưới 200,000đ</option>
            <option value="200-350">200,000đ - 350,000đ</option>
            <option value="over350">Trên 350,000đ</option>
          </select>
        </div>
      </div>

      <Button
        variant="outline"
        className="w-full text-slate-600 border-slate-200 hover:bg-slate-50"
        onClick={handleReset}
      >
        <RotateCcw className="w-4 h-4 mr-2" />
        Đặt lại bộ lọc
      </Button>

      <div className="bg-amber-50/50 border border-amber-200/60 rounded-xl p-4 mt-6">
        <div className="flex items-start gap-3">
          <div className="bg-amber-100 p-1.5 rounded-full mt-0.5">
            <ShieldAlert className="w-4 h-4 text-amber-600" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-amber-900 mb-1">Quy tắc cộng đồng</h4>
            <p className="text-xs text-amber-800/80 leading-relaxed">
              Vui lòng không chia sẻ SĐT/Zalo trong bài đăng để bảo mật thông tin. Mọi tương tác sẽ được kết nối an toàn qua nền tảng.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
