"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

// SVG Shapes – inline, no external images needed
function PinwheelSVG({ className, id }: { className?: string; id?: string }) {
  const uid = id ?? "pw";
  return (
    <svg
      className={className}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M60 60 C60 33 40 10 60 10 C80 10 60 33 60 60Z"
        fill={`url(#${uid}1)`}
      />
      <path
        d="M60 60 C87 60 110 40 110 60 C110 80 87 60 60 60Z"
        fill={`url(#${uid}2)`}
      />
      <path
        d="M60 60 C60 87 80 110 60 110 C40 110 60 87 60 60Z"
        fill={`url(#${uid}3)`}
      />
      <path
        d="M60 60 C33 60 10 80 10 60 C10 40 33 60 60 60Z"
        fill={`url(#${uid}4)`}
      />
      <defs>
        <linearGradient id={`${uid}1`} x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#fbbf24" />
          <stop offset="1" stopColor="#f59e0b" />
        </linearGradient>
        <linearGradient id={`${uid}2`} x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#a78bfa" />
          <stop offset="1" stopColor="#7c3aed" />
        </linearGradient>
        <linearGradient id={`${uid}3`} x1="0" y1="1" x2="1" y2="0">
          <stop stopColor="#fbbf24" />
          <stop offset="1" stopColor="#f59e0b" />
        </linearGradient>
        <linearGradient id={`${uid}4`} x1="1" y1="0" x2="0" y2="1">
          <stop stopColor="#c4b5fd" />
          <stop offset="1" stopColor="#8b5cf6" />
        </linearGradient>
      </defs>
    </svg>
  );
}

function LightningSVG({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 60 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M35 0L0 55H25L10 100L60 38H35L50 0Z" fill="#fbbf24" />
    </svg>
  );
}

function StarSVG({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 80 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M40 0 L43 37 L80 40 L43 43 L40 80 L37 43 L0 40 L37 37 Z"
        fill="#fbbf24"
      />
    </svg>
  );
}

function DotsSVG({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 60 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="10" cy="10" r="7" fill="white" fillOpacity="0.5" />
      <circle cx="30" cy="10" r="7" fill="white" fillOpacity="0.5" />
      <circle cx="50" cy="10" r="7" fill="white" fillOpacity="0.5" />
    </svg>
  );
}

export function AboutHero() {
  const containerRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const tl = gsap.timeline();

      // 1) Inline pinwheel spins 2 full rotations, then the "ee" text appears
      tl.from(".inline-pinwheel", {
        scale: 0,
        opacity: 0,
        rotation: 0,
        duration: 0.4,
        ease: "back.out(2)",
      })
        .to(".inline-pinwheel", {
          rotation: 720,
          duration: 0.8,
          ease: "power2.inOut",
        })
        // "B" appears first
        .from(
          ".hero-B",
          { yPercent: 110, opacity: 0, duration: 0.6, ease: "power4.out" },
          "<0.2",
        )
        // "ee" appears right after pinwheel finishes spinning
        .from(
          ".hero-ee",
          { yPercent: 110, opacity: 0, duration: 0.6, ease: "power4.out" },
          "-=0.1",
        )
        // inline pinwheel fades out AND collapses its width → no gap left
        .to(
          ".inline-pinwheel",
          { scale: 0, opacity: 0, width: 0, duration: 0.3, ease: "power2.in" },
          "<",
        )
        // Rest of the headline
        .from(
          [".hero-Wise", ".hero-2026"],
          {
            yPercent: 110,
            opacity: 0,
            duration: 0.7,
            ease: "power4.out",
            stagger: 0.12,
          },
          "-=0.2",
        );

      // 2) Sub-text
      gsap.from(".hero-sub", {
        opacity: 0,
        y: 20,
        duration: 0.7,
        delay: 1.6,
        ease: "power3.out",
      });

      // 3) Floating shapes entrance
      gsap.from(".shape", {
        scale: 0,
        opacity: 0,
        duration: 0.7,
        ease: "back.out(1.7)",
        stagger: 0.1,
        delay: 0.5,
      });

      // 4) Infinite float loops — each shape unique
      gsap.to(".shape-pinwheel", {
        y: -18,
        rotation: 20,
        duration: 3.2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
      gsap.to(".shape-lightning", {
        y: 16,
        rotation: -12,
        duration: 2.6,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: 0.4,
      });

      gsap.to(".shape-star", {
        y: 14,
        rotation: 35,
        duration: 2.4,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: 0.2,
      });
      gsap.to(".shape-dots", {
        y: -8,
        duration: 2.1,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: 0.7,
      });
      // Inline pinwheel continuous slow spin (once it's gone it doesn't matter)
      gsap.to(".inline-pinwheel", {
        rotation: "+=360",
        duration: 4,
        repeat: -1,
        ease: "none",
        delay: 1.5,
      });

      // 5) Cursor parallax
      const handleMouseMove = (e: MouseEvent) => {
        const rect = containerRef.current?.getBoundingClientRect();
        if (!rect) return;
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dx = (e.clientX - cx) / rect.width;
        const dy = (e.clientY - cy) / rect.height;

        gsap.to(".shape-pinwheel", {
          x: dx * 22,
          y: dy * 14,
          duration: 0.6,
          overwrite: "auto",
        });
        gsap.to(".shape-lightning", {
          x: dx * -18,
          y: dy * 20,
          duration: 0.6,
          overwrite: "auto",
        });

        gsap.to(".shape-star", {
          x: dx * -12,
          y: dy * 22,
          duration: 0.6,
          overwrite: "auto",
        });
        gsap.to(".shape-dots", {
          x: dx * 14,
          y: dy * -10,
          duration: 0.6,
          overwrite: "auto",
        });
      };

      containerRef.current?.addEventListener("mousemove", handleMouseMove);
      return () =>
        containerRef.current?.removeEventListener("mousemove", handleMouseMove);
    },
    { scope: containerRef },
  );

  return (
    <section
      ref={containerRef}
      className="relative overflow-hidden bg-primary min-h-[92vh] lg:h-screen flex flex-col items-center justify-center"
    >
      {/* Ambient glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] rounded-full bg-accent/10 blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-violet-500/10 blur-[100px]" />
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 text-center">
        {/* Big headline */}
        <div className="relative py-10">
          {/* ── Floating shapes ── */}

          {/* Pinwheel – far left, vertically centered */}
          <div
            className="shape shape-pinwheel absolute pointer-events-none"
            style={{
              top: "50%",
              left: "-2%",
              transform: "translateY(-50%)",
              width: "clamp(55px,6vw,88px)",
            }}
          >
            <PinwheelSVG id="pw-outer" />
          </div>

          {/* Star – upper left */}
          <div
            className="shape shape-star absolute pointer-events-none"
            style={{ top: "0%", left: "6%", width: "clamp(24px,3vw,44px)" }}
          >
            <StarSVG />
          </div>

          {/* Dots – upper right */}
          <div
            className="shape shape-dots absolute pointer-events-none"
            style={{ top: "5%", right: "4%", width: "clamp(36px,4.5vw,60px)" }}
          >
            <DotsSVG />
          </div>

          {/* Lightning – mid right */}
          <div
            className="shape shape-lightning absolute pointer-events-none"
            style={{
              top: "50%",
              right: "-1%",
              transform: "translateY(-50%)",
              width: "clamp(26px,3.5vw,48px)",
            }}
          >
            <LightningSVG />
          </div>

          {/* ── Headline ── */}
          <div className="overflow-hidden">
            <h1 className="font-nunito text-[14vw] sm:text-[12vw] lg:text-[11vw] xl:text-[9.5vw] font-black uppercase leading-none tracking-tighter inline-flex flex-wrap items-center justify-center gap-x-[0.03em]">
              <span className="hero-B inline-block text-primary-foreground">
                B
              </span>

              <span
                className="inline-pinwheel inline-block"
                style={{
                  width: "0.55em",
                  height: "0.9em",
                  verticalAlign: "middle",
                  marginBottom: "0.05em",
                }}
              >
                <PinwheelSVG id="pw-inline" className="w-full h-full" />
              </span>

              <span className="hero-ee inline-block text-primary-foreground">
                ee
              </span>

              <span className="hero-Wise inline-block text-accent">Wise</span>

              <span className="inline-block" style={{ width: "0.25em" }} />

              <span className="hero-2026 inline-block text-primary-foreground/90">
                2026
              </span>
            </h1>
          </div>
        </div>

        <p className="hero-sub mt-4 text-sm text-primary-foreground/50 tracking-widest uppercase">
          Về BeeWise
        </p>
      </div>
    </section>
  );
}
