"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Merienda } from "next/font/google";
import {
  Eye,
  Rocket,
  Heart,
  ShieldCheck,
  Handshake,
  Lightbulb,
  Sparkles,
} from "lucide-react";

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

// ── Mission & Values Data ───────────────────────────────────────────────────

const MISSION_VALUES = [
  {
    id: "transparency",
    num: "01",
    icon: Eye,
    title: "Minh Bạch",
    quote: "Rõ ràng từ đầu, an tâm đồng hành.",
    desc: "Mọi thông tin về năng lực gia sư, học phí và lộ trình đều được công khai và bảo chứng 100%.",
    accentColor: "from-blue-500/20 to-cyan-500/5",
    iconColor: "text-blue-600 bg-blue-500/10 border-blue-500/20",
    themeHex: "#3b82f6",
  },
  {
    id: "quality",
    num: "02",
    icon: ShieldCheck,
    title: "Chất Lượng",
    quote: "Xác thực tận tâm, kiểm duyệt nghiêm ngặt.",
    desc: "Mỗi gia sư trên nền tảng đều trải qua quy trình đánh giá chuẩn mực để đảm bảo hiệu quả cho từng buổi học.",
    accentColor: "from-emerald-500/20 to-teal-500/5",
    iconColor: "text-emerald-600 bg-emerald-500/10 border-emerald-500/20",
    themeHex: "#10b981",
  },
  {
    id: "trust",
    num: "03",
    icon: Handshake,
    title: "Tin Tưởng",
    quote: "Cầu nối công bằng và vững chãi.",
    desc: "Bảo vệ tối đa quyền lợi bình đẳng của cả người dạy lẫn người học với cơ chế kết nối an toàn và minh bạch.",
    accentColor: "from-violet-500/20 to-purple-500/5",
    iconColor: "text-violet-600 bg-violet-500/10 border-violet-500/20",
    themeHex: "#8b5cf6",
  },
  {
    id: "impact",
    num: "04",
    icon: Rocket,
    title: "Tác Động Thực",
    quote: "Mỗi bước tiến là một cột mốc.",
    desc: "Chúng tôi đo lường thành công bằng sự tiến bộ thực chất và niềm đam mê học hỏi được thắp sáng của học viên.",
    accentColor: "from-amber-500/20 to-orange-500/5",
    iconColor: "text-amber-600 bg-amber-500/10 border-amber-500/20",
    themeHex: "#f59e0b",
  },
  {
    id: "community",
    num: "05",
    icon: Heart,
    title: "Cộng Đồng",
    quote: "Gắn kết vì một nền giáo dục sẻ chia.",
    desc: "BeeWise không chỉ là nền tảng, mà là ngôi nhà chung của những người học tập có trách nhiệm và khát khao phát triển.",
    accentColor: "from-rose-500/20 to-pink-500/5",
    iconColor: "text-rose-600 bg-rose-500/10 border-rose-500/20",
    themeHex: "#f43f5e",
  },
  {
    id: "innovation",
    num: "06",
    icon: Lightbulb,
    title: "Đổi Mới",
    quote: "Công nghệ phụng sự con người.",
    desc: "Ứng dụng AI thông minh để tối ưu hóa quá trình tìm kiếm, giúp bạn tìm được người đồng hành lý tưởng nhanh nhất.",
    accentColor: "from-teal-500/20 to-cyan-500/5",
    iconColor: "text-teal-600 bg-teal-500/10 border-teal-500/20",
    themeHex: "#06b6d4",
  },
];

export function AboutMission() {
  const containerRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      // Refresh ScrollTrigger to ensure accurate trigger offsets
      ScrollTrigger.refresh();

      // 1. Mission Header Animations
      gsap.from(".mission-badge", {
        y: -20,
        opacity: 0,
        duration: 0.6,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".mission-header",
          start: "top 90%",
          toggleActions: "play none none none",
        },
      });

      gsap.from(".mission-title", {
        y: 30,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
        delay: 0.1,
        scrollTrigger: {
          trigger: ".mission-header",
          start: "top 90%",
          toggleActions: "play none none none",
        },
      });

      gsap.from(".mission-quote-box", {
        scale: 0.96,
        opacity: 0,
        y: 25,
        duration: 0.8,
        ease: "power3.out",
        delay: 0.15,
        scrollTrigger: {
          trigger: ".mission-quote-box",
          start: "top 90%",
          toggleActions: "play none none none",
        },
      });

      // 2. Core Values Subtitle
      gsap.from(".values-heading", {
        y: 25,
        opacity: 0,
        duration: 0.7,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".values-heading",
          start: "top 90%",
          toggleActions: "play none none none",
        },
      });

      // 3. Value Cards Stagger (robust trigger on the grid container)
      gsap.from(".value-card", {
        y: 40,
        opacity: 0,
        duration: 0.7,
        ease: "power3.out",
        stagger: 0.1,
        clearProps: "transform,opacity",
        scrollTrigger: {
          trigger: ".values-grid",
          start: "top 90%",
          toggleActions: "play none none none",
        },
      });

      // 4. Floating ambient SVGs
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

      // 5. Mouse parallax on subtle accents
      const handleMouseMove = (e: MouseEvent) => {
        const rect = containerRef.current?.getBoundingClientRect();
        if (!rect) return;
        const dx = (e.clientX - (rect.left + rect.width / 2)) / rect.width;
        const dy = (e.clientY - (rect.top + rect.height / 2)) / rect.height;

        gsap.to(".mission-sparkle-1", {
          x: dx * 25,
          y: dy * 20,
          duration: 0.8,
          overwrite: "auto",
        });
        gsap.to(".mission-sparkle-2", {
          x: dx * -20,
          y: dy * -15,
          duration: 0.8,
          overwrite: "auto",
        });
      };

      containerRef.current?.addEventListener("mousemove", handleMouseMove);
      return () =>
        containerRef.current?.removeEventListener("mousemove", handleMouseMove);
    },
    { scope: containerRef },
  );

  return (
    <section
      ref={containerRef}
      className="py-20 sm:py-28 bg-background relative overflow-hidden"
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="mission-header max-w-3xl mx-auto text-center mb-12 sm:mb-16">
          <div className="mission-badge inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs sm:text-sm font-bold uppercase tracking-wider mb-4 border border-primary/15">
            <Sparkles className="w-3.5 h-3.5 text-accent animate-pulse" />
            Tầm Nhìn & Sứ Mệnh
          </div>

          <h2 className="mission-title text-4xl sm:text-5xl lg:text-[3.2rem] font-black uppercase text-primary leading-tight font-nunito tracking-tight">
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

        {/* Featured Big Mission Statement Quote */}
        <div className="mission-quote-box max-w-4xl mx-auto mb-20 p-8 sm:p-12 rounded-[2.5rem] bg-gradient-to-br from-card via-card to-card/60 border border-border/60 shadow-[0_20px_50px_rgba(0,0,0,0.05)] relative overflow-hidden text-center backdrop-blur-xl">
          {/* Subtle Glow inside quote box */}
          <div className="absolute -top-20 -right-20 w-52 h-52 bg-accent/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-20 -left-20 w-52 h-52 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

          <p
            className={`${meriendaFont.className} text-xl sm:text-2xl lg:text-3xl text-foreground/85 leading-relaxed sm:leading-loose font-normal tracking-wide`}
          >
            “BeeWise hướng đến việc xây dựng một hệ sinh thái giáo dục minh
            bạch, nơi mọi học viên đều tìm được người thầy truyền cảm hứng, và
            mọi gia sư tâm huyết đều được tôn vinh xứng đáng.”
          </p>

          <div className="mt-6 flex items-center justify-center gap-3">
            <div className="h-0.5 w-12 bg-accent/60 rounded-full" />
            <span className="text-xs uppercase tracking-[0.25em] font-bold text-foreground/45 font-mono">
              Cam kết từ BeeWise
            </span>
            <div className="h-0.5 w-12 bg-accent/60 rounded-full" />
          </div>
        </div>

        {/* Core Values Sub-headline */}
        <div className="values-heading text-center mb-12">
          <p className="font-mono text-xs uppercase tracking-[0.25em] text-primary/60 mb-2">
            Nền tảng phát triển
          </p>
          <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black uppercase text-foreground font-nunito tracking-tight">
            Giá trị cốt lõi
          </h3>
        </div>

        {/* 6 Core Value Cards Grid */}
        <div className="values-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {MISSION_VALUES.map((v) => {
            const Icon = v.icon;
            return (
              <div
                key={v.id}
                className="value-card group relative p-8 rounded-3xl bg-card border border-border/60 shadow-sm hover:shadow-2xl hover:border-primary/25 hover:-translate-y-1.5 transition-all duration-300 overflow-hidden flex flex-col justify-between"
              >
                {/* Background Card Hover Aura */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${v.accentColor} opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`}
                />

                {/* Top: Icon + Number Badge */}
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div
                      className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${v.iconColor} shadow-inner transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3`}
                    >
                      <Icon className="w-7 h-7" />
                    </div>
                    <span className="font-nunito font-black text-2xl text-foreground/15 group-hover:text-primary/30 transition-colors">
                      {v.num}
                    </span>
                  </div>

                  {/* Title */}
                  <h4 className="font-nunito font-black text-2xl text-foreground uppercase tracking-tight mb-2">
                    {v.title}
                  </h4>

                  {/* Handwritten mini quote in Merienda */}
                  <p
                    className={` font-nunito text-base sm:text-lg text-foreground/75 leading-snug mb-4 font-normal`}
                  >
                    {v.quote}
                  </p>
                </div>

                {/* Description */}
                <p className="text-sm font-google-sans text-foreground/60 leading-relaxed relative z-10 border-t border-border/40 pt-4">
                  {v.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
