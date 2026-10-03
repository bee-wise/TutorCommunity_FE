"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle,
  Copy,
  Info,
  WarningCircle,
} from "@phosphor-icons/react";
import { getApiErrorMessage } from "@workspace/core/sys-libs/error-handler";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@workspace/ui/components/ui/dialog";
import {
  formatReviewDate,
  profileSections,
  type ProfileFieldName,
} from "../data/profile-fields";
import {
  useProfileReview,
  useSubmitProfileReview,
} from "../hooks/useConsultantReviews";
import { ProfileReviewField } from "./ProfileReviewField";
import { ReviewDecisionSummary } from "./ReviewDecisionSummary";
import { ReviewStepper } from "./ReviewStepper";

const LIST_HREF = "/consultant/tutors";
const LAST_STEP = profileSections.length;

export function ProfileReviewScreen({ profileId }: { profileId: string }) {
  const router = useRouter();
  const profileQuery = useProfileReview(profileId);
  const mutation = useSubmitProfileReview(profileId);
  const [activeStep, setActiveStep] = useState(0);
  const [furthestStep, setFurthestStep] = useState(0);
  const [rejections, setRejections] = useState<
    Partial<Record<ProfileFieldName, string>>
  >({});
  const [offeringRejections, setOfferingRejections] = useState<
    Record<string, string>
  >({});
  const [note, setNote] = useState("");
  const [showValidation, setShowValidation] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [infoModalOpen, setInfoModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const offerings = profileQuery.data?.profile.teachingOfferings ?? [];
  const reviewable =
    profileQuery.data?.status?.toUpperCase() === "PENDING_REVIEW";
  const selectedFields = Object.entries(rejections) as [
    ProfileFieldName,
    string,
  ][];
  const selectedOfferings = Object.entries(offeringRejections);
  const selectedCount = selectedFields.length + selectedOfferings.length;
  const currentSection = profileSections[activeStep];
  const rejectionCounts = [
    ...profileSections.map(
      (section) =>
        section.fields.filter((field) => field in rejections).length +
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

  function toggleField(field: ProfileFieldName) {
    if (field === "teachingOfferings") setOfferingRejections({});
    setRejections((current) => {
      const next = { ...current };
      if (field in next) delete next[field];
      else next[field] = "";
      return next;
    });
  }

  function toggleOffering(id: string) {
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
    setShowValidation(false);
  }

  function openConfirmation() {
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
    if (!reviewable || profileSections.some((_, index) => invalidStep(index)))
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
    <main className="min-w-0 bg-muted px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Link
            href={LIST_HREF}
            className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-border bg-card px-3.5 py-2 text-sm font-semibold text-foreground transition-colors hover:border-primary hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <ArrowLeft size={17} aria-hidden="true" /> Về hàng chờ
          </Link>

          {profileQuery.data ? (
            <div className="flex items-center gap-2.5 rounded-lg border border-border bg-card px-3 py-1.5 shadow-sm">
              <div className="min-w-0 text-right">
                <span className="block truncate font-nunito text-sm font-bold text-foreground">
                  {profileQuery.data.profile.displayName || "Gia sư chưa đặt tên"}
                </span>
                <span className="block font-mono text-[11px] text-muted-foreground">
                  Mã: {profileId.length > 18 ? `${profileId.slice(0, 15)}...` : profileId}
                </span>
              </div>
              <span
                className={`shrink-0 rounded-md border px-2 py-0.5 text-xs font-bold ${
                  reviewable
                    ? "border-amber-500/30 bg-amber-500/10 text-amber-700"
                    : "border-border text-muted-foreground"
                }`}
              >
                {reviewable
                  ? "Đang chờ duyệt"
                  : profileQuery.data.status || "Chưa rõ trạng thái"}
              </span>
              <button
                type="button"
                onClick={() => setInfoModalOpen(true)}
                className="flex size-7 items-center justify-center rounded-md border border-border bg-muted/50 text-muted-foreground transition-colors hover:border-primary hover:bg-primary/10 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                aria-label="Xem thông tin chi tiết hồ sơ"
                title="Thông tin chi tiết hồ sơ"
              >
                <Info size={16} weight="bold" aria-hidden="true" />
              </button>
            </div>
          ) : null}
        </div>

        {profileQuery.isPending ? (
          <div className="space-y-4" role="status" aria-label="Đang tải hồ sơ">
            <div className="h-72 animate-pulse rounded-xl bg-card" />
          </div>
        ) : profileQuery.isError ? (
          <div
            className="rounded-xl border border-error bg-card p-6"
            role="alert"
          >
            <p className="font-semibold text-destructive">
              Không tải được hồ sơ
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              {getApiErrorMessage(profileQuery.error)}
            </p>
            <button
              type="button"
              onClick={() => void profileQuery.refetch()}
              className="mt-4 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
            >
              Thử lại
            </button>
          </div>
        ) : profileQuery.data ? (
          <>

            {!reviewable && (
              <div className="flex items-start gap-2 rounded-lg border border-warning bg-card p-4 text-sm text-foreground">
                <WarningCircle
                  size={20}
                  className="shrink-0 text-warning"
                  aria-hidden="true"
                />
                Hồ sơ không ở trạng thái chờ duyệt. Bạn có thể xem lại nội dung
                nhưng không thể gửi quyết định mới.
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
              </div>

              <div className="min-w-0 space-y-4">
                {currentSection ? (
                  <section className="overflow-hidden rounded-xl border border-border bg-card">
                    <div className="border-b border-border px-5 py-5 sm:px-7">
                      <p className="text-xs font-bold text-primary">
                        Bước {activeStep + 1} / {LAST_STEP + 1}
                      </p>
                      <h2 className="mt-1 font-nunito text-2xl font-extrabold">
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
                          rejected={field in rejections}
                          reason={rejections[field] ?? ""}
                          reviewable={reviewable}
                          showValidation={showValidation}
                          onToggle={() => toggleField(field)}
                          onReasonChange={(value) =>
                            setRejections((current) => ({
                              ...current,
                              [field]: value,
                            }))
                          }
                          offerings={offerings}
                          offeringRejections={offeringRejections}
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
                    rejections={rejections}
                    offeringRejections={offeringRejections}
                    offeringIds={offerings.map((item) => item.id)}
                    note={note}
                    onNoteChange={setNote}
                    reviewable={reviewable}
                    status={profileQuery.data.status}
                    previousRejections={profileQuery.data.rejectedFields ?? []}
                  />
                )}

                <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-card p-3 sm:p-4">
                  <div>
                    <p className="text-xs font-bold text-primary">
                      Bước {activeStep + 1} / {LAST_STEP + 1}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {selectedCount
                        ? `${selectedCount} mục đã đánh dấu cần sửa`
                        : "Chưa có mục cần sửa"}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {activeStep > 0 && (
                      <button
                        type="button"
                        onClick={() => selectStep(activeStep - 1)}
                        className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-border bg-card px-4 py-2 text-sm font-bold text-foreground transition-colors hover:border-primary hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      >
                        <ArrowLeft size={16} aria-hidden="true" /> Bước trước
                      </button>
                    )}
                    {activeStep < LAST_STEP ? (
                      <button
                        type="button"
                        onClick={advance}
                        className="inline-flex min-h-10 items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-bold text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      >
                        Tiếp tục <ArrowRight size={16} aria-hidden="true" />
                      </button>
                    ) : reviewable ? (
                      <button
                        type="button"
                        onClick={openConfirmation}
                        className="inline-flex min-h-10 items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-bold text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      >
                        <CheckCircle size={17} aria-hidden="true" /> Gửi kết quả
                      </button>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : null}
      </div>

      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedCount
                ? "Gửi yêu cầu chỉnh sửa hồ sơ?"
                : "Duyệt toàn bộ hồ sơ?"}
            </DialogTitle>
            <DialogDescription>
              {selectedCount
                ? `${selectedCount} mục sẽ bị từ chối, các mục còn lại được duyệt. Gia sư sẽ nhận lý do để cập nhật.`
                : "Hồ sơ sẽ được phê duyệt trong một lần xử lý."}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <button
              type="button"
              onClick={() => setConfirmOpen(false)}
              disabled={mutation.isPending}
              className="rounded-lg border border-border px-4 py-2 text-sm font-semibold text-foreground"
            >
              Quay lại rà soát
            </button>
            <button
              type="button"
              onClick={() => void submit()}
              disabled={mutation.isPending}
              className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-50"
            >
              {mutation.isPending ? "Đang gửi..." : "Xác nhận gửi"}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog open={infoModalOpen} onOpenChange={setInfoModalOpen}>
        <DialogContent className="max-w-md rounded-2xl border-border sm:max-w-lg">
          <DialogHeader className="text-left">
            <div className="mb-2 flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Info size={22} weight="fill" aria-hidden="true" />
            </div>
            <DialogTitle className="font-nunito text-xl font-extrabold text-foreground">
              Thông tin chi tiết hồ sơ
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Thông tin định danh và trạng thái xét duyệt của gia sư.
            </DialogDescription>
          </DialogHeader>

          {profileQuery.data ? (
            <div className="space-y-4 py-2 text-sm">
              <div className="grid gap-3 rounded-xl border border-border bg-muted/40 p-3.5">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-medium text-muted-foreground">
                    Tên hiển thị
                  </span>
                  <span className="font-semibold text-foreground">
                    {profileQuery.data.profile.displayName || "Chưa đặt tên"}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-2 border-t border-border/60 pt-2.5">
                  <span className="text-xs font-medium text-muted-foreground">
                    Trạng thái xét duyệt
                  </span>
                  <span
                    className={`rounded-md border px-2 py-0.5 text-xs font-bold ${
                      reviewable
                        ? "border-amber-500/30 bg-amber-500/10 text-amber-700"
                        : "border-border text-muted-foreground"
                    }`}
                  >
                    {reviewable
                      ? "Đang chờ duyệt"
                      : profileQuery.data.status || "Chưa rõ trạng thái"}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-2 border-t border-border/60 pt-2.5">
                  <span className="text-xs font-medium text-muted-foreground">
                    Mã hồ sơ (UUID)
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono text-xs text-foreground">
                      {profileId}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        void navigator.clipboard.writeText(profileId);
                        setCopied(true);
                        setTimeout(() => setCopied(false), 2000);
                      }}
                      className="inline-flex size-6 items-center justify-center rounded text-muted-foreground hover:bg-muted hover:text-foreground"
                      title="Sao chép mã hồ sơ"
                    >
                      {copied ? (
                        <Check size={14} className="text-green-600" />
                      ) : (
                        <Copy size={14} />
                      )}
                    </button>
                  </div>
                </div>

                {profileQuery.data.reviewedAt ? (
                  <div className="flex items-center justify-between gap-2 border-t border-border/60 pt-2.5">
                    <span className="text-xs font-medium text-muted-foreground">
                      Thời gian xử lý gần nhất
                    </span>
                    <span className="text-xs font-medium text-foreground">
                      {formatReviewDate(profileQuery.data.reviewedAt)}
                    </span>
                  </div>
                ) : null}
              </div>

              <div className="rounded-xl border border-border bg-card p-3.5 text-xs leading-5 text-muted-foreground">
                <p className="mb-1 font-semibold text-foreground">
                  Quy trình xét duyệt:
                </p>
                <p>
                  1. Đi qua từng bước kiểm tra thông tin cá nhân, môn dạy, giới thiệu và địa chỉ.
                </p>
                <p>
                  2. Đánh dấu từ chối và nhập lý do rõ ràng nếu mục nào chưa đạt chuẩn.
                </p>
                <p>
                  3. Xem lại tổng kết quyết định ở bước cuối trước khi gửi kết quả.
                </p>
              </div>
            </div>
          ) : null}

          <DialogFooter>
            <button
              type="button"
              onClick={() => setInfoModalOpen(false)}
              className="w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 sm:w-auto"
            >
              Đóng
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  );
}
