"use client";

import { useRef } from "react";
import { motion, useInView } from "motion/react";
import {
  Lightning,
  GraduationCap,
  ChalkboardTeacher,
  CheckCircle,
  ArrowsClockwise,
  ShieldCheck,
  CalendarCheck,
  BookOpen,
} from "@phosphor-icons/react";

const ease = [0.22, 1, 0.36, 1] as const;

/* ───────────────────────────────────────────
   Activation Flow Mockup Widget
   ─────────────────────────────────────────── */

function ActivationFlowWidget() {
  return (
    <div className="bg-white rounded-2xl p-4 shadow-lg shadow-[#0c0c0b]/10 border border-[#0c0c0b]/6 max-w-sm">
      {/* System message header */}
      <div className="flex items-center gap-2 mb-3">
        <div className="w-7 h-7 rounded-full bg-[#280f91] flex items-center justify-center">
          <ArrowsClockwise size={13} weight="bold" className="text-white" />
        </div>
        <div>
          <p className="text-[10px] font-bold text-[#280f91]">
            Hệ thống BeeWise
          </p>
          <p className="text-[8px] text-[#0c0c0b]/40">
            Kích hoạt tự động · Vừa xong
          </p>
        </div>
      </div>

      {/* Activation details */}
      <div className="bg-[#280f91]/5 rounded-xl p-3 mb-3">
        <p className="text-[11px] text-[#0c0c0b] leading-relaxed mb-2">
          <strong>Yêu cầu kích hoạt lớp học mới</strong>
        </p>
        <div className="flex flex-col gap-1.5 text-[9px] text-[#0c0c0b]/60">
          <div className="flex items-center gap-1.5">
            <span className="font-semibold text-[#0c0c0b]/70">Học viên:</span>
            <span>Nguyễn Văn Minh</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="font-semibold text-[#0c0c0b]/70">Gia sư:</span>
            <span>Trần Thị Hương</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="font-semibold text-[#0c0c0b]/70">Môn học:</span>
            <span>Theo thỏa thuận</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="font-semibold text-[#0c0c0b]/70">Lịch học:</span>
            <span>T3, T5 · 14:00 - 15:30</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="font-semibold text-[#0c0c0b]/70">Đơn giá:</span>
            <span className="font-bold text-[#280f91]">220,000₫/buổi</span>
          </div>
        </div>
      </div>

      {/* Activation steps */}
      <div className="flex flex-col gap-2 mb-3">
        {[
          { label: "Xác nhận thông tin lớp học", done: true },
          { label: "Thiết lập lịch trình tự động", done: true },
          { label: "Cấp quyền truy cập LMS", done: true },
        ].map((step) => (
          <div key={step.label} className="flex items-center gap-2">
            <CheckCircle
              size={14}
              weight="fill"
              className="text-[#447353] shrink-0"
            />
            <span className="text-[10px] font-medium text-[#0c0c0b]/70">
              {step.label}
            </span>
          </div>
        ))}
      </div>

      {/* Status footer */}
      <div className="flex items-center gap-1.5 pt-2 border-t border-[#0c0c0b]/6">
        <ShieldCheck size={11} weight="fill" className="text-[#447353]" />
        <p className="text-[8px] text-[#447353] font-semibold">
          Lớp học đã kích hoạt — Cả hai bên có thể truy cập LMS ngay
        </p>
      </div>
    </div>
  );
}

/* ───────────────────────────────────────────
   Main Component
   ─────────────────────────────────────────── */

export function ClassActivationShowcase() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      id="activation"
      className="py-20 lg:py-28 bg-[#280f91] overflow-hidden relative"
    >
      {/* Dot grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            "radial-gradient(circle, #ffffff 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />
      <div className="hidden md:block absolute bottom-0 left-1/2 -translate-x-1/2 w-[500px] h-[200px] bg-[#ffc500]/8 blur-[100px]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div
          ref={ref}
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center"
        >
          {/* Left: Content */}
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease }}
          >
            <h2
              className="text-3xl md:text-4xl lg:text-[44px] leading-tight tracking-tight text-white mb-5"
              style={{ fontFamily: "var(--font-montserrat)", fontWeight: 800 }}
            >
              Consultant Xác Nhận,{" "}
              <span className="text-[#ffc500]">Hệ Thống Kích Hoạt</span>
            </h2>
            <p className="text-white/65 text-base leading-relaxed mb-8 max-w-[480px]">
              Khi học viên và gia sư thống nhất trong Chat Room, Consultant
              xác nhận kết nối thành công. Hệ thống tự động tạo lớp học,
              thiết lập lịch trình và cấp quyền LMS cho cả hai bên.
            </p>

            {/* Activation flow steps */}
            <div className="flex flex-col gap-4 mb-8">
              {[
                {
                  icon: GraduationCap,
                  step: "Trao đổi trong Chat Room",
                  desc: "Học viên, gia sư và Consultant cùng thảo luận về nhu cầu, lịch học, học phí và hình thức học.",
                },
                {
                  icon: ChalkboardTeacher,
                  step: "Consultant xác nhận kết nối",
                  desc: "Khi hai bên đồng ý, Consultant xác nhận và hệ thống tạo hợp đồng lớp học.",
                },
                {
                  icon: Lightning,
                  step: "LMS tự động mở quyền",
                  desc: "Lịch học, kho tài liệu và quản lý học phí sẵn sàng cho cả gia sư và học viên.",
                },
              ].map((item, i) => {
                const Icon = item.icon;
                return (
                  <motion.div
                    key={item.step}
                    initial={{ opacity: 0, x: -20 }}
                    animate={inView ? { opacity: 1, x: 0 } : {}}
                    transition={{
                      duration: 0.5,
                      delay: 0.15 + i * 0.08,
                      ease,
                    }}
                    className="flex items-start gap-3"
                  >
                    <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                      <Icon
                        size={18}
                        weight="fill"
                        className="text-[#ffc500]"
                      />
                    </div>
                    <div>
                      <p
                        className="text-sm font-bold text-white mb-0.5"
                        style={{ fontFamily: "var(--font-montserrat)" }}
                      >
                        {item.step}
                      </p>
                      <p className="text-xs text-white/55 leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Automation highlight */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.4, ease }}
              className="inline-flex items-center gap-3 bg-white/8 rounded-xl px-4 py-2.5 border border-white/10"
            >
              <p className="text-[11px] font-semibold text-white/80">
                Consultant đồng hành toàn bộ quy trình — từ kết nối đến kích hoạt lớp học
              </p>
            </motion.div>
          </motion.div>

          {/* Right: Activation Flow Widget */}
          <motion.div
            initial={{ opacity: 0, x: 28 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.15, ease }}
            className="flex justify-center lg:justify-end"
          >
            <div className="relative">
              <ActivationFlowWidget />

              {/* Floating accent */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={inView ? { opacity: 1, scale: 1 } : {}}
                transition={{ delay: 0.6, duration: 0.4 }}
                className="absolute -top-4 -left-4 bg-[#ffc500] rounded-full px-3 py-1.5 shadow-lg"
              >
                <div className="flex items-center gap-1.5">
                  <Lightning
                    size={11}
                    weight="fill"
                    className="text-[#0c0c0b]"
                  />
                  <span
                    className="text-[9px] font-bold text-[#0c0c0b]"
                    style={{ fontFamily: "var(--font-montserrat)" }}
                  >
                    Kích hoạt tự động
                  </span>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
