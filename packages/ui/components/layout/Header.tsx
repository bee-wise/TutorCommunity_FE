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
      <span className="ml-1 min-w-5 rounded-full bg-accent px-1.5 py-0.5 text-center text-[11px] font-bold text-accent-foreground">
        {count}
      </span>
    );
  };

  return (
    <div className="font-nunito fixed left-0 right-0 top-0 z-60 flex justify-center pt-0">
      <motion.header
        layout
        transition={{ duration: isReady ? 0.4 : 0, ease: [0.22, 1, 0.36, 1] }}
        className={
          scrolled
            ? "mt-3 rounded-full border border-white/10 bg-primary shadow-xl shadow-primary/20 supports-backdrop-filter:bg-primary/80"
            : "w-full bg-primary"
        }
        style={
          scrolled
            ? {
                backdropFilter: "blur(20px)",
                WebkitBackdropFilter: "blur(20px)",
                width: "min(1400px, calc(100vw - 2rem))",
              }
            : {
                width: "100%",
              }
        }
      >
        <div
          className={`flex h-16 items-center justify-between gap-3 transition-all ${
            isReady ? "duration-300" : "duration-0"
          } ${scrolled ? "px-5" : "mx-auto w-full max-w-350 px-4 sm:px-6 lg:px-8"}`}
        >
          <Link
            href={navbarConfig.homeHref}
            className="flex shrink-0 items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            aria-label="BeeWise Home"
          >
            <div className="relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-white">
              <Image
                src="https://res.cloudinary.com/dqevxj2k6/image/upload/v1783561272/beewise/beewise-logo-nobackground.png"
                alt="BeeWise Logo"
                fill
                sizes="40px"
                className="object-contain p-1"
                priority
              />
            </div>
            <span className="hidden text-xs font-black uppercase leading-none text-white md:block md:text-base">
              {isAuthenticated ? "BeeWise" : "Cộng Đồng Gia Sư Beewise"}
            </span>
          </Link>

          <nav
            className="hidden items-center gap-6 md:flex"
            aria-label="Điều hướng chính"
          >
            {isAuthLoading ? (
              <div
                className="h-4 w-72 rounded-full bg-white/15"
                aria-label="Đang tải điều hướng"
              />
            ) : (
              navbarConfig.centerItems.map((link) => {
                const isActive = isActiveLink(link.href);

                return (
                  <Link
                    key={`${link.label}-${link.href}`}
                    href={link.href}
                    className={`inline-flex items-center text-sm font-extrabold uppercase transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent md:text-[16px] ${
                      isActive
                        ? "text-accent"
                        : "text-primary-foreground hover:text-accent"
                    }`}
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
                  className="relative hidden h-8 w-8 items-center justify-center rounded-full text-white/80 transition-colors hover:bg-white/10 hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent md:inline-flex"
                >
                  <Bell
                    className={cn(
                      "h-4 w-4",
                      unreadNotificationCount > 0 &&
                        "animate-pulse text-accent",
                    )}
                    aria-hidden="true"
                  />
                  {unreadNotificationCount > 0 && (
                    <span className="absolute -right-1 -top-1 min-w-5 rounded-full bg-accent px-1 text-center text-[10px] font-bold leading-5 text-accent-foreground">
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
                      ? "inline-flex h-8 items-center justify-center whitespace-nowrap rounded-full bg-accent px-4 text-xs font-bold text-accent-foreground transition-all duration-200 hover:bg-highlight active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                      : "hidden text-sm font-google-sans font-bold text-white/70 transition-colors hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent md:inline-flex"
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
                  className="flex h-9 items-center gap-2 rounded-full pr-2 text-white transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                >
                  <span className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-white text-xs font-bold text-primary">
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
                  <span className="hidden max-w-28 truncate text-sm font-bold lg:inline">
                    {displayName}
                  </span>
                  <ChevronDown className="h-4 w-4" aria-hidden="true" />
                </button>

                {accountOpen && (
                  <div
                    className="absolute right-0 top-11 z-80 flex w-56 flex-col gap-1 rounded-2xl border border-[#eadca8] p-3 shadow-2xl shadow-black/15"
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
                          className="rounded-lg px-3 py-2 text-left text-sm font-semibold text-[#b42318] transition-colors hover:bg-[#fee4e2] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#b42318]"
                        >
                          {item.label}
                        </button>
                      ) : (
                        <Link
                          key={`${item.label}-${item.href}`}
                          href={item.href}
                          onClick={() => setAccountOpen(false)}
                          className="rounded-lg px-3 py-2 text-sm font-semibold text-[#280f91] transition-colors hover:bg-[#fff3cb] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#280f91]"
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
