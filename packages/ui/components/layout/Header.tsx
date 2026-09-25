"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { motion } from "motion/react";
import { Bell, ChevronDown } from "lucide-react";
import {
  getNavbarConfig,
  getTutorOnboardingStatus,
  resolveNavbarState,
  type NavbarItem,
} from "@workspace/core/configs/navbar";
import { useLogout } from "@workspace/core/hooks/useLogout";
import { useAuthStore } from "@workspace/core/store/useAuthStore";
import { useNotificationDrawerStore } from "@workspace/core/store/useNotificationDrawerStore";
import { cn } from "@workspace/core/helpers/utils";
import type { MeType } from "@workspace/core/types/auth.type";
import { MobileNav } from "./MobileNav";

type HeaderProps = {
  NAV_LINKS?: NavbarItem[];
  isTutorPage?: boolean;
  previewUser?: MeType | null;
  previewIsAuthenticated?: boolean;
  previewIsAuthLoading?: boolean;
  previewLogout?: () => void;
};

function getInitials(name?: string | null) {
  if (!name) return "BW";

  const words = name.trim().split(/\s+/).filter(Boolean);
  const initials = words
    .slice(0, 2)
    .map((word) => word[0])
    .join("");

  return initials.toUpperCase() || "BW";
}

function getDisplayName(user: MeType | null) {
  const fullName =
    user?.fullName ||
    [user?.firstName, user?.lastName].filter(Boolean).join(" ").trim();

  return user?.displayName || fullName || user?.email || "BeeWise";
}

export function Header({
  previewUser,
  previewIsAuthenticated,
  previewIsAuthLoading,
  previewLogout,
}: HeaderProps = {}) {
  const [scrolled, setScrolled] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const accountRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const storeUser = useAuthStore((state) => state.user);
  const storeIsAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const storeIsAuthLoading = useAuthStore((state) => state.isAuthLoading);
  const openDrawer = useNotificationDrawerStore((state) => state.openDrawer);
  const drawerUnreadCount = useNotificationDrawerStore(
    (state) => state.unreadCount,
  );
  const { mutate: logout } = useLogout();
  const user = previewUser !== undefined ? previewUser : storeUser;
  const isAuthenticated =
    previewIsAuthenticated !== undefined
      ? previewIsAuthenticated
      : storeIsAuthenticated;
  const isAuthLoading =
    previewIsAuthLoading !== undefined
      ? previewIsAuthLoading
      : storeIsAuthLoading;
  const handleLogout = previewLogout ?? (() => logout());

  const tutorOnboardingStatus = getTutorOnboardingStatus(user);
  const normalizedRole = user?.role?.trim().toUpperCase();
  const lmsAccessEnabled =
    normalizedRole === "TUTOR"
      ? user?.canAccessTutorLms === true
      : normalizedRole === "LEARNER"
        ? user?.canAccessLearnerLms === true
        : user?.lmsAccessEnabled === true;
  const unreadNotificationCount = Math.max(
    0,
    drawerUnreadCount || (user?.unreadNotificationCount ?? 0),
  );
  const unreadChatCount = Math.max(0, user?.unreadChatCount ?? 0);
  const displayName = getDisplayName(user);

  const navbarState = resolveNavbarState({
    isAuthenticated,
    role: user?.role,
    tutorOnboardingStatus,
    lmsAccessEnabled,
  });

  const navbarConfig = getNavbarConfig({
    state: navbarState,
    tutorOnboardingStatus,
    lmsAccessEnabled,
  });
  const notificationHref =
    navbarState === "TUTOR_APPROVED"
      ? "/tutor/notifications"
      : "/notifications";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);

    onScroll();

    const timer = setTimeout(() => {
      setIsReady(true);
    }, 50);

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    if (!accountOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        accountRef.current &&
        !accountRef.current.contains(event.target as Node)
      ) {
        setAccountOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [accountOpen]);

  const isActiveLink = (href: string) => {
    if (href.includes("#")) {
      const [basePath] = href.split("#");
      return basePath === "" || basePath === "/"
        ? pathname === "/"
        : pathname === basePath;
    }

    return href === "/"
      ? pathname === "/"
      : pathname === href || pathname?.startsWith(`${href}/`);
  };

  const renderBadge = (link: NavbarItem) => {
    const count =
      link.badgeKey === "unreadChatCount"
        ? unreadChatCount
        : link.badgeKey === "unreadNotificationCount"
          ? unreadNotificationCount
          : 0;

    if (count <= 0) return null;

    return (
      <span className="ml-1 min-w-5 rounded-full bg-accent px-1.5 py-0.5 text-center text-[10px] font-bold text-accent-foreground shadow-xs">
        {count}
      </span>
    );
  };

  const isScrollActive = scrolled && !isAuthenticated;

  return (
    <div className="font-nunito fixed left-0 right-0 top-0 z-60 flex justify-center pt-0">
      <motion.header
        layout={!isAuthenticated}
        transition={
          !isAuthenticated && isReady
            ? { duration: 0.4, ease: [0.22, 1, 0.36, 1] }
            : { duration: 0 }
        }
        className={
          isScrollActive
            ? "mt-3 rounded-full border border-white/15 bg-primary/95 shadow-xl shadow-primary/30 supports-backdrop-filter:bg-primary/90 backdrop-blur-xl transition-all duration-300"
            : "w-full border-b border-white/10 bg-primary shadow-sm shadow-primary/15 backdrop-blur-md transition-all duration-300"
        }
        style={
          isScrollActive
            ? {
                backdropFilter: "blur(28px)",
                WebkitBackdropFilter: "blur(28px)",
                width: "min(1400px, calc(100vw - 2rem))",
                boxShadow:
                  "0 12px 32px -4px rgba(40, 15, 145, 0.35), inset 0 1px 1px 0 rgba(255, 255, 255, 0.15)",
              }
            : {
                width: "100%",
                boxShadow:
                  "0 4px 16px -2px rgba(40, 15, 145, 0.2), inset 0 -1px 0 0 rgba(255, 255, 255, 0.08)",
              }
        }
      >
        <div
          className={cn(
            "flex h-16 items-center justify-between gap-3",
            !isAuthenticated && isReady
              ? "transition-all duration-300"
              : "duration-0",
            isScrollActive
              ? "px-5"
              : "mx-auto w-full max-w-350 px-4 sm:px-6 lg:px-8",
          )}
        >
          <Link
            href={navbarConfig.homeHref}
            className="flex shrink-0 items-center transition-all duration-200 hover:opacity-95 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white rounded-full"
            aria-label="BeeWise Home"
          >
            <div className="flex items-center justify-center rounded-full bg-white px-3 py-1 sm:px-3.5 sm:py-1.5 shadow-sm ring-1 ring-primary">
              <div className="relative h-6 w-28 sm:h-7 sm:w-32 md:h-7.5 md:w-36">
                <Image
                  src="https://res.cloudinary.com/xcrm6ykz/image/upload/e_trim/v1789964923/Logo_2.png"
                  alt="BeeWise Logo"
                  fill
                  sizes="(max-width: 640px) 112px, (max-width: 768px) 128px, 144px"
                  className="object-contain object-center"
                  priority
                />
              </div>
            </div>
          </Link>

          <nav
            className="hidden items-center gap-1 md:flex"
            aria-label="Điều hướng chính"
          >
            {isAuthLoading ? (
              <div
                className="h-5 w-72 rounded-full bg-white/20 animate-pulse"
                aria-label="Đang tải điều hướng"
              />
            ) : isAuthenticated ? (
              /* ── Authenticated: animated pill tabs ── */
              navbarConfig.centerItems.map((link) => {
                const isActive = isActiveLink(link.href);

                return (
                  <Link
                    key={`${link.label}-${link.href}`}
                    href={link.href}
                    className={cn(
                      "relative inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-extrabold uppercase transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent md:text-[14px]",
                      isActive
                        ? "text-accent font-black"
                        : "text-white/80 hover:text-accent hover:bg-white/10",
                    )}
                  >
                    {/* Sliding background pill */}
                    {isActive && (
                      <motion.span
                        layoutId="nav-pill"
                        className="absolute inset-0 rounded-full bg-white/15 border border-white/20 shadow-xs"
                        transition={{
                          type: "spring",
                          stiffness: 380,
                          damping: 30,
                        }}
                      />
                    )}
                    <span className="relative z-10">{link.label}</span>
                    {renderBadge(link)}
                  </Link>
                );
              })
            ) : (
              /* ── Guest: styled pill-hover tabs ── */
              navbarConfig.centerItems.map((link) => {
                const isActive = isActiveLink(link.href);

                return (
                  <Link
                    key={`${link.label}-${link.href}`}
                    href={link.href}
                    className={cn(
                      "inline-flex items-center rounded-full px-3.5 py-1.5 text-sm font-extrabold uppercase transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent md:text-[15px]",
                      isActive
                        ? "text-accent bg-white/15 shadow-xs ring-1 ring-white/20 font-black"
                        : "text-accent hover:text-accent hover:bg-white/10",
                    )}
                  >
                    <span>{link.label}</span>
                    {renderBadge(link)}
                  </Link>
                );
              })
            )}
          </nav>

          <div className="flex items-center gap-3">
            {!isAuthLoading &&
              navbarConfig.showNotifications &&
              navbarState !== "GUEST" && (
                <button
                  type="button"
                  onClick={openDrawer}
                  aria-label="Thông báo"
                  className="relative hidden h-9 w-9 items-center justify-center rounded-full text-white/80 transition-colors hover:bg-white/10 hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent md:inline-flex"
                >
                  <Bell
                    className={cn(
                      "h-4.5 w-4.5 transition-transform duration-200 hover:scale-105",
                      unreadNotificationCount > 0 && "text-accent",
                    )}
                    aria-hidden="true"
                  />
                  {unreadNotificationCount > 0 && (
                    <span className="absolute -right-0.5 -top-0.5 flex h-4.5 min-w-4.5 items-center justify-center rounded-full bg-accent px-1 text-[10px] font-bold text-accent-foreground shadow-xs animate-pulse">
                      {unreadNotificationCount}
                    </span>
                  )}
                </button>
              )}

            {!isAuthLoading &&
              navbarConfig.rightItems.map((action) => (
                <Link
                  key={`${action.label}-${action.href}`}
                  href={action.href}
                  className={
                    action.variant === "primary"
                      ? "inline-flex h-9 items-center justify-center whitespace-nowrap rounded-full bg-accent px-5 text-xs font-black uppercase tracking-wider text-accent-foreground shadow-md shadow-accent/25 transition-all duration-200 hover:bg-highlight hover:shadow-lg hover:shadow-accent/35 hover:-translate-y-0.5 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                      : "hidden rounded-full px-3.5 py-1.5 text-sm font-extrabold uppercase text-white transition-colors hover:bg-white/10 hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent md:inline-flex"
                  }
                >
                  {action.label}
                </Link>
              ))}

            {!isAuthLoading && navbarConfig.accountItems.length > 0 && (
              <div ref={accountRef} className="relative hidden md:block">
                <button
                  type="button"
                  onClick={() => setAccountOpen((prev) => !prev)}
                  aria-label="Mở menu tài khoản"
                  aria-expanded={accountOpen}
                  className="flex h-9 items-center gap-2 rounded-full py-0.5 pl-1 pr-2.5 text-white transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                >
                  <span className="flex h-7.5 w-7.5 items-center justify-center overflow-hidden rounded-full bg-white ring-1 ring-white/30 text-xs font-bold text-primary shadow-xs">
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
                  <span className="hidden max-w-28 truncate text-sm font-bold text-white lg:inline">
                    {displayName}
                  </span>
                  <ChevronDown
                    className={cn(
                      "h-4 w-4 text-white/70 transition-transform duration-200",
                      accountOpen && "rotate-180",
                    )}
                    aria-hidden="true"
                  />
                </button>

                {accountOpen && (
                  <div
                    className="absolute right-0 top-11 z-80 flex w-56 flex-col gap-1 rounded-2xl border border-[#eadca8] p-2.5 shadow-2xl shadow-primary/10 backdrop-blur-md"
                    style={{ backgroundColor: "#fffdf7", color: "#280f91" }}
                  >
                    {navbarConfig.accountItems.map((item) =>
                      item.action === "logout" ? (
                        <button
                          key={item.label}
                          type="button"
                          onClick={() => {
                            setAccountOpen(false);
                            handleLogout();
                          }}
                          className="rounded-xl px-3 py-2 text-left text-sm font-bold text-[#b42318] transition-colors hover:bg-[#fee4e2] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#b42318]"
                        >
                          {item.label}
                        </button>
                      ) : (
                        <Link
                          key={`${item.label}-${item.href}`}
                          href={item.href}
                          onClick={() => setAccountOpen(false)}
                          className="rounded-xl px-3 py-2 text-sm font-semibold text-primary transition-colors hover:bg-[#fff3cb] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                        >
                          {item.label}
                        </Link>
                      ),
                    )}
                  </div>
                )}
              </div>
            )}

            <MobileNav
              links={isAuthLoading ? [] : navbarConfig.centerItems}
              actions={isAuthLoading ? [] : navbarConfig.rightItems}
              accountItems={isAuthLoading ? [] : navbarConfig.accountItems}
              showNotifications={
                !isAuthLoading && navbarConfig.showNotifications
              }
              unreadNotificationCount={unreadNotificationCount}
              unreadChatCount={unreadChatCount}
              notificationHref={notificationHref}
              onLogout={handleLogout}
            />
          </div>
        </div>
      </motion.header>
    </div>
  );
}
