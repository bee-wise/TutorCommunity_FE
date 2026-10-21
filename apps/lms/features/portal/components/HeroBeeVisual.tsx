"use client";

import { useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";
import styles from "../styles/portal.module.css";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export function HeroBeeVisual() {
  const rootRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const reducedMotion = usePrefersReducedMotion();

  useGSAP(() => {
    if (reducedMotion) return;
    const float = gsap.to(imageRef.current, { y: -12, rotation: 1.2, duration: 3.5, repeat: -1, yoyo: true, ease: "sine.inOut", paused: true });
    ScrollTrigger.create({
      trigger: rootRef.current, start: "top bottom", end: "bottom top",
      onEnter: () => float.resume(), onEnterBack: () => float.resume(),
      onLeave: () => float.pause(), onLeaveBack: () => float.pause(),
    });
    const visibility = () => {
      if (document.hidden) float.pause();
      else if (rootRef.current && ScrollTrigger.isInViewport(rootRef.current)) float.resume();
    };
    document.addEventListener("visibilitychange", visibility);
    visibility();
    return () => document.removeEventListener("visibilitychange", visibility);
  }, { scope: rootRef, dependencies: [reducedMotion], revertOnUpdate: true });

  return (
    <div ref={rootRef} className={`relative mx-auto aspect-square w-full max-w-[560px] lg:max-w-none ${styles.heroVisual}`}>
      <div ref={imageRef} className="relative h-full w-full">
        <Image src="https://res.cloudinary.com/xcrm6ykz/image/upload/f_auto,q_auto,w_1440/v1790326857/bee-phone.png" alt="Ong BeeWise cùng điện thoại" width={1440} height={1440} preload sizes="(max-width: 1023px) min(100vw, 560px), 48vw" className="h-full w-full scale-[1.2] object-contain" />
      </div>
    </div>
  );
}
