"use client";

import type { ReactNode } from "react";
import { AcademicCapIcon, CalendarDaysIcon, ClockIcon, Squares2X2Icon } from "@heroicons/react/24/outline";
import { LmsStatCard } from "@/components/LmsStatCard";
import { formatHours } from "../utils/dashboard-overview.utils";
import { useTutorOverview } from "../hooks/useTutorOverview";

export function DashboardStats() {
  const { kpis, week, weekMinutes, weekSessions } = useTutorOverview();
  const kpi = kpis.data;
  const placeholder = (loading: boolean): string => (loading ? "…" : "–");
  const items: { label: string; value: string | number; icon: ReactNode; tone: "primary" | "accent" | "secondary" }[] = [
    { label: "Buổi dạy hôm nay", value: kpi?.sessionsToday ?? placeholder(kpis.isPending), icon: <CalendarDaysIcon aria-hidden="true" />, tone: "primary" },
    { label: "Buổi sắp tới", value: kpi?.upcomingSessions ?? placeholder(kpis.isPending), icon: <Squares2X2Icon aria-hidden="true" />, tone: "accent" },
    { label: "Lớp đang dạy", value: kpi?.activeClasses ?? placeholder(kpis.isPending), icon: <AcademicCapIcon aria-hidden="true" />, tone: "secondary" },
    { label: `Giờ dạy tuần này${week.data ? ` · ${weekSessions} buổi` : ""}`, value: week.data ? `${formatHours(weekMinutes)}h` : placeholder(week.isPending), icon: <ClockIcon aria-hidden="true" />, tone: "primary" },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 xl:grid-cols-4" aria-label="Chỉ số giảng dạy">
      {items.map((item) => <LmsStatCard key={item.label} {...item} />)}
    </div>
  );
}
