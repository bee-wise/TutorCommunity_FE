"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut, Lock } from "lucide-react";
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
import { useTheme } from "next-themes";
import { navigationConfig } from "@workspace/core/configs/navigation";

export function AppSidebar() {
  const pathname = usePathname();
  const user = useAuthStore((state) => state.user);
  const [imageUrl, setImageUrl] = React.useState(
    "/brand/beewise-logo-nobackground.PNG",
  );

  const navGroups = user ? navigationConfig[user?.role.toUpperCase()] : [];

  const { theme } = useTheme();

  React.useEffect(() => {
    if (theme === "dark") {
      setImageUrl("/brand/beewise-logo-nobackground.PNG");
    } else {
      setImageUrl("/brand/beewise-logo.png");
    }
  }, [theme]);

  return (
    <Sidebar collapsible="icon" className="border-r border-border/40">
      <SidebarHeader className="h-16 flex flex-row items-center justify-between group-data-[collapsible=icon]:justify-center px-4 group-data-[collapsible=icon]:px-0 border-b border-border/40">
        <Link
          href="/"
          className="flex items-center gap-2 group w-full overflow-hidden group-data-[collapsible=icon]:hidden"
        >
          <div className="relative w-8 h-8 border rounded-lg bg-background overflow-hidden shrink-0 flex items-center justify-center">
            <Image
              src={imageUrl}
              alt="BeeWise Logo"
              fill
              sizes="32px"
              className="object-contain"
              priority
            />
          </div>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-bold text-primary font-montserrat">
              BeeWise
            </span>
            <span className="truncate text-xs text-muted-foreground font-medium">
              {user?.role === "LEARNER" && "Học Viên"}
              {user?.role === "TUTOR" && "Gia Sư"}
              {user?.role === "CONSULTANT" && "Tư Vấn Viên"}
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
                    const isActive =
                      pathname === item.url ||
                      pathname.startsWith(`${item.url}/`);

                    const isTutor = user?.role === "TUTOR";
                    const isUnverified =
                      isTutor && user?.status === "UNVERIFIED";
                    const isDashboard = item.url === "/lms/tutor";
                    const isLocked = isUnverified && !isDashboard;

                    return (
                      <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton
                          asChild={!isLocked}
                          tooltip={
                            isLocked
                              ? "Bạn hãy hoàn thành xác thực tài khoản"
                              : item.title
                          }
                          isActive={isActive && !isLocked}
                          disabled={isLocked}
                          className={`transition-colors font-medium select-none ${
                            isLocked
                              ? "opacity-40 cursor-not-allowed text-muted-foreground/70"
                              : isActive
                                ? "bg-[#280F91]/10 text-accent hover:bg-[#280F91]/15 hover:text-[#280F91]"
                                : "text-muted-foreground hover:bg-[#280F91]/5 hover:text-[#280F91]"
                          }`}
                        >
                          {isLocked ? (
                            <div className="flex items-center gap-2 w-full cursor-not-allowed">
                              <item.icon className="size-4 text-muted-foreground/60 shrink-0" />
                              <span className="truncate">{item.title}</span>
                              <Lock className="ml-auto size-3 text-muted-foreground/60 shrink-0" />
                            </div>
                          ) : (
                            <Link href={item.url}>
                              <item.icon
                                className={`size-4 ${isActive ? "text-accent" : ""}`}
                              />
                              <span
                                className={` ${isActive ? "text-accent" : ""}`}
                              >
                                {item.title}
                              </span>
                            </Link>
                          )}
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
