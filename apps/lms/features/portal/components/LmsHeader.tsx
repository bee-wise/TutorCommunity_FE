"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "motion/react";
import { List, X } from "@phosphor-icons/react";

const NAV_LINKS = [
  { label: "Giới thiệu", href: "#intro" },
  { label: "Tính năng", href: "#features" },
  { label: "Giá trị", href: "#benefits" },
  { label: "Cách hoạt động", href: "#how-it-works" },
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

  return (
    <div className="fixed top-0 left-0 right-0 z-50 flex justify-center">
      <motion.header
        layout
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className={
          scrolled
            ? "mt-3 rounded-2xl shadow-xl shadow-[#280f91]/20 border border-[#280f91]/10 bg-white/90 backdrop-blur-xl overflow-hidden"
            : "w-full bg-white border-b border-[#280f91]/8"
        }
        style={
          scrolled
            ? { width: "min(1200px, calc(100vw - 2rem))" }
            : { width: "100%" }
        }
      >
        <div
          className={`h-16 flex items-center justify-between gap-4 transition-all duration-300 ${
            scrolled ? "px-6" : "px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full"
          }`}
        >
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 shrink-0">
            <div className="relative w-9 h-9 rounded-xl bg-[#280f91] flex items-center justify-center overflow-hidden shrink-0">
              <Image
                src="https://res.cloudinary.com/dqevxj2k6/image/upload/v1783561272/beewise/beewise-logo-nobackground.png"
                alt="BeeWise Logo"
                fill
                sizes="36px"
                className="object-contain p-1"
                priority
              />
            </div>
            <div className="flex items-center gap-1.5">
              <span
                className="text-[#280f91] text-sm md:text-base leading-none uppercase hidden sm:block"
                style={{ fontFamily: "var(--font-montserrat)", fontWeight: 800 }}
              >
                BeeWise
              </span>
              <span
                className="text-[#0c0c0b]/30 text-xs leading-none font-mono hidden sm:block"
                style={{ letterSpacing: "0.08em" }}
              >
                LMS
              </span>
            </div>
          </Link>

          {/* Nav */}
          <nav className="hidden md:flex items-center gap-6">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm font-semibold text-[#0c0c0b]/60 hover:text-[#280f91] transition-colors duration-200"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* CTA */}
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="hidden md:inline-flex h-9 items-center justify-center rounded-xl border-2 border-[#280f91] px-5 text-sm font-bold text-[#280f91] hover:bg-[#280f91] hover:text-white transition-all duration-200"
              style={{ fontFamily: "var(--font-montserrat)" }}
            >
              Đăng nhập
            </Link>
            <button
              className="md:hidden p-2 text-[#0c0c0b]/60 hover:text-[#280f91] transition-colors"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Mở menu"
            >
              {menuOpen ? <X size={22} weight="bold" /> : <List size={22} weight="bold" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden border-t border-[#280f91]/8 px-4 py-4 flex flex-col gap-3 bg-white">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="text-sm font-semibold text-[#0c0c0b]/70 hover:text-[#280f91] py-1 transition-colors"
              >
                {link.label}
              </a>
            ))}
            <Link
              href="/login"
              className="mt-2 inline-flex h-10 items-center justify-center rounded-xl bg-[#280f91] px-5 text-sm font-bold text-white"
              style={{ fontFamily: "var(--font-montserrat)" }}
            >
              Đăng nhập
            </Link>
          </div>
        )}
      </motion.header>
    </div>
  );
}
