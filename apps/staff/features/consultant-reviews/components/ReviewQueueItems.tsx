import Link from "next/link";
import { ArrowRightIcon, ClockIcon } from "@heroicons/react/24/outline";
import { Button } from "@workspace/ui/components/ui/button";
import { formatReviewDate, readableFieldName } from "../data/profile-fields";
import { formatReviewPreview } from "../data/review-value-format";
import type {
  PendingFieldChange,
  PendingProfile,
} from "../schemas/consultant-review.schema";

const actionClass =
  "min-h-11 rounded-full px-5 font-bold transition-all active:scale-[0.98]";

function initials(name: string) {
  const parts = name.split(/\s+/).filter(Boolean);
  return (
    parts
      .slice(-2)
      .map((part) => part[0])
      .join("")
      .toUpperCase() || "GS"
  );
}
function waitingLabel(value: string) {
  const elapsed = Date.now() - Date.parse(value);
  if (!Number.isFinite(elapsed) || elapsed < 0) return null;
  const minutes = Math.floor(elapsed / 60000);
  if (minutes < 60) return `Chờ ${Math.max(minutes, 1)} phút`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `Chờ ${hours} giờ`;
  return `Chờ ${Math.floor(hours / 24)} ngày`;
}
function isLong(value: string) {
  return Date.now() - Date.parse(value) > 2 * 24 * 3600 * 1000;
}
function WaitChip({ since }: { since: string }) {
  const label = waitingLabel(since);
  if (!label) return null;
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold ${isLong(since) ? "bg-highlight text-foreground" : "bg-muted text-muted-foreground"}`}
    >
      <ClockIcon className="size-3.5" aria-hidden="true" />
      {label}
    </span>
  );
}

export function ReviewQueueItem({ profile }: { profile: PendingProfile }) {
  const name =
    profile.displayName || profile.tutorFullName || "Gia sư chưa đặt tên";
  const school = [profile.universityName, profile.major]
    .filter(Boolean)
    .join(" · ");
  return (
    <article className="grid min-w-0 gap-4 border-b border-border px-4 py-4 transition-colors last:border-b-0 hover:bg-muted sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center sm:px-6">
      <div className="flex min-w-0 gap-4">
        <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-muted font-nunito text-base font-extrabold text-primary">
          {initials(name)}
        </span>
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <h3 className="truncate font-nunito text-base font-extrabold text-foreground">
              {name}
            </h3>
            {profile.reviewCount > 0 && (
              <span className="rounded-full bg-accent px-2.5 py-0.5 text-xs font-bold text-accent-foreground">
                Gửi lại lần {profile.reviewCount}
              </span>
            )}
          </div>
          <p className="truncate text-xs text-muted-foreground">
            {[profile.accountCode, profile.tutorEmail]
              .filter(Boolean)
              .join(" · ") || "Chưa có email"}
          </p>
          <p className="mt-1.5 line-clamp-1 text-sm text-foreground">
            {profile.profileHeadline || school || "Chưa có giới thiệu"}
          </p>
          {profile.profileHeadline && school && (
            <p className="line-clamp-1 text-xs text-muted-foreground">
              {school}
            </p>
          )}
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <WaitChip since={profile.submittedAt} />
            <span className="text-xs text-muted-foreground">
              Nộp {formatReviewDate(profile.submittedAt)}
            </span>
          </div>
        </div>
      </div>
      <Button asChild className={actionClass}>
        <Link href={`/consultant/tutors/${encodeURIComponent(profile.profileId)}`}>
          {profile.reviewCount > 0 ? "Duyệt lại hồ sơ" : "Bắt đầu xét duyệt"}
          <ArrowRightIcon className="size-4" aria-hidden="true" />
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
  const who = request.requestedByFullName || request.requestedByEmail || "Gia sư";
  return (
    <article className="grid min-w-0 gap-4 border-b border-border px-4 py-4 transition-colors last:border-b-0 hover:bg-muted sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center sm:px-6">
      <div className="flex min-w-0 gap-4">
        <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-muted font-nunito text-base font-extrabold text-primary">
          {initials(who)}
        </span>
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <h3 className="font-nunito text-base font-extrabold text-foreground">
              {who}
            </h3>
            <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs font-bold text-primary">
              {readableFieldName(request.fieldName)}
            </span>
          </div>
          <p className="truncate text-xs text-muted-foreground">
            {[request.accountCode, request.requestedByFullName && request.requestedByEmail]
              .filter(Boolean)
              .join(" · ")}
          </p>
          <p className="mt-1.5 line-clamp-2 break-words text-sm text-foreground">
            <span className="text-muted-foreground">Giá trị mới: </span>
            {formatReviewPreview(request.fieldName, request.newValue)}
          </p>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <WaitChip since={request.requestedAt} />
            <span className="text-xs text-muted-foreground">
              Yêu cầu {formatReviewDate(request.requestedAt)}
            </span>
          </div>
        </div>
      </div>
      <Button type="button" onClick={onReview} className={actionClass}>
        Xem thay đổi
        <ArrowRightIcon className="size-4" aria-hidden="true" />
      </Button>
    </article>
  );
}
