"use client";

import React from "react";
import { UserPlus, GraduationCap, User, ArrowRight } from "lucide-react";

const registrations = [
  {
    name: "Nguyễn Quốc Bảo",
    role: "Tutor" as const,
    subject: "Toán - Lý",
    time: "10 phút trước",
    status: "profile_submitted",
  },
  {
    name: "Lê Thị Hằng",
    role: "Learner" as const,
    subject: "Cần gia sư IELTS",
    time: "25 phút trước",
    status: "registered",
  },
  {
    name: "Trần Văn Đức",
    role: "Tutor" as const,
    subject: "Lập trình Java",
    time: "1 giờ trước",
    status: "interview_scheduled",
  },
  {
    name: "Phạm Minh Anh",
    role: "Learner" as const,
    subject: "Học Toán 10",
    time: "2 giờ trước",
    status: "registered",
  },
];

const statusLabel: Record<string, { label: string; color: string }> = {
  profile_submitted: { label: "Đã nộp hồ sơ", color: "text-orange-600 bg-orange-50" },
  registered: { label: "Mới đăng ký", color: "text-blue-600 bg-blue-50" },
  interview_scheduled: { label: "Có lịch PV", color: "text-violet-600 bg-violet-50" },
};

export function NewRegistrationsWidget() {
  return (
    <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-zinc-800 flex flex-col gap-4 h-full">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Đăng Ký Mới</h2>
          <p className="text-xs text-gray-400 mt-0.5">Learner & Tutor vừa tạo tài khoản</p>
        </div>
        <button className="text-xs text-blue-600 hover:underline flex items-center gap-1">
          Xem tất cả <ArrowRight className="w-3 h-3" />
        </button>
      </div>

      <div className="flex flex-col gap-2">
        {registrations.map((reg, idx) => (
          <div
            key={idx}
            className="flex items-center gap-3 p-3 rounded-2xl hover:bg-gray-50 dark:hover:bg-zinc-800/50 cursor-pointer transition-colors group border border-transparent hover:border-gray-100 dark:hover:border-zinc-700"
          >
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${reg.role === "Tutor" ? "bg-orange-50 dark:bg-orange-900/20" : "bg-blue-50 dark:bg-blue-900/20"}`}>
              {reg.role === "Tutor" ? (
                <GraduationCap className="w-4 h-4 text-orange-600" />
              ) : (
                <User className="w-4 h-4 text-blue-600" />
              )}
            </div>
            <div className="flex flex-col flex-1 min-w-0">
              <span className="text-sm font-semibold text-gray-800 dark:text-gray-200 truncate group-hover:text-blue-600 transition-colors">
                {reg.name}
              </span>
              <span className="text-xs text-gray-500 truncate">{reg.subject} · {reg.time}</span>
            </div>
            <span className={`hidden sm:inline text-[10px] font-semibold px-2.5 py-1 rounded-full flex-shrink-0 ${statusLabel[reg.status].color}`}>
              {statusLabel[reg.status].label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
