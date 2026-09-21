"use client";

import type { RefObject } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(useGSAP, ScrollTrigger);

export function useTutorGuideHeroMotion(
  scope: RefObject<HTMLElement | null>,
) {
  useGSAP(
    () => {
      const root = scope.current;
      if (!root) return;

      const media = gsap.matchMedia();
      media.add(
        {
          reduceMotion: "(prefers-reduced-motion: reduce)",
          desktop: "(min-width: 1024px)",
        },
        (context) => {
          const { reduceMotion, desktop } = context.conditions as {
            reduceMotion: boolean;
            desktop: boolean;
          };
          if (reduceMotion) return;

          const timeline = gsap.timeline({
            defaults: { duration: 0.75, ease: "power3.out" },
          });

          timeline
            .from("[data-hero-eyebrow]", { autoAlpha: 0, y: 16 })
            .from(
              "[data-hero-line]",
              { yPercent: 105, rotate: 1.5, stagger: 0.11 },
              "-=0.45",
            )
            .from(
              "[data-hero-copy]",
              { autoAlpha: 0, y: 18, stagger: 0.08 },
              "-=0.4",
            )
            .from(
              "[data-hero-visual]",
              {
                autoAlpha: 0,
                clipPath: "inset(12% 10% 12% 10% round 2rem)",
                scale: 0.96,
                duration: 1,
              },
              "-=0.75",
            );

          if (desktop) {
            gsap.to("[data-hero-media]", {
              yPercent: 7,
              ease: "none",
              scrollTrigger: {
                trigger: root,
                start: "top top",
                end: "bottom top",
                scrub: 0.6,
              },
            });
          }
        },
      );

      return () => media.revert();
    },
    { scope },
  );
}
