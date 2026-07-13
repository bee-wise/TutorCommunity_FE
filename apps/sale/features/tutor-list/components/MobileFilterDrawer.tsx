"use client";

import { motion, AnimatePresence } from "motion/react";
import { XIcon } from "@phosphor-icons/react";
import { FilterPanel } from "./FilterPanel";
import type { TutorFilters } from "../data/types";

interface MobileFilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  filters: TutorFilters;
  onFiltersChange: (f: TutorFilters) => void;
  resultCount: number;
}

export function MobileFilterDrawer({
  isOpen,
  onClose,
  filters,
  onFiltersChange,
  resultCount,
}: MobileFilterDrawerProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/40"
            onClick={onClose}
            aria-hidden="true"
          />
          <motion.div
            key="drawer"
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 32 }}
            className="fixed top-0 left-0 z-50 h-full w-[88vw] max-w-sm bg-background shadow-2xl flex flex-col"
            role="dialog"
            aria-label="Bộ lọc gia sư"
            aria-modal="true"
          >
            <div className="flex items-center justify-between p-5 border-b border-border">
              <span
                className="text-base font-bold text-foreground"
                style={{ fontFamily: "var(--font-montserrat)" }}
              >
                Bộ lọc
              </span>
              <button
                type="button"
                onClick={onClose}
                className="text-foreground/50 hover:text-foreground transition-colors"
                aria-label="Đóng bộ lọc"
              >
                <XIcon size={20} aria-hidden="true" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-5">
              <FilterPanel
                filters={filters}
                onFiltersChange={onFiltersChange}
              />
            </div>
            <div className="p-5 border-t border-border">
              <button
                type="button"
                onClick={onClose}
                className="w-full h-11 rounded-full bg-primary text-white text-sm font-bold transition-all hover:bg-primary/90 active:scale-[0.98]"
                style={{ fontFamily: "var(--font-montserrat)" }}
              >
                Xem {resultCount} gia sư
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
