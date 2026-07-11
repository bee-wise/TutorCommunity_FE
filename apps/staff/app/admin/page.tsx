import React from "react";
import { KPIStatsRow } from "../../features/admin/components/dashboard/KPIStatsRow";
import { RevenueTrendChart } from "../../features/admin/components/dashboard/RevenueTrendChart";
import { SystemActivityChart } from "../../features/admin/components/dashboard/SystemActivityChart";
import { PendingTutorVerifications } from "../../features/admin/components/dashboard/PendingVerificationsWidget";
import { RecentConnectionsWidget } from "../../features/admin/components/dashboard/RecentConnectionsWidget";
import { PersonnelWidget } from "../../features/admin/components/dashboard/PersonnelWidget";
import { NewRegistrationsWidget } from "../../features/admin/components/dashboard/NewRegistrationsWidget";
import { RiskAlertsWidget } from "../../features/admin/components/dashboard/RiskAlertsWidget";

export default function AdminDashboard() {
  const now = new Date();
  const timeStr = now.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" });
  const dateStr = now.toLocaleDateString("vi-VN", { weekday: "long", year: "numeric", month: "long", day: "numeric" });

  return (
    <div className="w-full min-h-screen bg-[#f4f6fb] dark:bg-zinc-950 py-8 px-4 md:px-8">
      <div className="max-w-[1400px] mx-auto flex flex-col gap-8">

        {/* ─── Page Header ─── */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">{dateStr}</p>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mt-1 tracking-tight">
              Dashboard Vận Hành
            </h1>
            <p className="text-sm text-gray-400 mt-1">
              Tổng quan hoạt động hệ thống BeeWise — Admin Portal
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <span className="text-xs text-gray-400">Giờ hệ thống</span>
              <p className="text-lg font-bold text-gray-800 dark:text-gray-200">{timeStr}</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white font-bold shadow-md">
              A
            </div>
          </div>
        </div>

        {/* ─── Row 1: 6-KPI stat cards ─── */}
        <KPIStatsRow />

        {/* ─── Row 2: Revenue chart (2/3) + Personnel (1/3) ─── */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2">
            <RevenueTrendChart />
          </div>
          <div>
            <PersonnelWidget />
          </div>
        </div>

        {/* ─── Row 3: System Activity (1/2) + Pending Tutor Verifications (1/2) ─── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="h-[340px] flex flex-col">
            <SystemActivityChart />
          </div>
          <div className="h-[340px] flex flex-col">
            <PendingTutorVerifications />
          </div>
        </div>

        {/* ─── Row 4: Recent Classes (1/2) + New Registrations (1/4) + Risk Alerts (1/4) ─── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-6">
          <div className="lg:col-span-1 xl:col-span-2">
            <RecentConnectionsWidget />
          </div>
          <div>
            <NewRegistrationsWidget />
          </div>
          <div>
            <RiskAlertsWidget />
          </div>
        </div>

      </div>
    </div>
  );
}
