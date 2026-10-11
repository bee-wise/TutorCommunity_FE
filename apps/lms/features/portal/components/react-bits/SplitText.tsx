"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { SplitText as GSAPSplitText } from "gsap/SplitText";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { usePrefersReducedMotion } from "../../hooks/usePrefersReducedMotion";
import styles from "../../styles/portal.module.css";

// React Bits SplitText, with a smaller portal API and cancellable font readiness.
// https://github.com/DavidHDev/react-bits/blob/main/src/ts-tailwind/TextAnimations/SplitText/SplitText.tsx
// Copyright (c) 2026 David Haz. License: ./LICENSE
gsap.registerPlugin(GSAPSplitText, ScrollTrigger, useGSAP);

type SplitTextProps = { text: string; accentText?: string; className?: string; tag?: "h1" | "h2"; delay?: number };

export function SplitText({ text, accentText, className, tag: Tag = "h2", delay = 0 }: SplitTextProps) {
  const ref = useRef<HTMLHeadingElement>(null);
  const reducedMotion = usePrefersReducedMotion();

  useGSAP((_context, contextSafe) => {
    const el = ref.current;
    if (!el || reducedMotion || !contextSafe) return;
    let cancelled = false;
    let split: GSAPSplitText | undefined;
    const start = contextSafe(() => {
      if (cancelled) return;
      split = GSAPSplitText.create(el, {
        type: "words", smartWrap: true, reduceWhiteSpace: false, aria: "auto",
        onSplit: (self) => gsap.fromTo(self.words, { opacity: 0, y: 28, rotationX: -30 }, {
          opacity: 1, y: 0, rotationX: 0, duration: 0.9, ease: "power3.out", stagger: 0.055, delay,
          scrollTrigger: { trigger: el, start: "top 92%", once: true },
        }),
      });
    });
    if (document.fonts.status === "loaded") start();
    else void document.fonts.ready.then(start);
    return () => { cancelled = true; split?.revert(); };
  }, { scope: ref, dependencies: [text, accentText, reducedMotion, delay], revertOnUpdate: true });

  return <Tag ref={ref} className={className}>{text}{accentText && <span className={styles.accentTitle}>{accentText}</span>}</Tag>;
}
