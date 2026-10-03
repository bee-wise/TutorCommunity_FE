"use client";

import {
  Clock,
  MessageCircle,
  CalendarCheck2,
  Hourglass,
  User,
  BookOpen,
  MonitorSmartphone,
  Home,
  CircleDollarSign,
  CheckCircle2,
  Lock,
} from "lucide-react";
import type { ChatRoom } from "../types/messages.types";

const STAGE_STEPS = [
  { key: "WAITING_FOR_TUTOR", label: "Chờ gia sư phản hồi", icon: Clock },
  { key: "DISCUSSING", label: "Đang thảo luận", icon: MessageCircle },
  {
    key: "TRIAL_SCHEDULED",
    label: "Đã lên lịch học thử",
    icon: CalendarCheck2,
  },
  { key: "AWAITING_DECISION", label: "Chờ quyết định", icon: Hourglass },
  { key: "CONVERTED_TO_CLASS", label: "Lớp học đã tạo", icon: CheckCircle2 },
];

interface ConnectionInfoPanelProps {
  room: ChatRoom;
}

function InfoRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3 border-b border-border py-2.5 last:border-0">
      <Icon size={16} className="mt-0.5 shrink-0 text-muted-foreground" />
      <div className="min-w-0 flex-1">
        <p className="text-[11px] text-muted-foreground">{label}</p>
        <p className="text-sm font-semibold text-foreground">{value}</p>
      </div>
    </div>
  );
}

export function ConnectionInfoPanel({ room }: ConnectionInfoPanelProps) {
  const currentStepIdx = STAGE_STEPS.findIndex(
    (s) => s.key === room.connectionStage,
  );
  const isReadOnly =
    room.status === "CLOSED" || room.status === "CONVERTED_TO_CLASS";

  return (
    <aside className="flex h-full flex-col overflow-y-auto">
      {/* Read-only banner */}
      {isReadOnly && (
        <div className="mb-4 flex items-center gap-2 rounded-xl bg-muted px-4 py-3">
          <Lock size={14} className="text-muted-foreground" />
          <p className="text-xs text-muted-foreground">
            {room.status === "CONVERTED_TO_CLASS"
              ? "Phòng chat đã chuyển thành lớp học."
              : "Phòng chat đã đóng. Chỉ đọc."}
          </p>
        </div>
      )}

      <div className="mb-4 rounded-2xl border border-border bg-card p-4 shadow-sm">
        <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">
          Tiến trình kết nối
        </h3>
        <ol className="space-y-0">
          {STAGE_STEPS.map((step, idx) => {
            const isDone = idx < currentStepIdx;
            const isActive = idx === currentStepIdx;
            const Icon = step.icon;
            return (
              <li key={step.key} className="relative flex gap-3">
                {idx < STAGE_STEPS.length - 1 && (
                  <div
                    className={`absolute left-[11px] top-7 h-[calc(100%-8px)] w-0.5 ${
                      isDone ? "bg-secondary" : "bg-border"
                    }`}
                  />
                )}
                <div
                  className={`relative z-10 mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition ${
                    isDone
                      ? "border-secondary bg-secondary"
                      : isActive
                        ? "border-primary bg-primary"
                        : "border-border bg-card"
                  }`}
                >
                  <Icon
                    size={12}
                    className={
                      isDone || isActive ? "text-primary-foreground" : "text-muted-foreground"
                    }
                  />
                </div>
                {/* Label */}
                <div className="pb-4">
                  <p
                    className={`text-xs font-semibold ${
                      isDone
                        ? "text-secondary"
                        : isActive
                          ? "text-primary"
                          : "text-muted-foreground"
                    }`}
                  >
                    {step.label}
                  </p>
                  {isActive && (
                    <span className="mt-0.5 inline-block rounded-full bg-muted px-2 py-0.5 text-[10px] font-bold text-primary">
                      Hiện tại
                    </span>
                  )}
                </div>
              </li>
            );
          })}
        </ol>
      </div>

      {/* Connection info */}
      <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
        <h3 className="mb-1 text-xs font-bold uppercase tracking-wider text-muted-foreground">
          Thông tin kết nối
        </h3>
        <div>
          {room.hasLearningDetails !== false && <><InfoRow
            icon={BookOpen}
            label="Môn học"
            value={`${room.subject} · ${room.gradeLevel}`}
          />
          <InfoRow
            icon={room.teachingMode === "ONLINE" ? MonitorSmartphone : Home}
            label="Hình thức"
            value={
              room.teachingMode === "ONLINE"
                ? "Online"
                : room.teachingMode === "OFFLINE"
                  ? "Tại nhà"
                  : "Online & Tại nhà"
            }
          /></>}
          {room.feeProposal && (
            <InfoRow
              icon={CircleDollarSign}
              label="Học phí đề xuất"
              value={`${room.feeProposal.toLocaleString("vi-VN")} VNĐ / buổi`}
            />
          )}
          <InfoRow icon={User} label="Học viên" value={room.learner.name} />
          <InfoRow
            icon={User}
            label="Consultant"
            value={room.consultant.name}
          />
        </div>
      </div>
    </aside>
  );
}
