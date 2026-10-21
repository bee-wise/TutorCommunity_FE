"use client";

import Link from "next/link";
import { navigationConfig } from "@workspace/core/configs/navigation";
import { cn } from "@workspace/core/helpers/utils";

const MOBILE_ITEMS: Record<"TUTOR" | "LEARNER", { url: string; label: string }[]> = {
  LEARNER: [
    { url: "/lms/learner", label: "Báo cáo" },
    { url: "/lms/learner/schedule", label: "Lịch học" },
    { url: "/lms/learner/classes", label: "Lớp học" },
    { url: "/lms/learner/exercises", label: "Bài tập" },
    { url: "/lms/learner/chat", label: "Tin nhắn" },
  ],
  TUTOR: [
    { url: "/lms/tutor/dashboard", label: "Tổng quan" },
    { url: "/lms/tutor/schedule", label: "Lịch dạy" },
    { url: "/lms/tutor/classes", label: "Lớp học" },
    { url: "/lms/tutor/earnings", label: "Thu nhập" },
  ],
};

/** Bottom tab bar for the most-used destinations on small screens; the full menu stays in the sidebar sheet. */
export function LmsMobileNav({ pathname, role }: { pathname: string; role: "TUTOR" | "LEARNER" | null }) {
  if (!role) return null;
  const icons = new Map((navigationConfig[role] ?? []).flatMap((group) => group.items).map((item) => [item.url, item.icon]));

  return (
    <nav aria-label="Điều hướng nhanh" className="fixed inset-x-0 bottom-0 z-30 flex border-t border-border bg-card pb-[env(safe-area-inset-bottom)] md:hidden">
      {MOBILE_ITEMS[role].map((item) => {
        const Icon = icons.get(item.url);
        const active = pathname === item.url || (item.url !== "/lms/learner" && pathname.startsWith(`${item.url}/`));
        return (
          <Link
            key={item.url}
            href={item.url}
            aria-current={active ? "page" : undefined}
            className={cn("flex min-h-16 min-w-0 flex-1 flex-col items-center justify-center gap-1 px-1 text-[11px] font-bold outline-none transition-colors focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring active:scale-95", active ? "text-primary" : "text-muted-foreground hover:text-primary")}
          >
            {Icon && <Icon className="size-5" aria-hidden />}
            <span className="max-w-full truncate">{item.label}</span>
            {active && <span className="h-0.5 w-6 rounded-full bg-primary" aria-hidden />}
          </Link>
        );
      })}
    </nav>
  );
}
