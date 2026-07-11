"use client";

import React from "react";
import { ArrowRight, MessageSquare, CheckCircle2, AlertCircle } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@workspace/ui/components/ui/avatar";

type ClassStatus = "Active" | "Pending Payment" | "Paused" | "Completed";

const recentClasses: {
  learner: string;
  tutor: string;
  subject: string;
  consultant: string;
  status: ClassStatus;
  fee: string;
  avatar: string;
}[] = [
  {
    learner: "Nguyễn Văn Nam",
    tutor: "Trần Minh Khoa",
    subject: "Toán 12",
    consultant: "Linh",
    status: "Active",
    fee: "120k/h",
    avatar: "nam",
  },
  {
    learner: "Phạm Thị Hoa",
    tutor: "Lê Quốc Huy",
    subject: "IELTS Speaking",
    consultant: "Lan",
    status: "Pending Payment",
    fee: "150k/h",
    avatar: "hoa",
  },
  {
    learner: "Bùi Quang Hiếu",
    tutor: "Nguyễn Thanh Tú",
    subject: "Lập trình Python",
    consultant: "Minh",
    status: "Active",
    fee: "200k/h",
    avatar: "hieu",
  },
  {
    learner: "Đỗ Thị Lan",
    tutor: "Vũ Anh Dũng",
    subject: "Vật Lý 11",
    consultant: "Linh",
    status: "Paused",
    fee: "100k/h",
    avatar: "lan",
  },
];

const statusConfig: Record<ClassStatus, { label: string; color: string; icon: React.ReactNode }> = {
  Active: {
    label: "Đang hoạt động",
    color: "text-green-600 bg-green-50 dark:bg-green-900/20",
    icon: <CheckCircle2 className="w-3 h-3" />,
  },
  "Pending Payment": {
    label: "Chờ thanh toán",
    color: "text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20",
    icon: <AlertCircle className="w-3 h-3" />,
  },
  Paused: {
    label: "Tạm dừng",
    color: "text-gray-500 bg-gray-100 dark:bg-zinc-800",
    icon: <AlertCircle className="w-3 h-3" />,
  },
  Completed: {
    label: "Hoàn thành",
    color: "text-blue-600 bg-blue-50",
    icon: <CheckCircle2 className="w-3 h-3" />,
  },
};

export function RecentConnectionsWidget() {
  return (
    <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-zinc-800 flex flex-col gap-4 h-full">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Lớp Học Gần Đây</h2>
          <p className="text-xs text-gray-400 mt-0.5">Sau khi Learner & Tutor xác nhận học</p>
        </div>
        <button className="text-xs font-medium text-blue-600 hover:underline flex items-center gap-1">
          Xem tất cả <ArrowRight className="w-3 h-3" />
        </button>
      </div>

      <div className="flex flex-col gap-2">
        {recentClasses.map((cls, idx) => {
          const cfg = statusConfig[cls.status];
          return (
            <div
              key={idx}
              className="flex items-center gap-3 p-3 rounded-2xl hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition-colors cursor-pointer group border border-transparent hover:border-gray-100 dark:hover:border-zinc-700"
            >
              {/* Learner avatar */}
              <Avatar className="h-9 w-9 flex-shrink-0">
                <AvatarImage src={`https://i.pravatar.cc/150?u=${cls.avatar}`} />
                <AvatarFallback className="bg-blue-100 text-blue-700 text-sm font-bold">{cls.learner.charAt(0)}</AvatarFallback>
              </Avatar>

              {/* Info */}
              <div className="flex flex-col flex-1 min-w-0">
                <div className="flex items-center gap-1 min-w-0">
                  <span className="text-sm font-semibold text-gray-800 dark:text-gray-200 truncate">{cls.learner}</span>
                  <span className="text-gray-400 text-xs">↔</span>
                  <span className="text-sm text-gray-600 dark:text-gray-400 truncate">{cls.tutor}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500 mt-0.5">
                  <span>{cls.subject}</span>
                  <span>·</span>
                  <span className="flex items-center gap-0.5">
                    <MessageSquare className="w-2.5 h-2.5" />{cls.consultant}
                  </span>
                  <span>·</span>
                  <span className="font-medium text-gray-700">{cls.fee}</span>
                </div>
              </div>

              {/* Status badge */}
              <span className={`hidden sm:flex items-center gap-1 text-[10px] font-semibold px-2.5 py-1 rounded-full flex-shrink-0 ${cfg.color}`}>
                {cfg.icon}{cfg.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
