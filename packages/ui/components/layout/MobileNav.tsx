"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
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

  return (
    <div ref={containerRef} className="md:hidden relative z-70">
      <button
        onClick={() => setOpen((prev) => !prev)}
        aria-label={open ? "Đóng menu" : "Mở menu"}
        aria-expanded={open}
        className="flex h-8 w-8 items-center justify-center rounded-full text-primary-foreground hover:bg-white/10 transition-colors"
      >
        {open ? (
          <X size={18} weight="bold" />
        ) : (
          <ListIcon size={18} weight="bold" />
        )}
      </button>

      {open && (
        <div className="absolute top-10 right-0 z-80 w-56 bg-primary border border-white/10 rounded-2xl px-4 py-4 flex flex-col gap-3 shadow-2xl shadow-primary/40">
          {links.map((link) => {
            const isActive =
              link.href === "/"
                ? pathname === "/"
                : pathname === link.href || pathname?.startsWith(link.href + "/");

            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={`text-sm font-medium transition-colors py-1 ${
                  isActive ? "text-accent" : "text-primary-foreground opacity-80 hover:opacity-100"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
          <Link
            href="/login"
            onClick={() => setOpen(false)}
            className="text-sm font-medium text-primary-foreground opacity-70 hover:opacity-100 transition-colors py-1 border-t border-white/10 pt-3"
          >
            Đăng Nhập
          </Link>
        </div>
      )}
    </div>
  );
}
