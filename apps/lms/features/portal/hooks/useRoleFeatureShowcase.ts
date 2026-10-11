"use client";

import { useEffect, useRef, useState, useSyncExternalStore, type KeyboardEvent } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { usePrefersReducedMotion } from "./usePrefersReducedMotion";

gsap.registerPlugin(useGSAP);
const subscribeVisibility = (onChange: () => void) => {
  document.addEventListener("visibilitychange", onChange);
  return () => document.removeEventListener("visibilitychange", onChange);
};
const getVisibility = () => !document.hidden;

export function useRoleFeatureShowcase(count: number) {
  const rootRef = useRef<HTMLElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLSpanElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [inView, setInView] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [paused, setPaused] = useState(false);
  const reducedMotion = usePrefersReducedMotion();
  const pageVisible = useSyncExternalStore(subscribeVisibility, getVisibility, () => true);
  const playing = count > 1 && inView && pageVisible && !hovered && !focused && !paused && !reducedMotion;

  useEffect(() => {
    const node = rootRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.2 });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!playing) return;
    const timer = window.setInterval(() => setActiveIndex((value) => (value + 1) % count), 3000);
    return () => window.clearInterval(timer);
  }, [activeIndex, count, playing]);

  useGSAP(() => {
    if (!reducedMotion) {
      gsap.fromTo(panelRef.current, { opacity: 0, y: 24, rotationX: 3 }, { opacity: 1, y: 0, rotationX: 0, duration: 0.65, ease: "power3.out" });
    }
  }, { scope: rootRef, dependencies: [activeIndex, reducedMotion], revertOnUpdate: true });

  useGSAP(() => {
    if (!progressRef.current) return;
    if (playing) gsap.fromTo(progressRef.current, { scaleX: 0 }, { scaleX: 1, duration: 3, ease: "none" });
    else gsap.set(progressRef.current, { scaleX: 1 });
  }, { scope: rootRef, dependencies: [activeIndex, playing], revertOnUpdate: true });

  const onSelectorKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (!(event.target instanceof HTMLElement) || !event.target.closest("[data-feature-tab]")) return;
    let next = activeIndex;
    if (event.key === "ArrowDown" || event.key === "ArrowRight") next = (activeIndex + 1) % count;
    else if (event.key === "ArrowUp" || event.key === "ArrowLeft") next = (activeIndex - 1 + count) % count;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = count - 1;
    else return;
    event.preventDefault();
    setActiveIndex(next);
    rootRef.current?.querySelectorAll<HTMLButtonElement>("[data-feature-tab]")[next]?.focus();
  };

  return {
    rootRef, panelRef, progressRef, activeIndex, setActiveIndex, setHovered,
    setFocused, paused, setPaused, reducedMotion, onSelectorKeyDown,
  };
}
