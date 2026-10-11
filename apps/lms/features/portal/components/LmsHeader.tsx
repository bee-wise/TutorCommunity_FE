"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { Button } from "@workspace/ui/components/ui/button";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";

const NAV_LINKS = [
  { label: "Học Viên", href: "#learner" },
  { label: "Gia Sư", href: "#tutor" },
  { label: "Cách Hoạt Động", href: "#how-it-works" },
  { label: "Câu Hỏi Thường Gặp", href: "#faq" },
] as const;

gsap.registerPlugin(useGSAP);

export function LmsHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const menuRef = useRef<HTMLElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const reducedMotion = usePrefersReducedMotion();

  useGSAP(
    () => {
      if (menuOpen && !reducedMotion) {
        gsap.fromTo(
          menuRef.current,
          { opacity: 0, y: -12 },
          { opacity: 1, y: 0, duration: 0.35, ease: "power3.out" },
        );
      }
    },
    {
      scope: headerRef,
      dependencies: [menuOpen, reducedMotion],
      revertOnUpdate: true,
    },
  );

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
        triggerRef.current?.focus();
      }
    };
    const onPointer = (event: PointerEvent) => {
      if (
        event.target instanceof Node &&
        !headerRef.current?.contains(event.target)
      )
        setMenuOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointer);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointer);
    };
  }, [menuOpen]);

  return (
    <header
      ref={headerRef}
      className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-6 sm:pt-4"
    >
      <div className="mx-auto max-w-7xl rounded-2xl border border-border bg-background/95 shadow-[0_8px_32px_-18px_color-mix(in_srgb,var(--primary)_30%,transparent)] backdrop-blur-md">
        <div className="flex h-16 items-center justify-between gap-2 px-3 sm:h-[72px] sm:px-5">
          <Link
            href="/"
            className="relative h-16 w-[108px] shrink-0 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:w-[160px]"
            aria-label="BeeWise LMS, trang chủ"
          >
            <Image
              src="https://res.cloudinary.com/xcrm6ykz/image/upload/v1791535277/BeeWiseLMS-Logo-500x150.svg"
              alt="BeeWise LMS"
              fill
              preload
              sizes="(max-width: 680px) 108px, 160px"
              className="object-contain object-left"
            />
          </Link>
          <nav
            className="hidden items-center gap-1 lg:flex"
            aria-label="Điều hướng chính"
          >
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="rounded-xl px-4 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-muted hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                {link.label}
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-1.5">
            <Button
              asChild
              className="h-10 rounded-xl px-3 text-sm transition-all active:scale-[0.98] sm:px-5"
            >
              <Link href="/login">Đăng nhập</Link>
            </Button>
            <Button
              ref={triggerRef}
              variant="outline"
              size="icon"
              onClick={() => setMenuOpen((value) => !value)}
              className="size-11 rounded-xl transition-all active:scale-[0.98] lg:hidden"
              aria-expanded={menuOpen}
              aria-controls="mobile-navigation"
              aria-label={menuOpen ? "Đóng menu" : "Mở menu"}
            >
              {menuOpen ? (
                <XMarkIcon className="size-5" />
              ) : (
                <Bars3Icon className="size-5" />
              )}
            </Button>
          </div>
        </div>
        <nav
          ref={menuRef}
          hidden={!menuOpen}
          id="mobile-navigation"
          className="border-t border-border p-3 lg:hidden"
          aria-label="Điều hướng trên di động"
        >
          <div className="flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="rounded-xl px-4 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                {link.label}
              </a>
            ))}
          </div>
        </nav>
      </div>
    </header>
  );
}
