"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowLeftIcon, CalendarDaysIcon, ChatBubbleLeftRightIcon, FolderIcon, InformationCircleIcon, UsersIcon } from "@heroicons/react/24/outline";
import { Button } from "@workspace/ui/components/ui/button";
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarRail, SidebarTrigger, useSidebar } from "@workspace/ui/components/ui/sidebar";
import { useTutorClassDetail } from "../hooks/useTutorClassDetail";
import { CLASS_WORKSPACE_LABELS, getClassWorkspaceLinks, type ClassWorkspaceRoute } from "../utils/class-workspace.utils";
import { ClassKindBadge, ClassStatusBadge } from "./ClassBadges";

const SECTIONS = [
  { id: "overview", icon: InformationCircleIcon }, { id: "sessions", icon: CalendarDaysIcon },
  { id: "members", icon: UsersIcon }, { id: "materials", icon: FolderIcon },
  { id: "messages", icon: ChatBubbleLeftRightIcon },
] as const;

export function ClassWorkspaceSidebar({ workspace }: { workspace: ClassWorkspaceRoute }) {
  const { classInfo } = useTutorClassDetail(workspace.classId);
  const { setOpenMobile, toggleSidebar } = useSidebar();
  const links = getClassWorkspaceLinks(workspace.classId);
  return (
    <Sidebar collapsible="icon" aria-label="Quản lý lớp học" className="border-r border-border [&_[data-slot=sidebar-inner]]:bg-card">
      <SidebarHeader className="flex h-16 flex-row items-center gap-1.5 border-b border-border px-2 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0">
        <Button asChild variant="outline" size="icon" className="size-11 shrink-0 rounded-full border-border text-primary transition-all active:scale-[0.98] group-data-[collapsible=icon]:hidden motion-reduce:transform-none">
          <Link href="/lms/tutor/classes" aria-label="Về danh sách lớp" title="Về danh sách lớp" onClick={() => setOpenMobile(false)}><ArrowLeftIcon className="size-4" aria-hidden="true" /></Link>
        </Button>
        <div className="flex min-w-0 flex-1 items-center group-data-[collapsible=icon]:hidden">
          <div className="relative h-10 min-w-0 max-w-32 flex-1">
            <Image src="https://res.cloudinary.com/xcrm6ykz/image/upload/v1791528372/BeeWiseLMS-Logo-500x150.svg" alt="BeeWise LMS" fill sizes="128px" className="object-contain object-left" priority />
          </div>
        </div>
        <SidebarTrigger className="size-11 shrink-0 rounded-full transition-all active:scale-[0.98] group-data-[collapsible=icon]:hidden motion-reduce:transform-none" aria-label="Thu gọn menu lớp" />
        <button type="button" onClick={toggleSidebar} aria-label="Mở menu lớp" className="hidden size-11 items-center justify-center rounded-xl transition-all hover:bg-primary/5 active:scale-[0.98] group-data-[collapsible=icon]:flex motion-reduce:transform-none">
          <span className="relative size-8"><Image src="https://res.cloudinary.com/xcrm6ykz/image/upload/v1791528374/BeeWiseLMS-Logo-500x500.svg" alt="BeeWise LMS" fill sizes="32px" className="object-contain" priority /></span>
        </button>
      </SidebarHeader>
      <SidebarContent className="gap-2 bg-card py-4">
        <div className="space-y-3 px-4 pb-4 group-data-[collapsible=icon]:hidden">
          <p className="text-xs font-bold text-muted-foreground">{classInfo?.code ?? workspace.classId}</p>
          <p className="font-nunito text-lg font-extrabold leading-[1.3] text-primary [overflow-wrap:anywhere]">{classInfo?.title ?? "Không tìm thấy lớp"}</p>
          {classInfo && <div className="flex flex-wrap gap-1.5"><ClassStatusBadge status={classInfo.status} /><ClassKindBadge kind={classInfo.kind} /></div>}
        </div>
        <SidebarGroup className="group-data-[collapsible=icon]:p-0.5">
          <SidebarGroupLabel className="text-xs font-bold text-muted-foreground group-data-[collapsible=icon]:hidden">Không gian lớp học</SidebarGroupLabel>
          <SidebarGroupContent><SidebarMenu className="gap-2">
            {classInfo && SECTIONS.map(({ id, icon: Icon }) => <SidebarMenuItem key={id}>
              <SidebarMenuButton asChild tooltip={CLASS_WORKSPACE_LABELS[id]} isActive={workspace.section === id}
                className={`min-h-11 rounded-xl px-3 font-semibold transition-all active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-ring group-data-[collapsible=icon]:size-11! motion-reduce:transform-none ${workspace.section === id ? "bg-primary! text-primary-foreground! hover:bg-primary/90!" : "text-muted-foreground hover:bg-muted hover:text-primary"}`}>
                <Link href={links[id]} aria-current={workspace.section === id ? "page" : undefined} onClick={() => setOpenMobile(false)}>
                  <Icon className="size-4" aria-hidden="true" /><span>{CLASS_WORKSPACE_LABELS[id]}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>)}
          </SidebarMenu></SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="hidden border-t border-border bg-card p-0.5 group-data-[collapsible=icon]:flex">
        <Button asChild variant="outline" size="icon" className="size-11 rounded-full border-border text-primary transition-all active:scale-[0.98] motion-reduce:transform-none">
          <Link href="/lms/tutor/classes" aria-label="Về danh sách lớp" title="Về danh sách lớp" onClick={() => setOpenMobile(false)}><ArrowLeftIcon className="size-4" aria-hidden="true" /></Link>
        </Button>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
