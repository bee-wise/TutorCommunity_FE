"use client";

import { motion, AnimatePresence } from "motion/react";
import Image from "next/image";
import { MagnifyingGlassIcon, UserIcon } from "@phosphor-icons/react";
import { TutorCard } from "./TutorCard";
import { TutorCardSkeleton } from "./TutorCardSkeleton";
import type { ApiTutorProfile, SearchMode } from "../data/types";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
  PaginationLink,
} from "@workspace/ui/components/ui/pagination";

interface TutorListResultsProps {
  tutors: ApiTutorProfile[];
  isLoading: boolean;
  searchMode: SearchMode;
  showBestMatch?: boolean;
  query: string;
  aiReason?: string;
  isLoggedIn?: boolean;
  pagination?: {
    page: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
  };
  onClearFilters: () => void;
  onTryAI: () => void;
  onPageChange?: (page: number) => void;
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
      <div className="flex flex-col gap-1.5 rounded-xl border border-[#dce3f0] bg-[#f8fafc] px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-6 h-6 rounded-full bg-[#280f91]">
            <Image
              src="/icons/BeeWiseAI-icon.svg"
              alt=""
              width={16}
              height={16}
              className="shrink-0"
              aria-hidden="true"
            />
          </div>
          <span
            className="text-sm font-bold text-[#280f91]"
            style={{ fontFamily: "var(--font-nunito-family)" }}
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
        <MagnifyingGlassIcon
          size={12}
          className="text-foreground/50"
          aria-hidden="true"
        />
      </div>
      <p className="text-sm text-foreground/60">
        Tìm thủ công:{" "}
        <span className="font-semibold text-foreground">{count} gia sư</span>
        {query && (
          <>
            {" "}
            khớp với{" "}
            <span className="font-semibold">&ldquo;{query}&rdquo;</span>
          </>
        )}
      </p>
    </div>
  );
}

function EmptyState({
  mode,
  query,
  onClearFilters,
  onTryAI,
}: {
  mode: SearchMode;
  query: string;
  onClearFilters: () => void;
  onTryAI: () => void;
}) {
  const isAIPrompt = mode === "ai" && !query.trim();

  return (
    <div className="flex flex-col items-center gap-5 py-20 text-center">
      <div className="relative flex items-center justify-center">
        {isAIPrompt ? (
          <Image
            src="/icons/BeeWiseAI-icon.svg"
            alt="BeeWise AI"
            width={280}
            height={84}
            className="w-[220px] sm:w-[280px] h-auto object-contain shrink-0"
            aria-hidden="true"
          />
        ) : (
          <Image
            src="https://res.cloudinary.com/xcrm6ykz/image/upload/v1790929519/NoData-Element.svg"
            alt="Không tìm thấy gia sư"
            width={300}
            height={300}
            className="shrink-0 object-contain w-72 h-56 sm:w-96 sm:h-72"
            aria-hidden="true"
          />
        )}
      </div>
      <div className="flex flex-col gap-2 max-w-[32ch]">
        <p
          className="text-base font-bold text-[#0c0c0b]"
          style={{ fontFamily: "var(--font-nunito-family)" }}
        >
          {isAIPrompt ? "Tìm kiếm gia sư với BeeWise AI" : null}
        </p>
        <p className="text-sm text-[#475467] leading-relaxed">
          {isAIPrompt
            ? "Hãy mô tả chi tiết nhu cầu học tập của bạn, BeeWise AI sẽ phân tích và gợi ý gia sư phù hợp nhất."
            : mode === "ai"
              ? "Hãy thử mô tả lại nhu cầu theo cách khác, hoặc chuyển sang tìm kiếm thủ công."
              : "Thử thay đổi bộ lọc hoặc tìm kiếm với từ khóa khác."}
        </p>
      </div>
      {!isAIPrompt && (
        <div className="flex flex-wrap justify-center gap-3">
          <button
            type="button"
            onClick={onClearFilters}
            className="h-10 rounded-xl border border-[#dce3f0] px-4 text-sm font-bold text-[#475467] hover:bg-[#f8fafc]"
          >
            Xóa bộ lọc
          </button>
          <button
            type="button"
            onClick={onTryAI}
            className="h-10 rounded-xl bg-[#280f91] px-4 text-sm font-bold text-white hover:bg-[#1f0b70]"
          >
            Thử tìm bằng AI
          </button>
        </div>
      )}
    </div>
  );
}

export function TutorListResults({
  tutors,
  isLoading,
  searchMode,
  showBestMatch = false,
  query,
  aiReason,
  isLoggedIn = false,
  pagination,
  onClearFilters,
  onTryAI,
  onPageChange,
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
        <EmptyState
          mode={searchMode}
          query={query}
          onClearFilters={onClearFilters}
          onTryAI={onTryAI}
        />
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
                key={tutor.profileId}
                layout
                className="h-full flex flex-col"
                variants={{
                  hidden: { opacity: 0, y: 16 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] },
                  },
                }}
                exit={{ opacity: 0, scale: 0.95 }}
                role="listitem"
              >
                <TutorCard
                  tutor={tutor}
                  isLoggedIn={isLoggedIn}
                  isBestMatch={showBestMatch && index === 0}
                  alignWithBestMatch={
                    showBestMatch && index === 1
                      ? "sm"
                      : showBestMatch && index === 2
                        ? "xl"
                        : undefined
                  }
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Pagination Controls */}
      {pagination && pagination.totalPages > 1 && onPageChange && (
        <div className="mt-8 mb-4">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => onPageChange(Math.max(1, pagination.page - 1))}
                  className={
                    pagination.page <= 1
                      ? "pointer-events-none opacity-50"
                      : "cursor-pointer"
                  }
                />
              </PaginationItem>
              {Array.from({ length: pagination.totalPages }).map((_, i) => {
                const pageNum = i + 1;
                // Simple logic: show first, last, current, and adjacent
                const isNearCurrent = Math.abs(pageNum - pagination.page) <= 1;
                const isEdge =
                  pageNum === 1 || pageNum === pagination.totalPages;
                if (!isNearCurrent && !isEdge) {
                  if (pageNum === 2 || pageNum === pagination.totalPages - 1) {
                    return (
                      <PaginationItem key={pageNum}>
                        <span className="px-2 text-muted-foreground">...</span>
                      </PaginationItem>
                    );
                  }
                  return null;
                }
                return (
                  <PaginationItem key={pageNum}>
                    <PaginationLink
                      isActive={pageNum === pagination.page}
                      onClick={() => onPageChange(pageNum)}
                      className="cursor-pointer"
                    >
                      {pageNum}
                    </PaginationLink>
                  </PaginationItem>
                );
              })}
              <PaginationItem>
                <PaginationNext
                  onClick={() =>
                    onPageChange(
                      Math.min(pagination.totalPages, pagination.page + 1),
                    )
                  }
                  className={
                    pagination.page >= pagination.totalPages
                      ? "pointer-events-none opacity-50"
                      : "cursor-pointer"
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
}
