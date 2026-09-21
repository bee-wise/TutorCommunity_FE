"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useAuthStore } from "@workspace/core/store/useAuthStore";

/**
 * Floating message button shown at the bottom-right of the screen.
 * Only visible for authenticated LEARNER users.
 * Excluded on the messages page itself.
 */
export function MessageFAB() {
  const pathname = usePathname();
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isAuthLoading = useAuthStore((state) => state.isAuthLoading);

  const unreadChatCount = Math.max(0, user?.unreadChatCount ?? 0);
  const isLearner = user?.role?.trim().toUpperCase() === "LEARNER";

  // Hide when: loading, unauthenticated, not learner, or already on messages page
  const isOnMessagesPage =
    pathname?.startsWith("/learner/messages") ?? false;

  if (isAuthLoading || !isAuthenticated || !isLearner || isOnMessagesPage) {
    return null;
  }

  return (
    <Link
      href="/learner/messages"
      aria-label="Tin nhắn"
      className="fixed bottom-6 right-6 z-50 flex h-16 w-16 items-center justify-center rounded-full shadow-2xl shadow-primary/30 transition-transform duration-200 hover:scale-110 active:scale-95 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-accent"
      style={{
        background: "linear-gradient(135deg, #280f91 0%, #3d1fd4 100%)",
      }}
    >
      {/* Icon */}
      <Image
        src="/icons/beewise-message-icon.svg"
        alt="Tin nhắn"
        width={36}
        height={36}
        className="object-contain"
        priority
      />

      {/* Unread badge */}
      {unreadChatCount > 0 && (
        <span
          aria-label={`${unreadChatCount} tin nhắn chưa đọc`}
          className="absolute -right-1 -top-1 flex min-w-5 items-center justify-center rounded-full bg-accent px-1.5 py-0.5 text-center text-[10px] font-bold leading-5 text-accent-foreground"
        >
          {unreadChatCount > 99 ? "99+" : unreadChatCount}
        </span>
      )}
    </Link>
  );
}
