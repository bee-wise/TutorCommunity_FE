"use client";

import Image from "next/image";
import Link from "next/link";
import { GlobeAltIcon } from "@heroicons/react/24/outline";
import { navigationConfig } from "@workspace/core/configs/navigation";
import { useAuthStore } from "@workspace/core/store/useAuthStore";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@workspace/ui/components/ui/avatar";
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

export function LmsAppSidebar({
  pathname,
  role,
}: {
  pathname: string;
  role: "TUTOR" | "LEARNER" | null;
}) {
  const user = useAuthStore((state) => state.user);
  const { state, toggleSidebar, setOpenMobile } = useSidebar();
  const groups = role ? (navigationConfig[role] ?? []) : [];
  const home = role === "TUTOR" ? "/lms/tutor/dashboard" : "/lms/learner";

  return (
    <Sidebar
      collapsible="icon"
      aria-label="Điều hướng LMS"
      className="border-r border-border [&_[data-slot=sidebar-inner]]:bg-card"
    >
      <SidebarHeader className="flex h-16 flex-row items-center justify-between border-b border-border px-4 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0">
        {state === "collapsed" ? (
          <button
            type="button"
            onClick={toggleSidebar}
            aria-label="Mở menu LMS"
            className="flex size-11 items-center justify-center rounded-xl hover:bg-muted focus-visible:outline-2 focus-visible:outline-ring"
          >
            <Image
              src="https://res.cloudinary.com/xcrm6ykz/image/upload/v1791528374/BeeWiseLMS-Logo-500x500.svg"
              alt=""
              width={32}
              height={32}
              priority
            />
          </button>
        ) : (
          <>
            <Link
              href={home}
              aria-label="Trang chính BeeWise LMS"
              className="relative h-10 w-32 rounded-lg transition-all active:scale-[0.98]"
              onClick={() => setOpenMobile(false)}
            >
              <Image
                src="https://res.cloudinary.com/xcrm6ykz/image/upload/v1791528372/BeeWiseLMS-Logo-500x150.svg"
                alt="BeeWise LMS"
                fill
                sizes="128px"
                className="object-contain object-left"
                priority
              />
            </Link>
            <SidebarTrigger
              aria-label="Thu gọn menu LMS"
              className="size-9 rounded-xl"
            />
          </>
        )}
      </SidebarHeader>
      <SidebarContent className="gap-1 overflow-x-hidden overflow-y-auto py-2">
        {groups.map((group) => (
          <SidebarGroup
            key={group.groupName}
            className="shrink-0 px-3 py-1 group-data-[collapsible=icon]:px-0.5"
          >
            <SidebarGroupLabel className="mb-1 h-6 px-3 text-[11px] font-semibold text-muted-foreground group-data-[collapsible=icon]:hidden">
              {group.groupName}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="gap-1">
                {group.items.map((item) => {
                  const active =
                    !item.openInNewTab &&
                    (pathname === item.url ||
                      (item.url !== "/lms/learner" &&
                        pathname.startsWith(`${item.url}/`)));
                  return (
                    <SidebarMenuItem key={item.url}>
                      <SidebarMenuButton
                        asChild
                        tooltip={item.title}
                        isActive={active}
                        className="lms-navigation-item group-data-[collapsible=icon]:size-11! group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:p-0"
                      >
                        <Link
                          href={item.url}
                          aria-current={active ? "page" : undefined}
                          target={item.openInNewTab ? "_blank" : undefined}
                          rel={
                            item.openInNewTab
                              ? "noopener noreferrer"
                              : undefined
                          }
                          onClick={() => setOpenMobile(false)}
                        >
                          <item.icon
                            className="size-[18px] shrink-0"
                            aria-hidden="true"
                          />
                          <span className="group-data-[collapsible=icon]:hidden">{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarFooter className="gap-3 border-t border-border p-3 group-data-[collapsible=icon]:p-1">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              tooltip="Cổng BeeWise"
              className="min-h-11 rounded-xl border border-border bg-muted font-bold text-primary hover:bg-card group-data-[collapsible=icon]:size-11! group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:p-0"
            >
              <a
                href="https://beewise.vn"
                target="_blank"
                rel="noopener noreferrer"
              >
                <GlobeAltIcon className="size-4 shrink-0" aria-hidden="true" />
                <span className="group-data-[collapsible=icon]:hidden">Cổng BeeWise</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        <div className="flex min-w-0 items-center gap-3 rounded-xl p-1 group-data-[collapsible=icon]:justify-center">
          <Avatar className="size-9 shrink-0 rounded-xl">
            <AvatarImage src="" alt="" />
            <AvatarFallback className="rounded-xl bg-accent/20 text-xs font-extrabold text-foreground">
              {user?.fullName
                ?.trim()
                .split(/\s+/)
                .slice(-2)
                .map((word) => word[0])
                .join("")
                .toUpperCase() || "BW"}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 group-data-[collapsible=icon]:hidden">
            <p className="truncate text-xs font-bold text-foreground">
              {user?.fullName || "Tài khoản"}
            </p>
            <p className="mt-1 truncate text-[11px] text-muted-foreground">
              {user?.email}
            </p>
          </div>
        </div>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
