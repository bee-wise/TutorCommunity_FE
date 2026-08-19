"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Sparkle,
  MicrophoneStage,
  BookOpen,
  Brain,
  ArrowRight,
} from "@phosphor-icons/react";

const AI_POINTS = [
  {
    icon: Sparkle,
    label: "Tìm kiếm gia sư bằng AI",
    bgIcon: "bg-purple-500/20 text-purple-300",
  },
  {
    icon: Brain,
    label: "Gợi ý gia sư phù hợp với bạn",
    bgIcon: "bg-cyan-500/20 text-cyan-300",
  },
];

export function AIFeaturesSection() {
  return (
    <section
      id="ai-features"
      aria-labelledby="ai-features-headline"
      className="py-12 sm:py-16 lg:py-20 bg-background relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Dark Container Box (Udemy / Modern AI Card Style) */}
        <div className="relative rounded-[2rem] sm:rounded-[2.5rem] bg-[#1c1d25] p-6 sm:p-10 lg:p-12 xl:p-14 overflow-hidden border border-white/10 shadow-2xl">
          {/* Subtle Ambient Light Gradients */}
          <div className="pointer-events-none absolute -top-24 -left-24 w-96 h-96 rounded-full bg-primary/30 blur-[100px]" />
          <div className="pointer-events-none absolute -bottom-24 -right-24 w-96 h-96 rounded-full bg-purple-600/20 blur-[100px]" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 xl:gap-12 items-center relative z-10">
            {/* Left Column: Headline, Description, 2x2 Feature Bullets & CTA */}
            <div className="lg:col-span-5 flex flex-col justify-center space-y-6 sm:space-y-8">
              <div className="space-y-4">
                <h2
                  id="ai-features-headline"
                  className="text-2xl sm:text-4xl xl:text-[2.65rem] font-black text-white leading-[1.2] font-nunito tracking-tight"
                >
                  Nâng cao chất lượng học tập cùng{" "}
                  <span className="text-accent">BeeWise AI</span>
                </h2>

                <p className="text-slate-300/85 text-sm sm:text-base leading-relaxed max-w-xl">
                  BeeWise tối ưu hóa việc học tập qua nhiều công cụ AI, giúp bạn
                  kết nối đúng người, chuẩn bị kỹ càng và học hiệu quả hơn.
                </p>
              </div>

              {/* 2x2 Features Bullets */}
              <div className="grid grid-cols-1  gap-4 pt-1">
                {AI_POINTS.map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <div key={idx} className="flex items-center gap-3">
                      <div
                        className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center shrink-0 ${item.bgIcon}`}
                      >
                        <Icon size={16} weight="fill" />
                      </div>
                      <span className="text-white/90 text-sm sm:text-[15px] font-medium leading-snug">
                        {item.label}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* CTA Button */}
              <div className="pt-2">
                <Link
                  href="/tutors?mode=ai"
                  className="inline-flex items-center justify-center gap-2 bg-white text-[#1c1d25] hover:bg-slate-100 active:scale-[0.98] font-bold text-sm sm:text-base px-7 py-3 rounded-xl transition-all duration-200 shadow-lg shadow-black/20"
                >
                  <span>Trải nghiệm ngay</span>
                  <ArrowRight size={18} weight="bold" />
                </Link>
              </div>
            </div>

            {/* Right Column: AI Visual Artwork / Collage Image (Larger, No Border, Crisp Quality) */}
            <div className="lg:col-span-7 flex items-center justify-center">
              <div className="relative w-full flex items-center justify-center">
                <Image
                  src="/images/Banner/AIBanner.png"
                  alt="BeeWise AI Features"
                  width={1400}
                  height={1000}
                  unoptimized
                  sizes="(max-width: 1024px) 100vw, 65vw"
                  className="w-full h-auto object-contain select-none"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
