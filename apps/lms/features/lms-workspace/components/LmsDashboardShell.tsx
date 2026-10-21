import type { ReactNode } from "react";
import { SidebarProvider } from "@workspace/ui/components/ui/sidebar";
import { LmsAppSidebar } from "./LmsAppSidebar";
import { LmsMobileNav } from "./LmsMobileNav";
import { LmsTopbar } from "./LmsTopbar";

interface LmsDashboardShellProps {
  children: ReactNode;
  pathname: string;
  role: "TUTOR" | "LEARNER" | null;
  sidebar?: ReactNode;
  breadcrumb?: ReactNode;
}

export function LmsDashboardShell({ children, pathname, role, sidebar, breadcrumb }: LmsDashboardShellProps) {
  const exercise = pathname.match(/^\/lms\/learner\/exercises\/([^/]+)\/?$/);
  const focused = Boolean(exercise && exercise[1] !== "classes")
    || pathname.startsWith("/lms/tutor/messages")
    || /^\/lms\/tutor\/materials\/[^/]+\/preview\/?$/.test(pathname);

  if (focused) return <main id="lms-main-content" className="h-dvh w-full overflow-hidden bg-muted">{children}</main>;

  return (
    <SidebarProvider className="lms-shell bg-muted">
      <a href="#lms-main-content" className="sr-only z-50 rounded-xl bg-primary px-4 py-3 font-bold text-primary-foreground focus:not-sr-only focus:fixed focus:left-4 focus:top-4">Đến nội dung chính</a>
      {sidebar ?? <LmsAppSidebar pathname={pathname} role={role} />}
      <div className="flex min-h-0 min-w-0 flex-1 flex-col">
        <LmsTopbar pathname={pathname} role={role} breadcrumb={breadcrumb} />
        <main id="lms-main-content" tabIndex={-1} className={`min-h-0 min-w-0 flex-1 overflow-y-auto outline-none${sidebar ? "" : " pb-[calc(4rem+env(safe-area-inset-bottom))] md:pb-0"}`}>
          {children}
        </main>
        {!sidebar && <LmsMobileNav pathname={pathname} role={role} />}
      </div>
    </SidebarProvider>
  );
}
