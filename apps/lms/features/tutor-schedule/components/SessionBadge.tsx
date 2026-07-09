"use client";

import { cn } from '@workspace/core/helpers/utils';
import type { Session } from "../types/schedule.types";
import { STATUS_COLORS } from "../types/schedule.types";

interface SessionBadgeProps {
  session: Session;
  onClick: (session: Session) => void;
  compact?: boolean;
}

export function SessionBadge({
  session,
  onClick,
  compact = false,
}: SessionBadgeProps) {
  const colors = STATUS_COLORS[session.status];

  return (
    <button
      type="button"
      onClick={() => onClick(session)}
      className={cn(
        "w-full text-left rounded-lg border pl-2 pr-1.5 transition-all duration-150",
        "hover:scale-[1.02] hover:shadow-sm active:scale-[0.99]",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-[#280f91]/40",
        colors.bg,
        colors.border,
        compact ? "py-1" : "py-1.5",
      )}
    >
      <p
        className={cn(
          "font-semibold leading-tight truncate",
          colors.text,
          compact ? "text-[10px]" : "text-xs",
        )}
      >
        {session.startTime} · {session.subject} {session.subjectLevel}
      </p>
      {!compact && (
        <p className="text-[10px] text-muted-foreground truncate mt-0.5">
          {session.studentName}
        </p>
      )}
    </button>
  );
}
