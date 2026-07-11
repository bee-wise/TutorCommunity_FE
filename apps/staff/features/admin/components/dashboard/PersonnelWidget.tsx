"use client";

import React from "react";
import { Briefcase, Circle, CheckCircle, ArrowRight } from "lucide-react";

const consultants = [
  { name: "Nguyễn Linh Chi", initials: "LC", status: "online", chatRooms: 4, tutorsReviewed: 2 },
  { name: "Trần Lan Anh", initials: "LA", status: "online", chatRooms: 6, tutorsReviewed: 1 },
  { name: "Lê Minh Tuấn", initials: "MT", status: "online", chatRooms: 3, tutorsReviewed: 3 },
  { name: "Phạm Đức Thắng", initials: "DT", status: "offline", chatRooms: 0, tutorsReviewed: 0 },
  { name: "Bùi Ngọc Yến", initials: "NY", status: "offline", chatRooms: 0, tutorsReviewed: 0 },
];

export function PersonnelWidget() {
  const online = consultants.filter((c) => c.status === "online").length;
  const totalChatRooms = consultants.reduce((acc, c) => acc + c.chatRooms, 0);

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-zinc-800 flex flex-col gap-5 h-full">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Nhân Sự & Ca Trực</h2>
          <p className="text-xs text-gray-400 mt-0.5">Consultant đang hoạt động</p>
        </div>
        <button className="text-xs text-blue-600 hover:underline flex items-center gap-1">
          Quản lý <ArrowRight className="w-3 h-3" />
        </button>
      </div>

      {/* Summary row */}
      <div className="grid grid-cols-3 gap-2">
        <div className="flex flex-col items-center p-2.5 bg-gray-50 dark:bg-zinc-800/50 rounded-2xl text-center">
          <span className="text-xl font-bold text-gray-900 dark:text-white">{consultants.length}</span>
          <span className="text-[10px] text-gray-500 font-medium">Tổng nhân sự</span>
        </div>
        <div className="flex flex-col items-center p-2.5 bg-green-50 dark:bg-green-900/10 rounded-2xl text-center">
          <span className="text-xl font-bold text-green-600">{online}</span>
          <span className="text-[10px] text-green-600/70 font-medium">Đang trực</span>
        </div>
        <div className="flex flex-col items-center p-2.5 bg-blue-50 dark:bg-blue-900/10 rounded-2xl text-center">
          <span className="text-xl font-bold text-blue-600">{totalChatRooms}</span>
          <span className="text-[10px] text-blue-600/70 font-medium">Chat đang xử</span>
        </div>
      </div>

      {/* Consultant list */}
      <div className="flex flex-col gap-2.5">
        {consultants.map((c, idx) => (
          <div key={idx} className="flex items-center gap-3 group">
            <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${c.status === "online" ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-400"}`}>
              {c.initials}
            </div>
            <div className="flex flex-col flex-1 min-w-0">
              <span className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">{c.name}</span>
              {c.status === "online" && (
                <span className="text-[10px] text-gray-400">
                  {c.chatRooms} phòng chat · {c.tutorsReviewed} hồ sơ duyệt hôm nay
                </span>
              )}
            </div>
            <div className="flex items-center gap-1 flex-shrink-0">
              {c.status === "online" ? (
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              ) : (
                <span className="w-2 h-2 rounded-full bg-gray-300" />
              )}
              <span className={`text-[10px] font-medium ${c.status === "online" ? "text-green-500" : "text-gray-400"}`}>
                {c.status === "online" ? "Online" : "Offline"}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
