"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

export function InterviewOnboardingSteps({
  step,
  children,
}: {
  step: string;
  children: ReactNode;
}) {
  const container = useRef<HTMLDivElement>(null);
  const [focused, setFocused] = useState(false);

  useEffect(() => {
    const checkFocused = () => {
      setFocused(document.body.dataset.interviewFocused === "true");
    };
    checkFocused();
    const observer = new MutationObserver(checkFocused);
    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ["data-interview-focused"],
    });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (focused) return;
    const showCurrentStep = () => {
      if (!window.matchMedia("(max-width: 767px)").matches) return;
      const track = container.current?.querySelector("ol");
      const current = track
        ?.querySelector('[aria-current="step"]')
        ?.closest("li");
      if (!track || !current) return;
      const item = current.getBoundingClientRect();
      track.scrollLeft +=
        item.left -
        track.getBoundingClientRect().left -
        (track.clientWidth - item.width) / 2;
    };
    showCurrentStep();
    window.addEventListener("resize", showCurrentStep);
    return () => window.removeEventListener("resize", showCurrentStep);
  }, [step, focused]);

  if (focused) return null;

  return (
    <div ref={container} className="min-w-0">
      {children}
    </div>
  );
}

