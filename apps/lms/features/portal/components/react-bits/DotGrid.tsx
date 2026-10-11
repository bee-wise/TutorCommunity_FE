"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { usePrefersReducedMotion } from "../../hooks/usePrefersReducedMotion";

// React Bits DotGrid, adapted to a quiet portal background: small dots, bounded
// displacement, no shockwaves/inertia plugin, and redraw only during interaction.
// https://github.com/DavidHDev/react-bits/blob/main/src/ts-tailwind/Backgrounds/DotGrid/DotGrid.tsx
// Copyright (c) 2026 David Haz. License: ./LICENSE
type Dot = {
  cx: number;
  cy: number;
  xOffset: number;
  yOffset: number;
  strength: number;
};

export function DotGrid() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const canvas = canvasRef.current;
    const parent = wrapper?.parentElement;
    const ctx = canvas?.getContext("2d");
    if (!wrapper || !canvas || !ctx || !parent) return;
    let dots: Dot[] = [];
    let frame: number | null = null;
    let inView = true;
    let lastMove = 0;
    let width = 0;
    let height = 0;
    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = getComputedStyle(wrapper).color;
      for (const dot of dots) {
        ctx.globalAlpha = 0.1 + dot.strength * 0.75;
        ctx.beginPath();
        ctx.arc(
          dot.cx + dot.xOffset,
          dot.cy + dot.yOffset,
          1.25 + dot.strength * 0.35,
          0,
          Math.PI * 2,
        );
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    };
    const scheduleDraw = () => {
      if (frame !== null || !inView || document.hidden) return;
      frame = requestAnimationFrame(() => {
        frame = null;
        draw();
      });
    };
    const resize = () => {
      gsap.killTweensOf(dots);
      width = wrapper.clientWidth;
      height = wrapper.clientHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const cell = 32;
      const cols = Math.floor(width / cell);
      const rows = Math.floor(height / cell);
      const startX = (width - (cols - 1) * cell) / 2;
      const startY = (height - (rows - 1) * cell) / 2;
      dots = Array.from({ length: cols * rows }, (_, index) => ({
        cx: startX + (index % cols) * cell,
        cy: startY + Math.floor(index / cols) * cell,
        xOffset: 0,
        yOffset: 0,
        strength: 0,
      }));
      scheduleDraw();
    };
    const move = (event: PointerEvent) => {
      const now = performance.now();
      if (
        reducedMotion ||
        !inView ||
        document.hidden ||
        event.pointerType !== "mouse" ||
        now - lastMove < 50
      )
        return;
      lastMove = now;
      const rect = wrapper.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      for (const dot of dots) {
        const dx = dot.cx - x;
        const dy = dot.cy - y;
        const strength = Math.max(0, 1 - Math.hypot(dx, dy) / 110);
        if (strength === 0 && dot.strength < 0.01) continue;
        gsap.to(dot, {
          xOffset: (dx / 110) * strength * 4,
          yOffset: (dy / 110) * strength * 4,
          strength,
          duration: 0.45,
          ease: "power2.out",
          overwrite: true,
          onUpdate: scheduleDraw,
        });
      }
    };
    const reset = () => {
      if (reducedMotion || document.hidden || !inView) return;
      gsap.to(dots, {
        xOffset: 0,
        yOffset: 0,
        strength: 0,
        duration: 0.8,
        ease: "power2.out",
        overwrite: true,
        onUpdate: scheduleDraw,
      });
    };
    const suspend = () => {
      gsap.killTweensOf(dots);
      if (frame !== null) cancelAnimationFrame(frame);
      frame = null;
      dots.forEach((dot) => {
        dot.xOffset = 0;
        dot.yOffset = 0;
        dot.strength = 0;
      });
    };
    const visibility = () => {
      if (document.hidden) suspend();
      else scheduleDraw();
    };
    const observer = new ResizeObserver(resize);
    observer.observe(wrapper);
    const intersection = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      if (!inView) suspend();
      else scheduleDraw();
    });
    intersection.observe(wrapper);
    parent.addEventListener("pointermove", move, { passive: true });
    parent.addEventListener("pointerleave", reset);
    document.addEventListener("visibilitychange", visibility);
    resize();
    return () => {
      suspend();
      observer.disconnect();
      intersection.disconnect();
      parent.removeEventListener("pointermove", move);
      parent.removeEventListener("pointerleave", reset);
      document.removeEventListener("visibilitychange", visibility);
    };
  }, [reducedMotion]);

  return (
    <div
      ref={wrapperRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 text-accent [mask-image:linear-gradient(to_bottom,transparent,black_12%,black_88%,transparent)]"
    >
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
    </div>
  );
}
