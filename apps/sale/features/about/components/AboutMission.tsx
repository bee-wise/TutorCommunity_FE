"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Merienda } from "next/font/google";
import {
  SparklesIcon,
  BoltIcon,
  AcademicCapIcon,
  ArrowTrendingUpIcon,
  LightBulbIcon,
  FlagIcon,
  GlobeAltIcon,
  RocketLaunchIcon,
} from "@heroicons/react/24/outline";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const meriendaFont = Merienda({
  subsets: ["vietnamese", "latin"],
  weight: ["400", "700"],
  display: "swap",
});

// ── Floating Decorative SVGs ────────────────────────────────────────────────

function FloatingSparkle({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 40 40" fill="none">
      <path
        d="M20 0 L22 17.5 L40 20 L22 22.5 L20 40 L18 22.5 L0 20 L18 17.5 Z"
        fill="currentColor"
      />
    </svg>
  );
}

function FloatingRing({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 50 50" fill="none">
      <circle
        cx="25"
        cy="25"
        r="20"
        stroke="currentColor"
        strokeWidth="4"
        strokeDasharray="6 6"
      />
    </svg>
  );
}

// ── 4 Core Values Data ──────────────────────────────────────────────────────

const CORE_VALUES = [
  {
    id: "streamlined",
    num: "01",
    icon: BoltIcon,
    title: "Tinh gọn",
    accentColor: "from-blue-500/20 to-cyan-500/5",
    iconColor: "text-blue-600 bg-blue-500/10 border-blue-500/20",
  },
  {
    id: "practical",
    num: "02",
    icon: AcademicCapIcon,
    title: "Thực tiễn",
    accentColor: "from-emerald-500/20 to-teal-500/5",
    iconColor: "text-emerald-600 bg-emerald-500/10 border-emerald-500/20",
  },
  {
    id: "progressive",
    num: "03",
    icon: ArrowTrendingUpIcon,
    title: "Tiến bộ",
    accentColor: "from-amber-500/20 to-orange-500/5",
    iconColor: "text-amber-600 bg-amber-500/10 border-amber-500/20",
  },
  {
    id: "creative",
    num: "04",
    icon: LightBulbIcon,
    title: "Sáng tạo",
    accentColor: "from-violet-500/20 to-purple-500/5",
    iconColor: "text-violet-600 bg-violet-500/10 border-violet-500/20",
  },
];

export function AboutMission() {
  const containerRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      // Floating ambient SVGs
      gsap.to(".mission-sparkle-1", {
        rotation: 360,
        y: -15,
        duration: 6,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      gsap.to(".mission-sparkle-2", {
        rotation: -360,
        y: 12,
        duration: 5,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      gsap.to(".mission-ring", {
        rotation: 180,
        duration: 16,
        repeat: -1,
        ease: "none",
      });
    },
    { scope: containerRef },
  );

  return (
    <section
      ref={containerRef}
      className="py-20 sm:py-28 bg-background relative overflow-hidden font-google-sans"
      id="about-mission"
    >
      {/* Ambient background glow */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[700px] rounded-full bg-accent/5 blur-[160px]" />
        <div className="absolute bottom-10 left-10 w-[450px] h-[450px] rounded-full bg-primary/5 blur-[130px]" />
      </div>

      {/* Floating SVGs */}
      <FloatingSparkle className="mission-sparkle-1 absolute top-20 right-12 w-8 h-8 text-accent/35 pointer-events-none" />
      <FloatingSparkle className="mission-sparkle-2 absolute bottom-28 left-8 w-6 h-6 text-primary/25 pointer-events-none" />
      <FloatingRing className="mission-ring absolute top-1/2 right-6 w-12 h-12 text-foreground/10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-20 sm:space-y-28">
        {/* ── 1. SỨ MỆNH (MISSION) ─────────────────────────────────── */}
        <div>
          <div className="max-w-3xl mx-auto text-center mb-10 sm:mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs sm:text-sm font-bold uppercase tracking-wider mb-4 border border-primary/15 font-nunito">
              <SparklesIcon className="w-4 h-4 text-accent animate-pulse" />
              Sứ mệnh
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-[2.75rem] font-black uppercase text-primary leading-tight font-nunito tracking-tight">
              Sứ mệnh của{" "}
              <span className="text-accent relative inline-block">
                BeeWise
                <svg
                  className="absolute -bottom-2 left-0 w-full text-accent/40"
                  viewBox="0 0 100 8"
                  fill="none"
                  preserveAspectRatio="none"
                >
                  <path
                    d="M0 4 C 30 0, 70 8, 100 4"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
            </h2>
          </div>

          <div className="max-w-4xl mx-auto p-8 sm:p-12 rounded-[2.5rem] bg-gradient-to-br from-card via-card to-card/80 border border-border shadow-soft relative overflow-hidden backdrop-blur-xl">
            <div className="absolute -top-20 -right-20 w-52 h-52 bg-accent/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-20 -left-20 w-52 h-52 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

            <p
              className={`${meriendaFont.className} text-xl sm:text-2xl lg:text-[1.65rem] text-foreground/90 leading-relaxed sm:leading-loose font-normal tracking-wide`}
            >
              “Bằng việc tích hợp tối đa sức mạnh của AI và công nghệ tương tác
              trực quan, BeeWise không chỉ tập trung giải quyết sự rời rạc và
              thiếu minh bạch của thị trường gia sư như khó xác minh năng lực và
              mức độ phù hợp của người dạy; quy trình tìm kiếm, trao đổi và tổ
              chức lớp học thông tin an toàn,...mà còn mở ra không gian học tập
              cá nhân, đưa học viên từ “ghi nhớ tạm thời” sang “làm chủ kiến
              thức và ứng dụng hiệu quả””
            </p>
          </div>
        </div>

        {/* ── 2. TẦM NHÌN (VISION) ─────────────────────────────────── */}
        <div>
          <div className="text-center mb-10 sm:mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/10 text-accent text-xs sm:text-sm font-bold uppercase tracking-wider mb-4 border border-accent/20 font-nunito">
              <GlobeAltIcon className="w-4 h-4" />
              Tầm nhìn
            </div>
            <h3 className="text-3xl sm:text-4xl lg:text-[2.5rem] font-black uppercase text-foreground font-nunito tracking-tight">
              Tầm nhìn (Vision)
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Mục tiêu ngắn hạn */}
            <div className="group relative p-8 sm:p-10 rounded-3xl bg-card border border-border shadow-soft hover:shadow-xl hover:border-primary/40 transition-all duration-300 flex flex-col justify-between">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent rounded-3xl pointer-events-none" />
              <div>
                <div className="flex items-center gap-3.5 mb-5">
                  <div className="size-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20 group-hover:scale-105 transition-transform">
                    <FlagIcon className="size-6" />
                  </div>
                  <h4 className="font-nunito font-black text-xl sm:text-2xl text-primary uppercase tracking-tight">
                    Mục tiêu ngắn hạn
                  </h4>
                </div>
                <p className="text-base sm:text-lg text-foreground/85 leading-relaxed">
                  Chuẩn hóa các quy trình trải nghiệm và nâng cao việc tìm kiếm,
                  kết nối theo nhu cầu của gia sư - học viên - phụ huynh gắn
                  liền với xây dựng cộng đồng gia sư uy tín
                </p>
              </div>
            </div>

            {/* Mục tiêu dài hạn */}
            <div className="group relative p-8 sm:p-10 rounded-3xl bg-card border border-border shadow-soft hover:shadow-xl hover:border-accent/40 transition-all duration-300 flex flex-col justify-between">
              <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent rounded-3xl pointer-events-none" />
              <div>
                <div className="flex items-center gap-3.5 mb-5">
                  <div className="size-12 rounded-2xl bg-accent/10 flex items-center justify-center text-accent border border-accent/20 group-hover:scale-105 transition-transform">
                    <GlobeAltIcon className="size-6" />
                  </div>
                  <h4 className="font-nunito font-black text-xl sm:text-2xl text-accent uppercase tracking-tight">
                    Mục tiêu dài hạn
                  </h4>
                </div>
                <p className="text-base sm:text-lg text-foreground/85 leading-relaxed">
                  Phát triển BeeWise thành hệ sinh thái giải pháp công nghệ giáo
                  dục thúc đẩy môi trường học tập chủ động và an toàn
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ── 3. 4 GIÁ TRỊ CỐT LÕI ──────────────────────────────────── */}
        <div>
          <div className="text-center mb-10 sm:mb-12">
            <p className="font-mono text-xs uppercase tracking-[0.25em] text-primary/60 mb-2">
              Nền tảng phát triển
            </p>
            <h3 className="text-3xl sm:text-4xl lg:text-[2.5rem] font-black uppercase text-foreground font-nunito tracking-tight">
              4 giá trị cốt lõi
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {CORE_VALUES.map((v) => {
              const Icon = v.icon;
              return (
                <div
                  key={v.id}
                  className="group relative p-8 rounded-3xl bg-card border border-border shadow-soft hover:shadow-2xl hover:border-primary/30 hover:-translate-y-1.5 transition-all duration-300 overflow-hidden flex flex-col items-center text-center justify-between min-h-[220px]"
                >
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${v.accentColor} opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`}
                  />

                  <div className="w-full flex items-center justify-between mb-4">
                    <span className="font-mono text-xs font-bold text-muted-foreground">
                      VAL
                    </span>
                    <span className="font-nunito font-black text-xl text-foreground/20 group-hover:text-primary/40 transition-colors">
                      {v.num}
                    </span>
                  </div>

                  <div
                    className={`size-16 rounded-2xl flex items-center justify-center shrink-0 ${v.iconColor} border shadow-inner transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3 mb-4`}
                  >
                    <Icon className="size-8" />
                  </div>

                  <h4 className="font-nunito font-black text-2xl text-foreground tracking-tight">
                    {v.title}
                  </h4>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
