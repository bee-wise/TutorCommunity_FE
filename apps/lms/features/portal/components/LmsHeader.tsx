"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import { List, X } from "@phosphor-icons/react";

const NAV_LINKS = [
  { label: "Giới thiệu", href: "#features" },
  { label: "Tính năng lớp học", href: "#activation" },
];

export function LmsHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mobile menu on resize to desktop
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 1024) setMenuOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/85 backdrop-blur-xl shadow-lg shadow-[#280f91]/6 border-b border-[#280f91]/8"
          : "bg-white/0"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-16 flex items-center justify-between gap-4">
          {/* Logo + LMS Hub tag */}
          <Link href="/" className="flex items-center gap-2.5 shrink-0">
            <div className="relative w-9 h-9 rounded-xl bg-[#280f91]/10 flex items-center justify-center overflow-hidden shrink-0">
              <Image
                src="https://res.cloudinary.com/dqevxj2k6/image/upload/v1783561272/beewise/beewise-logo-nobackground.png"
                alt="BeeWise Logo"
                fill
                sizes="36px"
                className="object-contain p-1"
                priority
              />
            </div>
            <div className="flex items-center gap-2">
              <span
                className="text-[#280f91] text-sm leading-none uppercase hidden sm:block"
                style={{
                  fontFamily: "var(--font-montserrat)",
                  fontWeight: 800,
                }}
              >
                BeeWise
              </span>
              <span className="hidden sm:inline-flex items-center h-5 px-2 rounded-md bg-[#280f91]/8 text-[#280f91] text-[10px] font-bold tracking-wide">
                LMS
              </span>
            </div>
          </Link>

          {/* Center nav links */}
          <nav className="hidden lg:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="px-3 py-1.5 text-sm font-medium text-[#0c0c0b]/60 hover:text-[#280f91] hover:bg-[#280f91]/5 rounded-lg transition-all duration-200"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Right: dual-action CTA hub */}
          <div className="flex items-center gap-2.5">
            <Link
              href="/login"
              className="hidden md:inline-flex h-9 items-center justify-center rounded-xl bg-[#ffc500] px-5 text-sm font-bold text-primary hover:bg-[#ffcc1a] active:scale-[0.97] transition-all duration-200 shadow-sm shadow-[#ffc500]/30"
              style={{ fontFamily: "var(--font-montserrat)" }}
            >
              Đăng Nhập Hệ Thống
            </Link>

            {/* Mobile hamburger */}
            <button
              className="lg:hidden p-2 text-[#0c0c0b]/60 hover:text-[#280f91] transition-colors rounded-lg hover:bg-[#280f91]/5"
              onClick={() => setMenuOpen(!menuOpen)}
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
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="lg:hidden overflow-hidden border-t border-[#280f91]/8 bg-white"
            style={{ willChange: "height, opacity" }}
          >
            <div className="px-4 py-4 flex flex-col gap-1">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="text-sm font-semibold text-[#0c0c0b]/70 hover:text-[#280f91] hover:bg-[#280f91]/5 py-2.5 px-3 rounded-lg transition-all"
                >
                  {link.label}
                </a>
              ))}
              <div className="mt-3 pt-3 border-t border-[#0c0c0b]/8 flex flex-col gap-2.5">
                <Link
                  href="/login"
                  className="inline-flex h-10 items-center justify-center rounded-xl bg-[#ffc500] px-5 text-sm font-bold text-[#0c0c0b]"
                  style={{ fontFamily: "var(--font-montserrat)" }}
                >
                  Đăng Nhập Hệ Thống
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
