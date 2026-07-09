"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { Bell, ChevronDown, Moon, Sun, Monitor } from "lucide-react";
import { useTheme } from "next-themes";

import { useAuthStore, UserRole } from '@workspace/core/store/useAuthStore';

import { SidebarTrigger } from '@workspace/ui/components/ui/sidebar';
import { Separator } from '@workspace/ui/components/ui/separator';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@workspace/ui/components/ui/breadcrumb';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@workspace/ui/components/ui/dropdown-menu';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@workspace/ui/components/ui/avatar';

export function Topbar() {
  const pathname = usePathname();
  const { user } = useAuthStore();

  // Simple breadcrumb generator based on pathname
  const paths = pathname.split("/").filter(Boolean);

  return (
    <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center gap-2 border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 transition-all">
      <div className="flex items-center gap-2 md:hidden">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="h-4 mr-2" />
      </div>

      {/* Dynamic Breadcrumbs */}
      <Breadcrumb className="hidden md:flex">
        <BreadcrumbList>
          {paths.map((path, index) => {
            const isLast = index === paths.length - 1;
            const href = `/${paths.slice(0, index + 1).join("/")}`;
            // Capitalize and format text
            const title =
              path.charAt(0).toUpperCase() + path.slice(1).replace("-", " ");

            return (
              <React.Fragment key={path}>
                <BreadcrumbItem>
                  {isLast ? (
                    <BreadcrumbPage className="font-semibold text-foreground">
                      {title}
                    </BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink
                      href={href}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      {title}
                    </BreadcrumbLink>
                  )}
                </BreadcrumbItem>
                {!isLast && <BreadcrumbSeparator />}
              </React.Fragment>
            );
          })}
        </BreadcrumbList>
      </Breadcrumb>

      <div className="ml-auto flex items-center gap-4">
        {/* Notifications Mock */}
        <button className="relative size-8 flex items-center justify-center rounded-full hover:bg-accent text-muted-foreground hover:text-foreground transition-colors">
          <Bell className="size-4.5" />
          <span className="absolute top-1.5 right-1.5 size-2 rounded-full bg-destructive border-2 border-background" />
        </button>

        {/* Role Switcher & Profile Dropdown (Dev Mode) */}
        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-2 focus-visible:outline-none rounded-full pr-2 hover:bg-accent transition-colors">
            <Avatar className="h-8 w-8 rounded-full border border-border/50">
              <AvatarImage src={user?.avatarUrl} alt={user?.name || ""} />
              <AvatarFallback className="bg-[#FFC500]/20 text-[#280F91] text-xs font-semibold">
                {user?.name?.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <span className="text-sm font-medium hidden md:block">
              {user?.name}
            </span>
            <ChevronDown className="size-4 text-muted-foreground hidden md:block" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Tài khoản hiện tại</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="flex flex-col items-start gap-1">
              <span className="font-medium">{user?.name}</span>
              <span className="text-xs text-muted-foreground">
                {user?.email}
              </span>
            </DropdownMenuItem>

            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive focus:bg-destructive/10 focus:text-destructive cursor-pointer">
              Đăng xuất
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
