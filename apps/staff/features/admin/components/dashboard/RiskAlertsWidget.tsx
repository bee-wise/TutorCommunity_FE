"use client";

import React from "react";
import { Shield, Settings, Lock } from "lucide-react";

const riskItems = [
  {
    type: "Tài khoản bị báo cáo",
    detail: "Tutor ID #1042 – 3 báo cáo trong 24h",
    severity: "high",
    time: "2 giờ trước",
  },
  {
    type: "Hồ sơ bị ẩn tự động",
    detail: "Gia sư Trần Văn Sơn – quá hạn gia hạn 50k",
    severity: "medium",
    time: "5 giờ trước",
  },
  {
    type: "Timeout kết nối",
    detail: "Chat Room #778 – Consultant chưa phản hồi > 30 phút",
    severity: "high",
    time: "30 phút trước",
  },
];

const severityConfig = {
  high: "bg-red-50 dark:bg-red-900/10 border-red-200 dark:border-red-800 text-red-700",
  medium: "bg-yellow-50 dark:bg-yellow-900/10 border-yellow-200 dark:border-yellow-800 text-yellow-700",
};

export function RiskAlertsWidget() {
  return (
    <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-zinc-800 flex flex-col gap-4 h-full">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Cảnh Báo Rủi Ro</h2>
          <p className="text-xs text-gray-400 mt-0.5">Khóa TK · Ẩn hồ sơ · Audit log</p>
        </div>
        <div className="w-9 h-9 rounded-full bg-red-50 dark:bg-red-900/20 flex items-center justify-center">
          <Shield className="w-4 h-4 text-red-500" />
        </div>
      </div>

      <div className="flex flex-col gap-3">
        {riskItems.map((item, idx) => (
          <div
            key={idx}
            className={`p-3 rounded-2xl border ${severityConfig[item.severity as keyof typeof severityConfig]} cursor-pointer hover:opacity-90 transition-opacity`}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex flex-col gap-0.5">
                <span className="text-xs font-bold">{item.type}</span>
                <span className="text-[10px] opacity-80">{item.detail}</span>
              </div>
              <span className="text-[10px] opacity-60 flex-shrink-0">{item.time}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Quick system actions */}
      <div className="flex gap-2 mt-auto pt-3 border-t border-gray-100 dark:border-zinc-800">
        <button className="flex-1 flex items-center justify-center gap-1.5 text-xs font-medium text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-zinc-800 hover:bg-gray-100 dark:hover:bg-zinc-700 rounded-xl py-2 transition-colors">
          <Lock className="w-3.5 h-3.5" />Audit Log
        </button>
        <button className="flex-1 flex items-center justify-center gap-1.5 text-xs font-medium text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-zinc-800 hover:bg-gray-100 dark:hover:bg-zinc-700 rounded-xl py-2 transition-colors">
          <Settings className="w-3.5 h-3.5" />Cấu Hình
        </button>
      </div>
    </div>
  );
}
