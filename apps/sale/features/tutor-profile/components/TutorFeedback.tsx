import { Quote } from "lucide-react";
import type { TutorProfileData } from "../types/mockTutorProfile";
import {
  getInitials,
  RatingStars,
  SectionShell,
} from "./TutorProfilePrimitives";

interface TutorFeedbackProps {
  tutor: TutorProfileData;
}

export function TutorFeedback({ tutor }: TutorFeedbackProps) {
  const reviews = tutor.reviews || [];

  return (
    <SectionShell
      title="Đánh giá từ học viên & Phụ huynh"
      description="Những phản hồi thực tế sau quá trình học tập và đồng hành"
      badge={reviews.length > 0 ? `${reviews.length} đánh giá` : undefined}
    >
      {reviews.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2">
          {reviews.map((review, index) => (
            <article
              key={`${review.author}-${index}`}
              className="flex flex-col justify-between rounded-2xl border border-[#e8edf5] bg-white p-5 transition duration-200 hover:-translate-y-0.5 hover:border-[#280f91]/25 hover:shadow-md hover:shadow-[#280f91]/6"
            >
              <div>
                {/* Author row */}
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#280f91] to-[#447353] text-sm font-black text-white shadow-xs">
                    {getInitials(review.author)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-base font-extrabold text-[#0c0c0b]">
                      {review.author}
                    </h3>
                    <p className="text-xs font-semibold text-[#447353]">
                      {review.relationship || "Học viên BeeWise"}
                    </p>
                  </div>
                  <RatingStars value={review.rating} size={14} />
                </div>

                {/* Quote Body */}
                <div className="relative mt-4 rounded-xl bg-[#f8faff] p-4 border border-[#e8edf5]/80">
                  <Quote
                    size={20}
                    className="mb-1 text-[#ffc500]/60"
                    aria-hidden="true"
                  />
                  <blockquote className="text-sm leading-relaxed text-[#0c0c0b]/75">
                    &ldquo;{review.quote}&rdquo;
                  </blockquote>
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <p className="text-sm text-[#0c0c0b]/50">
          Chưa có nhận xét nào từ học viên.
        </p>
      )}
    </SectionShell>
  );
}

