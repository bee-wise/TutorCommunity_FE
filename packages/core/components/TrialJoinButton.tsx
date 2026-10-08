"use client";

import { useEffect, useState } from "react";
import { ArrowRightIcon } from "@heroicons/react/24/outline";
import { Button } from "@workspace/ui/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@workspace/ui/components/ui/tooltip";
import type { TrialSession } from "../services/connection-widgets.service";
import { getTrialJoinAvailability } from "../services/trial-join-availability";

function startTimeLabel(value?: string | null) {
  if (!value) return "giờ học";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "giờ học";
  return new Intl.DateTimeFormat("vi-VN", {
    timeZone: "Asia/Ho_Chi_Minh",
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export function TrialJoinButton({ trial, href }: { trial: TrialSession; href: string }) {
  const [now, setNow] = useState(0);
  useEffect(() => {
    const refresh = () => setNow(Date.now());
    refresh();
    document.addEventListener("visibilitychange", refresh);
    return () => document.removeEventListener("visibilitychange", refresh);
  }, []);
  useEffect(() => {
    if (!now) return;
    const start = trial.scheduledStartAt ? Date.parse(trial.scheduledStartAt) : NaN;
    const end = trial.scheduledEndAt ? Date.parse(trial.scheduledEndAt) : NaN;
    const next = [start, end].filter((value) => Number.isFinite(value) && value > Date.now()).sort((a, b) => a - b)[0];
    const timer = next === undefined ? undefined : window.setTimeout(() => setNow(Date.now()), Math.min(next - Date.now() + 50, 2_147_483_647));
    return () => {
      if (timer !== undefined) window.clearTimeout(timer);
    };
  }, [trial.scheduledStartAt, trial.scheduledEndAt, now]);

  const availability = now ? getTrialJoinAvailability(trial, now) : { state: "NO_SCHEDULE" as const };
  const reason = availability.state === "BEFORE_START"
    ? `Có thể tham gia từ ${startTimeLabel(trial.scheduledStartAt)}.`
    : availability.state === "AFTER_END"
      ? "Buổi học đã kết thúc."
      : availability.state === "AWAITING_CONFIRMATION"
        ? "Chờ gia sư và học viên xác nhận lịch học."
        : availability.state === "CLOSED"
          ? "Lịch học này không còn mở để tham gia."
          : "Chưa có thời gian học hợp lệ.";
  const className = "h-8 rounded-lg px-2.5 text-xs font-bold transition-all active:scale-[0.98]";

  if (availability.state === "READY") {
    return (
      <Button asChild className={className}>
        <a href={href} target="_blank" rel="noopener noreferrer">
          Tham gia phòng học <ArrowRightIcon className="size-4" aria-hidden="true" />
        </a>
      </Button>
    );
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <span tabIndex={0} aria-label={reason} className="inline-flex cursor-not-allowed rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
            <Button type="button" disabled className={className}>
              Tham gia phòng học <ArrowRightIcon className="size-4" aria-hidden="true" />
            </Button>
          </span>
        </TooltipTrigger>
        <TooltipContent side="top" sideOffset={6}>{reason}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
