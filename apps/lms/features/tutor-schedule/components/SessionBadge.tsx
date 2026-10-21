"use client";

import { cn } from "@workspace/core/helpers/utils";
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
  const isPlanned = session.source === "PLANNED";

  return (
    <button
      type="button"
      onClick={() => onClick(session)}
      className={cn(
        "w-full text-left rounded-lg border pl-2 pr-1.5 transition-all duration-150",
        "hover:scale-[1.02] hover:shadow-sm active:scale-[0.99]",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40",
        isPlanned && "border-dashed opacity-85",
        colors.bg,
        colors.border,
        compact ? "py-1" : "py-1.5",
      )}
    >
      <p
        className={cn(
          "font-semibold leading-tight truncate flex items-center gap-1",
          colors.text,
          compact ? "text-[10px]" : "text-xs",
        )}
      >
        {isPlanned && (
          <span className="text-[9px] uppercase tracking-wider font-extrabold px-1 rounded bg-muted/80 text-muted-foreground border border-border/60">
            Dự kiến
          </span>
        )}
        <span>
          {session.startTime} · {session.subject} {session.subjectLevel}
        </span>
      </p>
      {!compact && (
        <p
          className="text-[10px] text-muted-foreground truncate mt-0.5"
          title={session.studentFullName || session.studentName}
        >
          {session.studentFullName || session.studentName}
        </p>
      )}
    </button>
  );
}
