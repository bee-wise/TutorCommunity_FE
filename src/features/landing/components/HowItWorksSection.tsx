"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { HOW_IT_WORKS_STEPS } from "../data/landing.data";

export function HowItWorksSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [progress, setProgress] = useState(0);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    const el = sectionRef.current;
    if (!el || shouldReduceMotion) {
      setProgress(1);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          const start = performance.now();
          const duration = 3500;

          const tick = (now: number) => {
            const elapsed = now - start;
            const p = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - p, 3);
            setProgress(eased);
            if (p < 1) requestAnimationFrame(tick);
          };

          requestAnimationFrame(tick);
          observer.disconnect();
        }
      },
      { threshold: 0.3 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [shouldReduceMotion]);

  return (
    <section
      ref={sectionRef}
      className="bg-background py-20 sm:py-24"
      id="how-it-works"
      aria-labelledby="how-headline"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2
          id="how-headline"
          className="text-3xl sm:text-4xl tracking-tight text-foreground mb-16 text-center"
          style={{ fontFamily: "var(--font-montserrat)", fontWeight: 800 }}
        >
          Chỉ 3 Bước Để Bắt Đầu
        </h2>

        <div className="relative grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-6">
          <div
            className="hidden md:block absolute top-8 left-[calc(16.66%+2rem)] right-[calc(16.66%+2rem)] h-[3px] bg-border rounded-full overflow-hidden"
            aria-hidden="true"
          >
            <motion.div
              className="h-full bg-primary rounded-full origin-left"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: progress }}
              transition={{ duration: 0 }}
              style={{ transformOrigin: "left" }}
            />
          </div>

          {HOW_IT_WORKS_STEPS.map((step, index) => (
            <motion.div
              key={step.step}
              initial={{ opacity: 0, y: 24 }}
              animate={
                progress > index * 0.3
                  ? { opacity: 1, y: 0 }
                  : { opacity: 0, y: 24 }
              }
              transition={{
                duration: 0.5,
                delay: index * 0.15,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="flex flex-col items-center text-center gap-5"
            >
              <motion.div
                className="relative flex items-center justify-center w-16 h-16 rounded-full bg-primary shadow-lg shadow-primary/25 z-10"
                animate={
                  progress > index * 0.3
                    ? { scale: 1, boxShadow: "0 8px 24px rgba(40,15,145,0.35)" }
                    : { scale: 0.8, boxShadow: "0 0 0 rgba(40,15,145,0)" }
                }
                transition={{ duration: 0.4, delay: index * 0.15 + 0.1 }}
              >
                <span
                  className="text-2xl text-white leading-none"
                  style={{
                    fontFamily: "var(--font-montserrat)",
                    fontWeight: 800,
                  }}
                >
                  {step.step}
                </span>
              </motion.div>

              <div className="flex flex-col gap-2">
                <h3
                  className="text-lg text-foreground"
                  style={{
                    fontFamily: "var(--font-montserrat)",
                    fontWeight: 700,
                  }}
                >
                  {step.title}
                </h3>
                <p className="text-sm text-foreground/60 leading-relaxed max-w-[26ch] mx-auto">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
