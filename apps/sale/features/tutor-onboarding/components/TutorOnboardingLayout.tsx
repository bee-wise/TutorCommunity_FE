"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Bank,
  Check,
  CheckCircle,
  ClipboardText,
  Copy,
  GraduationCap,
  Laptop,
  Lock,
  ArrowCounterClockwise,
  ShieldCheck,
  User,
  VideoCamera,
} from "@phosphor-icons/react/dist/ssr";
import { Header } from "@workspace/ui/components/layout/Header";
import { Button } from "@workspace/ui/components/ui/button";
import { onboardingSteps } from "../constants/tutor-onboarding.fixtures";
import { useTutorOnboardingViewModel } from "./TutorOnboardingProvider";
import { OnboardingVideoGuide } from "./OnboardingVideoGuide";
import type {
  TutorOnboardingScenario,
  TutorOnboardingStep,
  TutorOnboardingStepId,
  TutorOnboardingStepStatus,
} from "../types";

const stepIcons: Record<TutorOnboardingStepId, typeof User> = {
  account: User,
  profile: GraduationCap,
  interview: VideoCamera,
  verification: ShieldCheck,
  postApproval: Bank,
  lms: Laptop,
};

const statusCopy: Record<TutorOnboardingStepStatus, string> = {
  COMPLETED: "Hoàn tất",
  CURRENT: "Đang thực hiện",
  UPCOMING: "Sắp tới",
  BLOCKED: "Chưa mở",
  ACTION_REQUIRED: "Cần chỉnh sửa",
};

const statusClass: Record<TutorOnboardingStepStatus, string> = {
  COMPLETED: "border-secondary/30 bg-secondary/10 text-secondary",
  CURRENT: "border-primary/30 bg-primary/10 text-primary",
  UPCOMING: "border-border bg-muted text-primary",
  BLOCKED: "border-border bg-card text-muted-foreground",
  ACTION_REQUIRED: "border-accent/50 bg-accent/20 text-amber-800",
};

const stepNodeClass: Record<TutorOnboardingStepStatus, string> = {
  COMPLETED: "border-secondary bg-secondary text-secondary-foreground shadow-sm",
  CURRENT: "border-primary bg-primary text-primary-foreground shadow-sm",
  UPCOMING: "border-border bg-card text-primary shadow-sm",
  BLOCKED: "border-border bg-card text-muted-foreground shadow-sm",
  ACTION_REQUIRED:
    "border-accent bg-accent text-accent-foreground shadow-sm",
};

const stepTrackClass: Record<TutorOnboardingStepStatus, string> = {
  COMPLETED: "bg-secondary",
  CURRENT: "bg-accent",
  UPCOMING: "bg-border",
  BLOCKED: "bg-border",
  ACTION_REQUIRED: "bg-accent",
};

const statusTextClass: Record<TutorOnboardingStepStatus, string> = {
  COMPLETED: "text-secondary",
  CURRENT: "text-primary",
  UPCOMING: "text-primary",
  BLOCKED: "text-muted-foreground",
  ACTION_REQUIRED: "text-amber-800",
};

export function TutorOnboardingShell({
  children,
  capture,
  toolbar,
  useAuthenticatedHeader = false,
}: {
  children: React.ReactNode;
  capture: boolean;
  toolbar: React.ReactNode;
  useAuthenticatedHeader?: boolean;
}) {
  const { session, view } = useTutorOnboardingViewModel();
  const previewUser = {
    ...session.user,
    status: view.canAccessTutorLms ? "COMPLETED" : "DRAFT",
    tutorProfileStatus: view.canAccessTutorLms ? "COMPLETED" : "DRAFT",
    canAccessTutorLms: view.canAccessTutorLms,
    canAccessLearnerLms: false,
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {useAuthenticatedHeader ? (
        <Header />
      ) : (
        <Header
          previewUser={previewUser}
          previewIsAuthenticated
          previewIsAuthLoading={false}
          previewLogout={() => undefined}
        />
      )}
      {!capture && toolbar}
      <main className="mx-auto flex w-full max-w-7xl flex-col gap-5 px-4 pb-12 pt-24 sm:px-6 lg:px-8">
        {/* Banner */}
        <section>
          <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
            <Image
              src="https://res.cloudinary.com/xcrm6ykz/image/upload/v1790437541/onboarding-banner.png"
              alt="BeeWise Tutor Onboarding Banner"
              width={1280}
              height={96}
              priority
              className="h-[119px] w-full object-cover object-center md:h-[135px]"
            />
            <div className="p-5">
              <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wide text-primary">
                    Tutor Onboarding
                  </p>
                  <h1 className="font-nunito mt-1 text-2xl leading-tight text-foreground md:text-3xl">
                    {view.title}
                  </h1>
                  <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
                    {view.description}
                  </p>
                </div>
                <div className="min-w-40 rounded-xl bg-accent/20 p-3 ring-1 ring-accent/40">
                  <p className="text-xs font-semibold text-amber-800">
                    Tiến độ
                  </p>
                  <div className="mt-2 h-2 rounded-full bg-card">
                    <div
                      className="h-2 rounded-full bg-primary transition-all duration-500"
                      style={{ width: `${view.progressValue}%` }}
                    />
                  </div>
                  <p className="mt-2 text-lg font-bold text-primary">
                    {view.progressValue}%
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Desktop stepper (hidden on mobile) */}
        <div className="hidden md:block">
          <OnboardingStepper />
        </div>

        {/* Mobile: 2-column layout (left: vertical step rail, right: step content) */}
        <div className="flex gap-3 md:hidden">
          <MobileStepNav />
          <div className="flex-1 min-w-0">{children}</div>
        </div>

        {/* Desktop: content */}
        <div className="hidden md:block">{children}</div>
      </main>
    </div>
  );
}

/** Horizontal stepper – desktop only */
export function OnboardingStepper({ compact = false }: { compact?: boolean }) {
  const { view, state, dispatchAction } = useTutorOnboardingViewModel();

  return (
    <nav
      aria-label="Tiến trình onboarding gia sư"
      className={`rounded-2xl border border-border bg-card shadow-sm ${
        compact ? "p-4" : "px-5 py-6 md:px-6 md:py-7"
      }`}
    >
      <ol className="flex overflow-x-auto py-3 px-1">
        {onboardingSteps.map((step) => {
          const status = view.stepStatuses[step.id];
          const Icon = stepIcons[step.id];
          const isCurrent =
            status === "CURRENT" || status === "ACTION_REQUIRED";
          const isComplete = status === "COMPLETED";
          const canSelectStep = view.currentScreen === "JOURNEY";
          const isSelected =
            (canSelectStep ? state.selectedStepId : view.activeStep) === step.id;

          return (
            <li
              key={step.id}
              className="relative flex min-w-[130px] flex-1 flex-col items-center px-2 text-center"
            >
              <div
                aria-hidden="true"
                className={`absolute left-0 right-1/2 top-[30px] h-1 ${
                  step.order === 1 ? "bg-transparent" : stepTrackClass[status]
                }`}
              />
              <div
                aria-hidden="true"
                className={`absolute left-1/2 right-0 top-[30px] h-1 ${
                  step.order === onboardingSteps.length
                    ? "bg-transparent"
                    : isComplete
                      ? "bg-secondary"
                      : "bg-border"
                }`}
              />
              <button
                type="button"
                disabled={!canSelectStep}
                onClick={() =>
                  dispatchAction("switch-journey-detail-step", {
                    stepId: step.id,
                  })
                }
                aria-current={isCurrent ? "step" : undefined}
                className={`relative z-10 flex w-full flex-col items-center gap-2 rounded-xl px-1 py-1.5 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-default ${
                  isSelected
                    ? "scale-[1.03]"
                    : "enabled:hover:scale-[1.02] enabled:hover:opacity-95"
                }`}
              >
                <div className="flex items-center justify-center">
                  <span
                    className={`flex h-12 w-12 items-center justify-center rounded-full border-2 shadow-sm transition-transform ${stepNodeClass[status]} ${
                      isSelected ? "ring-2 ring-accent ring-offset-2" : ""
                    }`}
                  >
                    {status === "COMPLETED" ? (
                      <CheckCircle
                        className="h-5 w-5"
                        weight="fill"
                        aria-hidden="true"
                      />
                    ) : status === "BLOCKED" ? (
                      <Lock className="h-5 w-5" aria-hidden="true" />
                    ) : (
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    )}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-extrabold leading-tight text-foreground">
                    {step.shortTitle}
                  </p>
                  <p
                    className={`mt-1 text-[11px] font-bold ${statusTextClass[status]}`}
                  >
                    {statusCopy[status]}
                  </p>
                </div>
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

/** Vertical step rail – mobile only (left column) */
export function MobileStepNav() {
  const { view, state, dispatchAction } = useTutorOnboardingViewModel();

  return (
    <nav
      aria-label="Các bước onboarding"
      className="sticky top-20 flex shrink-0 w-14 sm:w-16 flex-col items-center rounded-2xl border border-border bg-card py-3 px-1 shadow-sm self-start"
    >
      <span className="mb-2 text-[10px] font-bold uppercase tracking-wider text-primary">
        Bước
      </span>
      <ol className="flex flex-col items-center gap-0.5">
        {onboardingSteps.map((step, i) => {
          const status = view.stepStatuses[step.id];
          const Icon = stepIcons[step.id];
          const isCurrent =
            status === "CURRENT" || status === "ACTION_REQUIRED";
          const canSelectStep = view.currentScreen === "JOURNEY";
          const isSelected =
            (canSelectStep ? state.selectedStepId : view.activeStep) === step.id;

          return (
            <li key={step.id} className="flex flex-col items-center">
              <button
                type="button"
                disabled={!canSelectStep}
                onClick={() =>
                  dispatchAction("switch-journey-detail-step", {
                    stepId: step.id,
                  })
                }
                title={step.shortTitle}
                aria-current={isCurrent ? "step" : undefined}
                className={`relative flex flex-col items-center p-1 rounded-xl transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-default ${
                  isSelected ? "scale-105" : "opacity-85 enabled:hover:opacity-100"
                }`}
              >
                <span
                  className={`flex h-8 w-8 items-center justify-center rounded-full border-2 text-xs shadow-sm transition-all ${
                    stepNodeClass[status]
                  } ${isSelected ? "ring-2 ring-accent ring-offset-1" : ""}`}
                >
                  {status === "COMPLETED" ? (
                    <Check className="h-4 w-4" weight="bold" />
                  ) : status === "BLOCKED" ? (
                    <Lock className="h-3.5 w-3.5" />
                  ) : (
                    <Icon className="h-4 w-4" />
                  )}
                </span>
                <span className="mt-0.5 text-[9px] font-bold text-foreground text-center leading-tight line-clamp-1 max-w-[48px]">
                  {step.shortTitle}
                </span>
              </button>
              {i < onboardingSteps.length - 1 && (
                <div
                  className={`my-0.5 h-2.5 w-0.5 ${
                    status === "COMPLETED" ? "bg-secondary" : "bg-border"
                  }`}
                />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

export function JourneyTimeline() {
  const { state } = useTutorOnboardingViewModel();
  const selected =
    onboardingSteps.find((step) => step.id === state.selectedStepId) ??
    onboardingSteps[1];

  return <StepDetailPanel step={selected} />;
}

export function StepDetailPanel({ step }: { step: TutorOnboardingStep }) {
  const router = useRouter();
  const { view, dispatchAction } = useTutorOnboardingViewModel();
  const status = view.stepStatuses[step.id];
  const isActionable = status === "CURRENT" || status === "ACTION_REQUIRED";

  const handleAction = () => {
    if (step.id === "profile") {
      router.push("/tutor/onboarding/profile-register");
    } else if (step.id === "postApproval") {
      dispatchAction("open-post-approval-form");
    } else if (step.id === "interview") {
      dispatchAction("join-mock-interview");
    } else if (step.id === "lms") {
      dispatchAction("open-lms-preview");
    }
  };

  const hasVideoGuide = step.id === "profile" || step.id === "interview";
  const videoGuideConfig =
    step.id === "profile"
      ? {
          title: "Hướng dẫn hoàn thiện hồ sơ gia sư",
          duration: "4:32",
          description:
            "Xem video hướng dẫn chi tiết cách điền thông tin và tải minh chứng đạt chuẩn xét duyệt.",
        }
      : {
          title: "Hướng dẫn chuẩn bị phỏng vấn",
          duration: "3:15",
          description:
            "Các lưu ý về chuyên môn, thiết bị và tác phong trong buổi phỏng vấn trực tuyến.",
        };

  return (
    <section className="rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-sm">
      <div
        className={`grid gap-6 ${
          hasVideoGuide ? "lg:grid-cols-[1fr_320px] lg:items-start" : ""
        }`}
      >
        <div className="space-y-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-primary">
                Chi tiết bước
              </p>
              <h2 className="mt-1 text-xl font-bold text-foreground">
                {step.title}
              </h2>
              <p className="mt-1.5 text-sm leading-6 text-muted-foreground">
                {step.description}
              </p>
            </div>
            <span
              className={`shrink-0 rounded-full border px-3 py-1 text-xs font-bold ${statusClass[status]}`}
            >
              {statusCopy[status]}
            </span>
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Việc cần làm
            </p>
            <ul className="mt-2.5 grid gap-2.5" aria-label="Việc cần làm">
              {step.tasks.map((task) => (
                <li
                  key={task}
                  className="flex items-start gap-2.5 text-sm text-foreground/90"
                >
                  <ClipboardText
                    className="mt-0.5 h-4 w-4 shrink-0 text-secondary"
                    aria-hidden="true"
                  />
                  <span>{task}</span>
                </li>
              ))}
            </ul>

            {isActionable && step.primaryAction && (
              <div className="mt-5">
                <Button
                  type="button"
                  onClick={handleAction}
                  className="rounded-full bg-primary px-6 text-primary-foreground hover:bg-primary/90"
                >
                  {step.primaryAction}
                  <ArrowRight className="ml-1.5 h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </div>

        {hasVideoGuide && (
          <div className="space-y-1.5">
            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Video hướng dẫn
            </p>
            <OnboardingVideoGuide
              title={videoGuideConfig.title}
              duration={videoGuideConfig.duration}
              description={videoGuideConfig.description}
            />
          </div>
        )}
      </div>
    </section>
  );
}

export function PreviewToolbar({
  scenario,
  capture,
  scenarios,
  onScenarioChange,
  onToggleCapture,
  onReset,
}: {
  scenario: string;
  capture: boolean;
  scenarios: readonly TutorOnboardingScenario[];
  onScenarioChange: (scenario: TutorOnboardingScenario) => void;
  onToggleCapture: () => void;
  onReset: () => void;
}) {
  if (capture) return null;

  return (
    <div className="fixed bottom-4 left-1/2 z-80 w-[calc(100%-2rem)] max-w-4xl -translate-x-1/2 rounded-2xl border border-border bg-card/95 p-3 shadow-2xl backdrop-blur">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-accent/20 px-3 py-1 text-xs font-bold text-primary">
            Preview
          </span>
          <label className="text-sm font-semibold" htmlFor="scenario-select">
            Màn hình
          </label>
          <select
            id="scenario-select"
            value={scenario}
            onChange={(event) =>
              onScenarioChange(event.target.value as TutorOnboardingScenario)
            }
            className="h-9 rounded-md border border-border bg-card px-3 text-sm text-foreground"
          >
            {scenarios.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onToggleCapture}
          >
            <Copy className="h-4 w-4" aria-hidden="true" />
            Link chụp
          </Button>
          <Button type="button" variant="outline" size="sm" onClick={onReset}>
            <ArrowCounterClockwise className="h-4 w-4" aria-hidden="true" />
            Đặt lại
          </Button>
          <Button
            type="button"
            size="sm"
            onClick={() =>
              void navigator.clipboard?.writeText(window.location.href)
            }
          >
            Sao chép link
          </Button>
        </div>
      </div>
    </div>
  );
}

export function StatusCard({
  title,
  children,
  tone = "default",
}: {
  title: string;
  children: React.ReactNode;
  tone?: "default" | "success" | "warning";
}) {
  const toneClass =
    tone === "success"
      ? "border-accent bg-accent/20"
      : tone === "warning"
        ? "border-accent/40 bg-accent/15"
        : "border-border bg-card";

  return (
    <section
      className={`rounded-2xl border p-5 shadow-sm ${toneClass}`}
    >
      <h2 className="text-lg font-bold text-foreground">{title}</h2>
      <div className="mt-3 text-sm leading-6 text-muted-foreground">{children}</div>
    </section>
  );
}

export function PrimaryScreenActions() {
  const router = useRouter();
  const { view, dispatchAction } = useTutorOnboardingViewModel();
  const primaryAction =
    view.currentScreen === "APPROVED"
      ? "open-post-approval-form"
      : view.currentScreen === "POST_APPROVAL"
        ? "complete-onboarding"
        : view.currentScreen === "COMPLETED"
          ? "open-lms-preview"
          : null;

  return (
    <div className="flex flex-wrap gap-3">
      {view.primaryAction && (
        <Button
          type="button"
          onClick={() => {
            if (view.currentScreen === "OVERVIEW") {
              router.push("/tutor/onboarding/profile-register");
              return;
            }
            if (primaryAction) dispatchAction(primaryAction);
          }}
          disabled={!primaryAction && view.currentScreen !== "OVERVIEW"}
          className="rounded-full bg-primary px-5 text-primary-foreground hover:bg-primary/90"
        >
          {view.primaryAction}
        </Button>
      )}
      {view.secondaryAction && (
        <Button
          variant="outline"
          className="rounded-full border-primary/25 text-primary hover:bg-primary/5"
        >
          {view.secondaryAction}
        </Button>
      )}
    </div>
  );
}

export function ScenarioLink({
  scenario,
}: {
  scenario: TutorOnboardingScenario;
}) {
  return (
    <Link
      href={`/dev/tutor-onboarding?scenario=${scenario}`}
      className="text-sm font-bold text-primary hover:underline"
    >
      Mở {scenario}
    </Link>
  );
}
