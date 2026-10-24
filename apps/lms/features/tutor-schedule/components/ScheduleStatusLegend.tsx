"use client";

import { InformationCircleIcon } from "@heroicons/react/24/outline";
import { Button } from "@workspace/ui/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@workspace/ui/components/ui/dropdown-menu";
import { LMS_SESSION_STATUS, type LmsSessionStatus } from "@/components/lms-session-status";
import { statusTone } from "@/components/lms-status";

const ORDER: LmsSessionStatus[] = ["UPCOMING", "IN_PROGRESS", "COMPLETED", "CANCELED", "RESCHEDULED"];

/** Info button beside the page title: explains what each calendar colour means. */
export function ScheduleStatusLegend() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button type="button" variant="ghost" size="icon" className="size-11 rounded-full text-muted-foreground hover:text-primary" aria-label="Chú thích màu trạng thái buổi dạy">
          <InformationCircleIcon className="size-6" aria-hidden="true" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-64 rounded-2xl border-border bg-popover p-4 shadow-pop">
        <p className="mb-3 text-sm font-extrabold text-foreground">Màu trạng thái buổi dạy</p>
        <ul className="space-y-2">
          {ORDER.map((status) => (
            <li key={status} className="flex items-center gap-3">
              <span className={`h-6 w-14 shrink-0 rounded-lg border ${statusTone[LMS_SESSION_STATUS[status].tone]}`} aria-hidden="true" />
              <span className="text-sm font-semibold text-foreground">{LMS_SESSION_STATUS[status].label}</span>
            </li>
          ))}
          <li className="flex items-center gap-3 border-t border-border pt-2">
            <span className="h-6 w-14 shrink-0 rounded-lg border border-dashed border-border bg-card" aria-hidden="true" />
            <span className="text-sm font-semibold text-foreground">Lịch dự kiến, chưa tạo buổi</span>
          </li>
        </ul>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
