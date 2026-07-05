"use client";

import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";

interface BeeLoadingOverlayProps {
  /** Show/hide the overlay */
  isVisible: boolean;
  /**
   * Optional label shown below the bee.
   * @default "Đang tải..."
   */
  label?: string;
  /**
   * Optional sub-label (e.g. AI context text).
   * Shown only when provided.
   */
  subLabel?: string;
  /** z-index. Default 50 */
  zIndex?: number;
}

/**
 * BeeWise branded full-screen loading overlay.
 *
 * Uses the exclusive `/images/Sticker/Bee-Loading.mp4` video
 * (transparent background already removed by the team).
 *
 * Performance notes:
 * - Video is mounted once and paused/played imperatively — no remount on show/hide.
 * - `mix-blend-mode: multiply` handles any residual white fringe on light backgrounds.
 * - `AnimatePresence` drives fade-in/fade-out; DOM is unmounted after exit to free memory.
 * - `preload="auto"` so the first frame renders instantly on show.
 */
export function BeeLoadingOverlay({
  isVisible,
  label = "Đang tải...",
  subLabel,
  zIndex = 50,
}: BeeLoadingOverlayProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  // Play/pause imperatively to avoid re-mounting the video element
  useEffect(() => {
    const vid = videoRef.current;
    if (!vid) return;
    if (isVisible) {
      vid.currentTime = 0;
      vid.play().catch(() => {
        // Auto-play blocked (e.g. low-power mode) — video stays paused; still shows first frame
      });
    } else {
      vid.pause();
    }
  }, [isVisible]);

  return (
    <>
      <video
        ref={videoRef}
        src="/images/Sticker/Bee-Loading.mp4"
        preload="auto"
        muted
        loop
        playsInline
        aria-hidden="true"
        style={{ display: "none" }}
      />

      <AnimatePresence>
        {isVisible && (
          <motion.div
            key="bee-loading-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            role="status"
            aria-label={label}
            style={{ zIndex }}
            className="fixed inset-0 flex flex-col items-center justify-center gap-5"
          >
            <div
              className="absolute inset-0"
              style={{
                background: "rgba(255, 255, 255, 0.90)",
                backdropFilter: "blur(12px)",
                WebkitBackdropFilter: "blur(12px)",
              }}
            />

            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  "radial-gradient(ellipse 60% 50% at 50% 40%, rgba(40,15,145,0.06) 0%, transparent 70%)",
              }}
            />

            <div className="relative flex flex-col items-center gap-4">
              <div
                className="relative"
                style={{ width: 160, height: 160 }}
                aria-hidden="true"
              >
                <video
                  src="/images/Sticker/Bee-Loading.mp4"
                  preload="auto"
                  muted
                  loop
                  playsInline
                  autoPlay
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "contain",
                    mixBlendMode: "multiply",
                  }}
                />
              </div>

              <div className="flex flex-col items-center gap-1.5 text-center">
                <motion.p
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1, duration: 0.3 }}
                  className="text-sm font-bold text-[#280F91]"
                  style={{ fontFamily: "var(--font-montserrat)" }}
                >
                  {label}
                </motion.p>

                {subLabel && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.35 }}
                    className="text-xs text-foreground/50 max-w-[28ch] leading-relaxed"
                  >
                    {subLabel}
                  </motion.p>
                )}

                <motion.span
                  className="flex gap-1 mt-0.5"
                  aria-hidden="true"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.15 }}
                >
                  {[0, 1, 2].map((i) => (
                    <motion.span
                      key={i}
                      className="block w-1.5 h-1.5 rounded-full bg-[#280F91]"
                      animate={{ opacity: [0.25, 1, 0.25] }}
                      transition={{
                        duration: 1.2,
                        repeat: Infinity,
                        delay: i * 0.2,
                        ease: "easeInOut",
                      }}
                    />
                  ))}
                </motion.span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
