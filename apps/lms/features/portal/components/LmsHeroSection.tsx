"use client";

import { motion } from "motion/react";
import Link from "next/link";
import {
  GraduationCap,
  ChalkboardTeacher,
  CalendarCheck,
  Lock,
  Clock,
  ShieldCheck,
} from "@phosphor-icons/react";

const ease = [0.22, 1, 0.36, 1] as const;

/* ───────────────────────────────────────────
   Mini Mockup Sub-Components (right column)
   ─────────────────────────────────────────── */

function ScheduleGrid() {
  const days = ["T2", "T3", "T4", "T5", "T6", "T7"];
  const slots = [
    { day: 0, row: 0, label: "Ielts Reading", color: "#280f91", text: "white" },
    {
      day: 2,
      row: 0,
      label: "Toeic Listening",
      color: "#ffc500",
      text: "#0c0c0b",
    },
    { day: 4, row: 0, label: "Toán cao cấp", color: "#447353", text: "white" },
    {
      day: 1,
      row: 1,
      label: "Xác xuất thống kê",
      color: "#280f91",
      text: "white",
    },
    {
      day: 3,
      row: 1,
      label: "Hóa học hữu cơ",
      color: "#ffc500",
      text: "#0c0c0b",
    },
    {
      day: 5,
      row: 1,
      label: "Tiếng anh giao tiếp",
      color: "#280f91",
      text: "white",
    },
  ];

  return (
    <div className="bg-white rounded-2xl p-4 shadow-lg shadow-[#280f91]/8 border border-[#0c0c0b]/6">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <p
          className="text-xs font-bold text-[#0c0c0b]"
          style={{ fontFamily: "var(--font-nunito-family)" }}
        >
          Lịch Học Tuần Này
        </p>
        <span className="text-[9px] font-medium text-[#0c0c0b]/40">
          Tuần 28
        </span>
      </div>
      {/* Day headers */}
      <div className="grid grid-cols-6 gap-1 mb-2">
        {days.map((d) => (
          <div
            key={d}
            className="text-center text-[9px] font-semibold text-[#0c0c0b]/40"
          >
            {d}
          </div>
        ))}
      </div>
      {/* Slot grid */}
      {[0, 1].map((row) => (
        <div key={row} className="grid grid-cols-6 gap-1 mb-1">
          {Array.from({ length: 6 }).map((_, col) => {
            const slot = slots.find((s) => s.day === col && s.row === row);
            return (
              <div
                key={col}
                className="h-8 rounded-lg flex items-center justify-center text-[8px] font-bold transition-all duration-200"
                style={
                  slot
                    ? { backgroundColor: slot.color, color: slot.text }
                    : { backgroundColor: "#f0f4ff" }
                }
              >
                {slot?.label || ""}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}

function SessionCard() {
  return (
    <div className="bg-white rounded-2xl p-4 shadow-lg shadow-[#280f91]/8 border border-[#0c0c0b]/6">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-7 h-7 rounded-lg bg-[#280f91] flex items-center justify-center">
          <Lock size={13} weight="fill" className="text-white" />
        </div>
        <div>
          <p className="text-[10px] font-bold text-[#0c0c0b]">
            Buổi Học Hôm Nay
          </p>
          <p className="text-[9px] text-[#0c0c0b]/40">
            Theo dõi tiến độ lớp học
          </p>
        </div>
      </div>
      {/* Session items */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between bg-[#280f91]/5 rounded-lg px-3 py-2">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-[#ffc500] animate-pulse" />
            <span className="text-[9px] font-semibold text-[#0c0c0b]">
              Lớp A — 14:00
            </span>
          </div>
          <span className="text-[8px] font-bold text-[#ffc500] bg-[#ffc500]/15 px-2 py-0.5 rounded-full">
            Sắp diễn ra
          </span>
        </div>
        <div className="flex items-center justify-between bg-[#447353]/5 rounded-lg px-3 py-2">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-[#447353]" />
            <span className="text-[9px] font-semibold text-[#0c0c0b]">
              Lớp B — 09:00
            </span>
          </div>
          <span className="text-[8px] font-bold text-[#447353] bg-[#447353]/15 px-2 py-0.5 rounded-full">
            Đã hoàn thành
          </span>
        </div>
        <div className="flex items-center justify-between bg-[#447353]/5 rounded-lg px-3 py-2">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-[#447353]" />
            <span className="text-[9px] font-semibold text-[#0c0c0b]">
              Lớp C — 07:30
            </span>
          </div>
          <span className="text-[8px] font-bold text-[#447353] bg-[#447353]/15 px-2 py-0.5 rounded-full">
            Đã hoàn thành
          </span>
        </div>
      </div>
    </div>
  );
}

/* ───────────────────────────────────────────
   Main Hero Section
   ─────────────────────────────────────────── */

export function LmsHeroSection() {
  return (
    <section className="min-h-[100dvh] flex items-center pt-20 pb-12 overflow-hidden bg-[#F8FAFC] relative">
      {/* Background accents */}
      <div className="absolute top-0 right-0 w-[55%] h-full bg-gradient-to-bl from-[#280f91]/4 via-[#cfe1fa]/10 to-transparent -z-0 rounded-bl-[120px]" />
      <div className="hidden md:block absolute bottom-24 left-8 w-40 h-40 rounded-full bg-[#ffc500]/15 blur-[60px]" />
      <div className="hidden md:block absolute top-40 right-16 w-56 h-56 rounded-full bg-[#280f91]/8 blur-[80px]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Column: Content */}
          <motion.div
            initial={{ opacity: 0, x: -32 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease }}
          >
            {/* Role pills */}
            <div className="flex items-center gap-2 mb-6 flex-wrap">
              <span className="inline-flex items-center gap-1.5 h-7 px-3 rounded-full bg-[#280f91]/8 text-[#280f91] text-xs font-bold">
                <GraduationCap size={13} weight="fill" />
                Học Viên
              </span>
              <span className="inline-flex items-center gap-1.5 h-7 px-3 rounded-full bg-[#ffc500]/15 text-[#0c0c0b] text-xs font-bold">
                <ChalkboardTeacher size={13} weight="fill" />
                Gia Sư
              </span>
            </div>

            <h1
              className="text-[25px] sm:text-4xl  leading-[1.1] tracking-tight text-[#0c0c0b] mb-5"
              style={{ fontFamily: "var(--font-nunito-family)", fontWeight: 800 }}
            >
              Quản Lý Lớp Học Sau Kết Nối
              <br />
              Cùng <span className="text-accent">BeeWise LMS</span>
            </h1>

            <p className="text-base md:text-lg text-[#0c0c0b]/60 leading-relaxed max-w-[520px] mb-8">
              Không gian dành riêng cho gia sư và học viên đã kết nối thành
              công. Theo dõi lịch học, quản lý tài liệu, kiểm soát học phí — tất
              cả trong một hệ thống.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 mb-10">
              <Link
                href="/login"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-[#ffc500] px-7 text-sm font-bold text-primary hover:bg-[#ffcc1a] active:scale-[0.97] transition-all duration-200 shadow-lg shadow-[#ffc500]/30"
                style={{ fontFamily: "var(--font-nunito-family)" }}
              >
                Bắt Đầu Ngay
              </Link>
            </div>

            {/* Glassmorphism Stat Cards — within BeeWise scope */}
            <div className="flex items-center gap-4 flex-wrap">
              {[
                {
                  icon: Clock,
                  value: "1 tài khoản",
                  label: "Dùng chung toàn hệ thống",
                },
                {
                  icon: CalendarCheck,
                  value: "Tự động",
                  label: "Kích hoạt lớp học",
                },
                {
                  icon: ShieldCheck,
                  value: "Consultant",
                  label: "Đồng hành & hỗ trợ",
                },
              ].map((stat) => {
                const Icon = stat.icon;
                return (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4, ease }}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/95 md:bg-white/60 md:backdrop-blur-md border border-[#280f91]/8 shadow-sm"
                  >
                    <Icon
                      size={18}
                      weight="fill"
                      className="text-[#280f91] shrink-0"
                    />
                    <div>
                      <p
                        className="text-sm font-bold text-[#0c0c0b] leading-none"
                        style={{ fontFamily: "var(--font-nunito-family)" }}
                      >
                        {stat.value}
                      </p>
                      <p className="text-[10px] text-[#0c0c0b]/50 mt-0.5">
                        {stat.label}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* Right Column: Mockup UI */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, x: 32 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.15, ease }}
            className="relative"
          >
            <div className="flex flex-col gap-4">
              <ScheduleGrid />
              <SessionCard />
            </div>

            {/* Top-right verified badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.7, duration: 0.4 }}
              className="absolute -top-3 -right-2 bg-[#447353] text-white rounded-full px-3 py-1.5 shadow-lg"
            >
              <div className="flex items-center gap-1.5">
                <ShieldCheck size={12} weight="fill" />
                <span
                  className="text-[9px] font-bold"
                  style={{ fontFamily: "var(--font-nunito-family)" }}
                >
                  Hệ thống xác thực
                </span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
