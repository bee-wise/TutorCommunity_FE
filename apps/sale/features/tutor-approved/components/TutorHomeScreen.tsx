"use client";

import Link from "next/link";
import {
  ShieldCheck,
  GraduationCap,
  ArrowRight,
  Eye,
} from "@phosphor-icons/react/dist/ssr";
import { Button } from "@workspace/ui/components/ui/button";
import { useAuthStore } from "@workspace/core/store/useAuthStore";
import {
  TUTOR_LMS_URL,
  getTutorPublicProfilePath,
} from "@workspace/core/constants/tutor-links";
import { ChatSummary } from "@/features/messages/components/ChatSummary";
import { useTutorApproved } from "./TutorApprovedProvider";

function getDisplayName(user?: {
  displayName?: string | null;
  fullName?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  email?: string | null;
} | null) {
  const fullName =
    user?.fullName ||
    [user?.firstName, user?.lastName].filter(Boolean).join(" ").trim();
  return user?.displayName || fullName || user?.email || "Gia sư";
}

function getInitials(name?: string | null) {
  if (!name) return "GS";
  const words = name.trim().split(/\s+/).filter(Boolean);
  const initials = words
    .slice(0, 2)
    .map((word) => word[0])
    .join("");
  return initials.toUpperCase() || "GS";
}

export function TutorHomeScreen() {
  const storeUser = useAuthStore((state) => state.user);
  const { state } = useTutorApproved();

  // Fallback for dev preview when storeUser is not authenticated
  const user = storeUser ?? {
    id: "preview-tutor",
    fullName: state?.profile?.fullName ?? "Gia sư BeeWise",
    firstName: state?.profile?.firstName ?? "Gia sư",
    displayName: state?.profile?.fullName ?? "Gia sư BeeWise",
    email: state?.profile?.email ?? null,
    avatarUrl: state?.profile?.avatarUrl ?? undefined,
    role: "TUTOR",
    canAccessTutorLms: state?.permissions?.canAccessTutorLms ?? false,
    isProfilePublic: state?.permissions?.isProfilePublic ?? true,
    tutorProfileId: undefined,
  };

  const displayName = getDisplayName(user);
  const initials = getInitials(displayName);
  const publicProfileHref = getTutorPublicProfilePath(user);
  const canAccessLms = user.canAccessTutorLms === true;

  return (
    <div className="space-y-6">
      {/* Welcome Banner — solid primary block, no redundant subtitle */}
      <section className="relative overflow-hidden rounded-[var(--radius-panel)] bg-primary p-6 text-primary-foreground sm:p-8">
        {/* Decorative hexagon cluster — aria-hidden */}
        <span
          aria-hidden="true"
          className="bw-hex absolute -right-8 -top-8 h-36 w-36 bg-primary-foreground/[0.06]"
        />
        <span
          aria-hidden="true"
          className="bw-hex absolute -bottom-10 right-24 h-24 w-24 bg-primary-foreground/[0.04]"
        />

        <div className="relative flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          {/* Left: identity */}
          <div className="flex items-center gap-4">
            {/* Avatar */}
            <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-primary-foreground/30 bg-primary-foreground/15 text-base font-black text-primary-foreground">
              {user.avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={user.avatarUrl}
                  alt={displayName}
                  className="h-full w-full object-cover"
                />
              ) : (
                initials
              )}
            </div>

            <div>
              <p className="text-[11px] font-black uppercase tracking-[0.18em] text-accent">
                Tutor Workspace
              </p>
              <h1 className="font-nunito text-xl font-black leading-[1.2] sm:text-2xl lg:text-3xl">
                Chào mừng trở lại, {displayName}
              </h1>
              {/* Status badges */}
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-primary-foreground/15 px-3 py-1 text-[11px] font-bold text-primary-foreground">
                  <ShieldCheck className="h-3.5 w-3.5 text-accent" weight="fill" />
                  Đã xác thực
                </span>
                {user.isProfilePublic !== undefined &&
                  user.isProfilePublic !== null && (
                    <span
                      className={`inline-flex items-center rounded-full px-3 py-1 text-[11px] font-bold ${
                        user.isProfilePublic
                          ? "bg-primary-foreground/15 text-primary-foreground"
                          : "bg-accent/25 text-accent"
                      }`}
                    >
                      {user.isProfilePublic
                        ? "Hồ sơ đang hiển thị"
                        : "Hồ sơ đang tạm ẩn"}
                    </span>
                  )}
              </div>
            </div>
          </div>

          {/* Right: CTAs */}
          <div className="flex flex-wrap items-center gap-3 md:flex-col md:items-end md:flex-nowrap">
            <Button
              asChild
              className="h-11 rounded-full bg-accent px-5 text-sm font-black text-accent-foreground shadow-[inset_0_1px_0_rgb(255_255_255/0.35),0_8px_20px_-10px_rgb(12_12_11/0.25)] transition-[transform,box-shadow] duration-200 hover:-translate-y-0.5 active:translate-y-px active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <Link href={publicProfileHref} className="flex items-center gap-1.5">
                <Eye className="h-4 w-4" weight="bold" />
                Xem hồ sơ công khai
              </Link>
            </Button>

            {canAccessLms && (
              <Button
                asChild
                className="h-11 rounded-full border-2 border-primary-foreground/30 bg-transparent px-5 text-sm font-bold text-primary-foreground transition-[transform,background-color] duration-200 hover:bg-primary-foreground/15 hover:-translate-y-0.5 active:translate-y-px active:scale-[0.98]"
              >
                <a
                  href={TUTOR_LMS_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5"
                >
                  Vào Tutor LMS
                  <ArrowRight className="h-4 w-4" weight="bold" />
                </a>
              </Button>
            )}
          </div>
        </div>
      </section>

      {/* Main Grid: Messages & Sidebar */}
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start">
        {/* Real Chat & Messages */}
        <div className="min-w-0">
          <ChatSummary />
        </div>

        {/* Sidebar */}
        <aside className="space-y-5">
          {/* Public Profile Card */}
          <section className="rounded-[var(--radius-card)] border border-border bg-card p-5 shadow-[var(--shadow-soft)]">
            <div className="mb-4 flex items-center justify-between gap-3">
              <h2 className="font-nunito text-base font-extrabold text-foreground">
                Hồ sơ công khai
              </h2>
              <span className="inline-flex items-center gap-1 rounded-full bg-secondary px-2.5 py-0.5 text-[11px] font-bold text-secondary-foreground">
                <ShieldCheck className="h-3 w-3" weight="fill" />
                Đã duyệt
              </span>
            </div>

            <div className="flex items-center gap-3.5">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary text-sm font-black text-primary-foreground ring-2 ring-primary/20">
                {user.avatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={user.avatarUrl}
                    alt={displayName}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  initials
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-extrabold text-foreground">
                  {displayName}
                </p>
                {user.email && (
                  <p className="truncate text-xs text-muted-foreground">
                    {user.email}
                  </p>
                )}
              </div>
            </div>

            <Button
              asChild
              size="sm"
              className="mt-4 w-full rounded-full font-bold"
            >
              <Link href={publicProfileHref} className="flex items-center gap-1.5">
                Xem trang hồ sơ
                <ArrowRight className="h-3.5 w-3.5" weight="bold" />
              </Link>
            </Button>
          </section>

          {/* Tutor LMS Card */}
          {canAccessLms ? (
            <section className="rounded-[var(--radius-card)] border border-border bg-card p-5 shadow-[var(--shadow-soft)]">
              <div className="flex items-center gap-3 mb-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                  <GraduationCap className="h-4.5 w-4.5" weight="bold" />
                </div>
                <h2 className="font-nunito text-base font-extrabold text-foreground">
                  Tutor LMS
                </h2>
              </div>
              <p className="text-xs leading-5 text-muted-foreground">
                Xem danh sách lớp học, buổi dạy, tài liệu và điểm danh học viên.
              </p>
              <Button
                asChild
                className="mt-4 w-full rounded-full font-bold"
              >
                <a
                  href={TUTOR_LMS_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-1.5"
                >
                  Mở Tutor LMS
                  <ArrowRight className="h-4 w-4" weight="bold" />
                </a>
              </Button>
            </section>
          ) : (
            <section className="rounded-[var(--radius-card)] border border-dashed border-border bg-card p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-border bg-card text-muted-foreground">
                  <GraduationCap className="h-4.5 w-4.5" weight="regular" />
                </div>
                <h3 className="font-nunito text-base font-extrabold text-foreground">
                  Tutor LMS
                </h3>
              </div>
              <p className="text-xs leading-5 text-muted-foreground">
                Quyền vào LMS sẽ được kích hoạt tự động khi bạn nhận lớp học đầu
                tiên trên BeeWise.
              </p>
            </section>
          )}
        </aside>
      </div>
    </div>
  );
}
