"use client";

import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { CircleNotchIcon, FunnelIcon, XIcon } from "@phosphor-icons/react";
import { FilterPanel } from "./FilterPanel";
import type { SearchMode, TutorFilters } from "../data/types";
import { countActiveFilters } from "../utils/tutor-filter.utils";

interface MobileFilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  searchMode: SearchMode;
  filters: TutorFilters;
  onFiltersChange: (f: TutorFilters) => void;
  resultCount: number;
  isLoading?: boolean;
}

export function MobileFilterDrawer({
  isOpen,
  onClose,
  searchMode,
  filters,
  onFiltersChange,
  resultCount,
  isLoading = false,
}: MobileFilterDrawerProps) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);
  const activeFilterCount = countActiveFilters(filters, searchMode === "manual");
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    const previousFocus = document.activeElement;
    document.body.style.overflow = "hidden";
    const frame = window.requestAnimationFrame(() => closeButtonRef.current?.focus());
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
        return;
      }

      if (event.key !== "Tab") return;
      const focusable = drawerRef.current?.querySelectorAll<HTMLElement>(
        'button:not([disabled]), input:not([disabled]), select:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])',
      );
      if (!focusable?.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
      if (previousFocus instanceof HTMLElement) previousFocus.focus();
    };
  }, [isOpen, onClose]);

  if (typeof document === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            key="backdrop"
            initial={shouldReduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: shouldReduceMotion ? 0 : 0.2 }}
            className="fixed inset-0 z-[70] bg-foreground/45"
            onClick={onClose}
            aria-hidden="true"
          />
          <motion.div
            ref={drawerRef}
            key="drawer"
            initial={shouldReduceMotion ? false : { x: "-100%" }}
            animate={{ x: 0 }}
            exit={shouldReduceMotion ? { opacity: 0 } : { x: "-100%" }}
            transition={shouldReduceMotion ? { duration: 0 } : { type: "spring", stiffness: 300, damping: 32 }}
            className="fixed left-0 top-0 z-[80] flex h-dvh w-[92vw] max-w-[400px] flex-col border-r border-border bg-background shadow-lg"
            role="dialog"
            aria-label="Bộ lọc gia sư"
            aria-modal="true"
          >
            <div className="flex items-center justify-between gap-3 border-b border-border px-5 py-4">
              <div className="flex min-w-0 items-center gap-2.5">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-border bg-muted text-primary">
                  <FunnelIcon size={18} weight="bold" aria-hidden="true" />
                </span>
                <span className="font-nunito text-lg font-extrabold text-foreground">Bộ lọc</span>
                {activeFilterCount > 0 && (
                  <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-md bg-primary px-1 text-[11px] font-bold text-primary-foreground">
                    {activeFilterCount}
                  </span>
                )}
              </div>
              <button
                ref={closeButtonRef}
                type="button"
                onClick={onClose}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                aria-label="Đóng bộ lọc"
              >
                <XIcon size={20} aria-hidden="true" />
              </button>
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5">
              <FilterPanel
                searchMode={searchMode}
                filters={filters}
                onFiltersChange={onFiltersChange}
                showHeader={false}
              />
            </div>
            <div className="border-t border-border bg-card px-5 pt-4 pb-[calc(1rem+env(safe-area-inset-bottom))]">
              <button
                type="button"
                onClick={onClose}
                disabled={isLoading}
                aria-busy={isLoading}
                className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-primary text-sm font-bold text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-wait"
              >
                {isLoading ? (
                  <>
                    <CircleNotchIcon size={18} className="animate-spin" aria-hidden="true" />
                    Đang lọc...
                  </>
                ) : (
                  `Xem ${resultCount} gia sư`
                )}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body,
  );
}
