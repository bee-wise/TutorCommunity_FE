"use client";

import React from "react";
import {
  TrendingUp,
  TrendingDown,
  Users,
  UserCheck,
  BookOpen,
  MessageSquare,
  ShieldAlert,
  Activity,
  DollarSign,
  BadgePercent,
} from "lucide-react";

interface StatCardProps {
  label: string;
  value: string;
  trend?: { value: string; up: boolean };
  icon: React.ReactNode;
  iconBg: string;
}

function StatCard({ label, value, trend, icon, iconBg }: StatCardProps) {
  return (
    <div
      className={`bg-white dark:bg-zinc-900 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-zinc-800 flex items-start justify-between gap-3 hover:shadow-md transition-shadow cursor-default border-l-4`}
    >
      <div className="flex flex-col gap-1 min-w-0">
        <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide truncate">
          {label}
        </span>
        <span className="text-2xl font-bold text-gray-900 dark:text-white leading-none">
          {value}
        </span>
        {trend && (
          <div
            className={`flex items-center gap-1 text-xs font-medium mt-1 ${trend.up ? "text-green-600" : "text-red-500"}`}
          >
            {trend.up ? (
              <TrendingUp className="w-3 h-3" />
            ) : (
              <TrendingDown className="w-3 h-3" />
            )}
            <span>{trend.value} so với tháng trước</span>
          </div>
        )}
      </div>
      <div
        className={`w-11 h-11 flex-shrink-0 rounded-xl flex items-center justify-center ${iconBg}`}
      >
        {icon}
      </div>
    </div>
  );
}

export function KPIStatsRow() {
  const stats: StatCardProps[] = [
    {
      label: "Tổng Doanh Thu",
      value: "124.5M ₫",
      trend: { value: "+12.5%", up: true },
      icon: <DollarSign className="w-5 h-5 text-green-600" />,
      iconBg: "bg-green-50 dark:bg-green-900/20",
    },
    {
      label: "Phí Dịch Vụ (20%)",
      value: "24.9M ₫",
      trend: { value: "+9.3%", up: true },
      icon: <BadgePercent className="w-5 h-5 text-blue-600" />,
      iconBg: "bg-blue-50 dark:bg-blue-900/20",
    },
    {
      label: "Học Viên Đang Học",
      value: "312",
      trend: { value: "+8%", up: true },
      icon: <Users className="w-5 h-5 text-purple-600" />,
      iconBg: "bg-purple-50 dark:bg-purple-900/20",
    },
    {
      label: "Gia Sư Đã Duyệt",
      value: "87",
      trend: { value: "+5", up: true },
      icon: <UserCheck className="w-5 h-5 text-teal-600" />,
      iconBg: "bg-teal-50 dark:bg-teal-900/20",
    },
    {
      label: "Lớp Đang Hoạt Động",
      value: "128",
      trend: { value: "+14%", up: true },
      icon: <BookOpen className="w-5 h-5 text-orange-600" />,
      iconBg: "bg-orange-50 dark:bg-orange-900/20",
    },
    {
      label: "Chat Room Đang Chờ",
      value: "12",
      trend: { value: "−3", up: false },
      icon: <MessageSquare className="w-5 h-5 text-red-500" />,
      iconBg: "bg-red-50 dark:bg-red-900/20",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
      {stats.map((s) => (
        <StatCard key={s.label} {...s} />
      ))}
    </div>
  );
}
