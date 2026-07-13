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
  isLoading?: boolean;
}

export function MobileFilterDrawer({
  isOpen,
  onClose,
  filters,
  onFiltersChange,
  resultCount,
  isLoading = false,
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
                disabled={isLoading}
                className="w-full h-11 flex items-center justify-center gap-2 rounded-full bg-primary text-white text-sm font-bold transition-all hover:bg-primary/90 active:scale-[0.98] disabled:opacity-70 disabled:pointer-events-none"
                style={{ fontFamily: "var(--font-montserrat)" }}
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
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
    </AnimatePresence>
  );
}
