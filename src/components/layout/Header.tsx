"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { motion } from "motion/react";
import { MobileNav } from "./MobileNav";

interface HeaderProps {
  NAV_LINKS: { label: string; href: string }[];
  isTutorPage?: boolean;
}

export function Header({ NAV_LINKS, isTutorPage }: HeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [href, setHref] = useState<string>("");
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);

    onScroll();

    // Cho phép animation sau khi render lần đầu
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
    if (!isTutorPage) {
      setHref("/");
    } else {
      setHref("/tutor-guide");
    }
  }, [isTutorPage]);

  return (
    <div className="fixed top-0 left-0 right-0 z-60 flex justify-center pt-0">
      <motion.header
        layout
        transition={{ duration: isReady ? 0.4 : 0, ease: [0.22, 1, 0.36, 1] }}
        className={
          scrolled
            ? "mt-3 rounded-full shadow-xl shadow-[#280F91]/20 border border-white/10 overflow-visible"
            : "w-full overflow-visible"
        }
        style={
          scrolled
            ? {
                background: "rgba(28, 10, 100, 0.95)",
                backdropFilter: "blur(20px)",
                WebkitBackdropFilter: "blur(20px)",
                width: "min(780px, calc(100vw - 2rem))",
              }
            : {
                background: "#280F91",
                width: "100%",
              }
        }
      >
        <div
          className={`h-16 flex items-center justify-between gap-3 transition-all ${
            isReady ? "duration-300" : "duration-0"
          } ${
            scrolled ? "px-5" : "px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full"
          }`}
        >
          <Link
            href={href}
            className="flex items-center gap-2 shrink-0"
            aria-label="BeeWise - Trang chủ"
            onClick={() => {
              window.scrollTo({
                top: 0,
                behavior: "smooth",
              });
            }}
          >
            <div className="relative w-10 h-10 rounded-full bg-white overflow-hidden shrink-0 flex items-center justify-center">
              <Image
                src="/brand/beewise-logo-nobackground.PNG"
                alt="BeeWise Logo"
                fill
                className="object-contain p-1"
                priority
              />
            </div>
            <span
              className="text-white text-xs md:text-base leading-none"
              style={{ fontFamily: "var(--font-montserrat)", fontWeight: 800 }}
            >
              Cộng Đồng Gia Sư
            </span>
          </Link>

          <nav
            className="hidden md:flex items-center gap-6"
            aria-label="Điều hướng chính"
          >
            {NAV_LINKS.map((link) => {
              const isActive =
                link.href === "/"
                  ? pathname === "/"
                  : pathname === link.href ||
                    pathname?.startsWith(link.href + "/");

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm font-bold transition-colors duration-200 ${
                    isActive ? "text-accent" : "text-white/70 hover:text-accent"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="hidden md:inline-flex text-sm font-bold text-white/70 hover:text-accent transition-colors"
            >
              Đăng Nhập
            </Link>
            {!isTutorPage && (
              <Link
                href="/tutors"
                id="nav-cta"
                className="inline-flex h-8 items-center justify-center rounded-full bg-[#FFC500] px-4 text-xs font-bold text-[#0C0C0B] transition-all duration-200 hover:bg-[#FADC76] active:scale-[0.98] whitespace-nowrap"
              >
                Tìm Gia Sư
              </Link>
            )}
            <MobileNav links={NAV_LINKS} />
          </div>
        </div>
      </motion.header>
    </div>
  );
}
