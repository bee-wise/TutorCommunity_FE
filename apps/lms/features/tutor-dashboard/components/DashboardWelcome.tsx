"use client";

import { useAuthStore } from "@workspace/core/store/useAuthStore";
import { DashboardMoreMenu } from "./DashboardMoreMenu";

export function DashboardWelcome() {
  const fullName = useAuthStore((state) => state.user?.fullName);
  const name = fullName?.trim().split(/\s+/).pop() || "Gia sư";

  return (
    <header className="flex items-start justify-between gap-4 px-1">
      <div className="min-w-0">
        <p className="mb-1.5 text-sm font-medium text-muted-foreground">Chào {name},</p>
        <h1 className="font-lms text-2xl font-extrabold leading-[1.3] text-foreground sm:text-3xl">Không gian giảng dạy</h1>
      </div>
      <DashboardMoreMenu />
    </header>
  );
}
