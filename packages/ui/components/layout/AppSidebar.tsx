"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Globe, ExternalLink } from "lucide-react";
import { useAuthStore } from "@workspace/core/store/useAuthStore";

import Image from "next/image";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarTrigger,
  useSidebar,
} from "@workspace/ui/components/ui/sidebar";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@workspace/ui/components/ui/avatar";
import { Skeleton } from "@workspace/ui/components/ui/skeleton";
import { navigationConfig } from "@workspace/core/configs/navigation";

export function AppSidebar({ app }: { app?: string } = {}) {
  const pathname = usePathname();
  const user = useAuthStore((state) => state.user);
  const { state, toggleSidebar } = useSidebar();
  const isCollapsed = state === "collapsed";

  const isLms =
    app === "lms" ||
    pathname?.startsWith("/lms") ||
    pathname?.includes("/lms");

  const normalizedRole = user?.role?.toUpperCase();
  const navGroups = normalizedRole ? navigationConfig[normalizedRole] : [];

  return (
    <Sidebar
      collapsible="icon"
      className="border-r border-border/40 bg-white! [&_[data-slot=sidebar-inner]]:bg-white!"
    >
      <SidebarHeader className="h-16 flex flex-row items-center justify-between group-data-[collapsible=icon]:justify-center px-4 group-data-[collapsible=icon]:px-0 border-b border-border/40 bg-white">
        {isCollapsed ? (
          <button
            onClick={toggleSidebar}
            aria-label="Mở sidebar"
            className="relative flex size-11 cursor-pointer items-center justify-center rounded-xl transition-all hover:bg-primary/5 active:scale-[0.98] motion-reduce:transform-none"
          >
            <div className="relative size-8 shrink-0 overflow-hidden">
              <Image
                src={isLms
                  ? "https://res.cloudinary.com/xcrm6ykz/image/upload/v1791528374/BeeWiseLMS-Logo-500x500.svg"
                  : "https://res.cloudinary.com/xcrm6ykz/image/upload/v1789964842/Logo_1.png"}
                alt={isLms ? "BeeWise LMS" : "BeeWise"}
                fill
                sizes="32px"
                className="object-contain"
                priority
              />
            </div>
          </button>
        ) : (
          <>
            <Link
              href={isLms ? "/lms" : "/"}
              className="flex min-w-0 flex-1 items-center rounded-lg transition-all hover:opacity-85 active:scale-[0.98] motion-reduce:transform-none"
              aria-label={isLms ? "BeeWise LMS" : "BeeWise"}
            >
              <div className={isLms ? "relative h-10 w-32 shrink-0" : "relative h-7 w-[96px] shrink-0"}>
                <Image
                  src={isLms
                    ? "https://res.cloudinary.com/xcrm6ykz/image/upload/v1791528372/BeeWiseLMS-Logo-500x150.svg"
                    : "https://res.cloudinary.com/xcrm6ykz/image/upload/e_trim/v1789964923/Logo_2.png"}
                  alt={isLms ? "BeeWise LMS" : "BeeWise"}
                  fill
                  sizes={isLms ? "128px" : "96px"}
                  className="object-contain object-left"
                  priority
                />
              </div>
            </Link>
            <SidebarTrigger />
          </>
        )}
      </SidebarHeader>
      <SidebarContent className="gap-0 py-4 bg-white">
        {navGroups.length === 0 ? (
          <div className="px-4 py-2 space-y-6 group-data-[collapsible=icon]:px-2">
            {[1, 2].map((groupIndex) => (
              <div key={groupIndex} className="space-y-3">
                <Skeleton className="h-3 w-16 bg-primary/10 group-data-[collapsible=icon]:hidden" />
                <div className="space-y-1">
                  {[1, 2, 3].map((itemIndex) => (
                    <Skeleton
                      key={itemIndex}
                      className="h-8 w-full bg-primary/5 rounded-md"
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          navGroups.map((group) => (
            <SidebarGroup
              key={group.groupName}
              className="group-data-[collapsible=icon]:p-2"
            >
              <SidebarGroupLabel className="text-xs font-semibold uppercase text-muted-foreground group-data-[collapsible=icon]:hidden">
                {group.groupName}
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {group.items.map((item) => {
                    const isRootUrl =
                      item.url === "/admin" || item.url === "/consultant" || item.url === "/lms/learner";
                    const isActive =
                      !item.openInNewTab &&
                      (pathname === item.url ||
                        (!isRootUrl && pathname.startsWith(`${item.url}/`)));

                    return (
                      <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton
                          asChild
                          tooltip={item.title}
                          isActive={isActive}
                          className={`transition-colors font-medium select-none ${
                            isActive
                              ? "bg-primary/85! text-accent! hover:bg-primary/90! hover:text-accent!"
                              : "text-muted-foreground hover:bg-primary/5 hover:text-primary"
                          }`}
                        >
                          <Link
                            href={item.url}
                            target={item.openInNewTab ? "_blank" : undefined}
                            rel={
                              item.openInNewTab
                                ? "noopener noreferrer"
                                : undefined
                            }
                          >
                            <item.icon
                              className={`size-4 ${isActive ? "text-accent" : ""}`}
                            />
                            <span
                              className={` ${isActive ? "text-accent" : ""}`}
                            >
                              {item.title}
                            </span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          ))
        )}
      </SidebarContent>
      <SidebarFooter className="border-t border-border/40 p-3 bg-white">
        <SidebarMenu className="gap-1.5">
          {normalizedRole === "TUTOR" && (
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                size="default"
                tooltip="Cổng BeeWise.vn"
                className="bg-primary/5 hover:bg-primary/10 text-primary hover:text-primary transition-colors font-medium border border-primary/15 group-data-[collapsible=icon]:justify-center"
              >
                <a
                  href="https://beewise.vn"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 w-full"
                >
                  <Globe className="size-4 shrink-0 text-primary" />
                  <span className="truncate text-xs font-semibold group-data-[collapsible=icon]:hidden">
                    Cổng BeeWise
                  </span>
                  <ExternalLink className="ml-auto size-3.5 text-primary/70 group-data-[collapsible=icon]:hidden" />
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )}

          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              tooltip={user?.fullName || "Tài khoản"}
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground group-data-[collapsible=icon]:justify-center cursor-default hover:bg-sidebar-accent/50 select-none"
            >
              <Avatar className="h-8 w-8 rounded-lg shrink-0">
                <AvatarImage src={""} alt={user?.fullName || ""} />
                <AvatarFallback className="rounded-lg bg-[#FFC500]/20 text-[#280F91] font-semibold">
                  {user?.fullName?.substring(0, 2).toUpperCase() || "BW"}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden min-w-0">
                <span className="truncate font-semibold text-foreground">
                  {user?.fullName}
                </span>
                <span className="truncate text-xs text-muted-foreground">
                  {user?.email}
                </span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
