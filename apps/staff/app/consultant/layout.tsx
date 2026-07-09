import { DashboardLayout } from '@workspace/ui/components/layout/DashboardLayout';

export default function ConsultantLayout({ children }: { children: React.ReactNode }) {
  // We can add Consultant-specific logic here if needed (e.g., auth guards)
  return <DashboardLayout>{children}</DashboardLayout>;
}
