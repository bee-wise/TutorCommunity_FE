"use client";
import { useGetMe } from "@workspace/core/hooks/useGetMe";
import { DashboardLayout } from "@workspace/ui/components/layout/DashboardLayout";

export default function ConsultantLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useGetMe();
  return <DashboardLayout>{children}</DashboardLayout>;
}
