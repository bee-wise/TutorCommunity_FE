"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { List, X } from "@phosphor-icons/react";

const NAV_LINKS = [
  { label: "Dành cho học viên", href: "#learner" },
  { label: "Dành cho gia sư", href: "#tutor" },
  { label: "Cách hoạt động", href: "#how-it-works" },
  { label: "Câu hỏi thường gặp", href: "#faq" },
] as const;

export function LmsHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const reduceMotion = useReducedMotion();

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-[#280f91]/8 bg-[#fbfaf7]/92 backdrop-blur-xl">
      <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between gap-6 px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="flex shrink-0 items-center gap-3"
          aria-label="BeeWise LMS, trang chủ"
        >
          <span className="relative size-10 overflow-hidden rounded-xl bg-[#280f91]/8">
            <Image
              src="https://res.cloudinary.com/dqevxj2k6/image/upload/v1783561272/beewise/beewise-logo-nobackground.png"
              alt=""
              fill
              priority
              sizes="40px"
              className="object-contain p-1"
            />
          </span>
          <span
            className="text-base font-extrabold text-[#280f91]"
            style={{ fontFamily: "var(--font-nunito-family)" }}
          >
            BeeWise <span className="font-semibold text-[#0c0c0b]/45">LMS</span>
          </span>
        </Link>

        <nav
          className="hidden items-center gap-7 lg:flex"
          aria-label="Điều hướng chính"
        >
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm uppercase font-black text-primary transition-colors hover:text-accent"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/login"
            className="inline-flex h-10 items-center justify-center whitespace-nowrap rounded-xl bg-[#ffc500] px-4 text-sm font-extrabold text-[#201a00] transition-transform hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#280f91] focus-visible:ring-offset-2 sm:px-5"
          >
            Đăng nhập
          </Link>
          <button
            type="button"
            onClick={() => setMenuOpen((value) => !value)}
            className="grid size-10 place-items-center rounded-xl text-[#280f91] transition-colors hover:bg-[#280f91]/7 lg:hidden"
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
            aria-label={menuOpen ? "Đóng menu" : "Mở menu"}
          >
            {menuOpen ? (
              <X size={22} weight="bold" />
            ) : (
              <List size={22} weight="bold" />
            )}
          </button>
        </div>
      </div>

      <AnimatePresence initial={false}>
        {menuOpen && (
          <motion.nav
            id="mobile-navigation"
            initial={reduceMotion ? false : { height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={reduceMotion ? undefined : { height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-[#280f91]/8 bg-[#fbfaf7] lg:hidden"
            aria-label="Điều hướng trên di động"
          >
            <div className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-4 sm:px-6">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="rounded-lg px-3 py-3 text-sm font-semibold text-[#29272f]/75 hover:bg-[#280f91]/6 hover:text-[#280f91]"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
