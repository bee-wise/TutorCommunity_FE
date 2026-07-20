"use client";

import {
  CalendarPlus,
  CheckSquare,
  XSquare,
} from "lucide-react";
import type { ChatParticipantRole } from "../types/messages.types";

interface ConsultantActionsProps {
  currentRole: ChatParticipantRole;
  onSendTrialScheduleWidget: () => void;
  onSendConfirmWidget: () => void;
  onSendCloseWidget: () => void;
}

/** Renders quick-action buttons only when current user is CONSULTANT. */
export function ConsultantActions({
  currentRole,
  onSendTrialScheduleWidget,
  onSendConfirmWidget,
  onSendCloseWidget,
}: ConsultantActionsProps) {
  if (currentRole !== "CONSULTANT") return null;

  return (
    <div className="flex items-center gap-1.5">
      <span className="mr-1 text-[10px] font-bold uppercase tracking-widest text-[#c2c7d6]">
        Consultant
      </span>
      <button
        type="button"
        title="Đề xuất lịch học thử"
        onClick={onSendTrialScheduleWidget}
        className="flex items-center gap-1.5 rounded-lg border border-amber-200 bg-amber-50 px-2.5 py-1.5 text-xs font-bold text-amber-800 transition hover:bg-amber-100 active:scale-[0.97]"
      >
        <CalendarPlus size={14} className="fill-amber-200" />
        Lịch học thử
      </button>
      <button
        type="button"
        title="Xác nhận học chính thức"
        onClick={onSendConfirmWidget}
        className="flex items-center gap-1.5 rounded-lg border border-green-200 bg-green-50 px-2.5 py-1.5 text-xs font-bold text-green-800 transition hover:bg-green-100 active:scale-[0.97]"
      >
        <CheckSquare size={14} className="fill-green-200" />
        Xác nhận lớp
      </button>
      <button
        type="button"
        title="Đóng kết nối"
        onClick={onSendCloseWidget}
        className="flex items-center gap-1.5 rounded-lg border border-red-200 bg-red-50 px-2.5 py-1.5 text-xs font-bold text-red-700 transition hover:bg-red-100 active:scale-[0.97]"
      >
        <XSquare size={14} className="fill-red-200" />
        Đóng kết nối
      </button>
    </div>
  );
}
