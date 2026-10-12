"use client";

import { useEffect, useMemo, useState } from "react";
import { FormProvider, useWatch } from "react-hook-form";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  FloppyDisk,
  Info,
} from "@phosphor-icons/react";
import { useRouter } from "next/navigation";
import { ExclamationCircleIcon } from "@heroicons/react/20/solid";
import { Header } from "@workspace/ui/components/layout/Header";
import { Button } from "@workspace/ui/components/ui/button";
import { useAuthStore } from "@workspace/core/store/useAuthStore";
import { useTutorProfileRegistration } from "../hooks/useTutorProfileRegistration";
import {
  getProfileStepIssues,
  getRejectedProfileStep,
  getRejectedProfileSteps,
  type ProfileStepIndex,
} from "../utils/profile-step-completion";
import { AchievementsFields } from "./AchievementsFields";
import {
  TeachingAreaAndVerificationSection,
  BasicInformationSection,
  IntroductionSection,
  TeachingInformationSection,
} from "./ProfileFormSections";
import { ProfileExitDialog } from "./ProfileExitDialog";
import { ProfileReviewHighlightProvider } from "./ProfileField";
import { ProfileReviewFeedback } from "./ProfileReviewFeedback";
import { ProfileRegistrationSkeleton } from "./ProfileRegistrationSkeleton";
import { ProfileStepStatusDialog } from "./ProfileStepStatusDialog";

const steps = [
  { title: "Cá nhân", description: "Danh tính và học vấn" },
  { title: "Chuyên môn", description: "Môn dạy và học phí" },
  { title: "Giới thiệu", description: "Phương pháp và thành tích" },
  { title: "Hoàn tất", description: "Khu vực và xác minh" },
] as const;

export function TutorProfileRegistrationScreen() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isAuthLoading = useAuthStore((state) => state.isAuthLoading);
  const registration = useTutorProfileRegistration();
  const [activeStep, setActiveStep] = useState(0);
  const [guideStep, setGuideStep] = useState<number | null>(null);
  const [locateRequest, setLocateRequest] = useState<{
    fieldName: string;
    offeringId?: string | null;
    sequence: number;
  } | null>(null);
  const formValues = useWatch({ control: registration.form.control });
  const stepIssues = useMemo(
    () => getProfileStepIssues(formValues),
    [formValues],
  );
  const rejectedSteps = useMemo(
    () =>
      getRejectedProfileSteps(
        registration.isReviewCorrection
          ? (registration.reviewQuery.data?.rejectedFields ?? [])
          : [],
      ),
    [registration.isReviewCorrection, registration.reviewQuery.data],
  );

  function locateField(fieldName: string, offeringId?: string | null) {
    const step = getRejectedProfileStep(fieldName);
    if (step === undefined) return;
    setActiveStep(step);
    setLocateRequest((current) => ({
      fieldName,
      offeringId,
      sequence: (current?.sequence ?? 0) + 1,
    }));
  }

  useEffect(() => {
    const rejectedFields = registration.reviewQuery.data?.rejectedFields;
    if (!registration.isReviewCorrection || !rejectedFields) return;
    const params = new URLSearchParams(window.location.search);
    const fieldName = params.get("field");
    const offeringId = params.get("offeringId");
    const rejected = rejectedFields.find((field) =>
      field.fieldName === fieldName && (field.offeringId ?? null) === offeringId,
    );
    if (!rejected) return;
    const frame = window.requestAnimationFrame(() => locateField(rejected.fieldName, rejected.offeringId));
    return () => window.cancelAnimationFrame(frame);
  }, [registration.isReviewCorrection, registration.reviewQuery.data]);

  useEffect(() => {
    if (!locateRequest || registration.profileQuery.isLoading) return;
    const rootField = locateRequest.fieldName.split(/[.[\]]+/).find(Boolean);
    const targetField = ["subjectIds", "gradeLevelIds", "hourlyRate", "basePrice", "teachingMode", "teachingModes"].includes(rootField ?? "")
      ? "teachingOfferings"
      : rootField === "offlineDistrict" ? "area" : rootField;
    const offering = locateRequest.offeringId
      ? [...document.querySelectorAll<HTMLElement>("[data-review-offering-id]")]
          .find((element) => element.dataset.reviewOfferingId === locateRequest.offeringId)
      : undefined;
    const target = offering ?? (targetField ? document.getElementById(`profile-review-field-${targetField}`) : null)
      ?? document.getElementById("profile-review-step-content");
    target?.scrollIntoView({ behavior: "smooth", block: "center" });
    target?.focus({ preventScroll: true });
  }, [activeStep, locateRequest, registration.profileQuery.isLoading]);

  useEffect(() => {
    if (isAuthLoading) return;
    if (!isAuthenticated || !user)
      router.replace(
        "/login?returnUrl=%2Ftutor%2Fonboarding%2Fprofile-register",
      );
    else if (user.role?.trim().toUpperCase() !== "TUTOR") router.replace("/");
  }, [isAuthenticated, isAuthLoading, router, user]);

  if (
    isAuthLoading ||
    !isAuthenticated ||
    !user ||
    user.role?.trim().toUpperCase() !== "TUTOR" ||
    registration.profileQuery.isLoading
  )
    return <ProfileRegistrationSkeleton />;

  if (registration.profileQuery.isError) {
    return (
      <div className="min-h-[100dvh] bg-background">
        <Header />
        <main className="mx-auto max-w-xl px-4 pt-32 text-center">
          <h1 className="text-2xl font-extrabold text-foreground">
            Không tải được hồ sơ
          </h1>
          <p className="mt-2 text-muted-foreground">
            Vui lòng kiểm tra kết nối rồi thử lại.
          </p>
          <Button
            className="mt-5 rounded-xl transition-all active:scale-[0.98]"
            onClick={() => void registration.profileQuery.refetch()}
          >
            Thử lại
          </Button>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-[100dvh] bg-background text-foreground">
      <Header />
      <main className="mx-auto w-full max-w-6xl px-4 pb-28 pt-24 sm:px-6 lg:px-8">
        <section className="overflow-hidden rounded-2xl bg-primary px-5 py-6 text-primary-foreground shadow-sm sm:px-8">
          <p className="text-sm font-semibold text-accent">
            Hồ sơ gia sư BeeWise
          </p>
          <div className="mt-2 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-2xl font-extrabold sm:text-3xl">
                {registration.isReviewCorrection
                  ? "Chỉnh sửa hồ sơ theo phản hồi từ BeeWise"
                  : "Xây dựng hồ sơ gia sư chất lượng"}
              </h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-primary-foreground/80">
                {registration.isReviewCorrection
                  ? "Chỉ những mục bạn thay đổi sẽ được gửi lại để xét duyệt."
                  : "Bạn có thể lưu nháp bất kỳ lúc nào. Các mục có dấu * cần hoàn tất trước khi gửi xét duyệt."}
              </p>
            </div>
            <span className="shrink-0 rounded-xl bg-primary-foreground/10 px-4 py-2 text-sm font-semibold">
              Bước {activeStep + 1}/{steps.length}
            </span>
          </div>
        </section>

        {registration.isReviewCorrection && registration.reviewQuery.data ? (
          <ProfileReviewFeedback review={registration.reviewQuery.data} onLocateField={locateField} />
        ) : null}

        <div className="mt-5 grid gap-5 lg:grid-cols-[240px_minmax(0,1fr)] lg:items-start">
          <nav
            aria-label="Các bước hoàn thiện hồ sơ"
            className="rounded-2xl border border-border bg-card p-3 shadow-sm lg:sticky lg:top-24"
          >
            <ol className="grid grid-cols-2 items-start gap-2 lg:grid-cols-1">
              {steps.map((step, index) => {
                const issues = stepIssues[index] ?? [];
                const isComplete = issues.length === 0;
                const isActive = index === activeStep;
                const needsCorrection = rejectedSteps.has(
                  index as ProfileStepIndex,
                );
                return (
                  <li
                    key={step.title}
                    className={`flex min-w-0 items-start rounded-xl transition ${isActive ? "bg-accent/20 text-primary font-bold" : "text-muted-foreground hover:bg-muted"}`}
                  >
                    <button
                      type="button"
                      onClick={() => setActiveStep(index)}
                      className="flex min-w-0 flex-1 items-start gap-3 rounded-xl p-3 text-left transition-all active:scale-[0.98]"
                    >
                      <span
                        className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ${needsCorrection ? "bg-destructive/10 text-destructive" : isComplete ? "bg-secondary text-secondary-foreground" : isActive ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}
                      >
                        {needsCorrection ? (
                          <ExclamationCircleIcon
                            className="size-5"
                            aria-hidden="true"
                          />
                        ) : isComplete ? (
                          <CheckCircle weight="fill" />
                        ) : (
                          index + 1
                        )}
                      </span>
                      <span className="min-w-0">
                        <strong className="block truncate text-sm">
                          {step.title}
                        </strong>
                        {needsCorrection ? (
                          <span className="sr-only">
                            Cần chỉnh sửa theo phản hồi.{" "}
                          </span>
                        ) : null}
                        <span className="hidden text-xs font-normal leading-5 lg:block">
                          {step.description}
                        </span>
                      </span>
                    </button>
                    {!isComplete ? (
                      <button
                        type="button"
                        onClick={() => setGuideStep(index)}
                        className="mr-2 mt-2 flex size-8 shrink-0 items-center justify-center rounded-lg text-amber-800 transition-all hover:bg-accent/20 hover:text-amber-900 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                        aria-label={`Xem các mục chưa hoàn thành ở bước ${step.title}`}
                      >
                        <Info
                          className="size-5"
                          weight="fill"
                          aria-hidden="true"
                        />
                      </button>
                    ) : null}
                  </li>
                );
              })}
            </ol>
          </nav>

          <ProfileReviewHighlightProvider
            rejectedFields={registration.isReviewCorrection ? (registration.reviewQuery.data?.rejectedFields ?? []) : []}
          >
          <FormProvider {...registration.form}>
            <form
              id="profile-review-step-content"
              onSubmit={registration.submit}
              className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-7"
              noValidate
            >
              {activeStep === 0 ? <BasicInformationSection /> : null}
              {activeStep === 1 ? <TeachingInformationSection /> : null}
              {activeStep === 2 ? (
                <div className="space-y-6">
                  <IntroductionSection />
                  <AchievementsFields />
                </div>
              ) : null}
              {activeStep === 3 ? <TeachingAreaAndVerificationSection /> : null}
              <div className="mt-8 flex flex-wrap items-center gap-3 border-t border-border pt-5">
                <Button
                  type="button"
                  variant="outline"
                  className="rounded-xl transition-all active:scale-[0.98]"
                  disabled={activeStep === 0}
                  onClick={() => setActiveStep((step) => Math.max(0, step - 1))}
                >
                  <ArrowLeft /> Quay lại
                </Button>
                {!registration.isReviewCorrection ? (
                  <Button
                    type="button"
                    variant="outline"
                    className="rounded-xl transition-all active:scale-[0.98]"
                    disabled={registration.isSaving}
                    onClick={registration.saveDraft}
                  >
                    <FloppyDisk />{" "}
                    {registration.isSaving ? "Đang lưu..." : "Lưu nháp"}
                  </Button>
                ) : null}
                {activeStep < steps.length - 1 ? (
                  <Button
                    type="button"
                    onClick={() =>
                      setActiveStep((step) =>
                        Math.min(steps.length - 1, step + 1),
                      )
                    }
                    className="ml-auto rounded-xl bg-primary text-primary-foreground transition-all hover:bg-primary/90 active:scale-[0.98]"
                  >
                    Tiếp tục <ArrowRight />
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    disabled={registration.isSubmitting}
                    className="ml-auto rounded-xl bg-accent font-bold text-accent-foreground transition-all hover:bg-accent/90 active:scale-[0.98]"
                  >
                    {registration.isSubmitting
                      ? "Đang gửi..."
                      : registration.isReviewCorrection
                        ? "Gửi lại hồ sơ"
                        : "Gửi hồ sơ xét duyệt"}
                  </Button>
                )}
              </div>
              {Object.keys(registration.form.formState.errors).length > 0 &&
              activeStep === steps.length - 1 ? (
                <p role="alert" className="mt-3 text-sm text-destructive">
                  Hồ sơ còn thiếu thông tin bắt buộc. Vui lòng kiểm tra lại các
                  bước có lỗi.
                </p>
              ) : null}
            </form>
          </FormProvider>
          </ProfileReviewHighlightProvider>
        </div>
      </main>
      <ProfileStepStatusDialog
        open={guideStep !== null}
        stepTitle={guideStep === null ? "" : (steps[guideStep]?.title ?? "")}
        issues={guideStep === null ? [] : (stepIssues[guideStep] ?? [])}
        onOpenChange={(open) => {
          if (!open) setGuideStep(null);
        }}
        onGoToStep={() => {
          if (guideStep !== null) setActiveStep(guideStep);
          setGuideStep(null);
        }}
      />
      <ProfileExitDialog
        open={Boolean(registration.pendingNavigation)}
        isSaving={registration.isSaving}
        discardChanges={registration.isReviewCorrection}
        onCancel={registration.cancelLeave}
        onSaveAndLeave={() => void registration.saveAndLeave()}
      />
    </div>
  );
}
