"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import {
  CircleNotchIcon,
  SparkleIcon,
} from "@phosphor-icons/react";

export function AILoadingOverlay({ query }: { query: string }) {
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    const startedAt = Date.now();
    const timer = window.setInterval(() => {
      setElapsedSeconds(Math.floor((Date.now() - startedAt) / 1000));
    }, 1000);
    return () => window.clearInterval(timer);
  }, [query]);

  const isTakingLonger = elapsedSeconds >= 14;

  return (
    <motion.section
      initial={shouldReduceMotion ? false : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="overflow-hidden rounded-2xl border border-primary/15 bg-white shadow-sm"
      aria-live="polite"
      aria-atomic="true"
      aria-label="Tiến trình tìm kiếm bằng AI"
      role="status"
    >
      <div className="h-1 overflow-hidden bg-primary/10">
        <motion.div
          className="h-full w-1/3 bg-primary"
          animate={shouldReduceMotion ? undefined : { x: ["-100%", "300%"] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="grid gap-6 p-5 sm:p-6 lg:grid-cols-[minmax(0,1fr)_280px] lg:items-center">
        <div className="min-w-0">
          <div className="mb-4 flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary text-white">
              <SparkleIcon size={20} weight="fill" aria-hidden="true" />
            </div>
            <div className="min-w-0">
              <p className="text-base font-extrabold text-foreground" style={{ fontFamily: "var(--font-nunito-family)" }}>
                Đang tìm gia sư phù hợp
              </p>
              <p className="mt-1 text-sm leading-relaxed text-foreground/60">
                BeeWise đang đối chiếu mô tả của bạn với hồ sơ gia sư.
              </p>
            </div>
          </div>

          <div className="mb-4 truncate rounded-xl bg-muted/60 px-3 py-2 text-sm text-foreground/65">
            <span className="font-semibold text-foreground/80">Bạn cần: </span>&ldquo;{query}&rdquo;
          </div>

          <div className="flex items-center gap-2 rounded-lg bg-primary/8 px-3 py-2.5 text-xs font-semibold text-primary">
            <CircleNotchIcon
              size={16}
              className={shouldReduceMotion ? "" : "animate-spin"}
              aria-hidden="true"
            />
            Đang chờ kết quả từ hệ thống
          </div>

          <p className="mt-4 text-xs leading-relaxed text-foreground/50">
            {isTakingLonger
              ? "Lần tìm kiếm này mất nhiều thời gian hơn thường lệ. Bạn có thể chỉnh mô tả hoặc chuyển sang tìm thủ công trong lúc chờ."
              : "Bạn có thể chỉnh mô tả hoặc chuyển sang tìm thủ công trong lúc chờ."}
          </p>
        </div>

        <div className="hidden grid-cols-2 gap-3 lg:grid" aria-hidden="true">
          {[0, 1, 2, 3].map((item) => (
            <div key={item} className="rounded-xl border border-border/70 bg-muted/30 p-3">
              <div className="mb-3 h-10 w-10 animate-pulse rounded-full bg-primary/10" />
              <div className="mb-2 h-2.5 w-4/5 animate-pulse rounded-full bg-primary/10" />
              <div className="h-2 w-3/5 animate-pulse rounded-full bg-foreground/10" />
            </div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}
