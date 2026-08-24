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

  if (isFullscreenExercise) {
    return (
      <main className="min-h-[100dvh] w-full bg-background">{children}</main>
    );
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        <AppSidebar />
        <div className="flex flex-col flex-1 w-full relative">
          <Topbar />
          <main className="flex-1 min-h-0">
            <div className="w-full">{children}</div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
