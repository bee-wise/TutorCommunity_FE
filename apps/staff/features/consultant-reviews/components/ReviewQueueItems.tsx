import Link from "next/link";
import {
  ArrowRightIcon,
  PencilSquareIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";
import { Button } from "@workspace/ui/components/ui/button";
import { formatReviewDate, readableFieldName } from "../data/profile-fields";
import { formatReviewPreview } from "../data/review-value-format";
import type {
  PendingFieldChange,
  PendingProfile,
} from "../schemas/consultant-review.schema";

const actionClass =
  "h-10 rounded-xl border-primary px-4 font-bold text-primary transition-all hover:bg-primary hover:text-primary-foreground active:scale-[0.98]";

export function ReviewQueueItem({ profile }: { profile: PendingProfile }) {
  return (
    <article className="grid min-w-0 gap-4 border-b border-border px-4 py-4 transition-colors last:border-b-0 hover:bg-muted/30 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center sm:px-6">
      <div className="flex min-w-0 gap-3.5">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground">
          <UserCircleIcon className="size-5" aria-hidden="true" />
        </span>
        <div className="min-w-0">
          <h3 className="truncate font-nunito text-base font-extrabold text-foreground">
            {profile.displayName || profile.tutorFullName || "Gia sư chưa đặt tên"}
          </h3>
          <p className="truncate text-xs text-muted-foreground">
            {profile.tutorEmail || profile.profileId}
          </p>
          <p className="mt-1 line-clamp-2 text-sm text-foreground">
            {profile.profileHeadline ||
              [profile.universityName, profile.major].filter(Boolean).join(" · ") ||
              "Chưa có giới thiệu"}
          </p>
          <div className="mt-1.5 flex flex-wrap items-center gap-2">
            <span className="text-xs text-muted-foreground">
              Nộp lúc {formatReviewDate(profile.submittedAt)}
            </span>
            {profile.reviewCount > 0 && (
              <span className="rounded-full border border-accent bg-accent px-2.5 py-0.5 text-xs font-bold text-accent-foreground">
                Gửi lại lần {profile.reviewCount}
              </span>
            )}
          </div>
        </div>
      </div>
      <Button asChild variant="outline" size="sm" className={actionClass}>
        <Link href={`/consultant/tutors/${encodeURIComponent(profile.profileId)}`}>
          {profile.reviewCount > 0 ? "Duyệt lại hồ sơ" : "Bắt đầu xét duyệt"} <ArrowRightIcon className="size-4" aria-hidden="true" />
        </Link>
      </Button>
    </article>
  );
}

export function FieldChangeItem({
  request,
  onReview,
}: {
  request: PendingFieldChange;
  onReview: () => void;
}) {
  return (
    <article className="grid min-w-0 gap-4 border-b border-border px-4 py-4 transition-colors last:border-b-0 hover:bg-muted/30 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center sm:px-6">
      <div className="flex min-w-0 gap-3.5">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground">
          <PencilSquareIcon className="size-5" aria-hidden="true" />
        </span>
        <div className="min-w-0">
          <h3 className="font-nunito text-base font-extrabold text-foreground">
            {readableFieldName(request.fieldName)}
          </h3>
          <p className="truncate text-xs text-muted-foreground">
            {request.requestedByFullName || request.requestedByEmail || "Gia sư"}
            {request.requestedByFullName && request.requestedByEmail
              ? ` · ${request.requestedByEmail}`
              : ""}
          </p>
          <p className="mt-1 line-clamp-2 break-words text-sm text-foreground">
            {formatReviewPreview(request.fieldName, request.newValue)}
          </p>
          <p className="mt-1.5 text-xs text-muted-foreground">
            Yêu cầu lúc {formatReviewDate(request.requestedAt)}
          </p>
        </div>
      </div>
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={onReview}
        className={actionClass}
      >
        Xem thay đổi <ArrowRightIcon className="size-4" aria-hidden="true" />
      </Button>
    </article>
  );
}
