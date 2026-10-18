"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { BellIcon, ChevronDownIcon } from "@heroicons/react/24/outline";
import { navigationConfig } from "@workspace/core/configs/navigation";
import { useAuthStore } from "@workspace/core/store/useAuthStore";
import { useNotificationDrawerStore } from "@workspace/core/store/useNotificationDrawerStore";
import { useLogout } from "@workspace/core/hooks/useLogout";
import { Avatar, AvatarFallback } from "@workspace/ui/components/ui/avatar";
import { Button } from "@workspace/ui/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@workspace/ui/components/ui/dropdown-menu";
import { SidebarTrigger } from "@workspace/ui/components/ui/sidebar";

export function LmsTopbar({ pathname, role, breadcrumb }: { pathname: string; role: "TUTOR" | "LEARNER" | null; breadcrumb?: ReactNode }) {
  const user = useAuthStore((state) => state.user);
  const openDrawer = useNotificationDrawerStore((state) => state.openDrawer);
  const unreadCount = useNotificationDrawerStore((state) => state.unreadCount);
  const { mutate: logout } = useLogout();
  const count = Math.max(0, unreadCount ?? user?.unreadNotificationCount ?? 0);
  const items = role ? (navigationConfig[role] ?? []).flatMap((group) => group.items) : [];
  const current = items.filter((item) => !item.openInNewTab && (pathname === item.url || (item.url !== "/lms/learner" && pathname.startsWith(`${item.url}/`)))).sort((a, b) => b.url.length - a.url.length)[0];

  return (
    <header className="flex h-16 shrink-0 items-center gap-3 border-b border-border bg-card px-4 sm:px-6 lg:px-8">
      <SidebarTrigger aria-label="Mở menu LMS" className="size-11 rounded-xl md:hidden" />
      <div className="min-w-0 flex-1 overflow-x-auto whitespace-nowrap text-sm font-semibold text-muted-foreground">
        {breadcrumb ?? <nav aria-label="Vị trí hiện tại"><span aria-current="page">{current?.title ?? "Không gian học tập"}</span></nav>}
      </div>
      <div className="flex shrink-0 items-center gap-2 sm:gap-4">
        <Button type="button" variant="ghost" size="icon" onClick={openDrawer} aria-label={count ? `Thông báo, ${count} chưa đọc` : "Thông báo"} className="relative size-11 rounded-xl text-muted-foreground hover:bg-muted hover:text-primary">
          <BellIcon className="size-[18px]" aria-hidden="true" />
          {count > 0 && <span className="absolute right-2 top-2 size-2 rounded-full border-2 border-card bg-destructive" />}
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild><Button variant="ghost" className="h-11 gap-2 rounded-xl px-1.5 hover:bg-muted" aria-label="Menu tài khoản">
            <Avatar className="size-8"><AvatarFallback className="bg-accent/20 text-[11px] font-extrabold text-foreground">{user?.fullName?.trim().split(/\s+/).slice(-2).map((word) => word[0]).join("").toUpperCase() || "BW"}</AvatarFallback></Avatar>
            <span className="hidden max-w-36 truncate text-xs font-bold sm:block">{user?.fullName || "Tài khoản"}</span><ChevronDownIcon className="size-3.5 text-muted-foreground" aria-hidden="true" />
          </Button></DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-64 rounded-2xl border-border p-2 shadow-soft">
            <DropdownMenuLabel className="space-y-1 px-2 py-3"><span className="block truncate text-sm font-bold">{user?.fullName}</span><span className="block truncate text-xs font-medium text-muted-foreground">{user?.email}</span></DropdownMenuLabel>
            <DropdownMenuSeparator />
            {role === "TUTOR" && <DropdownMenuItem asChild className="min-h-11 rounded-xl"><Link href="/lms/tutor/profile">Hồ sơ của tôi</Link></DropdownMenuItem>}
            <DropdownMenuItem onClick={() => logout()} className="min-h-11 rounded-xl text-destructive focus:text-destructive">Đăng xuất</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
