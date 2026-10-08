"use client";

import Link from "next/link";
import { EllipsisHorizontalIcon } from "@heroicons/react/24/outline";
import { Button } from "@workspace/ui/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@workspace/ui/components/ui/dropdown-menu";

export function DashboardMoreMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button type="button" variant="outline" aria-label="Thêm điều hướng dashboard" className="size-11 rounded-full border-border bg-card transition-all active:scale-95 motion-reduce:transform-none">
          <EllipsisHorizontalIcon className="size-5" aria-hidden="true" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 rounded-2xl border-border bg-popover p-2 shadow-soft motion-reduce:animate-none">
        <DropdownMenuItem asChild className="min-h-11 rounded-xl font-semibold transition-all active:scale-[0.98]"><Link href="/lms/tutor/profile">Hồ sơ của tôi</Link></DropdownMenuItem>
        <DropdownMenuItem asChild className="min-h-11 rounded-xl font-semibold transition-all active:scale-[0.98]"><Link href="/lms/tutor/history">Lịch sử kết nối</Link></DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
