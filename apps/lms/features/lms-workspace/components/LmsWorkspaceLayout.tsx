"use client";

import type { ReactNode } from "react";
import { DashboardLayout } from "@workspace/ui/components/layout/DashboardLayout";
import { ClassWorkspaceSidebar } from "@/features/tutor-classes/components/ClassWorkspaceSidebar";
import { ClassWorkspaceBreadcrumb } from "@/features/tutor-classes/components/ClassWorkspaceBreadcrumb";
import { getClassWorkspaceRoute } from "@/features/tutor-classes/utils/class-workspace.utils";
import { LearnerClassSidebar } from "@/features/learner-classes/components/LearnerClassSidebar";
import { LearnerClassBreadcrumb } from "@/features/learner-classes/components/LearnerClassBreadcrumb";
import { getLearnerWorkspaceRoute } from "@/features/learner-classes/utils/learner-class-workspace.utils";
import { AIJobNavigationGuard } from "@/features/tutor-materials/components/AIJobNavigationGuard";
import { useLmsRoleGuard } from "../hooks/useLmsRoleGuard";

export function LmsWorkspaceLayout({ children }: { children: ReactNode }) {
  const { pathname, role, canRender } = useLmsRoleGuard();

  if (!canRender) {
    return (
      <main className="flex min-h-dvh items-center justify-center bg-background px-6">
        <div
          role="status"
          className="rounded-2xl border border-border bg-card px-6 py-5 text-sm font-medium text-muted-foreground shadow-sm"
        >
          Đang xác minh tài khoản...
        </div>
      </main>
    );
  }

  const tutorWorkspace = role === "TUTOR" ? getClassWorkspaceRoute(pathname) : null;
  const learnerWorkspace = role === "LEARNER" ? getLearnerWorkspaceRoute(pathname) : null;
  return (
    <DashboardLayout
      sidebar={tutorWorkspace ? <ClassWorkspaceSidebar workspace={tutorWorkspace} /> : learnerWorkspace ? <LearnerClassSidebar workspace={learnerWorkspace} /> : undefined}
      breadcrumb={tutorWorkspace ? <ClassWorkspaceBreadcrumb workspace={tutorWorkspace} /> : learnerWorkspace ? <LearnerClassBreadcrumb workspace={learnerWorkspace} /> : undefined}
    >
      <AIJobNavigationGuard />{children}
    </DashboardLayout>
  );
}
