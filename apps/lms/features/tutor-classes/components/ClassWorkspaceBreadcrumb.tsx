"use client";

import Link from "next/link";
import { ChevronRightIcon } from "@heroicons/react/20/solid";
import { Button } from "@workspace/ui/components/ui/button";
import { useTutorClassDetail } from "../hooks/useTutorClassDetail";
import { CLASS_WORKSPACE_LABELS, type ClassWorkspaceRoute } from "../utils/class-workspace.utils";

export function ClassWorkspaceBreadcrumb({ workspace }: { workspace: ClassWorkspaceRoute }) {
  const { classInfo } = useTutorClassDetail(workspace.classId);
  return <nav aria-label="Vị trí trong lớp học" className="hidden min-w-0 items-center gap-2 text-sm md:flex">
    <Button asChild variant="ghost" className="min-h-11 shrink-0 rounded-xl px-3 text-muted-foreground transition-all active:scale-[0.98] motion-reduce:transform-none">
      <Link href="/lms/tutor/classes">Quản lý lớp học</Link>
    </Button>
    <ChevronRightIcon className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
    <span className="truncate font-bold text-primary">{classInfo?.code ?? "Lớp học"}</span>
    <ChevronRightIcon className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
    <span aria-current="page" className="truncate text-muted-foreground">{CLASS_WORKSPACE_LABELS[workspace.section]}</span>
  </nav>;
}
