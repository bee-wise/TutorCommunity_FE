"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ListIcon, X } from "@phosphor-icons/react";

type NavLink = {
  label: string;
  href: string;
};

interface Props {
  links: NavLink[];
}

export function MobileNav({ links }: Props) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

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

  return (
    <div ref={containerRef} className="md:hidden relative z-70">
      <button
        onClick={() => setOpen((prev) => !prev)}
        aria-label={open ? "Đóng menu" : "Mở menu"}
        aria-expanded={open}
        className="flex h-8 w-8 items-center justify-center rounded-full text-white hover:bg-white/10 transition-colors"
      >
        {open ? (
          <X size={18} weight="bold" />
        ) : (
          <ListIcon size={18} weight="bold" />
        )}
      </button>

      {open && (
        <div className="absolute top-10 right-0 z-80 w-56 bg-[#1c0a64] border border-white/10 rounded-2xl px-4 py-4 flex flex-col gap-3 shadow-2xl shadow-[#280F91]/40">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="text-sm font-medium text-white/80 hover:text-white transition-colors py-1"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/login"
            onClick={() => setOpen(false)}
            className="text-sm font-medium text-white/70 hover:text-white transition-colors py-1 border-t border-white/10 pt-3"
          >
            Đăng Nhập
          </Link>
        </div>
      )}
    </div>
  );
}
