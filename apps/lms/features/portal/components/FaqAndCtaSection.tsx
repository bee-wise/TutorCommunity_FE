"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence, useInView } from "motion/react";
import Link from "next/link";
import Image from "next/image";
import { CaretDown, ArrowRight, Sparkle } from "@phosphor-icons/react";

const ease = [0.22, 1, 0.36, 1] as const;

/* ───────────────────────────────────────────
   FAQ Data
   ─────────────────────────────────────────── */

const FAQ_ITEMS = [
  {
    q: "BeeWise LMS dành cho ai?",
    a: "BeeWise LMS phục vụ hai nhóm người dùng chính: Học viên muốn học 1-1 với gia sư chất lượng, và Gia sư muốn quản lý lớp học, tài liệu và thu nhập một cách chuyên nghiệp.",
  },
  {
    q: "Làm thế nào để bắt đầu sử dụng hệ thống?",
    a: "Đăng ký tài khoản qua trang chủ BeeWise hoặc nhận lời mời từ gia sư. Sau khi cả hai bên xác nhận thông tin lớp học, hệ thống sẽ tự động kích hoạt quyền truy cập LMS cho bạn.",
  },
  {
    q: "Học phí được tính như thế nào?",
    a: "Học phí được tính theo đơn giá công khai cho mỗi buổi học (ví dụ: 220,000₫/buổi). Bảng kê chi tiết số buổi và tổng chi phí luôn minh bạch trên hệ thống để học viên theo dõi.",
  },
  {
    q: "Gia sư có thể quản lý nhiều lớp cùng lúc không?",
    a: "Có. Không gian làm việc của Gia sư được thiết kế đa nhiệm — bạn có thể theo dõi và tương tác với nhiều phòng học đồng thời, quản lý tài liệu riêng cho từng lớp và xem thu nhập tổng hợp.",
  },
  {
    q: "Dữ liệu của tôi có được bảo mật không?",
    a: "Tất cả dữ liệu trên BeeWise LMS được mã hóa AES-256 và truyền qua kết nối HTTPS bảo mật. Tài liệu học tập, thông tin cá nhân và lịch sử giao dịch đều được bảo vệ nghiêm ngặt.",
  },
  {
    q: "Lớp học được kích hoạt như thế nào?",
    a: "Sau khi Học viên và Gia sư cùng xác nhận thông tin lớp học (môn học, lịch trình, đơn giá), hệ thống sẽ tự động tạo phòng chat, lịch học và kho tài liệu — không cần thiết lập thủ công.",
  },
];

/* ───────────────────────────────────────────
   Accordion Item
   ─────────────────────────────────────────── */

function AccordionItem({
  item,
  isOpen,
  onToggle,
}: {
  item: (typeof FAQ_ITEMS)[number];
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="border-b border-[#0c0c0b]/8 last:border-b-0">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between py-5 px-1 text-left group"
      >
        <span
          className="text-sm md:text-base font-bold text-[#0c0c0b] pr-4 group-hover:text-[#280f91] transition-colors duration-200"
          style={{ fontFamily: "var(--font-montserrat)" }}
        >
          {item.q}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.25, ease }}
          className="shrink-0"
        >
          <CaretDown
            size={18}
            weight="bold"
            className={`transition-colors duration-200 ${
              isOpen ? "text-[#280f91]" : "text-[#0c0c0b]/30"
            }`}
          />
        </motion.div>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease }}
            className="overflow-hidden"
          >
            <p className="text-sm text-[#0c0c0b]/60 leading-relaxed pb-5 px-1 max-w-[640px]">
              {item.a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ───────────────────────────────────────────
   Main Component
   ─────────────────────────────────────────── */

export function FaqAndCtaSection() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);
  const faqRef = useRef(null);
  const ctaRef = useRef(null);
  const faqInView = useInView(faqRef, { once: true, margin: "-60px" });
  const ctaInView = useInView(ctaRef, { once: true, margin: "-60px" });

  return (
    <>
      {/* ─── FAQ Section ─── */}
      <section className="py-20 lg:py-28 bg-[#F8FAFC]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            ref={faqRef}
            initial={{ opacity: 0, y: 24 }}
            animate={faqInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.55, ease }}
            className="text-center mb-12"
          >
            <h2
              className="text-3xl md:text-4xl leading-tight tracking-tight text-[#0c0c0b] mb-3"
              style={{ fontFamily: "var(--font-montserrat)", fontWeight: 800 }}
            >
              Câu hỏi <span className="text-[#280f91]">thường gặp</span>
            </h2>
            <p className="text-[#0c0c0b]/60 text-base">
              Giải đáp nhanh những thắc mắc phổ biến về hệ thống.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={faqInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.1, ease }}
            className="bg-white rounded-2xl border border-[#0c0c0b]/6 px-5 md:px-7 shadow-sm"
          >
            {FAQ_ITEMS.map((item, i) => (
              <AccordionItem
                key={i}
                item={item}
                isOpen={openIdx === i}
                onToggle={() => setOpenIdx(openIdx === i ? null : i)}
              />
            ))}
          </motion.div>
        </div>
      </section>

      {/* ─── Bottom CTA Banner ─── */}
      <section className="py-16 lg:py-24 bg-[#280f91] relative overflow-hidden">
        {/* Decorative blurs */}
        <div className="absolute top-0 left-1/4 w-48 h-48 rounded-full bg-[#ffc500]/10 blur-[80px]" />
        <div className="absolute bottom-0 right-1/4 w-64 h-64 rounded-full bg-[#cfe1fa]/8 blur-[100px]" />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            ref={ctaRef}
            initial={{ opacity: 0, y: 24 }}
            animate={ctaInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease }}
            className="text-center"
          >
            <h2
              className="text-3xl md:text-4xl lg:text-5xl leading-tight tracking-tight text-white mb-5"
              style={{ fontFamily: "var(--font-montserrat)", fontWeight: 800 }}
            >
              Trải Nghiệm Hệ Thống Ngay
            </h2>
            <p className="text-white/60 text-base leading-relaxed mb-10 max-w-lg mx-auto">
              Đăng nhập để khám phá không gian học tập và giảng dạy được thiết
              kế riêng cho bạn.
            </p>

            {/* Pulse-animated CTA button */}
            <motion.div
              animate={{
                boxShadow: [
                  "0 0 0 0 rgba(255, 197, 0, 0.4)",
                  "0 0 0 12px rgba(255, 197, 0, 0)",
                  "0 0 0 0 rgba(255, 197, 0, 0)",
                ],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="inline-block rounded-xl"
            >
              <Link
                href="/login"
                className="inline-flex h-14 items-center justify-center gap-2.5 rounded-xl bg-[#ffc500] px-10 text-base font-bold text-[#0c0c0b] hover:bg-[#ffcc1a] active:scale-[0.97] transition-all duration-200 shadow-xl shadow-[#ffc500]/30"
                style={{ fontFamily: "var(--font-montserrat)" }}
              >
                Bắt Đầu Ngay
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ─── Minimal Footer ─── */}
      <footer className="bg-white border-t border-[#0c0c0b]/6 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Left: brand */}
            <div className="flex items-center gap-2.5">
              <div className="relative w-7 h-7 rounded-lg bg-[#280f91] flex items-center justify-center overflow-hidden shrink-0">
                <Image
                  src="https://res.cloudinary.com/dqevxj2k6/image/upload/v1783561272/beewise/beewise-logo-nobackground.png"
                  alt="BeeWise"
                  fill
                  sizes="28px"
                  className="object-contain p-0.5"
                />
              </div>
              <span className="text-[#0c0c0b]/40 text-xs">
                &copy; {new Date().getFullYear()} BeeWise Education
              </span>
            </div>

            {/* Right: system status */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-[#447353] animate-pulse" />
                <p className="text-[#0c0c0b]/40 text-xs">
                  Hệ thống hoạt động bình thường
                </p>
              </div>
              <a
                href="#"
                className="text-xs text-[#0c0c0b]/40 hover:text-[#280f91] transition-colors"
              >
                Điều khoản
              </a>
              <a
                href="#"
                className="text-xs text-[#0c0c0b]/40 hover:text-[#280f91] transition-colors"
              >
                Bảo mật
              </a>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
