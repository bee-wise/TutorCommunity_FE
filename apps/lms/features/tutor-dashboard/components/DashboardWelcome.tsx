"use client";

import Image from "next/image";
import { CalendarDaysIcon } from "@heroicons/react/24/outline";
import { getVietnamToday } from "@/features/lms-calendar";
import { useAuthStore } from "@workspace/core/store/useAuthStore";
import { DASHBOARD_ASSETS } from "../data/dashboard.assets";
import { formatLongDate, getGreeting } from "../utils/dashboard-overview.utils";
import { DashboardLink } from "./DashboardLink";
import { DashboardMoreMenu } from "./DashboardMoreMenu";

export function DashboardWelcome() {
  const fullName = useAuthStore((state) => state.user?.fullName);
  const name = fullName?.trim().split(/\s+/).pop() || "Gia sư";

  return (
    <header className="relative overflow-hidden rounded-[var(--radius-card)] bg-primary px-5 py-5 text-primary-foreground shadow-soft sm:px-7 sm:py-6">
      <div className="relative z-10 flex items-start justify-between gap-4">
        <div className="min-w-0 max-w-xl">
          <p className="inline-flex items-center gap-1.5 rounded-full bg-primary-foreground/15 px-3 py-1 text-xs font-bold">
            <CalendarDaysIcon className="size-4" aria-hidden="true" />
            <span className="capitalize">{formatLongDate(getVietnamToday())}</span>
          </p>
          <h1 className="mt-3 font-lms text-2xl font-extrabold leading-[1.2] text-primary-foreground sm:text-3xl">
            {getGreeting()}, {name}
          </h1>
          <div className="mt-4 flex flex-wrap gap-2">
            <DashboardLink href="/lms/tutor/schedule" variant="accent">Mở lịch dạy</DashboardLink>
            <DashboardLink href="/lms/tutor/classes" variant="outline">Lớp học của tôi</DashboardLink>
          </div>
        </div>
        <DashboardMoreMenu />
      </div>
      <Image
        src={DASHBOARD_ASSETS.beePencil}
        alt=""
        width={240}
        height={240}
        unoptimized
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-2 right-16 hidden h-40 w-auto md:block lg:h-44"
      />
    </header>
  );
}
