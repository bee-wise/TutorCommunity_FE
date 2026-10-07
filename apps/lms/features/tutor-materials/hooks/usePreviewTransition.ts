"use client";

import { useCallback, useEffect, useRef, useState, type TransitionEvent } from "react";
import { useRouter } from "next/navigation";

export type PreviewPhase = "waiting" | "entering" | "entered" | "leaving";

export function usePreviewTransition(returnHref: string, ready: boolean) {
  const router = useRouter();
  const [phase, setPhase] = useState<PreviewPhase>("waiting");
  const leavingRef = useRef(false);
  const navigated = useRef(false);
  const fallbackTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    router.prefetch(returnHref);
  }, [router, returnHref]);

  useEffect(() => {
    if (!ready) return;
    let secondFrame = 0;
    // Keep the off-screen position for one painted frame. Mount-time keyframes
    // can finish during hydration, before the document is actually visible.
    const firstFrame = requestAnimationFrame(() => {
      secondFrame = requestAnimationFrame(() => {
        if (leavingRef.current) return;
        setPhase(window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "entered" : "entering");
      });
    });
    return () => {
      cancelAnimationFrame(firstFrame);
      cancelAnimationFrame(secondFrame);
    };
  }, [ready]);

  useEffect(() => () => {
    if (fallbackTimer.current) clearTimeout(fallbackTimer.current);
  }, []);

  const finish = useCallback(() => {
    if (navigated.current) return;
    navigated.current = true;
    if (fallbackTimer.current) clearTimeout(fallbackTimer.current);
    router.replace(returnHref);
  }, [router, returnHref]);

  const leave = useCallback(() => {
    if (leavingRef.current) return;
    leavingRef.current = true;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      finish();
      return;
    }
    setPhase("leaving");
    // Navigation still completes if an animation-end event is interrupted.
    fallbackTimer.current = setTimeout(finish, 550);
  }, [finish]);

  const onTransitionEnd = useCallback((event: TransitionEvent<HTMLDivElement>) => {
    if (event.target !== event.currentTarget || event.propertyName !== "transform") return;
    if (leavingRef.current) finish();
    else setPhase("entered");
  }, [finish]);

  return { phase, leaving: phase === "leaving", leave, onTransitionEnd };
}
