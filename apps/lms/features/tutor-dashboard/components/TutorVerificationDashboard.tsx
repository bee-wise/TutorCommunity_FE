"use client";

import Link from "next/link";
import { useAuthStore } from "@workspace/core/store/useAuthStore";
import { CheckCircleIcon as CheckCircle, ArrowRightIcon as ArrowRight, ClipboardDocumentListIcon as ClipboardText, IdentificationIcon as IdentificationCard, VideoCameraIcon as VideoCamera, ShieldCheckIcon as ShieldCheck } from "@heroicons/react/24/outline";

type StepStatus = "done" | "current" | "pending";

interface OnboardingStep {
  id: number;
  title: string;
  description: string;
  icon: React.ElementType;
  status: StepStatus;
  ctaLabel?: string;
  ctaHref?: string;
}

const STEPS: OnboardingStep[] = [
  {
    id: 1,
    title: "Đăng ký tài khoản",
    description: "Tạo tài khoản BeeWise thành công với vai trò Gia sư.",
    icon: IdentificationCard,
    status: "done",
  },
  {
    id: 2,
    title: "Hoàn thành hồ sơ",
    description: "Điền đầy đủ thông tin cá nhân, chuyên môn và kinh nghiệm.",
    icon: ClipboardText,
    status: "current",
    ctaLabel: "Hoàn thành hồ sơ",
    ctaHref: "/lms/tutor/profile",
  },
  {
    id: 3,
    title: "Phỏng vấn online",
    description: "BeeWise liên hệ sắp xếp phỏng vấn online với bạn.",
    icon: VideoCamera,
    status: "pending",
    ctaLabel: "Lên lịch phỏng vấn",
    ctaHref: "/lms/tutor/interview",
  },
  {
    id: 4,
    title: "Chờ xác minh",
    description: "Tài khoản được xem xét và kích hoạt (3-5 ngày).",
    icon: ShieldCheck,
    status: "pending",
  },
];

export function TutorVerificationDashboard() {
  const user = useAuthStore((s) => s.user);

  return (
    <div className="min-h-full bg-background p-4 md:p-8">
      <div className="max-w-4xl mx-auto flex flex-col">
        <div className="flex flex-col gap-1 mb-10 text-center md:text-left">
          <p
            className="text-sm text-muted-foreground"
            style={{ fontFamily: "var(--font-lms-family)" }}
          >
            Xin chào,
          </p>
          <h1
            className="text-2xl md:text-3xl text-primary"
            style={{ fontFamily: "var(--font-lms-family)", fontWeight: 800 }}
          >
            {user?.fullName ?? "Gia sư"}
          </h1>
          <div className="inline-flex items-center gap-1.5 mt-1 justify-center md:justify-start w-full md:w-fit">
            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
            <span
              className="text-xs font-semibold text-warning"
              style={{ fontFamily: "var(--font-lms-family)" }}
            >
              Tài khoản của bạn chưa được xác minh
            </span>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-6 md:gap-4 relative">
          {STEPS.map((step, index) => {
            const isDone = step.status === "done";
            const isCurrent = step.status === "current";
            const isPending = step.status === "pending";
            const isLast = index === STEPS.length - 1;
            const Icon = step.icon;

            return (
              <div
                key={step.id}
                className="relative flex flex-row md:flex-col gap-4 flex-1"
              >
                {!isLast && (
                  <>
                    <div
                      className={`hidden md:block absolute top-5 left-[calc(50%+20px)] w-[calc(100%-24px)] h-px -mt-px z-0
                        ${isDone ? "bg-secondary/50" : "bg-border"}
                      `}
                    />
                    <div
                      className={`block md:hidden absolute top-10 left-5 -ml-px w-px -bottom-6 z-0
                        ${isDone ? "bg-secondary/50" : "bg-border"}
                      `}
                    />
                  </>
                )}

                <div className="flex flex-col items-center md:mx-auto relative z-10 shrink-0">
                  <div
                    className={`w-10 h-10 flex items-center justify-center rounded-full border-2 bg-background
                      ${isDone ? "border-secondary text-foreground" : ""}
                      ${isCurrent ? "border-primary text-primary shadow-sm shadow-primary/20" : ""}
                      ${isPending ? "border-border text-muted-foreground/40" : ""}
                    `}
                  >
                    {isDone ? (
                      <CheckCircle width={20} height={20} />
                    ) : (
                      <Icon
                        size={20}
                        weight={isCurrent ? "duotone" : "regular"}
                      />
                    )}
                  </div>
                </div>

                <div className="flex flex-col gap-1 mt-0.5 md:mt-2 md:text-center pb-2 md:pb-0">
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider
                      ${isDone ? "text-foreground" : isCurrent ? "text-primary" : "text-muted-foreground/50"}
                    `}
                    style={{ fontFamily: "var(--font-lms-family)" }}
                  >
                    Bước {step.id}
                  </span>
                  <h3
                    className={`text-sm font-bold
                      ${isPending ? "text-muted-foreground/70" : "text-foreground"}
                    `}
                    style={{ fontFamily: "var(--font-lms-family)" }}
                  >
                    {step.title}
                  </h3>
                  <p
                    className={`text-xs mt-1 max-w-[280px] md:mx-auto leading-relaxed
                      ${isPending ? "text-muted-foreground/50" : "text-muted-foreground"}
                    `}
                  >
                    {step.description}
                  </p>

                  {isCurrent && step.ctaHref && (
                    <div className="mt-3 md:flex md:justify-center">
                      <Link
                        href={step.ctaHref}
                        className="inline-flex min-h-11 items-center gap-1.5 px-4 rounded-lg border border-primary
                          text-primary text-xs font-bold bg-card
                          hover:bg-muted active:scale-[0.98] transition-all"
                        style={{ fontFamily: "var(--font-lms-family)" }}
                      >
                        {step.ctaLabel}
                        <ArrowRight width={14} height={14} aria-hidden />
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
