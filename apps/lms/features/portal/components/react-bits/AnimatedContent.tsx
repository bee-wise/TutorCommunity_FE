"use client";

import { useRef, type ReactNode } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { usePrefersReducedMotion } from "../../hooks/usePrefersReducedMotion";

// React Bits AnimatedContent, adapted for SSR, reduced motion and scoped cleanup.
// https://github.com/DavidHDev/react-bits/blob/main/src/ts-tailwind/Animations/AnimatedContent/AnimatedContent.tsx
// Copyright (c) 2026 David Haz. License: ./LICENSE
gsap.registerPlugin(ScrollTrigger, useGSAP);

type AnimatedContentProps = {
  children: ReactNode;
  className?: string;
  distance?: number;
  direction?: "vertical" | "horizontal";
  reverse?: boolean;
  delay?: number;
};

export function AnimatedContent({
  children, className, distance = 36, direction = "vertical", reverse = false, delay = 0,
}: AnimatedContentProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reducedMotion = usePrefersReducedMotion();

  useGSAP(() => {
    const el = ref.current;
    if (!el || reducedMotion) return;
    const axis = direction === "horizontal" ? "x" : "y";
    const timeline = gsap.timeline({ paused: true, delay });
    gsap.set(el, { [axis]: reverse ? -distance : distance, opacity: 0 });
    timeline.to(el, { [axis]: 0, opacity: 1, duration: 0.9, ease: "power3.out", clearProps: "transform,opacity" });
    ScrollTrigger.create({ trigger: el, start: "top 92%", once: true, onEnter: () => timeline.play() });
  }, { scope: ref, dependencies: [reducedMotion, distance, direction, reverse, delay], revertOnUpdate: true });

  return <div ref={ref} className={className}>{children}</div>;
}
