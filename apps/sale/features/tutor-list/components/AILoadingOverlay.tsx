"use client";

import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "motion/react";
import { SparkleIcon } from "@phosphor-icons/react";

// Strands is a heavy WebGL component — load only when needed
const Strands = dynamic(() => import("@workspace/ui/components/Strands"), {
  ssr: false,
});

export function AILoadingOverlay({ query }: { query: string }) {
  return (
    <AnimatePresence>
      <motion.div
        key="ai-loading"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="fixed inset-0 z-50 flex flex-col items-center justify-center"
        style={{
          background: "rgba(255,255,255,0.92)",
          backdropFilter: "blur(8px)",
        }}
        aria-live="polite"
        aria-label="AI đang tìm kiếm"
        role="status"
      >
        <div className="flex items-center justify-center w-36 h-36 mb-6 border rounded-full">
          <Strands
            colors={["#280f91", "#a855f7", "#3b82f6", "#ffc500"]}
            count={6}
            speed={0.6}
            amplitude={1.2}
            thickness={0.8}
            glow={3}
            intensity={0.7}
            opacity={0.9}
            waviness={1.2}
          />
        </div>

        <div className="flex flex-col items-center gap-3 text-center">
          <div className="flex items-center gap-2">
            <SparkleIcon
              size={20}
              className="text-primary"
              weight="fill"
              aria-hidden="true"
            />
            <span
              className="text-base font-bold text-primary"
              style={{ fontFamily: "var(--font-montserrat)" }}
            >
              Đang tìm gia sư phù hợp...
            </span>
          </div>
          {query && (
            <p className="text-sm text-foreground/55 max-w-[32ch] leading-relaxed">
              &ldquo;{query}&rdquo;
            </p>
          )}
          <div className="flex gap-1.5 mt-1">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-1.5 h-1.5 rounded-full bg-primary"
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{
                  duration: 1.2,
                  repeat: Infinity,
                  delay: i * 0.2,
                  ease: "easeInOut",
                }}
                aria-hidden="true"
              />
            ))}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
