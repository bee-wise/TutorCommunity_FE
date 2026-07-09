"use client";

import Image from "next/image";
import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import {
  MagnifyingGlass,
  ShieldWarning,
  Star,
  Certificate,
} from "@phosphor-icons/react";
import { TUTOR_PAIN_POINTS } from "../data/landing.data";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

const ICON_MAP = {
  MagnifyingGlass,
  ShieldWarning,
  Star,
  Certificate,
} as const;

type IconKey = keyof typeof ICON_MAP;

export function TutorPainpointSection() {
  const containerRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const bubbles = gsap.utils.toArray(".tutor-painpoint-bubble");

      gsap.set(bubbles, { autoAlpha: 0, y: 30 });

      ScrollTrigger.create({
        trigger: containerRef.current,
        start: "top 75%",
        onEnter: () => {
          gsap.to(bubbles, {
            y: 0,
            autoAlpha: 1,
            duration: 0.8,
            ease: "power2.out",
            stagger: 0.15,
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
      className="relative bg-[#f8f9fc] pb-4 pt-4 sm:py-28 overflow-hidden h-fit md:min-h-[500px] flex items-center"
      id="tutor-pain-points"
      aria-labelledby="tutor-pain-headline"
    >
      {/* Desktop Background */}
      <div className="">
        <Image
          src="https://res.cloudinary.com/dqevxj2k6/image/upload/v1783561324/beewise/Paintpoint-2.svg"
          alt="Tutor Painpoints Background"
          fill
          sizes="100vw"
          className="hidden sm:block object-cover lg:object-left opacity-30 lg:opacity-100"
          priority
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto w-full sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Cột trái (Bubbles) - Dàn 2 cột 2 dòng căn đều */}
          <div className="hidden sm:grid grid-cols-2 gap-8 w-full h-[600px] place-content-center">
            {TUTOR_PAIN_POINTS.map((point) => {
              const Icon = ICON_MAP[point.icon as IconKey];
              return (
                <div
                  key={point.id}
                  className="tutor-painpoint-bubble p-5 rounded-3xl bg-card/90 backdrop-blur-xl border border-border shadow-xl flex gap-4 max-w-[320px] place-self-center hover:border-secondary/20 hover:shadow-2xl transition-all duration-300"
                >
                  <div className="shrink-0 w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
                    <Icon size={24} weight="duotone" className="text-accent" />
                  </div>
                  <p className="text-sm text-foreground/85 leading-relaxed font-medium">
                    {point.text}
                  </p>
                </div>
              );
            })}
          </div>

          <div className="hidden lg:block"></div>

          {/* Mobile version - Only Image */}
          <div className="block sm:hidden relative z-10 w-full mt-0">
            <Image
              src="/images/Banner/Painpoint-3.png"
              alt="Tutor Painpoints Mobile"
              width={800}
              height={1200}
              className="w-full h-auto object-cover"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
}
