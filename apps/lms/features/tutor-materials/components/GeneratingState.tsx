"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import beeWiseAiIcon from "../../../../sale/public/icons/BeeWiseAI-icon.svg";
import styles from "./GeneratingState.module.css";

const TIPS = [
  "Mẹo: Bạn có thể chỉnh sửa nội dung bài tóm tắt nếu AI tóm tắt thiếu ý.",
  "Mẹo: Hãy đọc lại câu hỏi và đáp án trước khi chia sẻ với học viên.",
  "Mẹo: BeeWise AI tạo tài liệu dựa trên bản ghi bạn vừa cung cấp.",
  "Mẹo: Hãy kiểm tra lại các công thức toán học sau khi AI tạo xong.",
  "Mẹo: Gửi tài liệu sau buổi học để học viên ôn tập khi kiến thức còn mới.",
] as const;

export function GeneratingState() {
  const [progress, setProgress] = useState(0);
  const [tipIndex, setTipIndex] = useState(0);

  useEffect(() => {
    const duration = 10000;
    const intervalTime = 100;
    const steps = duration / intervalTime;
    let currentStep = 0;

    const timer = window.setInterval(() => {
      currentStep += 1;
      setProgress(Math.min((currentStep / steps) * 100, 99));
      if (currentStep >= steps) window.clearInterval(timer);
    }, intervalTime);

    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    let timer: number | undefined;

    const syncTips = () => {
      if (timer !== undefined) window.clearInterval(timer);
      if (media.matches) {
        setTipIndex(0);
        return;
      }
      timer = window.setInterval(() => {
        setTipIndex((current) => (current + 1) % TIPS.length);
      }, 3000);
    };

    syncTips();
    media.addEventListener("change", syncTips);
    return () => {
      if (timer !== undefined) window.clearInterval(timer);
      media.removeEventListener("change", syncTips);
    };
  }, []);

  return (
    <main className="min-h-full bg-background px-4 py-8 text-foreground sm:px-6" role="status" aria-live="polite">
      <div className="relative mx-auto mt-4 w-full max-w-2xl overflow-hidden rounded-3xl border border-border bg-card p-6 text-center shadow-sm sm:mt-12 sm:p-8">
        <div className="pointer-events-none absolute left-1/2 top-0 h-32 w-full -translate-x-1/2 bg-gradient-to-b from-[#cfe1fa]/50 to-transparent blur-xl" aria-hidden="true" />

        <div className="relative flex flex-col items-center">
          <Image
            src={beeWiseAiIcon}
            alt="BeeWise AI"
            width={240}
            height={72}
            unoptimized
            className="mb-5 h-auto w-48 sm:w-60"
          />

          <h1 className={`${styles.animatedTitle} mb-2 font-nunito text-xl font-extrabold sm:text-2xl`}>
            Đang phân tích bản ghi Zoom...
          </h1>
          <p className="mx-auto mb-8 max-w-sm text-sm leading-6 text-muted-foreground sm:text-base">
            BeeWise AI đang trích xuất ý chính và tạo bài tập từ nội dung buổi học.
          </p>

          <div className="mb-4 h-2 w-full overflow-hidden rounded-full bg-[#e8ebf0]" aria-hidden="true">
            <div
              className="h-full rounded-full bg-primary transition-[width] duration-100 ease-linear motion-reduce:transition-none"
              style={{ width: `${progress}%` }}
            />
          </div>

          <p className="min-h-10 text-sm font-medium leading-5 text-secondary sm:min-h-6" aria-live="off">
            {TIPS[tipIndex]}
          </p>
        </div>
      </div>
    </main>
  );
}
