"use client";

import { Button } from "@workspace/ui/components/ui/button";
import { PauseIcon, PlayIcon } from "@heroicons/react/20/solid";
import type { RoleFeature } from "../data/roleFeatures";
import { useRoleFeatureShowcase } from "../hooks/useRoleFeatureShowcase";
import { RoleFeatureVisual } from "./RoleFeatureVisual";
import { SpotlightCard } from "./react-bits/SpotlightCard";
import { PortalTitle } from "./PortalTitle";

type RoleFeatureShowcaseProps = {
  id: string;
  roleLabel: string;
  heading: string;
  accentHeading: string;
  imageSide: "left" | "right";
  features: readonly RoleFeature[];
  className?: string;
};

export function RoleFeatureShowcase({ id, roleLabel, heading, accentHeading, imageSide, features, className = "" }: RoleFeatureShowcaseProps) {
  const {
    rootRef, panelRef, progressRef, activeIndex, setActiveIndex, setHovered,
    setFocused, paused, setPaused, reducedMotion, onSelectorKeyDown,
  } = useRoleFeatureShowcase(features.length);
  const activeFeature = features[activeIndex] ?? features[0];
  const isTutor = imageSide === "right";
  if (!activeFeature) return null;

  return (
    <section ref={rootRef} id={id} aria-labelledby={`${id}-heading`} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} onFocusCapture={() => setFocused(true)} onBlurCapture={(event) => {
      if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false);
    }} className={`grid scroll-mt-32 items-center gap-10 lg:grid-cols-[1fr_1fr] lg:gap-14 ${className}`}>
      <div className={`min-w-0 ${isTutor ? "lg:order-2 lg:-mr-12" : "lg:order-1 lg:-ml-12"}`}>
        <div ref={panelRef} id={`${id}-panel`} role="tabpanel" aria-labelledby={`${id}-tab-${activeIndex}`}>
          <RoleFeatureVisual feature={activeFeature} />
        </div>
      </div>
      <div className={isTutor ? "lg:order-1" : "lg:order-2"}>
        <div className="mb-4 flex items-center justify-between gap-4">
          <span className="rounded-lg border border-primary/20 bg-background px-3 py-1.5 text-xs font-bold text-primary">{roleLabel}</span>
          {!reducedMotion && features.length > 1 && (
            <Button variant="ghost" size="sm" onClick={() => setPaused((value) => !value)} aria-pressed={paused} aria-label={paused ? `Tiếp tục tự chuyển tính năng ${roleLabel.toLowerCase()}` : `Tạm dừng tự chuyển tính năng ${roleLabel.toLowerCase()}`} className="rounded-lg text-xs text-muted-foreground transition-all active:scale-[0.98]">
              {paused ? <PlayIcon className="size-4" /> : <PauseIcon className="size-4" />}
              {paused ? "Tiếp tục" : "Tạm dừng"}
            </Button>
          )}
        </div>
        <PortalTitle as="h3" id={`${id}-heading`} primary={heading} accent={accentHeading} className="max-w-lg text-[clamp(1.8rem,3vw,2.6rem)]" />
        <div role="tablist" aria-orientation="vertical" aria-label={`Tính năng dành cho ${roleLabel.toLowerCase()}`} onKeyDown={onSelectorKeyDown} className="mt-7 space-y-3">
          {features.map((feature, index) => {
            const active = activeIndex === index;
            return (
              <SpotlightCard key={feature.id} style={active ? { borderColor: "var(--primary)" } : undefined} className={active ? "shadow-soft-hover" : ""}>
                <button type="button" role="tab" data-feature-tab id={`${id}-tab-${index}`} aria-selected={active} aria-controls={`${id}-panel`} tabIndex={active ? 0 : -1} onClick={() => setActiveIndex(index)} className="relative flex min-h-[108px] w-full items-start gap-4 rounded-[23px] px-5 py-5 text-left transition-transform focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring active:scale-[0.98]">
                  <span className={`pt-0.5 font-mono text-xs tabular-nums ${active ? "text-primary" : "text-muted-foreground"}`}>{String(index + 1).padStart(2, "0")}</span>
                  <span className="min-w-0">
                    <span className={`block text-base font-semibold ${active ? "text-primary" : "text-foreground"}`}>{feature.title}</span>
                    <span className="mt-1.5 block text-sm leading-6 text-muted-foreground">{feature.body}</span>
                  </span>
                  {active && <span ref={progressRef} aria-hidden="true" className="pointer-events-none absolute bottom-0 left-5 right-5 h-0.5 origin-left bg-primary" />}
                </button>
              </SpotlightCard>
            );
          })}
        </div>
      </div>
    </section>
  );
}
