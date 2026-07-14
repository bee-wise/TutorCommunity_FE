import { MessageSquareQuote, Star } from "lucide-react";
import type { TutorProfileData } from "../data/mockTutorProfile";
import {
  getInitials,
  RatingStars,
  SectionShell,
} from "./TutorProfilePrimitives";

interface TutorFeedbackProps {
  tutor: TutorProfileData;
}

export function TutorFeedback({ tutor }: TutorFeedbackProps) {
  return (
    <SectionShell
      eyebrow="Phản hồi"
      title="Đánh giá từ phụ huynh và học sinh"
      icon={MessageSquareQuote}
    >
      <div className="grid gap-4 lg:grid-cols-2">
        {tutor.reviews.map((review) => (
          <article
            key={review.author}
            className="rounded-2xl border border-[#ffc510]/45 bg-[#fff3cb] p-4"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#280f91] to-[#447353] text-sm font-black text-white">
                  {getInitials(review.author)}
                </div>
                <div>
                  <h3 className="text-sm font-black text-[#0c0c0b]">
                    {review.author}
                  </h3>
                  <p className="mt-0.5 text-sm text-[#0c0c0b]/55">
                    {review.relationship}
                  </p>
                </div>
              </div>
              <RatingStars value={review.rating} size={14} />
            </div>

            <div className="mt-4 rounded-2xl bg-white p-4">
              <Star
                size={17}
                className="text-[#ffc500]"
                fill="currentColor"
                aria-hidden="true"
              />
              <p className="mt-3 text-sm leading-7 text-[#0c0c0b]/70">
                &ldquo;{review.quote}&rdquo;
              </p>
            </div>
          </article>
        ))}
      </div>
    </SectionShell>
  );
}
