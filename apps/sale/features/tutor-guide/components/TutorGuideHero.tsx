"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { ArrowRightIcon } from "@phosphor-icons/react";

export function TutorGuideHero() {
  return (
    <section
      className="relative min-h-[100dvh] flex items-center overflow-hidden"
      aria-labelledby="tutor-guide-h1"
    >
      <div
        className="absolute inset-0 bg-[linear-gradient(145deg,#fff9e6_0%,#ffffff_55%,#fff3cb_100%)]"
        aria-hidden="true"
      />

      <div
        className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_80%_60%_at_70%_50%,rgba(255,197,0,0.15)_0%,transparent_70%)]"
        aria-hidden="true"
      />

      <div
        className="absolute top-1/2 right-0 -translate-y-1/2 w-[600px] h-[600px] rounded-full border border-accent/20 hidden lg:block"
        aria-hidden="true"
      />
      <div
        className="absolute top-1/2 right-0 -translate-y-1/2 translate-x-1/4 w-[480px] h-[480px] rounded-full border border-accent/40 hidden lg:block"
        aria-hidden="true"
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          <div className="flex flex-col gap-8">
            <motion.div
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="inline-flex self-start items-center gap-2 rounded-full border border-accent bg-accent/20 px-4 py-1.5"
            >
              <span
                className="text-xs text-foreground/80"
                style={{
                  fontFamily: "var(--font-montserrat)",
                  fontWeight: 700,
                }}
              >
                Nền tảng gia sư công nghệ thế hệ mới
              </span>
            </motion.div>

            <motion.h1
              id="tutor-guide-h1"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.6,
                delay: 0.1,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="text-foreground text-[1.5rem] sm:text-5xl lg:text-[2.3rem] leading-normal tracking-tight "
              style={{
                fontFamily: "var(--font-montserrat)",
                fontWeight: 800,
              }}
            >
              Nâng tầm hồ sơ giảng dạy,
              <br />
              Nhận lớp chủ động
              <br />
              Với{" "}
              <span
                className="text-accent"
                style={{
                  fontFamily: "var(--font-montserrat)",
                  fontWeight: 800,
                }}
              >
                Beewise
              </span>{" "}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.6,
                delay: 0.2,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="text-foreground/75 leading-relaxed max-w-[52ch]"
              style={{ fontSize: "clamp(0.9375rem, 1.5vw, 1.0625rem)" }}
            >
              BeeWise giúp bạn kết nối với học viên phù hợp thông qua công nghệ
              AI, giảm thời gian tìm lớp và tối ưu cơ hội nhận học viên. Hồ sơ
              xác thực rõ ràng, có đội ngũ hỗ trợ đồng hành trong suốt quá trình
              giảng dạy.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.6,
                delay: 0.32,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="flex flex-col sm:flex-row gap-3"
            >
              <Link
                href="/register"
                id="hero-cta-register"
                className="inline-flex h-13 items-center justify-center gap-2 rounded-full bg-primary px-8 text-sm font-bold text-primary-foreground transition-all duration-200 hover:bg-primary/90 active:scale-[0.98] shadow-lg shadow-primary/25 whitespace-nowrap"
                style={{ fontFamily: "var(--font-montserrat)" }}
              >
                Đăng Ký Trở Thành Gia Sư
                <ArrowRightIcon size={16} weight="bold" aria-hidden="true" />
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.45 }}
              className="flex items-center gap-3"
            >
              <div className="flex -space-x-2">
                {[
                  { bg: "#447353", label: "GS" },
                  { bg: "#280f91", label: "TG" },
                  { bg: "#905b0f", label: "NV" },
                  { bg: "#447353", label: "HL" },
                ].map((a, i) => (
                  <div
                    key={i}
                    className="w-8 h-8 rounded-full border-2 border-background flex items-center justify-center text-white text-[10px] font-bold shrink-0"
                    style={{
                      background: a.bg,
                      fontFamily: "var(--font-montserrat)",
                    }}
                    aria-hidden="true"
                  >
                    {a.label}
                  </div>
                ))}
              </div>
              <p className="text-foreground/60 text-xs leading-snug font-medium">
                Hàng nghìn gia sư đang đồng hành cùng BeeWise
              </p>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.92, x: 40 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{
              duration: 0.75,
              delay: 0.15,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="hidden lg:flex justify-center items-center relative"
          >
            <div className="relative w-125 h-110 rounded-3xl flex items-center justify-center bg-[rgba(255,255,255,0.6)] border border-[rgba(255,197,0,0.3)] shadow-[inset_0_1px_0_rgba(255,255,255,0.8),_0_32px_64px_rgba(255,197,0,0.15)] backdrop-blur-[24px]">
              <div className="absolute z-999 -top-5 -left-6 rounded-2xl px-4 py-2.5 shadow-xl bg-white border border-black/5">
                <p
                  className="text-xs text-foreground/60 leading-none mb-1"
                  style={{ fontFamily: "var(--font-montserrat)" }}
                >
                  Hồ sơ xác thực
                </p>
                <p
                  className="text-primary text-sm leading-none"
                  style={{
                    fontFamily: "var(--font-montserrat)",
                    fontWeight: 700,
                  }}
                >
                  Tăng uy tín
                </p>
              </div>

              <div className="absolute z-999 -bottom-5 -right-6 rounded-2xl px-4 py-2.5 shadow-xl bg-white border border-black/5">
                <p
                  className="text-xs text-foreground/60 leading-none mb-1"
                  style={{ fontFamily: "var(--font-montserrat)" }}
                >
                  Kết nối bằng AI
                </p>
                <p
                  className="text-primary text-sm leading-none"
                  style={{
                    fontFamily: "var(--font-montserrat)",
                    fontWeight: 700,
                  }}
                >
                  Không phí nhận lớp
                </p>
              </div>

              <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-2xl border border-white/20">
                <Image
                  src="https://res.cloudinary.com/dqevxj2k6/image/upload/v1784775328/Tutor-Guide-Hero_s9y0sq.png"
                  alt="Đội ngũ BeeWise"
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 1024px) 100vw, 600px"
                  quality={90}
                />
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.8 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        aria-hidden="true"
      >
        <span
          className="text-foreground/30 text-xs tracking-widest uppercase font-bold"
          style={{ fontFamily: "var(--font-montserrat)" }}
        >
          Cuộn để khám phá
        </span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          className="w-0.5 h-8 rounded-full bg-gradient-to-b from-primary/40 to-transparent"
        />
      </motion.div>
    </section>
  );
}
