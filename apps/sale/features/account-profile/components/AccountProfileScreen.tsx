"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@workspace/core/store/useAuthStore";
import { AccountProfileView } from "./AccountProfileView";

export function AccountProfileScreen() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const authenticated = useAuthStore((state) => state.isAuthenticated);
  const loading = useAuthStore((state) => state.isAuthLoading);

  useEffect(() => {
    if (!loading && (!authenticated || !user))
      router.replace("/login?returnUrl=%2Fprofile");
  }, [loading, authenticated, user, router]);

  if (loading || !authenticated || !user) {
    return (
      <div
        className="min-h-[65vh] bg-muted px-4 py-10"
        role="status"
        aria-label="Đang tải hồ sơ tài khoản"
      >
        <div
          className="mx-auto max-w-6xl space-y-6 motion-safe:animate-pulse"
          aria-hidden="true"
        >
          <div className="h-9 w-64 rounded-lg bg-border" />
          <div className="h-48 rounded-2xl border border-border bg-card" />
          <div className="grid gap-6 md:grid-cols-[220px_1fr]">
            <div className="h-64 rounded-2xl bg-card" />
            <div className="h-80 rounded-2xl bg-card" />
          </div>
        </div>
      </div>
    );
  }

  return <AccountProfileView key={user.id} user={user} />;
}
