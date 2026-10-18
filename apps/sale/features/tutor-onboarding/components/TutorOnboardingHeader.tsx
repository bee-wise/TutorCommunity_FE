"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { CaretDown, SignOut } from "@phosphor-icons/react/dist/ssr";
import { cn } from "@workspace/core/helpers/utils";
import type { MeType } from "@workspace/core/types/auth.type";

interface TutorOnboardingHeaderProps {
  user?: MeType | null;
  onLogout?: () => void;
  className?: string;
}

function getInitials(name?: string | null) {
  if (!name) return "BW";
  const words = name.trim().split(/\s+/).filter(Boolean);
  const initials = words
    .slice(0, 2)
    .map((word) => word[0])
    .join("");
  return initials.toUpperCase() || "BW";
}

function getDisplayName(user?: MeType | null) {
  const fullName =
    user?.fullName ||
    [user?.firstName, user?.lastName].filter(Boolean).join(" ").trim();
  return user?.displayName || fullName || user?.email || "Gia sư BeeWise";
}

export function TutorOnboardingHeader({
  user,
  onLogout,
  className,
}: TutorOnboardingHeaderProps) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const displayName = getDisplayName(user);

  useEffect(() => {
    if (!open) return;
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open]);

  return (
    <div
      role="banner"
      aria-label="Tutor Onboarding Header"
      className={cn(
        "flex min-h-16 items-center justify-between gap-4 rounded-2xl border border-border bg-card px-4 py-2.5 shadow-sm sm:px-6",
        className,
      )}
    >
      {/* Left: BeeWise Logo + Bee Logo */}
      <div className="flex items-center gap-2.5 sm:gap-3.5">
        <Link
          href="/"
          aria-label="Trang chủ BeeWise"
          className="flex items-center rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          <div className="relative h-8 w-28 shrink-0 overflow-hidden sm:h-10 sm:w-38">
            <Image
              src="/images/interview/Logo_2.png"
              alt="BeeWise"
              width={196}
              height={123}
              priority
              className="absolute left-1/2 top-1/2 h-auto w-34 max-w-none -translate-x-1/2 -translate-y-1/2 sm:w-[172px]"
            />
          </div>
        </Link>
        <div className="h-5 w-px bg-border/80" aria-hidden="true" />
        <Image
          src="https://res.cloudinary.com/xcrm6ykz/image/upload/v1792322865/Bee.svg"
          alt="Bee"
          width={90}
          height={32}
          priority
          className="h-8 w-auto object-contain sm:h-10"
        />
      </div>

      {/* Right: "Đăng ký hồ sơ gia sư" + Current Account */}
      <div className="flex items-center gap-3 sm:gap-4">
        <span className="text-xs uppercase font-bold text-primary/85 sm:text-sm">
          Đăng ký hồ sơ gia sư
        </span>
        <div className="h-4 w-px bg-border/80" aria-hidden="true" />

        {/* Account Menu */}
        <div ref={dropdownRef} className="relative">
          <button
            type="button"
            onClick={() => setOpen((prev) => !prev)}
            aria-label="Menu tài khoản gia sư"
            aria-expanded={open}
            className={cn(
              "flex h-9 items-center gap-2 rounded-full py-0.5 pl-1 pr-2 text-foreground transition-colors hover:bg-muted/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
              open && "bg-muted/70",
            )}
          >
            <span className="flex h-7.5 w-7.5 items-center justify-center overflow-hidden rounded-full bg-primary/10 font-sans text-xs font-bold text-primary ring-1 ring-primary/20 shadow-xs">
              {user?.avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={user.avatarUrl}
                  alt={displayName}
                  className="h-full w-full object-cover"
                />
              ) : (
                getInitials(displayName)
              )}
            </span>
            <span className="hidden max-w-32 truncate text-sm font-bold text-foreground md:inline">
              {displayName}
            </span>
            <CaretDown
              className={cn(
                "h-4 w-4 text-muted-foreground transition-transform duration-200",
                open && "rotate-180",
              )}
              aria-hidden="true"
            />
          </button>

          {open && (
            <div className="absolute right-0 top-11 z-50 w-64 rounded-2xl border border-border bg-popover p-2 shadow-lg shadow-black/5 animate-in fade-in-50 zoom-in-95">
              <div className="border-b border-border px-3 pb-3 pt-2">
                <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                  Tài khoản
                </p>
                <p
                  className="mt-1 truncate text-sm font-extrabold text-foreground"
                  title={displayName}
                >
                  {displayName}
                </p>
                {user?.email && (
                  <p
                    className="mt-0.5 truncate text-xs text-muted-foreground"
                    title={user.email}
                  >
                    {user.email}
                  </p>
                )}
              </div>
              <div className="flex flex-col gap-0.5 pt-1.5">
                {onLogout && (
                  <button
                    type="button"
                    onClick={() => {
                      setOpen(false);
                      onLogout();
                    }}
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm font-semibold text-destructive transition-colors hover:bg-destructive/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-destructive"
                  >
                    <SignOut className="h-4 w-4" aria-hidden="true" />
                    Đăng xuất
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
