"use client";

import Link from "next/link";
import Image from "next/image";
import type { CSSProperties } from "react";
import {
  Banknote,
  Bell,
  CalendarClock,
  CheckCircle2,
  ClipboardCheck,
  Copy,
  CreditCard,
  GraduationCap,
  HelpCircle,
  Laptop,
  Lock,
  RotateCcw,
  ShieldCheck,
  UserRoundCheck,
} from "lucide-react";
import { Header } from "@workspace/ui/components/layout/Header";
import { Button } from "@workspace/ui/components/ui/button";
import { onboardingSteps } from "../constants/tutor-onboarding.fixtures";
import { useTutorOnboardingViewModel } from "./TutorOnboardingProvider";
import type {
  TutorOnboardingScenario,
  TutorOnboardingStep,
  TutorOnboardingStepId,
  TutorOnboardingStepStatus,
} from "../types";

const stepIcons: Record<TutorOnboardingStepId, typeof UserRoundCheck> = {
  account: UserRoundCheck,
  profile: GraduationCap,
  listing: CreditCard,
  interview: CalendarClock,
  verification: ShieldCheck,
  postApproval: Banknote,
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
  COMPLETED: "border-[#447353]/30 bg-[#447353]/10 text-[#447353]",
  CURRENT: "border-[#280f91]/30 bg-[#280f91]/10 text-[#280f91]",
  UPCOMING: "border-[#cfe1fa] bg-[#cfe1fa]/45 text-[#280f91]",
  BLOCKED: "border-[#cfe1fa] bg-white text-[#5e6688]",
  ACTION_REQUIRED: "border-[#ffc510]/50 bg-[#fff3cb] text-[#905b0f]",
};

const stepNodeClass: Record<TutorOnboardingStepStatus, string> = {
  COMPLETED: "border-[#447353] bg-[#447353] text-white shadow-[#447353]/25",
  CURRENT: "border-[#280f91] bg-[#280f91] text-white shadow-[#280f91]/25",
  UPCOMING: "border-[#cfe1fa] bg-white text-[#280f91] shadow-[#cfe1fa]/70",
  BLOCKED: "border-[#cfe1fa] bg-white text-[#5e6688] shadow-[#cfe1fa]/50",
  ACTION_REQUIRED: "border-[#ffc510] bg-[#ffc510] text-[#280f91] shadow-[#ffc510]/30",
};

const stepTrackClass: Record<TutorOnboardingStepStatus, string> = {
  COMPLETED: "bg-[#447353]",
  CURRENT: "bg-[#ffc510]",
  UPCOMING: "bg-[#cfe1fa]",
  BLOCKED: "bg-[#cfe1fa]",
  ACTION_REQUIRED: "bg-[#ffc510]",
};

const statusTextClass: Record<TutorOnboardingStepStatus, string> = {
  COMPLETED: "text-[#447353]",
  CURRENT: "text-[#280f91]",
  UPCOMING: "text-[#280f91]",
  BLOCKED: "text-[#5e6688]",
  ACTION_REQUIRED: "text-[#905b0f]",
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
    <div
      className="min-h-screen bg-[#fff8df] text-[#0c0c0b]"
      style={
        {
          "--beewise-purple": "#280f91",
          "--beewise-light-blue": "#cfe1fa",
          "--beewise-yellow": "#ffc510",
          "--beewise-cream": "#fff3cb",
          "--beewise-pastel-yellow": "#fadc78",
          "--beewise-pastel-pink": "#e1aba7",
          "--beewise-green": "#447353",
          "--beewise-brown": "#905b0f",
          "--beewise-black": "#0c0c0b",
        } as CSSProperties
      }
    >
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
        <section>
          <div className="overflow-hidden rounded-2xl border border-[#cfe1fa] bg-white shadow-[0_18px_45px_rgba(40,15,145,0.10)]">
            <Image
              src="/images/Banner/onboard-banner.png"
              alt=""
              width={1280}
              height={96}
              priority
              className="h-[119px] w-full object-cover object-center md:h-[135px]"
            />
            <div className="p-5">
            <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-[#280f91]">
                  Tutor Onboarding
                </p>
                <h1 className="font-nunito mt-1 text-2xl leading-tight text-[#0c0c0b] md:text-3xl">
                  {view.title}
                </h1>
                <p className="mt-2 max-w-3xl text-sm leading-6 text-[#3f3b55]">
                  {view.description}
                </p>
              </div>
              <div className="min-w-40 rounded-xl bg-[#fff3cb] p-3 ring-1 ring-[#ffc510]/40">
                <p className="text-xs font-semibold text-[#905b0f]">
                  Tiến độ
                </p>
                <div className="mt-2 h-2 rounded-full bg-white">
                  <div
                    className="h-2 rounded-full bg-[#280f91]"
                    style={{ width: `${view.progressValue}%` }}
                  />
                </div>
                <p className="mt-2 text-lg font-bold text-[#280f91]">
                  {view.progressValue}%
                </p>
              </div>
            </div>
            </div>
          </div>

          {false && (
          <aside className="rounded-xl border border-border bg-white p-5 shadow-sm">
            <div className="flex items-center gap-2">
              <HelpCircle className="h-5 w-5 text-primary" aria-hidden="true" />
              <h2 className="text-base">Trợ giúp nhanh</h2>
            </div>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Preview này chỉ mô phỏng UI. Mọi thao tác cập nhật trong bộ nhớ,
              không gọi API và không thay đổi tài khoản thật.
            </p>
            <div className="mt-4 flex items-center gap-2 rounded-lg bg-accent/20 p-3 text-sm font-semibold text-primary">
              <Bell className="h-4 w-4" aria-hidden="true" />
              Thông báo mock đang bật
            </div>
          </aside>
          )}
        </section>

        <OnboardingStepper />
        {children}
      </main>
    </div>
  );
}

export function OnboardingStepper({ compact = false }: { compact?: boolean }) {
  const { view } = useTutorOnboardingViewModel();

  return (
    <nav
      aria-label="Tiến trình onboarding gia sư"
      className={`overflow-hidden rounded-2xl border border-[#cfe1fa] bg-white shadow-[0_14px_34px_rgba(40,15,145,0.10)] ${
        compact ? "p-4" : "p-5"
      }`}
    >
      <ol className="flex overflow-x-auto pb-1">
        {onboardingSteps.map((step) => {
          const status = view.stepStatuses[step.id];
          const Icon = stepIcons[step.id];
          const isCurrent = status === "CURRENT" || status === "ACTION_REQUIRED";
          const isComplete = status === "COMPLETED";

          return (
            <li
              key={step.id}
              className="relative flex min-w-[150px] flex-1 flex-col items-center px-2 text-center"
            >
              <div
                aria-hidden="true"
                className={`absolute left-0 right-1/2 top-6 h-1 ${
                  step.order === 1 ? "bg-transparent" : stepTrackClass[status]
                }`}
              />
              <div
                aria-hidden="true"
                className={`absolute left-1/2 right-0 top-6 h-1 ${
                  step.order === onboardingSteps.length
                    ? "bg-transparent"
                    : isComplete
                      ? "bg-[#447353]"
                      : "bg-[#cfe1fa]"
                }`}
              />
              <div
                aria-current={isCurrent ? "step" : undefined}
                className="relative z-10 flex flex-col items-center gap-2"
              >
                <div className="flex items-center justify-center">
                  <span className={`flex h-12 w-12 items-center justify-center rounded-full border-2 shadow-lg ${stepNodeClass[status]}`}>
                    {status === "COMPLETED" ? (
                      <CheckCircle2 className="h-5 w-5" aria-hidden="true" />
                    ) : status === "BLOCKED" ? (
                      <Lock className="h-5 w-5" aria-hidden="true" />
                    ) : (
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    )}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-extrabold leading-tight text-[#0c0c0b]">
                    {step.shortTitle}
                  </p>
                  <p className={`mt-1 text-[11px] font-bold ${statusTextClass[status]}`}>
                    {statusCopy[status]}
                  </p>
                </div>
              </div>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

export function JourneyTimeline() {
  const { state, view, dispatchAction } = useTutorOnboardingViewModel();
  const selected =
    onboardingSteps.find((step) => step.id === state.selectedStepId) ??
    onboardingSteps[1];

  return (
    <section className="grid gap-5 xl:grid-cols-[1.7fr_1fr]">
      <div className="rounded-2xl border border-[#cfe1fa] bg-white p-5 shadow-[0_14px_34px_rgba(40,15,145,0.10)]">
        <ol className="flex overflow-x-auto pb-2" aria-label="7 giai đoạn onboarding">
          {onboardingSteps.map((step) => {
            const status = view.stepStatuses[step.id];
            const Icon = stepIcons[step.id];
            const isSelected = state.selectedStepId === step.id;

            return (
              <li
                key={step.id}
                className="relative flex min-w-[150px] flex-1 justify-center px-2"
              >
                <div
                  aria-hidden="true"
                  className={`absolute left-0 right-1/2 top-7 h-1 ${
                    step.order === 1 ? "bg-transparent" : stepTrackClass[status]
                  }`}
                />
                <div
                  aria-hidden="true"
                  className={`absolute left-1/2 right-0 top-7 h-1 ${
                    step.order === onboardingSteps.length
                      ? "bg-transparent"
                      : status === "COMPLETED"
                        ? "bg-[#447353]"
                        : "bg-[#cfe1fa]"
                  }`}
                />
                <button
                  type="button"
                  onClick={() =>
                    dispatchAction("switch-journey-detail-step", {
                      stepId: step.id,
                    })
                  }
                  className={`relative z-10 flex w-full flex-col items-center gap-2 rounded-2xl px-2 py-1 text-center transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#280f91] ${
                    isSelected ? "scale-[1.03]" : ""
                  }`}
                >
                  <div className="flex items-center justify-center">
                    <span className={`flex h-14 w-14 items-center justify-center rounded-full border-2 shadow-lg ${stepNodeClass[status]}`}>
                      <Icon className="h-6 w-6" aria-hidden="true" />
                    </span>
                  </div>
                  <p className="text-sm font-extrabold leading-tight text-[#0c0c0b]">{step.title}</p>
                  <p className="line-clamp-2 text-xs leading-5 text-[#3f3b55]">
                    {step.description}
                  </p>
                  <span className={`text-[11px] font-bold ${statusTextClass[status]}`}>
                    {statusCopy[status]}
                  </span>
                </button>
              </li>
            );
          })}
        </ol>
      </div>
      <StepDetailPanel step={selected} />
    </section>
  );
}

export function StepDetailPanel({ step }: { step: TutorOnboardingStep }) {
  const { view, dispatchAction } = useTutorOnboardingViewModel();
  const status = view.stepStatuses[step.id];

  return (
    <section className="rounded-2xl border border-[#cfe1fa] bg-white p-5 shadow-[0_14px_34px_rgba(40,15,145,0.08)]">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-[#280f91]">
            Chi tiết bước
          </p>
          <h2 className="mt-1 text-xl">{step.title}</h2>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            {step.description}
          </p>
        </div>
        <span className={`rounded-full border px-3 py-1 text-xs font-bold ${statusClass[status]}`}>
          {statusCopy[status]}
        </span>
      </div>
      <ul className="mt-5 grid gap-2" aria-label="Việc cần làm">
        {step.tasks.map((task) => (
          <li key={task} className="flex gap-2 text-sm text-foreground/80">
            <ClipboardCheck className="mt-0.5 h-4 w-4 text-secondary" aria-hidden="true" />
            {task}
          </li>
        ))}
      </ul>
      <div className="mt-5 flex flex-wrap gap-3">
        <Button
          type="button"
          onClick={() => dispatchAction("submit-profile")}
          disabled={step.id !== "profile"}
          className="rounded-full bg-[#280f91] px-5 text-white hover:bg-[#1f0b70]"
        >
          {step.primaryAction ?? view.primaryAction ?? "Tiếp tục"}
        </Button>
        <Button type="button" variant="outline" className="rounded-full border-[#280f91]/25 text-[#280f91]">
          Xem hướng dẫn
        </Button>
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
    <div className="fixed bottom-4 left-1/2 z-80 w-[calc(100%-2rem)] max-w-4xl -translate-x-1/2 rounded-2xl border border-[#280f91]/20 bg-white/95 p-3 shadow-2xl backdrop-blur">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-[#fff3cb] px-3 py-1 text-xs font-bold text-[#280f91]">
            Bộ chọn màn hình
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
            className="h-9 rounded-md border border-border bg-white px-3 text-sm"
          >
            {scenarios.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button type="button" variant="outline" size="sm" onClick={onToggleCapture}>
            <Copy className="h-4 w-4" aria-hidden="true" />
            Link chụp
          </Button>
          <Button type="button" variant="outline" size="sm" onClick={onReset}>
            <RotateCcw className="h-4 w-4" aria-hidden="true" />
            Đặt lại
          </Button>
          <Button
            type="button"
            size="sm"
            onClick={() => void navigator.clipboard?.writeText(window.location.href)}
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
      ? "border-[#ffc510] bg-[#fadc78]"
      : tone === "warning"
        ? "border-[#ffc510] bg-[#ffc510]/35"
        : "border-[#cfe1fa] bg-white";

  return (
    <section className={`rounded-2xl border p-5 shadow-[0_14px_34px_rgba(40,15,145,0.08)] ${toneClass}`}>
      <h2 className="text-lg text-[#0c0c0b]">{title}</h2>
      <div className="mt-3 text-sm leading-6 text-[#3f3b55]">
        {children}
      </div>
    </section>
  );
}

export function PrimaryScreenActions() {
  const { view, dispatchAction } = useTutorOnboardingViewModel();
  const primaryAction =
    view.currentScreen === "LISTING_WAIVED"
      ? "continue-to-interview"
      : view.currentScreen === "APPROVED"
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
          onClick={() => primaryAction && dispatchAction(primaryAction)}
          disabled={!primaryAction}
          className="rounded-full bg-[#280f91] px-5 text-white hover:bg-[#1f0b70]"
        >
          {view.primaryAction}
        </Button>
      )}
      {view.secondaryAction && (
        <Button variant="outline" className="rounded-full border-[#280f91]/25 text-[#280f91]">
          {view.secondaryAction}
        </Button>
      )}
    </div>
  );
}

export const onboardingNotice =
  "Tài khoản của bạn được miễn phí thanh toán trong 6 tháng đầu theo chương trình dành cho 50 gia sư đầu tiên của BeeWise.";

export function ScenarioLink({ scenario }: { scenario: TutorOnboardingScenario }) {
  return (
    <Link
      href={`/dev/tutor-onboarding?scenario=${scenario}`}
      className="text-sm font-bold text-primary hover:underline"
    >
      Mở {scenario}
    </Link>
  );
}
