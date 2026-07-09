"use client";

import { useState } from "react";
import {
  Calendar,
  Clock,
  User,
  UserCheck,
  ExternalLink,
  Banknote,
  MessageCircle,
  CheckCircle2,
  X,
  Video,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@workspace/ui/components/ui/sheet';
import { cn } from '@workspace/core/helpers/utils';
import type { Session } from "../types/schedule.types";
import { STATUS_COLORS, STATUS_LABELS } from "../types/schedule.types";

interface SessionDetailSheetProps {
  session: Session | null;
  open: boolean;
  onClose: () => void;
}

function formatDate(dateStr: string): string {
  const [y, m, d] = dateStr.split("-");
  return `${d}/${m}/${y}`;
}

function formatFee(fee: number): string {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(fee);
}

// Simulate "is class joinable" (within 15 min of start or during class)
// For demo: always enabled if status is UPCOMING
function isJoinable(session: Session): boolean {
  return session.status === "UPCOMING";
}

function InfoRow({
  icon: Icon,
  label,
  children,
}: {
  icon: React.ElementType;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="size-8 rounded-lg bg-muted/60 flex items-center justify-center shrink-0 mt-0.5">
        <Icon className="size-4 text-muted-foreground" strokeWidth={1.75} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground mb-0.5">
          {label}
        </p>
        <div className="text-sm font-medium text-foreground">{children}</div>
      </div>
    </div>
  );
}

export function SessionDetailSheet({
  session,
  open,
  onClose,
}: SessionDetailSheetProps) {
  const [showTooltip, setShowTooltip] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  if (!session) return null;

  const colors = STATUS_COLORS[session.status];
  const joinable = isJoinable(session);

  return (
    <Sheet open={open} onOpenChange={(v) => !v && onClose()}>
      <SheetContent
        side="right"
        showCloseButton={false}
        className="w-full sm:max-w-md p-0 flex flex-col bg-white border-l border-border/60 shadow-2xl"
      >
        {/* ── Header ── */}
        <SheetHeader className="p-0">
          {/* Status bar */}
          <div
            className={cn(
              "px-6 pt-5 pb-4 border-b border-border/40",
              session.status === "UPCOMING" && "bg-[#fff3cb]/30 backdrop-blur-sm",
              session.status === "COMPLETED" && "bg-emerald-50/40",
              session.status === "CANCELED" && "bg-red-50/30",
            )}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                {/* Subject title */}
                <SheetTitle className="text-xl font-extrabold font-montserrat text-foreground leading-tight">
                  {session.subject} {session.subjectLevel}
                </SheetTitle>
                {/* Student name */}
                <SheetDescription className="mt-1 text-sm text-muted-foreground">
                  Học viên:{" "}
                  <span className="font-semibold text-foreground">
                    {session.studentFullName}
                  </span>
                </SheetDescription>
                {/* Status badge */}
                <span
                  className={cn(
                    "inline-flex items-center gap-1.5 mt-2 px-2.5 py-1 rounded-full text-xs font-semibold border",
                    colors.bg,
                    colors.text,
                    colors.border,
                  )}
                >
                  <span
                    className={cn("size-1.5 rounded-full shrink-0", colors.dot)}
                  />
                  {STATUS_LABELS[session.status]}
                </span>
              </div>
              {/* Close button */}
              <button
                type="button"
                onClick={onClose}
                className="size-8 rounded-lg flex items-center justify-center text-muted-foreground hover:bg-muted/60 hover:text-foreground transition-colors shrink-0"
              >
                <X className="size-4" strokeWidth={1.75} />
              </button>
            </div>
          </div>
        </SheetHeader>

        {/* ── Body ── */}
        <div className="flex-1 overflow-y-auto">
          <div className="px-6 py-5 space-y-5">
            {/* Consultant */}
            <InfoRow icon={UserCheck} label="Tư vấn viên phụ trách">
              {session.consultantName}
            </InfoRow>

            {/* Date */}
            <InfoRow icon={Calendar} label="Ngày học">
              {formatDate(session.date)}
            </InfoRow>

            {/* Time */}
            <InfoRow icon={Clock} label="Khung giờ">
              {session.startTime} – {session.endTime}
            </InfoRow>

            {/* Student full name */}
            <InfoRow icon={User} label="Mã lớp">
              <span className="font-mono text-xs bg-muted/60 px-2 py-0.5 rounded-md">
                {session.classId}
              </span>
            </InfoRow>

            {/* Fee */}
            <InfoRow icon={Banknote} label="Học phí / buổi">
              <span className="text-base font-extrabold font-montserrat text-[#280f91]">
                {formatFee(session.feeVnd)}
              </span>
            </InfoRow>

            <div className="h-px bg-border/40" />

            {/* Classroom Link CTA */}
            <div className="rounded-xl border border-border/50 bg-muted/20 p-4">
              <div className="flex items-center gap-2 mb-3">
                <Video className="size-4 text-muted-foreground" strokeWidth={1.75} />
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Phòng học trực tuyến
                </p>
              </div>

              {session.status === "CANCELED" ? (
                <p className="text-sm text-muted-foreground">
                  Buổi học đã bị hủy. Không thể vào phòng học.
                </p>
              ) : (
                <>
                  <a
                    href={joinable ? session.classroomLink : undefined}
                    target={joinable ? "_blank" : undefined}
                    rel="noopener noreferrer"
                    className={cn(
                      "flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl font-semibold text-sm transition-all duration-150",
                      joinable
                        ? "bg-[#ffc500] text-[#0c0c0b] hover:bg-[#f0b800] active:scale-[0.98] shadow-sm shadow-[#ffc500]/40 cursor-pointer"
                        : "bg-muted/50 text-muted-foreground cursor-not-allowed border border-border/50",
                    )}
                    onClick={!joinable ? (e) => e.preventDefault() : undefined}
                  >
                    <ExternalLink className="size-4" strokeWidth={2} />
                    {joinable ? "Vào lớp học" : "Chưa đến giờ học"}
                  </a>
                  {!joinable && (
                    <p className="text-[11px] text-muted-foreground text-center mt-2">
                      Nút sẽ mở khóa 15 phút trước giờ học.
                    </p>
                  )}
                </>
              )}
            </div>

            {/* Notes */}
            {session.notes && (
              <div className="rounded-xl border border-border/40 bg-muted/20 px-4 py-3">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground mb-1.5">
                  Ghi chú
                </p>
                <p className="text-sm text-foreground leading-relaxed">
                  {session.notes}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* ── Footer Actions ── */}
        <div className="border-t border-border/40 px-6 py-4 space-y-2 bg-white">
          {/* Confirm button — only for UPCOMING */}
          {session.status === "UPCOMING" && !confirmed && (
            <button
              type="button"
              onClick={() => setConfirmed(true)}
              className="flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl bg-[#280f91] text-white font-semibold text-sm hover:bg-[#1e0b72] active:scale-[0.98] transition-all duration-150 shadow-sm shadow-[#280f91]/20"
            >
              <CheckCircle2 className="size-4" strokeWidth={2} />
              Xác nhận thay đổi lịch
            </button>
          )}

          {confirmed && (
            <div className="flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl bg-emerald-50 border border-[#447353]/30 text-[#447353] font-semibold text-sm">
              <CheckCircle2 className="size-4" strokeWidth={2} />
              Đã xác nhận thành công
            </div>
          )}

          {/* Reschedule link with tooltip */}
          <div className="relative">
            <button
              type="button"
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
              onFocus={() => setShowTooltip(true)}
              onBlur={() => setShowTooltip(false)}
              className="flex items-center justify-center gap-1.5 w-full py-2 text-sm text-muted-foreground hover:text-[#280f91] transition-colors font-medium"
            >
              <MessageCircle className="size-4" strokeWidth={1.75} />
              Yêu cầu đổi lịch / Liên hệ tư vấn viên
            </button>

            {showTooltip && (
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50 w-64 rounded-xl bg-[#0c0c0b] text-white text-xs px-3 py-2.5 text-center shadow-lg pointer-events-none">
                Gửi tin nhắn trực tiếp đến tư vấn viên{" "}
                <strong>{session.consultantName}</strong> qua mục Tin Nhắn.
                <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-px border-4 border-transparent border-t-[#0c0c0b]" />
              </div>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
