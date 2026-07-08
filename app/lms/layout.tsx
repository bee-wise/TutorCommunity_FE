import { DashboardLayout } from "@/src/components/layout/DashboardLayout";

export default function LMSLayout({ children }: { children: React.ReactNode }) {
  return <DashboardLayout>{children}</DashboardLayout>;
}
