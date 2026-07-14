"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { ArrowLeft, CheckCircle, XCircle, Clock, FileText, User, GraduationCap, Video, Calendar, Star } from "lucide-react";
import { mockTutors, TutorStatus } from "@/features/tutors/mocks/tutors.mock";
import { toast } from "@workspace/ui/components/ui/bee-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@workspace/ui/components/ui/dialog";

export function TutorDetail({ tutorId }: { tutorId: string }) {
  const router = useRouter();
  
  // For mock purposes, we find it from the array and store it in state so we can "update" it
  const initialTutor = mockTutors.find((t) => t.id === tutorId);
  const [tutor, setTutor] = useState(initialTutor);
  const [isRejecting, setIsRejecting] = useState(false);
  const [rejectReason, setRejectReason] = useState("");

  if (!tutor) {
    return (
      <div className="p-6 text-center">
        <h2 className="text-xl font-semibold">Không tìm thấy hồ sơ</h2>
        <Link href="/consultant/tutors" className="text-[#280f91] hover:underline mt-4 inline-block">
          Quay lại danh sách
        </Link>
      </div>
    );
  }

  const getStatusBadge = (status: TutorStatus) => {
    switch (status) {
      case "PENDING":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-semibold bg-amber-100 text-amber-800">
            <Clock className="w-4 h-4" /> Đang chờ duyệt
          </span>
        );
      case "APPROVED":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-semibold bg-emerald-100 text-emerald-800">
            <CheckCircle className="w-4 h-4" /> Đã duyệt
          </span>
        );
      case "REJECTED":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-semibold bg-red-100 text-red-800">
            <XCircle className="w-4 h-4" /> Đã từ chối
          </span>
        );
    }
  };

  const handleApprove = () => {
    if (confirm("Xác nhận duyệt hồ sơ gia sư này? Gia sư sẽ được cấp quyền truy cập LMS.")) {
      setTutor({ ...tutor, status: "APPROVED" });
      toast.success("Đã duyệt hồ sơ thành công!");
    }
  };

  const handleRejectSubmit = () => {
    if (!rejectReason.trim()) {
      toast.error("Vui lòng nhập lý do từ chối");
      return;
    }
    setTutor({ ...tutor, status: "REJECTED", rejectReason });
    setIsRejecting(false);
    toast.success("Đã từ chối hồ sơ");
  };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6 relative min-h-[calc(100vh-64px)]">
      {/* Header */}
      <div className="flex items-start justify-between border-b border-gray-200 pb-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="p-2 -ml-2 rounded-full hover:bg-gray-100 text-gray-500 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3 font-montserrat">
              Hồ sơ gia sư
              {getStatusBadge(tutor.status)}
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Nộp lúc: {format(new Date(tutor.submittedAt), "dd/MM/yyyy HH:mm", { locale: vi })}
            </p>
          </div>
        </div>

        {/* Action Buttons at Top Right */}
        {tutor.status === "PENDING" && (
          <div className="flex items-center gap-3">
            <Dialog open={isRejecting} onOpenChange={setIsRejecting}>
              <DialogTrigger asChild>
                <button className="h-10 px-4 rounded-xl bg-white border border-gray-300 text-gray-700 text-sm font-bold hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-all">
                  Từ chối
                </button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Từ chối hồ sơ gia sư</DialogTitle>
                  <DialogDescription>
                    Vui lòng cung cấp lý do từ chối. Gia sư sẽ nhận được phản hồi này để cải thiện hồ sơ.
                  </DialogDescription>
                </DialogHeader>
                <div className="py-4">
                  <textarea
                    placeholder="Nhập lý do từ chối hồ sơ này..."
                    className="w-full h-24 p-3 rounded-lg border border-gray-300 focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none text-sm resize-none"
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                    autoFocus
                  />
                </div>
                <DialogFooter>
                  <button
                    onClick={() => setIsRejecting(false)}
                    className="h-10 px-4 rounded-lg bg-gray-100 text-gray-700 text-sm font-semibold hover:bg-gray-200 transition-colors"
                  >
                    Hủy
                  </button>
                  <button
                    onClick={handleRejectSubmit}
                    className="h-10 px-4 rounded-lg bg-red-600 text-white text-sm font-semibold hover:bg-red-700 transition-colors"
                  >
                    Xác nhận từ chối
                  </button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <button
              onClick={handleApprove}
              className="h-10 px-6 rounded-xl bg-[#280f91] text-white text-sm font-bold hover:bg-[#1f0c73] shadow-md shadow-[#280f91]/20 transition-all"
            >
              Duyệt Hồ Sơ
            </button>
          </div>
        )}
      </div>

      {tutor.status === "REJECTED" && tutor.rejectReason && (
        <div className="bg-red-50 border border-red-200 p-4 rounded-xl flex gap-3 text-red-800">
          <XCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-sm">Lý do từ chối:</h3>
            <p className="text-sm mt-1">{tutor.rejectReason}</p>
          </div>
        </div>
      )}

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Personal Info */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col items-center text-center">
            <img
              src={tutor.avatar}
              alt={tutor.name}
              className="w-24 h-24 rounded-full object-cover border-4 border-gray-50 shadow-sm"
            />
            <h2 className="text-xl font-bold text-gray-900 mt-4">{tutor.name}</h2>
            <p className="text-gray-500 text-sm mt-1">{tutor.email}</p>
            <p className="text-gray-500 text-sm">{tutor.phone}</p>
            
            <div className="w-full mt-6 text-left">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                <User className="w-4 h-4" /> Giới thiệu ngắn
              </h3>
              <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg leading-relaxed">
                "{tutor.bio}"
              </p>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-[#280f91]" /> Học vấn & Bằng cấp
            </h3>
            <div className="space-y-4">
              <div>
                <p className="text-xs text-gray-500 mb-1">Trường/Đơn vị đào tạo</p>
                <p className="font-medium text-sm text-gray-900">{tutor.education.university}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Bằng cấp</p>
                  <p className="font-medium text-sm text-gray-900">{tutor.education.degree}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Năm tốt nghiệp</p>
                  <p className="font-medium text-sm text-gray-900">{tutor.education.graduationYear}</p>
                </div>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Chuyên ngành</p>
                <p className="font-medium text-sm text-gray-900">{tutor.education.major}</p>
              </div>
              
              <div className="pt-2">
                <p className="text-xs text-gray-500 mb-2">Tài liệu minh chứng</p>
                <div className="space-y-2">
                  {tutor.education.documents.map((doc, idx) => (
                    <div key={idx} className="flex items-center gap-2 p-2 rounded-lg border border-gray-200 bg-gray-50 text-sm">
                      <FileText className="w-4 h-4 text-blue-500" />
                      <span className="truncate text-blue-600 cursor-pointer hover:underline">{doc}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Preferences & Interview */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#280f91]" /> Thiết lập giảng dạy
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <p className="text-xs text-gray-500 mb-2">Môn học đăng ký</p>
                <div className="flex flex-wrap gap-2">
                  {tutor.teachingPreferences.subjects.map(s => (
                    <span key={s} className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-full border border-blue-100">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
              
              <div>
                <p className="text-xs text-gray-500 mb-2">Khối lớp/Trình độ</p>
                <div className="flex flex-wrap gap-2">
                  {tutor.teachingPreferences.grades.map(g => (
                    <span key={g} className="px-3 py-1 bg-purple-50 text-purple-700 text-xs font-medium rounded-full border border-purple-100">
                      {g}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-xs text-gray-500 mb-1">Mức lương mong muốn</p>
                <p className="font-semibold text-gray-900 text-lg">
                  {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(tutor.teachingPreferences.expectedRate)}
                  <span className="text-sm font-normal text-gray-500"> / giờ</span>
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-500 mb-1">Thời gian rảnh</p>
                <p className="font-semibold text-gray-900 text-lg">
                  {tutor.teachingPreferences.availableHours}
                  <span className="text-sm font-normal text-gray-500"> giờ / tuần</span>
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                <Video className="w-4 h-4 text-[#280f91]" /> Kết quả phỏng vấn
              </h3>
              <div className="flex items-center gap-1 bg-yellow-50 text-yellow-700 px-3 py-1 rounded-full border border-yellow-200">
                <Star className="w-4 h-4 fill-current" />
                <span className="font-bold">{tutor.interviewResults.score}/10</span>
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 border-b border-gray-100 pb-4">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Người phỏng vấn</p>
                  <p className="text-sm font-medium text-gray-900">{tutor.interviewResults.interviewer}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Thời gian phỏng vấn</p>
                  <p className="text-sm font-medium text-gray-900">
                    {format(new Date(tutor.interviewResults.interviewDate), "dd/MM/yyyy HH:mm", { locale: vi })}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-xs text-gray-500 mb-2">Đánh giá chung (Notes)</p>
                <div className="bg-gray-50 border border-gray-200 p-4 rounded-xl text-sm text-gray-700 leading-relaxed italic">
                  "{tutor.interviewResults.notes}"
                </div>
              </div>

              <div>
                <p className="text-xs text-gray-500 mb-2">Bản ghi hình (Recording)</p>
                <button className="flex items-center gap-2 text-sm text-[#280f91] hover:underline font-medium">
                  <Video className="w-4 h-4" /> Xem lại video phỏng vấn
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
