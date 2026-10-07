"use client";

import { useEffect, useRef, type TransitionEventHandler, type ReactNode } from "react";
import Image from "next/image";
import { outlineActionClass } from "./materials-ui";
import styles from "./MaterialPreviewShell.module.css";
import type { PreviewPhase } from "../hooks/usePreviewTransition";

export function MaterialPreviewShell({ children, phase, leaving, onBack, onTransitionEnd }: {
  children: ReactNode;
  phase: PreviewPhase;
  leaving: boolean;
  onBack: () => void;
  onTransitionEnd: TransitionEventHandler<HTMLDivElement>;
}) {
  const screen = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (phase === "entered") screen.current?.focus({ preventScroll: true });
  }, [phase]);

  return (
    <div ref={screen} tabIndex={-1} inert={phase === "waiting" || leaving} data-phase={phase} onTransitionEnd={onTransitionEnd}
      className={`${styles.screen} outline-none`}>
      <header className="flex shrink-0 items-center justify-between gap-4 border-b border-border bg-card px-4 py-4 sm:px-8">
        <button type="button" disabled={leaving} onClick={onBack} className={outlineActionClass}>Quay lại</button>
        <div className="relative h-10 w-36 shrink-0 sm:h-12 sm:w-44">
          <Image src="https://res.cloudinary.com/xcrm6ykz/image/upload/e_trim/v1789964923/Logo_2.png"
            alt="BeeWise LMS" fill sizes="(min-width: 640px) 176px, 144px" className="object-contain" priority />
        </div>
      </header>
      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">{children}</div>
    </div>
  );
}
