"use client";

import { motion, AnimatePresence } from "motion/react";
import { SparkleIcon, MagnifyingGlassIcon, UserIcon } from "@phosphor-icons/react";
import { TutorCard } from "./TutorCard";
import { TutorCardSkeleton } from "./TutorCardSkeleton";
import type { Tutor, SearchMode } from "../data/types";

interface TutorListResultsProps {
  tutors: Tutor[];
  isLoading: boolean;
  searchMode: SearchMode;
  query: string;
  aiReason?: string;
  isLoggedIn?: boolean;
}

function ResultLabel({
  mode,
  query,
  count,
  aiReason,
}: {
  mode: SearchMode;
  query: string;
  count: number;
  aiReason?: string;
}) {
  if (mode === "ai") {
    return (
      <div className="flex flex-col gap-2 p-4 rounded-2xl border border-primary/15 bg-primary/5">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary">
            <SparkleIcon size={13} className="text-white" weight="fill" aria-hidden="true" />
          </div>
          <span
            className="text-sm font-bold text-primary"
            style={{ fontFamily: "var(--font-montserrat)" }}
          >
            AI tìm được {count} gia sư phù hợp
          </span>
        </div>
        {query && (
          <p className="text-xs text-foreground/55 pl-8 leading-relaxed">
            Kết quả AI cho:{" "}
            <span className="font-semibold text-foreground/70">
              &ldquo;{query}&rdquo;
            </span>
          </p>
        )}
        {aiReason && (
          <p className="text-xs text-foreground/50 pl-8 leading-relaxed italic">
            {aiReason}
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center justify-center w-6 h-6 rounded-full bg-muted border border-border">
        <MagnifyingGlassIcon size={12} className="text-foreground/50" aria-hidden="true" />
      </div>
      <p className="text-sm text-foreground/60">
        Tìm thủ công:{" "}
        <span className="font-semibold text-foreground">
          {count} gia sư
        </span>
        {query && (
          <>
            {" "}khớp với{" "}
            <span className="font-semibold">
              &ldquo;{query}&rdquo;
            </span>
          </>
        )}
      </p>
    </div>
  );
}

function EmptyState({
  mode,
}: {
  mode: SearchMode;
}) {
  return (
    <div className="flex flex-col items-center gap-5 py-20 text-center">
      <div
        className="w-16 h-16 rounded-2xl flex items-center justify-center"
        style={{ background: "rgba(40,15,145,0.08)" }}
      >
        <UserIcon size={32} className="text-primary/40" aria-hidden="true" />
      </div>
      <div className="flex flex-col gap-2 max-w-[32ch]">
        <p
          className="text-base font-bold text-foreground/60"
          style={{ fontFamily: "var(--font-montserrat)" }}
        >
          Không tìm thấy gia sư phù hợp
        </p>
        <p className="text-sm text-foreground/40 leading-relaxed">
          {mode === "ai"
            ? "Hãy thử mô tả lại nhu cầu theo cách khác, hoặc chuyển sang tìm kiếm thủ công."
            : "Thử thay đổi bộ lọc hoặc tìm kiếm với từ khóa khác."}
        </p>
      </div>
    </div>
  );
}

export function TutorListResults({
  tutors,
  isLoading,
  searchMode,
  query,
  aiReason,
  isLoggedIn = false,
}: TutorListResultsProps) {
  if (isLoading) {
    return (
      <div className="flex flex-col gap-6">
        <div className="h-14 rounded-2xl bg-muted/60 animate-pulse" />
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <TutorCardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Result label */}
      {query.trim() && (
        <ResultLabel
          mode={searchMode}
          query={query}
          count={tutors.length}
          aiReason={aiReason}
        />
      )}

      {tutors.length === 0 ? (
        <EmptyState mode={searchMode} />
      ) : (
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.06 } },
          }}
          role="list"
          aria-label={`Danh sách ${tutors.length} gia sư`}
        >
          <AnimatePresence mode="popLayout">
            {tutors.map((tutor, index) => (
              <motion.div
                key={tutor.id}
                layout
                className="h-full flex flex-col"
                variants={{
                  hidden: { opacity: 0, y: 16 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] } },
                }}
                exit={{ opacity: 0, scale: 0.95 }}
                role="listitem"
              >
                <TutorCard 
                  tutor={tutor} 
                  isLoggedIn={isLoggedIn} 
                  isBestMatch={searchMode === "ai" && index === 0}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
}
