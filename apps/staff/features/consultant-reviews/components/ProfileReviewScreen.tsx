"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import { getApiErrorMessage } from "@workspace/core/sys-libs/error-handler";
import { Button } from "@workspace/ui/components/ui/button";
import {
  profileSections,
  type ProfileFieldName,
} from "../data/profile-fields";
import { compareProfileReview } from "../data/review-comparison";
import { canRejectSubmittedField, canSubmitProfileReview } from "../data/review-eligibility";
import {
  useProfileReview,
  useReviewList,
  useSubmitProfileReview,
} from "../hooks/useConsultantReviews";
import { ProfileReviewField } from "./ProfileReviewField";
import { ProfileReviewHeader } from "./ProfileReviewHeader";
import { ReviewDecisionSummary } from "./ReviewDecisionSummary";
import { ReviewStepActions } from "./ReviewStepActions";
import { ReviewStepper } from "./ReviewStepper";
import { ReviewSubmitDialog } from "./ReviewSubmitDialog";

const LIST_HREF = "/consultant/tutors";
const LAST_STEP = profileSections.length;

export function ProfileReviewScreen({ profileId }: { profileId: string }) {
  const router = useRouter();
  const profileQuery = useProfileReview(profileId);
  const mutation = useSubmitProfileReview(profileId);
  const [activeStep, setActiveStep] = useState(0);
  const [furthestStep, setFurthestStep] = useState(0);
  const [rejections, setRejections] = useState<Partial<Record<ProfileFieldName, string>>>({});
  const [offeringRejections, setOfferingRejections] = useState<Record<string, string>>({});
  const [note, setNote] = useState("");
  const [showValidation, setShowValidation] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [locateRequest, setLocateRequest] = useState<{ field: ProfileFieldName; sequence: number } | null>(null);

  const offerings = profileQuery.data?.profile.teachingOfferings ?? [];
  const reviewable = profileQuery.data?.status?.toUpperCase() === "PENDING_REVIEW";
  const reviewCount = profileQuery.data?.reviewCount ?? 0;
  const isResubmission = reviewCount > 0;
  const queueQuery = useReviewList({ queue: "profiles", search: "" }, reviewable && isResubmission, 0);
  const pendingProfile = queueQuery.data?.profiles?.find((profile) => profile.profileId === profileId);
  const submittedFields = new Set(
    (pendingProfile?.fields ?? [])
      .map((field) => field.fieldName)
      .filter((field): field is string => Boolean(field)),
  );
  const canSubmitReview = canSubmitProfileReview(
    reviewable,
    reviewCount,
    queueQuery.isSuccess && !queueQuery.isFetching && Boolean(pendingProfile),
  );
  const comparisons = useMemo(
    () => profileQuery.data ? compareProfileReview(profileQuery.data) : null,
    [profileQuery.data],
  );
  const resubmittedFields = useMemo(() => {
    if (!comparisons) return undefined;
    const rejectedFields = profileQuery.data?.rejectedFields;
    const rejectedNames = new Set(
      (rejectedFields ?? [])
        .map((field) => field.fieldName?.split(/[.[\]]+/).find(Boolean))
        .filter((field): field is string => Boolean(field)),
    );
    return profileSections.flatMap((section) => section.fields).filter((field) => {
      const status = comparisons[field]?.status;
      return (status === "changed" || status === "new") &&
        (!rejectedFields?.length || rejectedNames.has(field));
    });
  }, [comparisons, profileQuery.data?.rejectedFields]);
  const reviewableFields = new Set<ProfileFieldName>(
    profileSections.flatMap((section) => section.fields).filter((field) =>
      canRejectSubmittedField({
        submitted: submittedFields.has(field),
        reviewCount,
      }),
    ),
  );
  const activeRejections = Object.fromEntries(
    Object.entries(rejections).filter(([field]) => reviewableFields.has(field as ProfileFieldName)),
  ) as Partial<Record<ProfileFieldName, string>>;
  const activeOfferingRejections = reviewableFields.has("teachingOfferings")
    ? offeringRejections
    : {};
  const selectedFields = Object.entries(activeRejections) as [ProfileFieldName, string][];
  const selectedOfferings = Object.entries(activeOfferingRejections);
  const selectedCount = selectedFields.length + selectedOfferings.length;
  const currentSection = profileSections[activeStep];
  const rejectionCounts = [
    ...profileSections.map(
      (section) =>
        section.fields.filter((field) => field in activeRejections).length +
        (section.fields.includes("teachingOfferings")
          ? selectedOfferings.length
          : 0),
    ),
    selectedCount,
  ];

  function invalidStep(index: number): boolean {
    const section = profileSections[index];
    if (!section) return false;
    return (
      selectedFields.some(
        ([field, reason]) => section.fields.includes(field) && !reason.trim(),
      ) ||
      (section.fields.includes("teachingOfferings") &&
        selectedOfferings.some(([, reason]) => !reason.trim()))
    );
  }

  const invalidSteps = [
    ...profileSections.map((_, index) => invalidStep(index)),
    false,
  ];

  useEffect(() => {
    if (!locateRequest) return;
    const target = document.getElementById(`profile-review-field-${locateRequest.field}`);
    target?.scrollIntoView({ behavior: "smooth", block: "center" });
    target?.focus({ preventScroll: true });
  }, [activeStep, locateRequest]);

  function locateField(field: ProfileFieldName) {
    const step = profileSections.findIndex((section) => section.fields.includes(field));
    if (step < 0) return;
    setActiveStep(step);
    setFurthestStep((current) => Math.max(current, step));
    setLocateRequest((current) => ({ field, sequence: (current?.sequence ?? 0) + 1 }));
  }

  function toggleField(field: ProfileFieldName) {
    if (!reviewableFields.has(field)) return;
    if (field === "teachingOfferings") setOfferingRejections({});
    setRejections((current) => {
      const next = { ...current };
      if (field in next) delete next[field];
      else next[field] = "";
      return next;
    });
  }

  function toggleOffering(id: string) {
    if (!reviewableFields.has("teachingOfferings")) return;
    setRejections((current) => {
      const next = { ...current };
      delete next.teachingOfferings;
      return next;
    });
    setOfferingRejections((current) => {
      const next = { ...current };
      if (id in next) delete next[id];
      else next[id] = "";
      return next;
    });
  }

  function advance() {
    if (invalidStep(activeStep)) {
      setShowValidation(true);
      return;
    }
    const next = Math.min(activeStep + 1, LAST_STEP);
    setActiveStep(next);
    setLocateRequest(null);
    setFurthestStep((current) => Math.max(current, next));
    setShowValidation(false);
  }

  function selectStep(index: number) {
    if (index > furthestStep) return;
    if (index > activeStep && invalidStep(activeStep)) {
      setShowValidation(true);
      return;
    }
    setActiveStep(index);
    setLocateRequest(null);
    setShowValidation(false);
  }

  function openConfirmation() {
    if (!canSubmitReview) return;
    const firstInvalid = profileSections.findIndex((_, index) =>
      invalidStep(index),
    );
    if (firstInvalid >= 0) {
      setActiveStep(firstInvalid);
      setShowValidation(true);
      return;
    }
    setConfirmOpen(true);
  }

  async function submit() {
    if (!canSubmitReview ||
      selectedFields.some(([field]) => !reviewableFields.has(field)) ||
      (selectedOfferings.length > 0 && !reviewableFields.has("teachingOfferings")) ||
      profileSections.some((_, index) => invalidStep(index)))
      return;
    try {
      await mutation.mutateAsync({
        rejectedFields: [
          ...selectedFields.map(([fieldName, rejectionReason]) => ({
            fieldName,
            rejectionReason: rejectionReason.trim(),
          })),
          ...selectedOfferings.map(([offeringId, rejectionReason]) => ({
            fieldName: "teachingOfferings",
            offeringId,
            rejectionReason: rejectionReason.trim(),
          })),
        ],
        note: note.trim() || null,
      });
      setConfirmOpen(false);
      router.push(LIST_HREF);
    } catch {
      setConfirmOpen(false);
    }
  }

  return (
    <main className="min-w-0 bg-background px-4 py-5 sm:px-6 sm:py-7 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-5">
        <ProfileReviewHeader
          profileId={profileId}
          review={profileQuery.data}
          reviewable={reviewable}
          resubmittedFields={reviewable && isResubmission ? resubmittedFields : undefined}
          onLocateField={locateField}
        />

        {profileQuery.isPending ? (
          <div className="space-y-4" role="status" aria-label="Đang tải hồ sơ">
            <div className="h-72 animate-pulse rounded-3xl border border-border bg-card" />
          </div>
        ) : profileQuery.isError ? (
          <div
            className="rounded-2xl border border-destructive bg-card p-6"
            role="alert"
          >
            <p className="font-semibold text-destructive">
              Không tải được hồ sơ
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              {getApiErrorMessage(profileQuery.error)}
            </p>
            <Button
              onClick={() => void profileQuery.refetch()}
              className="mt-4 rounded-xl transition-all active:scale-[0.98]"
            >
              Thử lại
            </Button>
          </div>
        ) : profileQuery.data ? (
          <>
            {!reviewable && (
              <div className="flex items-start gap-3 rounded-2xl border border-warning bg-card p-4 text-sm text-foreground">
                <ExclamationTriangleIcon
                  className="size-5 shrink-0 text-warning"
                  aria-hidden="true"
                />
                Hồ sơ không ở trạng thái chờ duyệt. Bạn có thể xem lại nội dung
                nhưng không thể gửi quyết định mới.
              </div>
            )}
            {reviewable && isResubmission && queueQuery.isFetching && (
              <div className="rounded-2xl border border-border bg-card p-4 text-sm text-muted-foreground" role="status">
                Đang xác minh các trường thuộc lượt xét duyệt hiện tại...
              </div>
            )}
            {reviewable && isResubmission && queueQuery.isError && (
              <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-destructive bg-card p-4 text-sm text-destructive" role="alert">
                <span>Chưa tải được các trường được gửi trong lượt xét duyệt này.</span>
                <Button type="button" variant="outline" size="sm" onClick={() => void queueQuery.refetch()} className="rounded-xl transition-all active:scale-[0.98]">Thử lại</Button>
              </div>
            )}
            {reviewable && isResubmission && queueQuery.isSuccess && !pendingProfile && (
              <div className="rounded-2xl border border-destructive bg-card p-4 text-sm text-destructive" role="alert">
                Không tìm thấy hồ sơ trong hàng chờ hiện tại. Vui lòng tải lại trang trước khi xét duyệt.
              </div>
            )}
            {reviewable && canSubmitReview && reviewableFields.size === 0 && (
              <div className="rounded-2xl border border-border bg-card p-4 text-sm text-muted-foreground">
                Chưa có trường nào có giá trị chờ duyệt để từ chối. Bạn có thể duyệt hồ sơ hoặc kiểm tra lại dữ liệu đã gửi.
              </div>
            )}

            <div className="grid min-w-0 gap-5 lg:grid-cols-[15rem_minmax(0,1fr)] lg:items-start">
              <div className="lg:sticky lg:top-5">
                <ReviewStepper
                  activeStep={activeStep}
                  furthestStep={furthestStep}
                  rejectionCounts={rejectionCounts}
                  invalidSteps={invalidSteps}
                  onSelect={selectStep}
                />
                <ReviewStepActions
                  activeStep={activeStep}
                  lastStep={LAST_STEP}
                  reviewable={canSubmitReview}
                  onPrevious={() => selectStep(activeStep - 1)}
                  onNext={advance}
                  onSubmit={openConfirmation}
                />
              </div>

              <div className="min-w-0 space-y-4">
                {currentSection ? (
                  <section className="overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
                    <div className="border-b border-border px-5 py-5 sm:px-7 sm:py-6">
                      <p className="text-xs font-extrabold uppercase tracking-wider text-primary">
                        Bước {activeStep + 1} / {LAST_STEP + 1}
                      </p>
                      <h2 className="mt-2 font-nunito text-2xl font-extrabold text-foreground">
                        {currentSection.title}
                      </h2>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {currentSection.description}
                      </p>
                    </div>
                    <div>
                      {currentSection.fields.map((field) => (
                        <ProfileReviewField
                          key={field}
                          field={field}
                          value={profileQuery.data.profile[field]}
                          comparison={comparisons?.[field]}
                          highlighted={locateRequest?.field === field}
                          rejected={field in activeRejections}
                          reason={activeRejections[field] ?? ""}
                          reviewable={canSubmitReview}
                          submittedInCurrentReview={!isResubmission || submittedFields.has(field)}
                          rejectableInCurrentReview={reviewableFields.has(field)}
                          showValidation={showValidation}
                          onToggle={() => toggleField(field)}
                          onReasonChange={(value) =>
                            setRejections((current) => ({
                              ...current,
                              [field]: value,
                            }))
                          }
                          offerings={offerings}
                          offeringRejections={activeOfferingRejections}
                          onToggleOffering={toggleOffering}
                          onOfferingReasonChange={(id, value) =>
                            setOfferingRejections((current) => ({
                              ...current,
                              [id]: value,
                            }))
                          }
                        />
                      ))}
                    </div>
                  </section>
                ) : (
                  <ReviewDecisionSummary
                    rejections={activeRejections}
                    offeringRejections={activeOfferingRejections}
                    offeringIds={offerings.map((item) => item.id)}
                    note={note}
                    onNoteChange={setNote}
                    reviewable={reviewable}
                    isResubmission={isResubmission}
                    status={profileQuery.data.status}
                    previousRejections={profileQuery.data.rejectedFields ?? []}
                  />
                )}

              </div>
            </div>
          </>
        ) : null}
      </div>

      <ReviewSubmitDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        selectedCount={selectedCount}
        isResubmission={isResubmission}
        pending={mutation.isPending}
        onSubmit={() => void submit()}
      />
    </main>
  );
}
