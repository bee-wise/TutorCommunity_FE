"use client";

import { ChatBubbleLeftRightIcon } from "@heroicons/react/24/outline";
import { LmsSessionDetailSheet } from "@/components/LmsSessionDetailSheet";
import type { LearnerSession } from "../types/learner-schedule.types";

interface LearnerSessionSheetProps {
  session: LearnerSession | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function LearnerSessionSheet({ session, open, onOpenChange }: LearnerSessionSheetProps) {
  return (
    <LmsSessionDetailSheet
      role="learner"
      session={session}
      open={open}
      onOpenChange={onOpenChange}
      getPerson={(detail) => ({ label: "Gia sư phụ trách", name: detail?.tutorName || session?.tutorName || "Gia sư" })}
      footer={(detail) => (
        <div className="rounded-2xl border border-border bg-muted p-3.5 text-xs leading-relaxed text-muted-foreground">
          <div className="mb-1 flex items-center gap-1.5 font-bold text-foreground">
            <ChatBubbleLeftRightIcon className="size-4 text-primary" aria-hidden />
            Lưu ý về đổi hoặc hủy lịch
          </div>
          Học viên không hủy hoặc đổi lịch trực tiếp trên hệ thống. Nếu có việc bận đột xuất, bạn vui lòng liên hệ tư vấn viên{" "}
          <strong className="text-foreground">{detail?.consultantName || session?.consultantName || "phụ trách"}</strong> để được hỗ trợ sắp xếp lại lịch học.
        </div>
      )}
    />
  );
}
