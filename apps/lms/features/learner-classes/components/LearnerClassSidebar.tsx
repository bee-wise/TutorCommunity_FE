"use client";

import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeftIcon,
  BanknotesIcon,
  BookOpenIcon,
  CalendarDaysIcon,
  InformationCircleIcon,
  PencilSquareIcon,
} from "@heroicons/react/24/outline";
import { Button } from "@workspace/ui/components/ui/button";
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
import { useLearnerClassQuery } from "../hooks/useLearnerClassesQuery";
import { LearnerClassStatus } from "./LearnerApiClassCard";
import {
  getLearnerWorkspaceLinks,
  LEARNER_WORKSPACE_LABELS,
  type LearnerWorkspaceRoute,
} from "../utils/learner-class-workspace.utils";

const SECTIONS = [
  { id: "overview", icon: InformationCircleIcon },
  { id: "sessions", icon: CalendarDaysIcon },
  { id: "materials", icon: BookOpenIcon },
  { id: "exercises", icon: PencilSquareIcon },
  { id: "tuition", icon: BanknotesIcon },
] as const;

export function LearnerClassSidebar({
  workspace,
}: {
  workspace: LearnerWorkspaceRoute;
}) {
  const { setOpenMobile, toggleSidebar } = useSidebar();
  const query = useLearnerClassQuery(workspace.classId);
  const data = query.data;
  const links = getLearnerWorkspaceLinks(workspace.classId);
  return (
    <Sidebar
      collapsible="icon"
      aria-label="Không gian lớp học"
      className="border-r border-border [&_[data-slot=sidebar-inner]]:bg-card"
    >
      <SidebarHeader className="flex h-16 flex-row items-center gap-1.5 border-b border-border px-2 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0">
        <Button
          asChild
          variant="outline"
          size="icon"
          className="size-11 shrink-0 rounded-full border-border text-primary transition-all active:scale-[0.98] group-data-[collapsible=icon]:hidden motion-reduce:transform-none"
        >
          <Link
            href="/lms/learner/classes"
            aria-label="Về danh sách lớp"
            title="Về danh sách lớp"
            onClick={() => setOpenMobile(false)}
          >
            <ArrowLeftIcon className="size-4" aria-hidden="true" />
          </Link>
        </Button>
        <div className="relative h-10 min-w-0 max-w-32 flex-1 group-data-[collapsible=icon]:hidden">
          <Image
            src="https://res.cloudinary.com/xcrm6ykz/image/upload/v1791528372/BeeWiseLMS-Logo-500x150.svg"
            alt="BeeWise LMS"
            fill
            sizes="128px"
            className="object-contain object-left"
            priority
          />
        </div>
        <SidebarTrigger
          className="size-11 shrink-0 rounded-full transition-all active:scale-[0.98] group-data-[collapsible=icon]:hidden motion-reduce:transform-none"
          aria-label="Thu gọn menu lớp"
        />
        <button
          type="button"
          onClick={toggleSidebar}
          aria-label="Mở menu lớp"
          className="hidden size-11 items-center justify-center rounded-xl transition-all hover:bg-primary/5 active:scale-[0.98] group-data-[collapsible=icon]:flex motion-reduce:transform-none"
        >
          <span className="relative size-8">
            <Image
              src="https://res.cloudinary.com/xcrm6ykz/image/upload/v1791528374/BeeWiseLMS-Logo-500x500.svg"
              alt="BeeWise LMS"
              fill
              sizes="32px"
              className="object-contain"
              priority
            />
          </span>
        </button>
      </SidebarHeader>
      <SidebarContent className="gap-1 overflow-x-hidden overflow-y-auto bg-card py-2">
        <div className="shrink-0 space-y-2 px-4 pb-2 group-data-[collapsible=icon]:hidden">
          <p className="text-xs font-bold tabular-nums text-muted-foreground">
            {data?.code ?? ""}
          </p>
          <p className="font-lms text-lg font-extrabold leading-[1.3] text-primary [overflow-wrap:anywhere]">
            {query.loading
              ? "Đang tải lớp..."
              : (data?.title ?? "Không truy cập được lớp")}
          </p>
          {data && (
            <div className="flex flex-wrap gap-1.5">
              <LearnerClassStatus status={data.status} />
              <span className="rounded-full border border-border bg-card px-2.5 py-1 text-xs font-bold text-primary">
                {data.type === "GROUP"
                  ? "Lớp nhóm"
                  : data.type === "INDIVIDUAL"
                    ? "Lớp 1:1"
                    : "Chưa xác định"}
              </span>
            </div>
          )}
        </div>
        <SidebarGroup className="shrink-0 py-1 group-data-[collapsible=icon]:p-0.5">
          <SidebarGroupLabel className="text-xs font-bold text-muted-foreground group-data-[collapsible=icon]:hidden">
            Không gian lớp học
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-1">
              {data &&
                SECTIONS.map(({ id, icon: Icon }) => {
                  if (id !== "overview" && id !== "sessions")
                    return (
                      <SidebarMenuItem key={id}>
                        <SidebarMenuButton
                          disabled
                          tooltip="Chưa tích hợp API"
                          className="min-h-11 rounded-xl px-3 text-muted-foreground group-data-[collapsible=icon]:size-11! group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:p-0"
                        >
                          <Icon className="size-4 shrink-0" />
                          <span className="group-data-[collapsible=icon]:hidden">
                            {LEARNER_WORKSPACE_LABELS[id]} (chưa tích hợp)
                          </span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  const href = links[id];
                  if (!href) return null;
                  return (
                    <SidebarMenuItem key={id}>
                      <SidebarMenuButton
                        asChild
                        tooltip={LEARNER_WORKSPACE_LABELS[id]}
                        isActive={workspace.section === id}
                        className="lms-navigation-item group-data-[collapsible=icon]:size-11! group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:p-0 motion-reduce:transform-none"
                      >
                        <Link
                          href={href}
                          aria-current={
                            workspace.section === id ? "page" : undefined
                          }
                          onClick={() => setOpenMobile(false)}
                        >
                          <Icon className="size-4 shrink-0" aria-hidden="true" />
                          <span className="group-data-[collapsible=icon]:hidden">{LEARNER_WORKSPACE_LABELS[id]}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="hidden border-t border-border bg-card p-0.5 group-data-[collapsible=icon]:flex">
        <Button
          asChild
          variant="outline"
          size="icon"
          className="size-11 rounded-full border-border text-primary transition-all active:scale-[0.98] motion-reduce:transform-none"
        >
          <Link
            href="/lms/learner/classes"
            aria-label="Về danh sách lớp"
            title="Về danh sách lớp"
            onClick={() => setOpenMobile(false)}
          >
            <ArrowLeftIcon className="size-4" aria-hidden="true" />
          </Link>
        </Button>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
