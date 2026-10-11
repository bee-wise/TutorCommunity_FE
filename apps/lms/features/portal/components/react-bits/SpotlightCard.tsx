"use client";

import { useRef, type HTMLAttributes, type PointerEvent, type SyntheticEvent } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { usePrefersReducedMotion } from "../../hooks/usePrefersReducedMotion";
import styles from "../../styles/portal.module.css";

// React Bits SpotlightCard: retain the pointer-driven radial light, omit ambient
// loops/proximity/grain, and use GSAP for the portal's interaction transitions.
// https://github.com/DavidHDev/react-bits/blob/main/src/ts-tailwind/Components/SpotlightCard/SpotlightCard.tsx
// Copyright (c) 2026 David Haz. License: ./LICENSE
gsap.registerPlugin(useGSAP);

export function SpotlightCard({ children, className = "", ...props }: HTMLAttributes<HTMLDivElement>) {
  const ref = useRef<HTMLDivElement>(null);
  const reducedMotion = usePrefersReducedMotion();
  const { contextSafe } = useGSAP({ scope: ref });

  const move = (event: PointerEvent<HTMLDivElement>) => {
    if (reducedMotion || event.pointerType !== "mouse") return;
    const rect = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty("--spot-x", `${event.clientX - rect.left}px`);
    event.currentTarget.style.setProperty("--spot-y", `${event.clientY - rect.top}px`);
  };
  const fade = contextSafe((event: SyntheticEvent<HTMLDivElement>, opacity: number) => {
    const light = event.currentTarget.querySelector("[data-spotlight-light]");
    gsap.to(light, { opacity, duration: reducedMotion ? 0 : 0.35, overwrite: true });
  });
  const show = (event: SyntheticEvent<HTMLDivElement>) => { if (!reducedMotion) fade(event, 1); };
  const hide = (event: SyntheticEvent<HTMLDivElement>) => fade(event, 0);

  return (
    <div {...props} ref={ref} className={`${styles.spotlight} ${className}`} onPointerMove={move} onPointerEnter={show} onPointerLeave={hide} onFocusCapture={show} onBlurCapture={hide}>
      <span data-spotlight-light className={styles.spotlightLight} aria-hidden="true" />
      {children}
    </div>
  );
}
