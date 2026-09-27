"use client";

import { Play } from "@phosphor-icons/react";

type OnboardingVideoGuideProps = {
  title: string;
  duration: string;
  description?: string;
};

export function OnboardingVideoGuide({
  title,
  duration,
  description,
}: OnboardingVideoGuideProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-[#cfe1fa] bg-white shadow-sm">
      {/* Video thumbnail mock */}
      <div
        className="relative flex aspect-video w-full cursor-pointer items-center justify-center"
        style={{
          background:
            "linear-gradient(135deg, #280f91 0%, #1a0a5e 50%, #447353 100%)",
        }}
        role="button"
        aria-label={`Phát video: ${title}`}
        tabIndex={0}
      >
        {/* Decorative BeeWise logo pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute left-4 top-4 h-16 w-16 rounded-full border-4 border-white/40" />
          <div className="absolute bottom-4 right-4 h-24 w-24 rounded-full border-4 border-[#ffc510]/40" />
        </div>

        {/* Play button */}
        <button
          type="button"
          aria-label="Phát video hướng dẫn"
          className="relative z-10 flex h-16 w-16 items-center justify-center rounded-full bg-white/20 ring-2 ring-white/60 backdrop-blur-sm transition hover:bg-white/30 hover:scale-105 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#ffc510]"
        >
          <Play className="h-7 w-7 translate-x-0.5 text-white" weight="fill" />
        </button>

        {/* Duration badge */}
        <span className="absolute bottom-3 right-3 rounded-md bg-black/60 px-2 py-0.5 text-xs font-semibold text-white backdrop-blur-sm">
          {duration}
        </span>

        {/* Coming soon overlay label */}
        <span className="absolute left-3 top-3 rounded-full bg-[#ffc510] px-3 py-0.5 text-xs font-bold text-[#280f91]">
          Video hướng dẫn
        </span>
      </div>

      {/* Info */}
      <div className="px-4 py-3">
        <p className="text-sm font-semibold text-[#0c0c0b]">{title}</p>
        {description && (
          <p className="mt-0.5 text-xs leading-5 text-[#5e6688]">
            {description}
          </p>
        )}
      </div>
    </div>
  );
}
