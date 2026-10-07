"use client";
import { useGetMe } from "@workspace/core/hooks/useGetMe";
import { DashboardLayout } from "@workspace/ui/components/layout/DashboardLayout";
import { AIJobNavigationGuard } from "@/features/tutor-materials/components/AIJobNavigationGuard";

export default function LMSLayout({ children }: { children: React.ReactNode }) {
  useGetMe();
  return <DashboardLayout><AIJobNavigationGuard />{children}</DashboardLayout>;
}
