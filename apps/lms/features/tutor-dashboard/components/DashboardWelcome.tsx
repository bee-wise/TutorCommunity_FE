"use client";

import { useAuthStore } from "@workspace/core/store/useAuthStore";
import { DashboardMoreMenu } from "./DashboardMoreMenu";

export function DashboardWelcome() {
  const fullName = useAuthStore((state) => state.user?.fullName);
  const name = fullName?.trim().split(/\s+/).pop() || "Gia sư";

  return (
    <header className="flex items-start justify-between gap-4 px-1">
      <div className="min-w-0">
        <h1 className="font-nunito text-2xl font-extrabold leading-[1.3] text-primary sm:text-3xl">Không gian giảng dạy</h1>
        <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">Chào {name}, sẵn sàng cho buổi dạy tiếp theo nhé.</p>
      </div>
      <DashboardMoreMenu />
    </header>
  );
}
