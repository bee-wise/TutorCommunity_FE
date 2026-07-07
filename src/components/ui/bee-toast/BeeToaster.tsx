"use client";

import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "motion/react";
import { CheckCircle, XCircle, Warning, Info, X } from "@phosphor-icons/react";
import { useToastStore, type Toast, type ToastVariant } from "./useToastStore";

const DEFAULT_DURATION = 4000;

export type ToastPosition =
  | "top-left"
  | "top-center"
  | "top-right"
  | "bottom-left"
  | "bottom-center"
  | "bottom-right";

const POSITION_CLASSES: Record<ToastPosition, string> = {
  "top-left": "top-5 left-5 items-start",
  "top-center": "top-5 left-1/2 -translate-x-1/2 items-center",
  "top-right": "top-5 right-5 items-end",
  "bottom-left": "bottom-5 left-5 items-start",
  "bottom-center": "bottom-5 left-1/2 -translate-x-1/2 items-center",
  "bottom-right": "bottom-5 right-5 items-end",
};

const VARIANT_CONFIG: Record<
  ToastVariant,
  {
    Icon: React.ElementType;
    iconClass: string;
    bg: string;
    iconBg: string;
  }
> = {
  success: {
    Icon: CheckCircle,
    iconClass: "text-[#447353]",
    bg: "bg-background",
    iconBg: "bg-[#447353]/10",
  },
  error: {
    Icon: XCircle,
    iconClass: "text-rose-500",
    bg: "bg-background",
    iconBg: "bg-rose-500/10",
  },
  warning: {
    Icon: Warning,
    iconClass: "text-[#ffc500]",
    bg: "bg-background",
    iconBg: "bg-[#ffc500]/10",
  },
  info: {
    Icon: Info,
    iconClass: "text-[#280f91]",
    bg: "bg-background",
    iconBg: "bg-[#280f91]/10",
  },
};

function ToastItem({
  toast,
  position,
}: {
  toast: Toast;
  position: ToastPosition;
}) {
  const remove = useToastStore((s) => s.remove);
  const duration = toast.duration ?? DEFAULT_DURATION;
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { Icon, iconClass, bg, iconBg } = VARIANT_CONFIG[toast.variant];

  useEffect(() => {
    timerRef.current = setTimeout(() => remove(toast.id), duration);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [toast.id, duration, remove]);

  const isTop = position.startsWith("top");

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: isTop ? -16 : 16, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: isTop ? -8 : 8, scale: 0.95 }}
      transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
      role="status"
      aria-live="polite"
      className={`
        relative flex items-start gap-3 w-[340px] max-w-[90vw]
        rounded-2xl px-4 py-3.5 shadow-xl shadow-black/10 overflow-hidden
        ${bg}
      `}
      style={{
        boxShadow: "0 8px 32px rgba(0,0,0,0.12), 0 1px 3px rgba(0,0,0,0.08)",
      }}
      onMouseEnter={() => {
        if (timerRef.current) clearTimeout(timerRef.current);
      }}
      onMouseLeave={() => {
        timerRef.current = setTimeout(() => remove(toast.id), duration);
      }}
    >
      <div
        className={`shrink-0 w-8 h-8 rounded-xl flex items-center justify-center ${iconBg}`}
      >
        <Icon size={17} weight="fill" className={iconClass} />
      </div>

      <div className="flex flex-col gap-0.5 flex-1 min-w-0 pt-0.5">
        <p
          className="text-sm font-semibold text-foreground leading-snug"
          style={{ fontFamily: "var(--font-montserrat)" }}
        >
          {toast.title}
        </p>
        {toast.description && (
          <p className="text-xs text-muted-foreground leading-relaxed">
            {toast.description}
          </p>
        )}
      </div>

      <button
        onClick={() => remove(toast.id)}
        aria-label="Đóng thông báo"
        className="shrink-0 mt-0.5 p-0.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors"
      >
        <X size={14} />
      </button>

      <motion.div
        className="absolute bottom-0 left-0 h-0.5 rounded-full"
        style={{ background: "var(--primary)", opacity: 0.25 }}
        initial={{ width: "100%" }}
        animate={{ width: "0%" }}
        transition={{ duration: duration / 1000, ease: "linear" }}
      />
    </motion.div>
  );
}

const ALL_POSITIONS: ToastPosition[] = [
  "top-left",
  "top-center",
  "top-right",
  "bottom-left",
  "bottom-center",
  "bottom-right",
];

export function BeeToaster({
  defaultPosition = "bottom-right",
}: {
  defaultPosition?: ToastPosition;
}) {
  const toasts = useToastStore((s) => s.toasts);

  if (typeof window === "undefined") return null;

  return (
    <>
      {ALL_POSITIONS.map((pos) => {
        const group = toasts.filter(
          (t) => (t.position ?? defaultPosition) === pos,
        );
        const isTop = pos.startsWith("top");

        return createPortal(
          <div
            key={pos}
            aria-label="Thông báo"
            className={`fixed z-[9999] flex gap-2.5 pointer-events-none ${
              isTop ? "flex-col" : "flex-col-reverse"
            } ${POSITION_CLASSES[pos]}`}
          >
            <AnimatePresence mode="popLayout">
              {group.map((t) => (
                <div key={t.id} className="pointer-events-auto">
                  <ToastItem toast={t} position={pos} />
                </div>
              ))}
            </AnimatePresence>
          </div>,
          document.body,
        );
      })}
    </>
  );
}
