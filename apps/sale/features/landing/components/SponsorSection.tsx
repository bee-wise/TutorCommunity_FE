"use client";

import Image from "next/image";
import { Handshake } from "@phosphor-icons/react";

export function SponsorSection() {
  return (
    <section
      className="py-12 sm:py-16 bg-muted/30 border-y border-border/60 relative overflow-hidden"
      id="sponsors"
      aria-labelledby="sponsors-heading"
    >
      {/* Subtle background glow */}
      <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-32 bg-primary/5 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col items-center text-center gap-6 sm:gap-8">
          {/* Tag & Small Title */}
          <div className="flex flex-col items-center gap-2">
            <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider">
              Đơn vị tài trợ
            </span>
          </div>

          {/* Sponsor Logo Card */}
          <div className="group p-6 sm:p-8 rounded-3xl bg-card border border-border/80 shadow-xs hover:shadow-xl hover:border-primary/20 transition-all duration-300 flex flex-col items-center justify-center max-w-md w-full">
            <div className="relative w-full h-16 sm:h-20 flex items-center justify-center">
              <Image
                src="https://res.cloudinary.com/xcrm6ykz/image/upload/v1787134517/2021-FPTU-Long.png"
                alt="Trường Đại Học FPT - Nhà tài trợ chính thức"
                width={360}
                height={120}
                unoptimized
                className="max-h-16 sm:max-h-20 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
