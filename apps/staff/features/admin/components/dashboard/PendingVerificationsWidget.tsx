"use client";

import React from "react";
import { Clock, ArrowRight, UserCheck, XCircle } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@workspace/ui/components/ui/avatar";

const pendingTutors = [
  {
    name: "Nguyễn Hoàng Minh",
    subject: "Toán & Vật Lý",
    elapsed: "2 giờ 20 phút",
    stage: "Chờ xem hồ sơ",
    stageColor: "text-orange-500 bg-orange-50",
    avatarBg: "bg-orange-100 text-orange-700",
  },
  {
    name: "Trần Bảo Ngọc",
    subject: "IELTS Preparation",
    elapsed: "5 giờ 30 phút",
    stage: "Đã phỏng vấn",
    stageColor: "text-blue-500 bg-blue-50",
    avatarBg: "bg-blue-100 text-blue-700",
  },
  {
    name: "Lê Nhật Huy",
    subject: "ReactJS Cơ Bản",
    elapsed: "1 ngày trước",
    stage: "Chờ xác thực",
    stageColor: "text-violet-500 bg-violet-50",
    avatarBg: "bg-violet-100 text-violet-700",
  },
  {
    name: "Phạm Quỳnh Anh",
    subject: "Tiếng Anh Giao Tiếp",
    elapsed: "3 giờ 10 phút",
    stage: "Chờ xem hồ sơ",
    stageColor: "text-orange-500 bg-orange-50",
    avatarBg: "bg-orange-100 text-orange-700",
  },
];

export function PendingTutorVerifications() {
  return (
    <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-zinc-800 flex flex-col gap-4 h-full">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Hồ Sơ Gia Sư Chờ Duyệt</h2>
          <p className="text-xs text-gray-400 mt-0.5">Cần Consultant xác thực</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-white bg-red-500 rounded-full w-5 h-5 flex items-center justify-center">
            {pendingTutors.length}
          </span>
          <button className="text-xs font-medium text-blue-600 hover:underline flex items-center gap-1">
            Xem tất cả <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-3 overflow-y-auto">
        {pendingTutors.map((tutor, idx) => (
          <div
            key={idx}
            className="flex items-center gap-3 p-3 rounded-2xl hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition-colors cursor-pointer group border border-transparent hover:border-gray-100 dark:hover:border-zinc-700"
          >
            <Avatar className="h-10 w-10 flex-shrink-0">
              <AvatarImage src={`https://i.pravatar.cc/150?u=${tutor.name}`} />
              <AvatarFallback className={`text-sm font-bold ${tutor.avatarBg}`}>{tutor.name.charAt(0)}</AvatarFallback>
            </Avatar>

            <div className="flex flex-col flex-1 min-w-0">
              <span className="text-sm font-semibold text-gray-800 dark:text-gray-200 truncate group-hover:text-blue-600 transition-colors">
                {tutor.name}
              </span>
              <span className="text-xs text-gray-500 truncate">{tutor.subject}</span>
            </div>

            <div className="hidden sm:flex flex-col items-end gap-1 flex-shrink-0">
              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${tutor.stageColor}`}>
                {tutor.stage}
              </span>
              <span className="text-[10px] text-gray-400 flex items-center gap-1">
                <Clock className="w-2.5 h-2.5" />{tutor.elapsed}
              </span>
            </div>

            <div className="flex items-center gap-1.5 ml-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button className="w-7 h-7 rounded-full bg-green-50 hover:bg-green-100 text-green-600 flex items-center justify-center transition-colors">
                <UserCheck className="w-3.5 h-3.5" />
              </button>
              <button className="w-7 h-7 rounded-full bg-red-50 hover:bg-red-100 text-red-400 flex items-center justify-center transition-colors">
                <XCircle className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
