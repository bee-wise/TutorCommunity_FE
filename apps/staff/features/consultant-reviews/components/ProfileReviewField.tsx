import { CheckIcon, ExclamationCircleIcon } from "@heroicons/react/24/outline";
import { Button } from "@workspace/ui/components/ui/button";
import { formatReviewDate, profileFieldLabels, type ProfileFieldName } from "../data/profile-fields";
import type { ReviewFieldComparison } from "../data/review-comparison";
import { hasReviewableValue } from "../data/review-eligibility";
import type { TutorProfileSubmission } from "../schemas/consultant-review.schema";
import { ReviewValue } from "./ReviewValue";
import { TeachingOfferingReviewDetails } from "./TeachingOfferingReviewDetails";

type Offering = NonNullable<TutorProfileSubmission["teachingOfferings"]>[number];

interface ProfileReviewFieldProps {
  field: ProfileFieldName;
  value: unknown;
  comparison?: ReviewFieldComparison;
  highlighted: boolean;
  rejected: boolean;
  reason: string;
  reviewable: boolean;
  submittedInCurrentReview: boolean;
  rejectableInCurrentReview: boolean;
  showValidation: boolean;
  onToggle: () => void;
  onReasonChange: (value: string) => void;
  offerings: Offering[];
  offeringRejections: Record<string, string>;
  onToggleOffering: (id: string) => void;
  onOfferingReasonChange: (id: string, value: string) => void;
}

export function ProfileReviewField({
  field,
  value,
  comparison,
  highlighted,
  rejected,
  reason,
  reviewable,
  submittedInCurrentReview,
  rejectableInCurrentReview,
  showValidation,
  onToggle,
  onReasonChange,
  offerings,
  offeringRejections,
  onToggleOffering,
  onOfferingReasonChange,
}: ProfileReviewFieldProps) {
  const isOfferingField = field === "teachingOfferings";
  const selectedOfferingCount = isOfferingField
    ? offerings.filter((offering) => offering.id && offering.id in offeringRejections).length
    : 0;
  const needsChange = rejected || selectedOfferingCount > 0;
  const canReview = reviewable && rejectableInCurrentReview;
  const showPrevious = comparison?.status === "changed";

  return (
    <div
      id={`profile-review-field-${field}`}
      tabIndex={-1}
      aria-label={`Trường ${profileFieldLabels[field]}`}
      className={`scroll-mt-24 border-b border-border px-5 py-5 outline-none last:border-b-0 sm:px-7 sm:py-6 ${highlighted ? "bg-accent/10 ring-2 ring-inset ring-primary/30" : ""}`}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="font-nunito text-base font-extrabold text-foreground">{profileFieldLabels[field]}</h3>
          {comparison && comparison.status !== "empty" && (
            <span className={`mt-1.5 inline-flex rounded-full px-2.5 py-1 text-xs font-bold ${comparison.status === "approved" ? "bg-primary text-primary-foreground" : "bg-accent text-accent-foreground"}`} title={comparison.reviewedAt ? `Đã duyệt ngày ${formatReviewDate(comparison.reviewedAt)}` : undefined}>
              {comparison.status === "approved" ? "Đã duyệt, không đổi" : comparison.status === "new" ? "Vừa gửi duyệt" : "Gửi duyệt lại"}
            </span>
          )}
          {reviewable && !submittedInCurrentReview && comparison?.status !== "approved" && (
            <span className="mt-1.5 inline-flex rounded-full border border-border bg-muted px-2.5 py-1 text-xs font-semibold text-muted-foreground">
              {hasReviewableValue(value) ? "Có dữ liệu, chưa nằm trong lượt duyệt" : "Chưa cung cấp"}
            </span>
          )}
          {needsChange && <p className="mt-0.5 text-xs font-semibold text-destructive">Đang đánh dấu cần chỉnh sửa</p>}
        </div>
        {canReview && (
          <Button
            type="button"
            variant={rejected ? "destructive" : "outline"}
            size="sm"
            onClick={onToggle}
            className="min-h-9 gap-1.5 rounded-xl px-3 text-xs font-bold transition-all active:scale-[0.98]"
          >
            {rejected ? <CheckIcon className="size-4" aria-hidden="true" /> : <ExclamationCircleIcon className="size-4" aria-hidden="true" />}
            {rejected ? "Đã chọn cần sửa" : "Yêu cầu sửa"}
          </Button>
        )}
      </div>

      <div className={`mt-3 grid min-w-0 gap-3 text-sm leading-6 text-foreground ${showPrevious ? "xl:grid-cols-2" : ""}`}>
        {showPrevious && (
          <div className="min-w-0 rounded-2xl border border-border bg-background p-4">
            <p className="mb-3 text-xs font-extrabold uppercase tracking-wider text-muted-foreground">
              Đã duyệt · {formatReviewDate(comparison.reviewedAt)}
            </p>
            <ReviewValue value={comparison.previousValue} fieldName={field} />
          </div>
        )}
        <div className={showPrevious ? "min-w-0 rounded-2xl border border-primary bg-background p-4" : "min-w-0"}>
          {showPrevious && <p className="mb-3 text-xs font-extrabold uppercase tracking-wider text-primary">Giá trị gửi lại</p>}
          {isOfferingField && offerings.length > 0 ? (
            <div className="grid gap-3">
              {offerings.map((offering, index) => {
                const offeringId = offering.id;
                const individuallyRejected = Boolean(offeringId && offeringId in offeringRejections);
                return (
                  <div key={offeringId ?? index} className={`min-w-0 rounded-2xl border p-4 ${individuallyRejected ? "border-destructive/40 bg-destructive/5" : "border-border bg-background"}`}>
                    <div className="mb-4 flex flex-wrap items-center justify-between gap-2 border-b border-border pb-3">
                      <span className="text-xs font-bold text-primary">Tổ hợp {index + 1}</span>
                      {canReview && offeringId && (
                        <Button
                          type="button"
                          variant={individuallyRejected ? "destructive" : "outline"}
                          size="sm"
                          onClick={() => onToggleOffering(offeringId)}
                          className="min-h-8 rounded-lg px-2.5 text-xs font-bold transition-all active:scale-[0.98]"
                        >
                          {individuallyRejected ? "Đã chọn cần sửa" : "Yêu cầu sửa riêng"}
                        </Button>
                      )}
                    </div>
                    <TeachingOfferingReviewDetails offering={offering} />
                    {individuallyRejected && offeringId && (
                      <ReasonInput
                        id={`offering-reason-${offeringId}`}
                        value={offeringRejections[offeringId] ?? ""}
                        onChange={(next) => onOfferingReasonChange(offeringId, next)}
                        invalid={showValidation && !offeringRejections[offeringId]?.trim()}
                        label={`Lý do yêu cầu sửa tổ hợp ${index + 1}`}
                      />
                    )}
                  </div>
                );
              })}
              {canReview && offerings.some((offering) => !offering.id) && (
                <p className="text-xs text-muted-foreground">Tổ hợp chưa có mã cần được đánh dấu ở cấp trường dữ liệu.</p>
              )}
            </div>
          ) : <ReviewValue value={value} fieldName={field} />}
        </div>
      </div>

      {rejected && (
        <ReasonInput
          id={`reason-${field}`}
          value={reason}
          onChange={onReasonChange}
          invalid={showValidation && !reason.trim()}
          label={`Lý do yêu cầu sửa ${profileFieldLabels[field]}`}
        />
      )}
    </div>
  );
}

function ReasonInput({
  id,
  value,
  onChange,
  invalid,
  label,
}: {
  id: string;
  value: string;
  onChange: (value: string) => void;
  invalid: boolean;
  label: string;
}) {
  return (
    <div className="mt-4">
      <label htmlFor={id} className="mb-1.5 block text-xs font-bold text-foreground">{label} *</label>
      <textarea
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        rows={2}
        maxLength={1000}
        placeholder="Nêu rõ điều gia sư cần bổ sung hoặc sửa"
        aria-invalid={invalid}
        className="w-full resize-y rounded-xl border border-input bg-background px-3.5 py-3 text-sm text-foreground outline-none transition-all placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-ring/30 aria-invalid:border-destructive"
      />
      {invalid && <p className="mt-1 text-xs font-semibold text-destructive">Cần nhập lý do trước khi chuyển bước.</p>}
    </div>
  );
}
