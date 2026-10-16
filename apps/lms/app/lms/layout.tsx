import { LmsWorkspaceLayout } from "@/features/lms-workspace/components/LmsWorkspaceLayout";
import "@/features/lms-workspace/styles/lms-workspace.css";

export default function LMSLayout({ children }: { children: React.ReactNode }) {
  return <div className="lms-workspace"><LmsWorkspaceLayout>{children}</LmsWorkspaceLayout></div>;
}
