"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { SidebarProvider } from '@workspace/ui/components/ui/sidebar';
import { AppSidebar } from "./AppSidebar";
import { Topbar } from "./Topbar";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const pathname = usePathname();
  const exerciseRoute = pathname.match(/^\/lms\/learner\/exercises\/([^/]+)$/);
  const isFullscreenExercise = Boolean(exerciseRoute && exerciseRoute[1] !== "classes");

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
      <div className="flex min-h-screen w-full bg-background">
        <AppSidebar />
        <div className="relative flex min-w-0 flex-1 flex-col">
          <Topbar />
          <main className="min-w-0 min-h-0 flex-1">
            <div className="min-w-0 w-full">{children}</div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
