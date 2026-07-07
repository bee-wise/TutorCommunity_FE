"use client";

import Image from "next/image";
import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import {
  Clock,
  ShieldWarning,
  ChatCircleDots,
  MagnifyingGlass,
} from "@phosphor-icons/react";
import { PAIN_POINTS } from "../data/landing.data";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

const ICON_MAP = {
  Clock,
  ShieldWarning,
  ChatCircleDots,
  MagnifyingGlass,
} as const;

type IconKey = keyof typeof ICON_MAP;

export function PainPointSection() {
  const containerRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const bubbles = gsap.utils.toArray(".painpoint-bubble");

      gsap.set(bubbles, { scale: 0, autoAlpha: 0, transformOrigin: "50% 50%" });

      ScrollTrigger.create({
        trigger: containerRef.current,
        start: "top 75%",
        onEnter: () => {
          bubbles.forEach((bubble, i) => {
            const delay = i * 0.15 + gsap.utils.random(-0.05, 0.05);

            gsap.to(bubble as Element, {
              scale: 1,
              autoAlpha: 1,
              duration: 0.6,
              ease: "back.out(1.5)",
              delay: delay,
            });
          });
        },
        once: true,
      });
    },
    { scope: containerRef },
  );

  return (
    <section
      ref={containerRef}
      className="relative bg-background py-4 sm:py-28 overflow-hidden h-fit md:min-h-[500px] flex items-center"
      id="pain-points"
      aria-labelledby="pain-headline"
    >
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/Banner/Painpoint-1.svg"
          alt="Painpoints Background"
          fill
          sizes="100vw"
          className="hidden sm:block object-contain lg:object-right opacity-30 lg:opacity-100"
          priority
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto w-full sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className="hidden lg:block"></div>

          {/* Cột phải (Bubbles) - Dàn 2 cột 2 dòng căn đều */}
          <div className="hidden sm:grid grid-cols-2 gap-8 w-full h-[600px] place-content-center">
            {PAIN_POINTS.map((point) => {
              const Icon = ICON_MAP[point.icon as IconKey];
              return (
                <div
                  key={point.id}
                  className="painpoint-bubble p-5 rounded-3xl bg-card/85 backdrop-blur-xl border border-border shadow-2xl flex gap-4 max-w-[320px] place-self-center"
                >
                  <div className="shrink-0 w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Icon size={24} weight="duotone" className="text-primary" />
                  </div>
                  <p className="text-sm text-foreground/85 leading-relaxed font-medium">
                    {point.text}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Mobile version - Only Image */}
          <div className="block sm:hidden relative z-10 w-full mt-0">
            <Image
              src="/images/Banner/Paintpoint-2.png"
              alt="Painpoints Mobile"
              width={800}
              height={1200}
              className="w-full h-auto object-contain"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
}
