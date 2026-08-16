"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import {
  CheckCircleIcon,
  CircleNotchIcon,
  MagnifyingGlassIcon,
  SparkleIcon,
} from "@phosphor-icons/react";

const SEARCH_STAGES = [
  { after: 0, title: "Đang hiểu nhu cầu của bạn", description: "AI đang đọc môn học, lịch học và mong muốn trong mô tả." },
  { after: 4, title: "Đang đối chiếu hồ sơ gia sư", description: "BeeWise đang so khớp chuyên môn, hình thức học và học phí." },
  { after: 9, title: "Đang xếp hạng những lựa chọn phù hợp", description: "Sắp xong rồi, AI đang kiểm tra lại các gợi ý tốt nhất." },
] as const;

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

  const activeStageIndex = SEARCH_STAGES.reduce(
    (latestIndex, stage, index) => elapsedSeconds >= stage.after ? index : latestIndex,
    0,
  );
  const activeStage = SEARCH_STAGES[activeStageIndex];
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
              <p className="text-base font-extrabold text-foreground" style={{ fontFamily: "var(--font-montserrat)" }}>
                {activeStage.title}
              </p>
              <p className="mt-1 text-sm leading-relaxed text-foreground/60">{activeStage.description}</p>
            </div>
          </div>

          <div className="mb-4 truncate rounded-xl bg-muted/60 px-3 py-2 text-sm text-foreground/65">
            <span className="font-semibold text-foreground/80">Bạn cần: </span>&ldquo;{query}&rdquo;
          </div>

          <ol className="grid gap-2 sm:grid-cols-3" aria-label="Các bước tìm kiếm">
            {SEARCH_STAGES.map((stage, index) => {
              const isComplete = index < activeStageIndex;
              const isActive = index === activeStageIndex;
              return (
                <li key={stage.title} className={`flex items-center gap-2 rounded-lg px-2.5 py-2 text-xs font-semibold ${isActive ? "bg-primary/8 text-primary" : isComplete ? "text-foreground/65" : "text-foreground/35"}`}>
                  {isComplete ? (
                    <CheckCircleIcon size={16} weight="fill" aria-hidden="true" />
                  ) : isActive ? (
                    <CircleNotchIcon size={16} className={shouldReduceMotion ? "" : "animate-spin"} aria-hidden="true" />
                  ) : (
                    <MagnifyingGlassIcon size={16} aria-hidden="true" />
                  )}
                  <span>Bước {index + 1}</span>
                </li>
              );
            })}
          </ol>

          <p className="mt-4 text-xs leading-relaxed text-foreground/50">
            {isTakingLonger
              ? "Lần tìm kiếm này cần thêm thời gian để đối chiếu. Bạn vẫn có thể sửa mô tả hoặc chuyển sang tìm thủ công ở phía trên."
              : "Thường mất khoảng vài giây. Bạn vẫn có thể điều chỉnh nội dung tìm kiếm trong lúc chờ."}
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
