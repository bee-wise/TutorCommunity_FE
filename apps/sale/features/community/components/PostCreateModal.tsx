"use client";

import { useState } from "react";
import { useCommunityStore } from "../store/community-store";
import { Button } from "@workspace/ui/components/ui/button";
import {
  BookOpen,
  GraduationCap,
  MapPin,
  Video,
  DollarSign,
  ImagePlus,
  Send,
  Loader2,
} from "lucide-react";
import { TeachingMode } from "../types/community";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@workspace/ui/components/ui/dialog";
import { provinces } from "tinhthanhvn";
import { useToastStore } from "@workspace/ui/components/ui/bee-toast/useToastStore";

interface PostCreateModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PostCreateModal({ open, onOpenChange }: PostCreateModalProps) {
  const { createPost } = useCommunityStore();
  const { add } = useToastStore();

  const [content, setContent] = useState("");
  const [subject, setSubject] = useState("");
  const [gradeLevel, setGradeLevel] = useState("");
  const [teachingMode, setTeachingMode] = useState<TeachingMode>("ONLINE");
  const [budgetPerSession, setBudgetPerSession] = useState("");
  const [city, setCity] = useState("");

  const provinceList = provinces.all(); // usually returns an array of { code, name, ... }

  const handleSubmit = () => {
    // Only content and subject are strictly required. Others are optional or have defaults.
    if (!content.trim() || !subject) return;

    createPost({
      content,
      imageUrls: [],
      subject,
      gradeLevel: gradeLevel || "Khác",
      teachingMode,
      budgetPerSession: budgetPerSession ? parseInt(budgetPerSession) : 0,
      city: city || undefined,
    });

    add({
      title: "Đăng bài thành công",
      description: "Bài đăng của bạn đã được xuất bản.",
      variant: "success",
    });

    // Reset
    setContent("");
    setSubject("");
    setGradeLevel("");
    setBudgetPerSession("");
    setCity("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-xl text-[#280f91]">
            Tạo bài đăng tìm gia sư
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div>
            <textarea
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-slate-700 placeholder:text-slate-500 focus:ring-2 focus:ring-primary/20 outline-none resize-none"
              placeholder="Bạn cần tìm gia sư môn gì, mục tiêu học tập ra sao? *"
              rows={4}
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Môn học */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <BookOpen className="w-4 h-4" />
              </div>
              <select
                className="pl-10 flex h-10 w-full items-center justify-between rounded-md border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm outline-none focus:border-primary"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
              >
                <option value="" disabled>
                  Môn học *
                </option>
                <option value="Toán">Toán</option>
                <option value="Tiếng Anh">Tiếng Anh</option>
                <option value="Vật lý">Vật lý</option>
                <option value="Hóa học">Hóa học</option>
                <option value="Ngữ Văn">Ngữ Văn</option>
              </select>
            </div>

            {/* Lớp học */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <GraduationCap className="w-4 h-4" />
              </div>
              <select
                className="pl-10 flex h-10 w-full items-center justify-between rounded-md border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm outline-none focus:border-primary"
                value={gradeLevel}
                onChange={(e) => setGradeLevel(e.target.value)}
              >
                <option value="" disabled>
                  Lớp học (Tùy chọn)
                </option>
                <option value="12">Lớp 12</option>
                <option value="11">Lớp 11</option>
                <option value="10">Lớp 10</option>
                <option value="9">Lớp 9</option>
                <option value="Khác">Khác</option>
              </select>
            </div>

            {/* Hình thức */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Video className="w-4 h-4" />
              </div>
              <select
                className="pl-10 flex h-10 w-full items-center justify-between rounded-md border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm outline-none focus:border-primary"
                value={teachingMode}
                onChange={(e) =>
                  setTeachingMode(e.target.value as TeachingMode)
                }
              >
                <option value="ONLINE">Online</option>
                <option value="OFFLINE">Offline (Tại nhà)</option>
                <option value="HYBRID">Linh hoạt</option>
              </select>
            </div>

            {/* Ngân sách */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <DollarSign className="w-4 h-4" />
              </div>
              <input
                type="number"
                placeholder="Ngân sách/buổi (Tùy chọn)"
                className="pl-10 flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm outline-none focus:border-primary"
                value={budgetPerSession}
                onChange={(e) => setBudgetPerSession(e.target.value)}
              />
            </div>

            {/* Tỉnh/Thành phố */}
            <div className="relative md:col-span-2">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <MapPin className="w-4 h-4" />
              </div>
              <select
                className="pl-10 flex h-10 w-full items-center justify-between rounded-md border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm outline-none focus:border-primary"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                disabled={teachingMode === "ONLINE"} // Option: disable if online
              >
                <option value="" disabled>
                  {teachingMode === "ONLINE"
                    ? "Không yêu cầu vị trí (Online)"
                    : "Chọn Tỉnh/Thành phố (Tùy chọn)"}
                </option>
                {provinceList.map((p: any) => (
                  <option key={p.code} value={p.name}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <DialogFooter className="flex items-center justify-between sm:justify-between">
          <Button
            variant="ghost"
            size="sm"
            className="text-slate-500 hover:text-primary"
          >
            <ImagePlus className="w-4 h-4 mr-2" />
            Thêm ảnh
          </Button>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onOpenChange(false)}
            >
              Hủy
            </Button>
            <Button
              size="sm"
              className="bg-primary text-white"
              disabled={!content.trim() || !subject}
              onClick={handleSubmit}
            >
              <Send className="w-4 h-4 mr-2" />
              Đăng bài
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
