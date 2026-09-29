"use client";

import { useState } from "react";
import { Play } from "@phosphor-icons/react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@workspace/ui/components/ui/dialog";

type OnboardingVideoGuideProps = {
  title: string;
  duration: string;
  description?: string;
  videoSrc?: string;
};

export function OnboardingVideoGuide({
  title,
  duration,
  description,
  videoSrc = "/video/videoplayback.mp4#t=0.1",
}: OnboardingVideoGuideProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm transition hover:shadow-md">
        {/* Video thumbnail mock */}
        <div
          className="group relative flex aspect-video w-full cursor-pointer items-center justify-center bg-primary overflow-hidden"
          style={{
            background:
              "linear-gradient(135deg, var(--primary) 0%, #1a0a5e 50%, var(--secondary) 100%)",
          }}
          role="button"
          aria-label={`Phát video: ${title}`}
          tabIndex={0}
          onClick={() => setIsOpen(true)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              setIsOpen(true);
            }
          }}
        >
          {/* Background video frame */}
          <video
            src={videoSrc}
            preload="metadata"
            muted
            playsInline
            className="absolute inset-0 h-full w-full object-cover opacity-45 transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/25 to-black/20" />

          {/* Decorative BeeWise pattern */}
          <div className="absolute inset-0 opacity-10 pointer-events-none">
            <div className="absolute left-4 top-4 h-16 w-16 rounded-full border-4 border-white/40" />
            <div className="absolute bottom-4 right-4 h-24 w-24 rounded-full border-4 border-accent/40" />
          </div>

          {/* Play button */}
          <button
            type="button"
            aria-label="Phát video hướng dẫn"
            className="relative z-10 flex h-14 w-14 items-center justify-center rounded-full bg-white/20 ring-2 ring-white/60 backdrop-blur-sm transition-all duration-300 group-hover:scale-110 group-hover:bg-white/35 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-accent"
          >
            <Play className="h-6 w-6 translate-x-0.5 text-white" weight="fill" />
          </button>

          {/* Duration badge */}
          <span className="absolute bottom-2.5 right-2.5 rounded-md bg-black/70 px-2 py-0.5 text-[11px] font-semibold text-white backdrop-blur-sm">
            {duration}
          </span>

          {/* Tag */}
          <span className="absolute left-2.5 top-2.5 rounded-full bg-accent px-2.5 py-0.5 text-[11px] font-bold text-accent-foreground shadow-sm">
            Video hướng dẫn
          </span>
        </div>

        {/* Info */}
        <div className="px-4 py-3">
          <p className="text-sm font-semibold text-foreground">{title}</p>
          {description && (
            <p className="mt-0.5 text-xs leading-5 text-muted-foreground">
              {description}
            </p>
          )}
        </div>
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-3xl p-0 overflow-hidden bg-black border-none rounded-2xl">
          <DialogTitle className="sr-only">{title}</DialogTitle>
          <div className="relative aspect-video w-full bg-black">
            <video
              className="h-full w-full object-contain"
              controls
              autoPlay
              playsInline
              preload="metadata"
              src={videoSrc}
            >
              Trình duyệt của bạn không hỗ trợ phát video.
            </video>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
