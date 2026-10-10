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
          aria-live="polite"
          className="flex flex-col items-center gap-3.5 rounded-3xl border border-border bg-card px-8 py-7 shadow-soft"
        >
          <div className="relative flex size-9 items-center justify-center">
            <div className="absolute inset-0 rounded-full border-2 border-primary/20" />
            <div className="size-9 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          </div>
          <p className="text-sm font-semibold text-foreground">
            Bạn chờ BeeWise chút nhé...
          </p>
        </div>
      </main>
    );
  }

  const tutorWorkspace =
    role === "TUTOR" ? getClassWorkspaceRoute(pathname) : null;
  const learnerWorkspace =
    role === "LEARNER" ? getLearnerWorkspaceRoute(pathname) : null;
  return (
    <DashboardLayout
      sidebar={
        tutorWorkspace ? (
          <ClassWorkspaceSidebar workspace={tutorWorkspace} />
        ) : learnerWorkspace ? (
          <LearnerClassSidebar workspace={learnerWorkspace} />
        ) : undefined
      }
      breadcrumb={
        tutorWorkspace ? (
          <ClassWorkspaceBreadcrumb workspace={tutorWorkspace} />
        ) : learnerWorkspace ? (
          <LearnerClassBreadcrumb workspace={learnerWorkspace} />
        ) : undefined
      }
    >
      <AIJobNavigationGuard />
      {children}
    </DashboardLayout>
  );
}
