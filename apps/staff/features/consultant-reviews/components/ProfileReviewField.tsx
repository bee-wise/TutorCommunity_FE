import { Check, WarningCircle } from "@phosphor-icons/react";
import { profileFieldLabels, type ProfileFieldName } from "../data/profile-fields";
import type { TutorProfileSubmission } from "../schemas/consultant-review.schema";
import { ReviewValue } from "./ReviewValue";

type Offering = NonNullable<TutorProfileSubmission["teachingOfferings"]>[number];

interface ProfileReviewFieldProps {
  field: ProfileFieldName;
  value: unknown;
  rejected: boolean;
  reason: string;
  reviewable: boolean;
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
  rejected,
  reason,
  reviewable,
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

  return (
    <div className="border-b border-border px-5 py-5 last:border-b-0 sm:px-7">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="font-semibold text-foreground">{profileFieldLabels[field]}</h3>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {!reviewable ? "Thông tin đã nộp" : needsChange ? "Đang đánh dấu cần chỉnh sửa" : "Không có yêu cầu chỉnh sửa"}
          </p>
        </div>
        {reviewable && (
          <button
            type="button"
            onClick={onToggle}
            className={`inline-flex min-h-9 items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${rejected ? "border-destructive bg-destructive text-destructive-foreground" : "border-border bg-card text-foreground hover:border-destructive hover:text-destructive"}`}
          >
            {rejected ? <Check size={15} aria-hidden="true" /> : <WarningCircle size={15} aria-hidden="true" />}
            {rejected ? "Đã chọn cần sửa" : "Yêu cầu sửa"}
          </button>
        )}
      </div>

      <div className="mt-3 min-w-0 text-sm leading-6 text-foreground">
        {isOfferingField && offerings.length > 0 ? (
          <div className="grid gap-3">
            {offerings.map((offering, index) => {
              const offeringId = offering.id;
              const individuallyRejected = Boolean(offeringId && offeringId in offeringRejections);
              return (
                <div key={offeringId ?? index} className="min-w-0 rounded-lg border border-border bg-muted p-4">
                  <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                    <span className="text-xs font-bold text-primary">Tổ hợp {index + 1}</span>
                    {reviewable && offeringId && (
                      <button
                        type="button"
                        onClick={() => onToggleOffering(offeringId)}
                        className={`rounded-md border px-2.5 py-1 text-xs font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${individuallyRejected ? "border-destructive bg-destructive text-destructive-foreground" : "border-border bg-card text-foreground hover:border-destructive hover:text-destructive"}`}
                      >
                        {individuallyRejected ? "Đã chọn cần sửa" : "Yêu cầu sửa riêng"}
                      </button>
                    )}
                  </div>
                  <ReviewValue value={offering} />
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
            {reviewable && offerings.some((offering) => !offering.id) && (
              <p className="text-xs text-muted-foreground">Tổ hợp chưa có mã cần được đánh dấu ở cấp trường dữ liệu.</p>
            )}
          </div>
        ) : <ReviewValue value={value} />}
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
        className="w-full resize-y rounded-lg border border-input bg-background px-3 py-2.5 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-ring aria-invalid:border-destructive"
      />
      {invalid && <p className="mt-1 text-xs font-semibold text-destructive">Cần nhập lý do trước khi chuyển bước.</p>}
    </div>
  );
}
