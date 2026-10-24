"use client";

import { useEffect, useState, type ReactNode } from "react";

export interface TutorSectionNavItem {
  id: string;
  label: string;
}

/** Scroll distance (px) after which the floating nav rises into view. */
const REVEAL_AFTER = 120;

/**
 * Floating glass pill pinned to the bottom of the viewport. It stays hidden
 * until the reader starts scrolling, then rises in. On mobile it sits above
 * the fixed connect CTA (`TutorMobileCTA`).
 */
export function TutorSectionNav({ items }: { items: TutorSectionNavItem[] }) {
  const [activeId, setActiveId] = useState(items[0]?.id ?? "");
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const onScroll = () => setRevealed(window.scrollY > REVEAL_AFTER);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const targets = items
      .map((item) => document.getElementById(item.id))
      .filter((el): el is HTMLElement => el !== null);
    if (targets.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const inView = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (inView[0]) setActiveId(inView[0].target.id);
      },
      { rootMargin: "-120px 0px -60% 0px" },
    );
    targets.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [items]);

  const handleClick = (id: string) => (event: React.MouseEvent) => {
    const target = document.getElementById(id);
    if (!target) return;
    event.preventDefault();
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    target.scrollIntoView({
      behavior: reduceMotion ? "auto" : "smooth",
      block: "start",
    });
    setActiveId(id);
  };

  return (
    <nav
      aria-label="Các phần của hồ sơ"
      aria-hidden={!revealed}
      className={`fixed bottom-[5.5rem] left-1/2 z-40 w-max max-w-[calc(100vw-1.5rem)] -translate-x-1/2 transition-[opacity,transform,visibility] duration-500 ease-[var(--ease-soft)] motion-reduce:transition-none lg:bottom-6 ${
        revealed
          ? "visible translate-y-0 opacity-100"
          : "invisible translate-y-8 opacity-0"
      }`}
    >
      <ul className="flex items-center gap-1 overflow-x-auto rounded-full border border-white/60 bg-white/55 p-1.5 shadow-pop backdrop-blur-xl backdrop-saturate-150 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {items.map((item) => {
          const active = activeId === item.id;
          return (
            <li key={item.id} className="shrink-0">
              <a
                href={`#${item.id}`}
                onClick={handleClick(item.id)}
                tabIndex={revealed ? undefined : -1}
                aria-current={active ? "true" : undefined}
                className={`inline-flex h-10 items-center rounded-full px-4 text-sm font-bold transition active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                  active
                    ? "bg-primary text-primary-foreground"
                    : "text-foreground hover:bg-white/70"
                }`}
              >
                {item.label}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

export function TutorAnchoredSection({
  id,
  children,
}: {
  id: string;
  children: ReactNode;
}) {
  return (
    <div id={id} className="scroll-mt-28">
      {children}
    </div>
  );
}
