"use client";

import { useState } from "react";
import type { RoleFeature } from "../data/roleFeatures";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";
import { RoleCardSwap } from "./RoleCardSwap";

type RoleFeatureShowcaseProps = {
  id: string;
  roleLabel: string;
  heading: string;
  imageSide: "left" | "right";
  features: readonly RoleFeature[];
  className?: string;
};

export function RoleFeatureShowcase({
  id,
  roleLabel,
  heading,
  imageSide,
  features,
  className = "",
}: RoleFeatureShowcaseProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const reducedMotion = usePrefersReducedMotion();

  return (
    <div
      id={id}
      className={`grid scroll-mt-24 grid-cols-1 items-center gap-8 lg:grid-cols-2 lg:gap-16 ${className}`}
    >
      <div
        className={`relative h-auto sm:h-[560px] lg:h-[600px] ${imageSide === "left" ? "lg:order-1" : "lg:order-2"}`}
      >
        <RoleCardSwap
          id={`${id}-cards`}
          roleLabel={roleLabel}
          side={imageSide}
          features={features}
          activeIndex={activeIndex}
          onSelect={setActiveIndex}
          reducedMotion={reducedMotion}
        />
      </div>

      <div className={imageSide === "left" ? "lg:order-2" : "lg:order-1"}>
        <p className="text-sm font-extrabold text-primary">{roleLabel}</p>
        <h3
          className="mt-3 text-3xl font-extrabold tracking-[-0.03em] text-primary sm:text-4xl"
          style={{ fontFamily: "var(--font-nunito-family)" }}
        >
          {heading}
        </h3>
        <div
          className="mt-7 space-y-2"
          role="group"
          aria-label={`Lợi ích ${roleLabel.toLowerCase()}`}
        >
          {features.map((feature, index) => {
            const isActive = activeIndex === index;
            return (
              <button
                key={feature.id}
                type="button"
                aria-pressed={isActive}
                aria-controls={`${id}-cards`}
                onClick={() => setActiveIndex(index)}
                className={`w-full rounded-r-xl border-l-[3px] px-5 py-4 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${
                  isActive
                    ? "border-primary bg-white"
                    : "border-transparent hover:border-primary/35 hover:bg-white/60"
                }`}
              >
                <span
                  className="block text-lg font-extrabold text-primary"
                  style={{ fontFamily: "var(--font-nunito-family)" }}
                >
                  {feature.title}
                </span>
                <span className="mt-1.5 block max-w-[530px] text-sm leading-6 text-[#37333d] sm:text-base">
                  {feature.body}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
