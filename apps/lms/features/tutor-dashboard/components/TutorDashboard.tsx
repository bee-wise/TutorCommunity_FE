"use client";

import React from "react";
import { useAuthStore } from "@workspace/core/store/useAuthStore";
import { KpiCard } from "./KpiCard";
import {
  Users,
  CalendarBlank,
  Files,
  Star,
  ArrowRight,
  MagicWand,
  UsersThree,
  BellRinging,
} from "@phosphor-icons/react";
import Link from "next/link";
import { format } from "date-fns";
import { vi } from "date-fns/locale";

// Mock data
const UPCOMING_CLASSES = [
  {
    id: "1",
    name: "Toán 10 - Lớp T10A",
    time: "18:00 - 19:30",
    date: "Hôm nay",
    students: 1,
  },
  {
    id: "2",
    name: "Vật lý 11 - Cơ bản",
    time: "20:00 - 21:30",
    date: "Hôm nay",
    students: 1,
  },
  {
    id: "3",
    name: "Hóa 12 - Luyện thi đại học",
    time: "14:00 - 16:00",
    date: "Ngày mai",
    students: 1,
  },
];

const RECENT_NOTIFICATIONS = [
  {
    id: "n1",
    title: "Bài tập mới",
    content: "Có 5 học sinh nộp bài tập Toán 10",
    time: "10 phút trước",
  },
  {
    id: "n2",
    title: "Nhắc nhở lớp học",
    content: "Lớp Vật lý 11 sẽ bắt đầu sau 2 tiếng nữa",
    time: "1 giờ trước",
  },
  {
    id: "n3",
    title: "Tài liệu AI",
    content: "Tài liệu 'Đạo hàm cơ bản' đã được tạo xong",
    time: "3 giờ trước",
  },
];

export function TutorDashboard() {
  const user = useAuthStore((s) => s.user);

  const currentDate = format(new Date(), "EEEE, 'ngày' d 'tháng' M, yyyy", {
    locale: vi,
  });

  return (
    <div className="flex flex-col min-h-full gap-8">
      {/* Header Section */}
      <section className="flex flex-col gap-2">
        <p className="text-sm font-medium text-gray-500 capitalize">
          {currentDate}
        </p>
        <h1
          className="text-3xl md:text-4xl text-[#280F91] "
          style={{ fontFamily: "var(--font-nunito-family)", fontWeight: 800 }}
        >
          Chào buổi sáng, {user?.fullName?.split(" ").pop() || "Gia sư"}!
        </h1>
        <p className="text-gray-600 max-w-[70ch]">
          Chúc bạn một ngày giảng dạy hiệu quả. Dưới đây là tổng quan các hoạt
          động của bạn hôm nay.
        </p>
      </section>

      {/* KPI Cards (Glassmorphism) */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <KpiCard
          title="Tổng học viên"
          value={45}
          icon={Users}
          trend="up"
          trendValue="3"
          description="so với tháng trước"
        />
        <KpiCard
          title="Lớp tuần này"
          value={12}
          icon={CalendarBlank}
          description="Đã dạy 4 lớp"
        />
        <KpiCard
          title="Cần chấm điểm"
          value={18}
          icon={Files}
          trend="down"
          trendValue="5"
          description="bài tập mới nộp"
        />
        <KpiCard
          title="Đánh giá trung bình"
          value={4.9}
          icon={Star}
          trend="neutral"
          description="Dựa trên 24 đánh giá"
        />
      </section>

      {/* Main Content: Bento Grid */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (8/12): Upcoming Classes */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          <div className="bg-white  rounded-2xl border p-6 shadow-sm flex flex-col h-full">
            <div className="flex items-center justify-between mb-6">
              <h2
                className="text-xl text-gray-900 "
                style={{
                  fontFamily: "var(--font-nunito-family)",
                  fontWeight: 800,
                }}
              >
                Lịch dạy sắp tới
              </h2>
              <Link
                href="/lms/tutor/schedule"
                className="text-sm font-semibold text-[#280F91] hover:underline flex items-center gap-1"
              >
                Xem toàn bộ <ArrowRight weight="bold" />
              </Link>
            </div>

            <div className="flex flex-col gap-4">
              {UPCOMING_CLASSES.map((cls) => (
                <div
                  key={cls.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border bg-gray-50/50  hover:bg-gray-50 transition-colors gap-4"
                >
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-xs font-bold px-2 py-0.5 rounded-full ${cls.date === "Hôm nay" ? "bg-[#FFC500]/20 text-[#905b0f]" : "bg-gray-200 text-gray-700"}`}
                      >
                        {cls.date}
                      </span>
                      <span className="text-sm font-semibold text-[#447353] flex items-center gap-1">
                        <CalendarBlank weight="fill" /> {cls.time}
                      </span>
                    </div>
                    <h3 className="font-bold text-gray-900  text-lg">
                      {cls.name}
                    </h3>
                    <p className="text-sm text-gray-500 flex items-center gap-1">
                      <UsersThree /> {cls.students} học viên
                    </p>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <button className="px-4 py-2 rounded-lg text-sm font-bold border border-gray-200 hover:bg-gray-100 transition-colors">
                      Chi tiết
                    </button>
                    <button className="px-4 py-2 rounded-lg text-sm font-bold bg-[#280F91] text-white hover:bg-[#280F91]/90 shadow-sm transition-colors">
                      Vào lớp
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column (4/12): Quick Actions & Notifications */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          {/* Quick Actions */}
          <div className="bg-[#CFE1FA]/20  rounded-2xl border border-[#CFE1FA] p-6">
            <h2
              className="text-xl text-[#280F91]  mb-4"
              style={{ fontFamily: "var(--font-nunito-family)", fontWeight: 800 }}
            >
              Thao tác nhanh
            </h2>
            <div className="flex flex-col gap-3">
              <Link
                href="/lms/tutor/materials"
                className="flex items-center justify-between p-4 bg-white  rounded-xl shadow-sm hover:shadow-md transition-shadow group border border-transparent hover:border-[#280F91]/20"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-[#FFC500]/20 text-[#905b0f] rounded-lg">
                    <MagicWand weight="fill" size={20} />
                  </div>
                  <span className="font-bold text-gray-900 ">
                    Soạn tài liệu AI
                  </span>
                </div>
                <ArrowRight
                  className="text-gray-400 group-hover:text-[#280F91] transition-colors"
                  weight="bold"
                />
              </Link>

              <Link
                href="/lms/tutor/classes"
                className="flex items-center justify-between p-4 bg-white  rounded-xl shadow-sm hover:shadow-md transition-shadow group border border-transparent hover:border-[#280F91]/20"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-[#447353]/10 text-[#447353] rounded-lg">
                    <UsersThree weight="fill" size={20} />
                  </div>
                  <span className="font-bold text-gray-900 ">
                    Quản lý lớp học
                  </span>
                </div>
                <ArrowRight
                  className="text-gray-400 group-hover:text-[#280F91] transition-colors"
                  weight="bold"
                />
              </Link>
            </div>
          </div>

          {/* Notifications */}
          <div className="bg-white  rounded-2xl border p-6 shadow-sm flex-1">
            <div className="flex items-center justify-between mb-4">
              <h2
                className="text-xl text-gray-900  flex items-center gap-2"
                style={{
                  fontFamily: "var(--font-nunito-family)",
                  fontWeight: 800,
                }}
              >
                <BellRinging weight="fill" className="text-[#FFC500]" />
                Thông báo
              </h2>
            </div>
            <div className="flex flex-col gap-4">
              {RECENT_NOTIFICATIONS.map((notif) => (
                <div
                  key={notif.id}
                  className="flex flex-col gap-1 border-b pb-4 last:border-0 last:pb-0"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-gray-900 ">
                      {notif.title}
                    </span>
                    <span className="text-xs text-gray-500">{notif.time}</span>
                  </div>
                  <p className="text-sm text-gray-600 ">
                    {notif.content}
                  </p>
                </div>
              ))}
            </div>
            <button className="w-full mt-4 py-2 text-sm font-semibold text-[#280F91] hover:bg-[#280F91]/5 rounded-lg transition-colors">
              Xem tất cả
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
