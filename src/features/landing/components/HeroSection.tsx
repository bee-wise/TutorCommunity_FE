"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { HeroMotion } from "./HeroMotion";
import { HeroCarousel } from "./HeroCarousel";
import { LightningIcon } from "@phosphor-icons/react";
import { Button } from "@/src/components/ui/button";
import { toast } from "@/src/components/ui/bee-toast";

export function HeroSection() {
  const router = useRouter();
  const [query, setQuery] = useState("");

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
            <div className="flex flex-col gap-7">
              <h4 className="text-accent italic font-sans">
                BeeWise: &quot;Find your tutor, fuel your future&quot;
              </h4>
              <h1
                id="hero-headline"
                className="font-montserrat text-[2rem] sm:text-5xl lg:text-[3.5rem] leading-[1.08] tracking-normal text-primary"
                style={{ fontWeight: 800 }}
              >
                Tìm Gia Sư Phù Hợp{" "}
                <span className="text-accent">Trong 30 Giây</span>
              </h1>

              <p className="text-base sm:text-lg text-foreground/60 leading-relaxed max-w-[50ch]">
                Chỉ cần cho BeeWise biết bạn cần học gì. AI gợi ý gia sư phù hợp
                nhất dựa trên nhu cầu, ngân sách và mục tiêu của bạn.
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
                <div className="relative z-10 rounded-[14.5px] p-3.5 flex items-center gap-3 bg-card w-full h-full">
                  <input
                    type="text"
                    id="hero-ai-search"
                    placeholder='Ví dụ: "Gia sư Toán lớp 12, học online, 200.000đ/buổi"'
                    className="flex-1 bg-transparent text-sm text-foreground placeholder-foreground/35 outline-none min-w-0"
                    aria-label="Nhập nhu cầu tìm gia sư"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleSearch();
                    }}
                  />
                  <button
                    type="button"
                    onClick={handleSearch}
                    id="hero-cta-primary"
                    className="shrink-0 inline-flex h-9 items-center justify-center rounded-full bg-primary px-5 text-sm font-bold text-primary-foreground transition-all duration-200 hover:bg-primary/90 active:scale-[0.98] whitespace-nowrap shadow-lg shadow-primary/30"
                  >
                    <LightningIcon
                      size={16}
                      className="mr-2"
                      aria-hidden="true"
                    />
                    Tìm Ngay
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <Link
                  href="/tutors"
                  id="hero-cta-secondary"
                  className="inline-flex h-10 items-center justify-center rounded-full border-2 border-primary px-6 text-sm font-semibold text-primary transition-all duration-200 hover:bg-primary hover:text-primary-foreground active:scale-[0.98]"
                >
                  Tìm kiếm thủ công
                </Link>
              </div>
              <Button
                onClick={() => {
                  toast.success("Hehehe", {
                    description: "HAHAHAH",
                    duration: 5000,
                    position: "top-right",
                  });
                }}
              >
                Toast
              </Button>
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
