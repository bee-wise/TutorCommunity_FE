"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { SidebarProvider } from '@workspace/ui/components/ui/sidebar';
import { AppSidebar } from "./AppSidebar";
import { Topbar } from "./Topbar";

interface DashboardLayoutProps {
  children: React.ReactNode;
  sidebar?: React.ReactNode;
  breadcrumb?: React.ReactNode;
}

export function DashboardLayout({ children, sidebar, breadcrumb }: DashboardLayoutProps) {
  const pathname = usePathname();
  const exerciseRoute = pathname.match(/^\/lms\/learner\/exercises\/([^/]+)$/);
  const isFullscreenExercise = Boolean(exerciseRoute && exerciseRoute[1] !== "classes");
  const isFullscreenMaterialPreview = /^\/lms\/tutor\/materials\/[^/]+\/preview\/?$/.test(pathname);

  const isFullscreenChat = Boolean(
    pathname.startsWith("/lms/tutor/messages") ||
    pathname.startsWith("/lms/learner/messages") ||
    pathname.startsWith("/consultant/workspace")
  );

  if (isFullscreenExercise || isFullscreenChat) {
    return (
      <main className="h-dvh w-full overflow-hidden bg-background">{children}</main>
    );
  }

  return (
    <SidebarProvider>
      <div className={isFullscreenMaterialPreview ? "flex h-dvh w-full overflow-hidden bg-background" : "flex min-h-dvh w-full bg-background"}>
        {!isFullscreenMaterialPreview && (sidebar ?? <AppSidebar />)}
        <div className="relative flex min-w-0 flex-1 flex-col">
          {!isFullscreenMaterialPreview && <Topbar breadcrumb={breadcrumb} />}
          <main className={`min-w-0 min-h-0 flex-1 ${isFullscreenMaterialPreview ? "overflow-hidden" : ""}`}>
            <div className={`min-w-0 w-full ${isFullscreenMaterialPreview ? "h-full" : ""}`}>{children}</div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
