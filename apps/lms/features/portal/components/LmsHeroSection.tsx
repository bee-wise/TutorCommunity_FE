"use client";
import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, GraduationCap, ChalkboardTeacher } from "@phosphor-icons/react";

export function LmsHeroSection() {
  return (
    <section className="min-h-[100dvh] flex items-center pt-16 overflow-hidden bg-white relative">
      {/* Background accents */}
      <div className="absolute top-0 right-0 w-[60%] h-full bg-[#280f91]/3 rounded-bl-[80px] -z-0" />
      <div className="absolute bottom-20 left-10 w-32 h-32 rounded-full bg-[#ffc500]/20 blur-3xl" />
      <div className="absolute top-32 right-20 w-48 h-48 rounded-full bg-[#280f91]/10 blur-3xl" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-16 lg:py-0 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left: Content */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Role pills */}
            <div className="flex items-center gap-2 mb-6">
              <span className="inline-flex items-center gap-1.5 h-7 px-3 rounded-full bg-[#280f91]/8 text-[#280f91] text-xs font-bold">
                <GraduationCap size={13} weight="fill" />
                Dành cho Học viên
              </span>
              <span className="inline-flex items-center gap-1.5 h-7 px-3 rounded-full bg-[#ffc500]/15 text-[#0c0c0b] text-xs font-bold">
                <ChalkboardTeacher size={13} weight="fill" />
                Dành cho Gia sư
              </span>
              <span className="text-xs text-[#0c0c0b]/40 font-medium">· Cổng thông tin nội bộ</span>
            </div>

            <h1
              className="text-4xl md:text-5xl lg:text-[56px] leading-[1.08] tracking-tight text-[#0c0c0b] mb-5"
              style={{ fontFamily: "var(--font-montserrat)", fontWeight: 800 }}
            >
              Hệ thống <span className="text-[#280f91]">Quản trị</span><br />
              Học tập trực tuyến.
            </h1>

            <p className="text-base md:text-lg text-[#0c0c0b]/60 leading-relaxed max-w-[480px] mb-8">
              Nơi gia sư và học viên quản lý lịch học, lớp học ảo trực tuyến, giao bài tập và theo dõi tiến độ một cách hệ thống nhất.
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/login"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-[#280f91] px-7 text-sm font-bold text-white hover:bg-[#1f0c73] active:scale-[0.98] transition-all duration-200 shadow-lg shadow-[#280f91]/30"
                style={{ fontFamily: "var(--font-montserrat)" }}
              >
                Đăng nhập hệ thống
                <ArrowRight size={16} weight="bold" />
              </Link>
            </div>

            {/* Stats */}
            <div className="mt-10 flex items-center gap-8">
              <div>
                <p className="text-2xl font-bold text-[#0c0c0b]" style={{ fontFamily: "var(--font-montserrat)" }}>99.9%</p>
                <p className="text-xs text-[#0c0c0b]/50 mt-0.5">Uptime hệ thống</p>
              </div>
              <div className="w-px h-8 bg-[#0c0c0b]/10" />
              <div>
                <p className="text-2xl font-bold text-[#0c0c0b]" style={{ fontFamily: "var(--font-montserrat)" }}>0s</p>
                <p className="text-xs text-[#0c0c0b]/50 mt-0.5">Độ trễ đồng bộ</p>
              </div>
              <div className="w-px h-8 bg-[#0c0c0b]/10" />
              <div>
                <p className="text-2xl font-bold text-[#ffc500]" style={{ fontFamily: "var(--font-montserrat)" }}>AES-256</p>
                <p className="text-xs text-[#0c0c0b]/50 mt-0.5">Bảo mật dữ liệu</p>
              </div>
            </div>
          </motion.div>

          {/* Right: Hero image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, x: 40 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="relative"
          >
            <div className="relative h-[480px] lg:h-[560px] w-full rounded-3xl overflow-hidden shadow-2xl shadow-[#280f91]/20">
              <Image
                src="/images/lms-hero.png"
                alt="BeeWise LMS - Quản trị học tập"
                fill
                className="object-cover"
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#280f91]/30 via-transparent to-transparent" />
            </div>

            {/* Floating card accent */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="absolute -bottom-5 -left-5 bg-white rounded-2xl p-4 shadow-xl shadow-[#0c0c0b]/10 border border-[#0c0c0b]/6"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#ffc500] flex items-center justify-center shrink-0">
                  <ChalkboardTeacher size={20} weight="fill" className="text-[#0c0c0b]" />
                </div>
                <div>
                  <p className="text-xs font-bold text-[#0c0c0b]">Buổi học đang diễn ra</p>
                  <p className="text-xs text-[#0c0c0b]/50">Toán đại số - Khối 12</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
