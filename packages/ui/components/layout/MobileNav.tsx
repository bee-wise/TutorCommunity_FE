"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, ListIcon, X } from "@phosphor-icons/react";
import type {
  NavbarAccountItem,
  NavbarAction,
  NavbarItem,
} from "@workspace/core/configs/navbar";

interface Props {
  links: NavbarItem[];
  actions: NavbarAction[];
  accountItems: NavbarAccountItem[];
  showNotifications: boolean;
  unreadNotificationCount: number;
  unreadChatCount: number;
  onLogout: () => void;
}

export function MobileNav({
  links,
  actions,
  accountItems,
  showNotifications,
  unreadNotificationCount,
  unreadChatCount,
  onLogout,
}: Props) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    if (!open) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    const handleScroll = () => setOpen(false);

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [open]);

  const renderBadge = (link: NavbarItem) => {
    const count =
      link.badgeKey === "unreadChatCount"
        ? unreadChatCount
        : link.badgeKey === "unreadNotificationCount"
          ? unreadNotificationCount
          : 0;

    if (count <= 0) return null;

    return (
      <span className="ml-auto min-w-5 rounded-full bg-accent px-1.5 py-0.5 text-center text-[11px] font-bold text-accent-foreground">
        {count}
      </span>
    );
  };

  const menuLinks = [...links, ...actions];

  return (
    <div ref={containerRef} className="relative z-70 md:hidden">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-label={open ? "Đóng menu" : "Mở menu"}
        aria-expanded={open}
        className="flex h-8 w-8 items-center justify-center rounded-full text-primary-foreground transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
      >
        {open ? (
          <X size={18} weight="bold" />
        ) : (
          <ListIcon size={18} weight="bold" />
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-10 z-80 flex w-64 flex-col gap-3 rounded-2xl border border-white/10 bg-primary px-4 py-4 shadow-2xl shadow-primary/40">
          {menuLinks.map((link) => {
            const isActive =
              link.href === "/"
                ? pathname === "/"
                : pathname === link.href ||
                  pathname?.startsWith(link.href + "/");

            return (
              <Link
                key={`${link.label}-${link.href}`}
                href={link.href}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-2 py-1 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
                  isActive
                    ? "text-accent"
                    : "text-primary-foreground opacity-80 hover:opacity-100"
                }`}
              >
                <span>{link.label}</span>
                {renderBadge(link)}
              </Link>
            );
          })}

          {showNotifications && (
            <Link
              href="/notifications"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 border-t border-white/10 pt-3 text-sm font-medium text-primary-foreground opacity-80 transition-colors hover:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              <Bell size={16} weight="bold" />
              <span>Thông báo</span>
              {unreadNotificationCount > 0 && (
                <span className="ml-auto min-w-5 rounded-full bg-accent px-1.5 py-0.5 text-center text-[11px] font-bold text-accent-foreground">
                  {unreadNotificationCount}
                </span>
              )}
            </Link>
          )}

          {accountItems.length > 0 && (
            <div className="flex flex-col gap-3 border-t border-white/10 pt-3">
              {accountItems.map((item) =>
                item.action === "logout" ? (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() => {
                      setOpen(false);
                      onLogout();
                    }}
                    className="text-left text-sm font-medium text-primary-foreground opacity-80 transition-colors hover:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                  >
                    {item.label}
                  </button>
                ) : (
                  <Link
                    key={`${item.label}-${item.href}`}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="text-sm font-medium text-primary-foreground opacity-80 transition-colors hover:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                  >
                    {item.label}
                  </Link>
                ),
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
