"use client";

import {
  CalendarCheck2,
  Clock,
  CheckCircle2,
  XCircle,
  Monitor,
  Home,
  AlertTriangle,
} from "lucide-react";
import type { ChatWidget as ChatWidgetType, ChatParticipantRole } from "../types/messages.types";
import type { TrialScheduleData, ConfirmClassData } from "../types/messages.types";

interface ChatWidgetProps {
  widget: ChatWidgetType;
  currentRole: ChatParticipantRole;
  onAccept?: () => void;
  onDecline?: () => void;
}

const STATUS_STYLES: Record<string, { bg: string; border: string; badge: string }> = {
  PENDING:  { bg: "bg-amber-50",  border: "border-amber-200",  badge: "bg-amber-100 text-amber-800" },
  ACCEPTED: { bg: "bg-green-50",  border: "border-green-200",  badge: "bg-green-100 text-[#447353]" },
  DECLINED: { bg: "bg-red-50",    border: "border-red-200",    badge: "bg-red-100 text-red-700" },
  EXPIRED:  { bg: "bg-gray-50",   border: "border-gray-200",   badge: "bg-gray-100 text-gray-600" },
};

const STATUS_LABELS: Record<string, string> = {
  PENDING:  "Chờ xác nhận",
  ACCEPTED: "Đã xác nhận",
  DECLINED: "Đã từ chối",
  EXPIRED:  "Đã hết hạn",
};

function TrialScheduleWidget({ widget, currentRole, onAccept, onDecline }: ChatWidgetProps) {
  const data = widget.data as TrialScheduleData;
  const styles = STATUS_STYLES[widget.status] ?? STATUS_STYLES.PENDING;
  const canAct = widget.status === "PENDING" && (currentRole === "LEARNER" || currentRole === "TUTOR");

  const dateObj = new Date(data.proposedDate);
  const formattedDate = dateObj.toLocaleDateString("vi-VN", {
    weekday: "long", day: "2-digit", month: "2-digit", year: "numeric",
  });

  return (
    <div className={`rounded-2xl border-2 ${styles.border} ${styles.bg} p-4 w-full max-w-sm`}>
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <CalendarCheck2 size={16} className="text-[#280f91]" />
          <span className="text-sm font-bold text-[#280f91]">Đề xuất lịch học thử</span>
        </div>
        <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${styles.badge}`}>
          {STATUS_LABELS[widget.status]}
        </span>
      </div>
      <div className="space-y-2 text-sm">
        <div className="flex items-center gap-2">
          <CalendarCheck2 size={13} className="shrink-0 text-[#667085]" />
          <span className="font-semibold">{formattedDate}</span>
        </div>
        <div className="flex items-center gap-2">
          <Clock size={13} className="shrink-0 text-[#667085]" />
          <span>{data.proposedTime} · {data.durationMinutes} phút</span>
        </div>
        <div className="flex items-center gap-2">
          {data.teachingMode === "ONLINE"
            ? <Monitor size={13} className="shrink-0 text-[#667085]" />
            : <Home size={13} className="shrink-0 text-[#667085]" />}
          <span>{data.teachingMode === "ONLINE" ? "Online" : "Tại nhà"}</span>
        </div>
        {data.note && (
          <p className="rounded-lg bg-white/70 px-3 py-2 text-xs text-[#667085] border border-black/5">
            {data.note}
          </p>
        )}
      </div>
      {canAct && (
        <div className="mt-3 flex gap-2">
          <button
            type="button"
            onClick={onAccept}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-[#447353] px-3 py-2 text-xs font-bold text-white transition hover:bg-[#3a6248] active:scale-[0.98]"
          >
            <CheckCircle2 size={13} />
            Xác nhận
          </button>
          <button
            type="button"
            onClick={onDecline}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-[#dce3f0] bg-white px-3 py-2 text-xs font-bold text-[#667085] transition hover:border-red-300 hover:text-red-600 active:scale-[0.98]"
          >
            <XCircle size={13} />
            Từ chối
          </button>
        </div>
      )}
      {widget.status === "ACCEPTED" && (
        <div className="mt-3 flex items-center gap-1.5 text-xs text-[#447353]">
          <CheckCircle2 size={12} />
          <span className="font-semibold">Đã được xác nhận</span>
        </div>
      )}
    </div>
  );
}

function ConfirmClassWidget({ widget, currentRole, onAccept, onDecline }: ChatWidgetProps) {
  const data = widget.data as ConfirmClassData;
  const styles = STATUS_STYLES[widget.status] ?? STATUS_STYLES.PENDING;
  const canAct = widget.status === "PENDING" && (currentRole === "LEARNER" || currentRole === "TUTOR");

  return (
    <div className={`rounded-2xl border-2 ${styles.border} ${styles.bg} p-4 w-full max-w-sm`}>
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <CheckCircle2 size={16} className="text-[#447353]" />
          <span className="text-sm font-bold text-[#447353]">Xác nhận học chính thức</span>
        </div>
        <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${styles.badge}`}>
          {STATUS_LABELS[widget.status]}
        </span>
      </div>
      <div className="space-y-2 text-sm">
        <div className="flex justify-between"><span className="text-[#667085]">Môn học</span><span className="font-semibold">{data.subject} {data.gradeLevel}</span></div>
        <div className="flex justify-between"><span className="text-[#667085]">Hình thức</span><span className="font-semibold">{data.teachingMode === "ONLINE" ? "Online" : "Tại nhà"}</span></div>
        <div className="flex justify-between"><span className="text-[#667085]">Số buổi/tuần</span><span className="font-semibold">{data.sessionsPerWeek} buổi</span></div>
        <div className="flex justify-between"><span className="text-[#667085]">Học phí/buổi</span><span className="font-semibold text-[#280f91]">{data.feePerSession.toLocaleString("vi-VN")} VNĐ</span></div>
        <div className="flex justify-between border-t border-[#e5eaf5] pt-2">
          <span className="text-[#667085]">Ngày bắt đầu</span>
          <span className="font-semibold">{new Date(data.startDate).toLocaleDateString("vi-VN")}</span>
        </div>
      </div>
      {canAct && (
        <div className="mt-3 flex gap-2">
          <button type="button" onClick={onAccept} className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-[#280f91] px-3 py-2 text-xs font-bold text-white transition hover:bg-[#1f0b70] active:scale-[0.98]">
            <CheckCircle2 size={13} />Đồng ý học
          </button>
          <button type="button" onClick={onDecline} className="flex items-center justify-center gap-1.5 rounded-xl border border-[#dce3f0] bg-white px-3 py-2 text-xs font-bold text-[#667085] transition hover:border-red-300 hover:text-red-600 active:scale-[0.98]">
            <XCircle size={13} />Từ chối
          </button>
        </div>
      )}
    </div>
  );
}

function CloseConnectionWidget() {
  return (
    <div className="rounded-2xl border-2 border-red-200 bg-red-50 p-4 w-full max-w-sm">
      <div className="flex items-center gap-2">
        <AlertTriangle size={16} className="text-red-600" />
        <span className="text-sm font-bold text-red-700">Kết nối đã được đóng</span>
      </div>
      <p className="mt-2 text-xs text-red-600">
        Consultant đã đóng phòng chat này. Phòng chat chuyển sang chế độ chỉ đọc.
      </p>
    </div>
  );
}

export function ChatWidget({ widget, currentRole, onAccept, onDecline }: ChatWidgetProps) {
  switch (widget.widgetType) {
    case "TRIAL_SCHEDULE":
      return <TrialScheduleWidget widget={widget} currentRole={currentRole} onAccept={onAccept} onDecline={onDecline} />;
    case "CONFIRM_CLASS":
      return <ConfirmClassWidget widget={widget} currentRole={currentRole} onAccept={onAccept} onDecline={onDecline} />;
    case "CLOSE_CONNECTION":
      return <CloseConnectionWidget />;
    default:
      return null;
  }
}
