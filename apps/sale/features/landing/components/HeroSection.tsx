"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { HeroMotion } from "@workspace/ui/components/HeroMotion";
import { HeroCarousel } from "./HeroCarousel";
import { LightningIcon } from "@phosphor-icons/react";
import { FunnelIcon } from "lucide-react";

export function HeroSection() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const handleSearch = () => {
    if (query.trim()) {
      router.push(`/tutors?mode=ai&q=${encodeURIComponent(query.trim())}`);
    } else {
      router.push("/tutors?mode=ai");
    }
  };

  return (
    <section
      className="relative lg:min-h-dvh flex items-center overflow-hidden bg-background"
      aria-labelledby="hero-headline"
      id="#"
    >
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
        style={{
          backgroundImage:
            "radial-gradient(circle at 15% 85%, rgba(255,197,0,0.10) 0%, transparent 45%), radial-gradient(circle at 85% 15%, var(--primary-opacity, rgba(40,15,145,0.06)) 0%, transparent 50%)",
        }}
      />

      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-24 pb-8 lg:pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <HeroMotion>
            <div className="flex flex-col gap-5">
              <h4 className="text-accent italic font-sans">
                &quot;Gia sư BeeWise, kiến tạo tương lai&quot;
              </h4>
              <h1
                id="hero-headline"
                className="font-nunito uppercase text-[2rem] sm:text-5xl lg:text-[3.2rem] leading-[1.18] tracking-normal text-primary"
                style={{ fontWeight: 900 }}
              >
                Tìm Gia Sư Phù Hợp{" "}
                <span className="text-accent">Với Beewise AI</span>
              </h1>

              <p className="text-base sm:text-lg text-foreground/60 leading-relaxed max-w-[50ch]">
                Tìm gia sư phù hợp hoặc bắt đầu hành trình trở thành gia sư tại
                BeeWise - nền tảng cộng đồng gia sư giúp việc học và giảng dạy
                trở nên dễ dàng, minh bạch và hiệu quả hơn.
              </p>

              <div
                className="relative rounded-2xl p-[1.5px] overflow-hidden bg-primary/20"
                style={{ boxShadow: "0 4px 20px rgba(40,15,145,0.08)" }}
              >
                <div
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[250%] aspect-square animate-spin pointer-events-none"
                  style={{
                    background:
                      "conic-gradient(from 0deg, transparent 0%, transparent 20%, #a855f7 35%, #3b82f6 50%, var(--primary) 65%, transparent 80%)",
                    animationDuration: "3s",
                  }}
                  aria-hidden="true"
                />
                <div className="relative z-10 rounded-[14.5px] p-2.5 sm:p-3.5 flex items-center gap-2 sm:gap-3 bg-card w-full">
                  <div className="relative flex-1 min-w-0 flex items-center overflow-hidden py-1">
                    <input
                      type="text"
                      id="hero-ai-search"
                      placeholder='Ví dụ: "Gia sư Toán lớp 12, học online, 200.000đ/buổi"'
                      className="w-full bg-transparent text-xs sm:text-sm text-foreground outline-none placeholder:text-foreground/35 placeholder:opacity-0 sm:placeholder:opacity-100 min-w-0 relative z-10 leading-normal"
                      aria-label="Nhập nhu cầu tìm gia sư"
                      value={query}
                      onFocus={() => setIsFocused(true)}
                      onBlur={() => setIsFocused(false)}
                      onChange={(e) => setQuery(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleSearch();
                      }}
                    />

                    {/* Running placeholder marquee for mobile when input is empty & not focused */}
                    {!query && !isFocused && (
                      <div
                        aria-hidden="true"
                        className="absolute inset-y-0 left-0 right-0 pointer-events-none flex items-center overflow-hidden sm:hidden select-none"
                        style={{
                          maskImage:
                            "linear-gradient(to right, black 75%, transparent 95%)",
                          WebkitMaskImage:
                            "linear-gradient(to right, black 75%, transparent 95%)",
                        }}
                      >
                        <div className="animate-marquee-text text-xs text-foreground/35 leading-normal flex items-center flex-nowrap whitespace-nowrap">
                          <span className="whitespace-nowrap shrink-0 pr-12">
                            Ví dụ: &quot;Gia sư Toán lớp 12, học online,
                            200.000đ/buổi&quot;
                          </span>
                          <span className="whitespace-nowrap shrink-0 pr-12">
                            Ví dụ: &quot;Gia sư Toán lớp 12, học online,
                            200.000đ/buổi&quot;
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={handleSearch}
                    id="hero-cta-primary"
                    className="shrink-0 inline-flex h-9 items-center justify-center rounded-full bg-primary px-3.5 sm:px-5 text-xs sm:text-sm font-bold text-primary-foreground transition-all duration-200 hover:bg-primary/90 active:scale-[0.98] whitespace-nowrap shadow-lg shadow-primary/30"
                  >
                    <LightningIcon
                      size={15}
                      className="mr-1 sm:mr-2"
                      aria-hidden="true"
                    />
                    Tìm Ngay
                  </button>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-y-2 gap-x-4 px-1 text-xs sm:text-sm text-foreground/60">
                <div className="flex items-center gap-2">
                  <span className="text-foreground/50">Hoặc:</span>
                  <Link
                    href="/tutors?mode=manual"
                    id="hero-cta-secondary"
                    className="inline-flex items-center gap-1.5 rounded-full border border-primary/25 bg-accent/5 px-3.5 py-1 text-xs font-semibold text-accent transition-all duration-200 hover:bg-primary/10 hover:border-primary/40 active:scale-[0.98] group"
                  >
                    <span>Xem danh sách gia sư</span>
                  </Link>
                </div>

                <div className="flex items-center gap-1.5">
                  <span className="text-xs text-foreground/45">Gợi ý:</span>
                  {["Toán 12", "IELTS", "Tiếng Anh"].map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => setQuery(`Gia sư ${tag}`)}
                      className="rounded-full bg-accent/70 px-2.5 py-0.5 text-xs font-medium text-primary/75 transition-all hover:bg-primary/10 hover:text-primary cursor-pointer active:scale-95"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </HeroMotion>

          <div className="w-full lg:pl-4">
            <HeroCarousel />
          </div>
        </div>
      </div>
    </section>
  );
}
