import { LmsWorkspaceLayout } from "@/features/lms-workspace/components/LmsWorkspaceLayout";

export default function LMSLayout({ children }: { children: React.ReactNode }) {
  return <LmsWorkspaceLayout>{children}</LmsWorkspaceLayout>;
}
