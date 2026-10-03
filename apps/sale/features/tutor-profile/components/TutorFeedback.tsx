"use client";

import { useState } from "react";
import { Quote, ChevronDown, ChevronUp } from "lucide-react";
import type { TutorProfileData, TutorReviewItem } from "../types/mockTutorProfile";
import {
  getInitials,
  RatingStars,
  SectionShell,
} from "./TutorProfilePrimitives";

interface TutorFeedbackProps {
  tutor: TutorProfileData;
}

const INITIAL_VISIBLE = 4;

/** Rating distribution bar */
function RatingBar({ star, count, total }: { star: number; count: number; total: number }) {
  const pct = total > 0 ? Math.round((count / total) * 100) : 0;
  return (
    <div className="flex items-center gap-2">
      <span className="w-3 shrink-0 text-right text-[11px] font-bold text-[#0c0c0b]/60">
        {star}
      </span>
      <div className="relative h-2 flex-1 overflow-hidden rounded-full bg-[#f0f4fa]">
        <div
          className="absolute inset-y-0 left-0 rounded-full bg-[#ffc500] transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="w-5 shrink-0 text-[11px] font-semibold text-[#0c0c0b]/45">
        {count}
      </span>
    </div>
  );
}

/** Compact aggregate block shown at the top */
function RatingSummary({ reviews, rating }: { reviews: TutorReviewItem[]; rating: number }) {
  const dist = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviews.filter((r) => Math.round(r.rating) === star).length,
  }));

  return (
    <div className="mb-6 flex flex-col gap-4 rounded-2xl border border-[#e8edf5] bg-[#f8faff] p-4 sm:flex-row sm:items-center sm:gap-6">
      {/* Big score */}
      <div className="flex shrink-0 flex-col items-center justify-center gap-1 sm:min-w-[88px]">
        <span className="text-4xl font-black text-[#0c0c0b]">{rating.toFixed(1)}</span>
        <RatingStars value={rating} size={15} />
        <span className="mt-0.5 text-[11px] font-medium text-[#0c0c0b]/50">
          {reviews.length} nhận xét
        </span>
      </div>

      {/* Distribution bars */}
      <div className="flex flex-1 flex-col gap-1.5">
        {dist.map(({ star, count }) => (
          <RatingBar key={star} star={star} count={count} total={reviews.length} />
        ))}
      </div>
    </div>
  );
}

/** Individual review card */
function ReviewCard({ review }: { review: TutorReviewItem }) {
  return (
    <article className="flex flex-col justify-between rounded-2xl border border-[#e8edf5] bg-white p-5 transition duration-200 hover:-translate-y-0.5 hover:border-[#280f91]/25 hover:shadow-md hover:shadow-[#280f91]/6">
      {/* Author row */}
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#280f91] to-[#447353] text-sm font-black text-white shadow-xs">
          {getInitials(review.author)}
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-sm font-extrabold text-[#0c0c0b]">
            {review.author}
          </h3>
          <p className="text-xs font-semibold text-[#447353]">
            {review.relationship || "Học viên BeeWise"}
          </p>
        </div>
        <RatingStars value={review.rating} size={13} />
      </div>

      {/* Quote */}
      <div className="mt-3.5 rounded-xl border border-[#e8edf5]/80 bg-[#f8faff] p-3.5">
        <Quote size={18} className="mb-1 text-[#ffc500]/60" aria-hidden="true" />
        <blockquote className="text-sm leading-relaxed text-[#0c0c0b]/75">
          &ldquo;{review.quote}&rdquo;
        </blockquote>
      </div>
    </article>
  );
}

export function TutorFeedback({ tutor }: TutorFeedbackProps) {
  const reviews = tutor.reviews || [];
  const [showAll, setShowAll] = useState(false);

  const displayed = showAll ? reviews : reviews.slice(0, INITIAL_VISIBLE);
  const hasMore = reviews.length > INITIAL_VISIBLE;

  return (
    <SectionShell
      title="Đánh giá từ học viên & Phụ huynh"
      description="Những phản hồi thực tế sau quá trình học tập và đồng hành"
      badge={reviews.length > 0 ? `${reviews.length} đánh giá` : undefined}
    >
      {reviews.length > 0 ? (
        <>
          {/* Aggregate summary — only useful once there are enough reviews */}
          {reviews.length >= 3 && (
            <RatingSummary reviews={reviews} rating={tutor.rating} />
          )}

          {/* Review grid: 1 col mobile → 2 col sm → auto-fit on lg */}
          <div className="grid gap-4 sm:grid-cols-2">
            {displayed.map((review, index) => (
              <ReviewCard key={`${review.author}-${index}`} review={review} />
            ))}
          </div>

          {/* Show more / less toggle */}
          {hasMore && (
            <button
              type="button"
              onClick={() => setShowAll((prev) => !prev)}
              className="mt-5 flex w-full items-center justify-center gap-1.5 rounded-full border border-[#280f91]/18 bg-white py-3 text-sm font-bold text-[#280f91] transition hover:bg-[#280f91]/5 active:scale-[0.99]"
            >
              {showAll ? (
                <>
                  <ChevronUp size={15} aria-hidden="true" />
                  Thu gọn
                </>
              ) : (
                <>
                  <ChevronDown size={15} aria-hidden="true" />
                  Xem thêm {reviews.length - INITIAL_VISIBLE} đánh giá
                </>
              )}
            </button>
          )}
        </>
      ) : (
        <p className="text-sm text-[#0c0c0b]/50">
          Chưa có nhận xét nào từ học viên.
        </p>
      )}
    </SectionShell>
  );
}
