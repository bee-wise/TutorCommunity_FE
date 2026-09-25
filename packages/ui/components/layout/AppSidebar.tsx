"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut } from "lucide-react";
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
} from "@workspace/ui/components/ui/sidebar";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@workspace/ui/components/ui/avatar";
import { Skeleton } from "@workspace/ui/components/ui/skeleton";
import { navigationConfig } from "@workspace/core/configs/navigation";

export function AppSidebar() {
  const pathname = usePathname();
  const user = useAuthStore((state) => state.user);

  const normalizedRole = user?.role?.toUpperCase();
  const navGroups = normalizedRole ? navigationConfig[normalizedRole] : [];

  return (
    <Sidebar collapsible="icon" className="border-r border-border/40">
      <SidebarHeader className="h-16 flex flex-row items-center justify-between group-data-[collapsible=icon]:justify-center px-4 group-data-[collapsible=icon]:px-0 border-b border-border/40">
        <Link
          href="/"
          className="flex items-center gap-2 group w-full overflow-hidden group-data-[collapsible=icon]:hidden"
        >
          <div className="relative w-8 h-8 border rounded-lg bg-background overflow-hidden shrink-0 flex items-center justify-center">
            <Image
              src="https://res.cloudinary.com/xcrm6ykz/image/upload/v1789964842/Logo_1.png"
              alt="BeeWise Logo"
              fill
              sizes="32px"
              className="object-contain"
              priority
            />
          </div>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-bold text-primary font-nunito">
              BeeWise
            </span>
            <span className="truncate text-xs text-muted-foreground font-medium">
              {normalizedRole === "LEARNER" && "Học Viên"}
              {normalizedRole === "TUTOR" && "Gia Sư"}
              {normalizedRole === "CONSULTANT" && "Tư Vấn Viên"}
            </span>
          </div>
        </Link>
        <SidebarTrigger />{" "}
      </SidebarHeader>
      <SidebarContent className="gap-0 py-4">
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
                      item.url === "/admin" || item.url === "/consultant";
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
      <SidebarFooter className="border-t border-border/40 p-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground group-data-[collapsible=icon]:justify-center"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage src={""} alt={user?.fullName || ""} />
                <AvatarFallback className="rounded-lg bg-[#FFC500]/20 text-[#280F91] font-semibold">
                  {user?.fullName?.substring(0, 2).toUpperCase() || "BW"}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden">
                <span className="truncate font-semibold text-foreground">
                  {user?.fullName}
                </span>
                <span className="truncate text-xs text-muted-foreground">
                  {user?.email}
                </span>
              </div>
              <LogOut className="ml-auto size-4 text-muted-foreground group-data-[collapsible=icon]:hidden" />
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
