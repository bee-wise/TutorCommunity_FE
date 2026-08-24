"use client";

import { VideoCamera, X } from "@phosphor-icons/react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@workspace/ui/components/ui/sheet";
import type { LearnerSession } from "../types/learner-schedule.types";
import { LEARNER_STATUS_LABELS } from "../types/learner-schedule.types";
import { formatLearnerSessionDate } from "../utils/calendar.utils";

const STATUS_CLASS = {
  UPCOMING: "border-[#FFC500]/40 bg-[#FFC500]/15 text-[#905B0F]",
  COMPLETED: "border-[#447353]/25 bg-[#447353]/10 text-[#447353]",
  CANCELED: "border-[#E1ABA7]/60 bg-[#E1ABA7]/18 text-[#9B5E5A]",
} as const;

interface LearnerSessionSheetProps {
  session: LearnerSession | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function LearnerSessionSheet({ session, open, onOpenChange }: LearnerSessionSheetProps) {
  if (!session) return null;
  const isUpcoming = session.status === "UPCOMING";

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" showCloseButton={false} className="flex w-full flex-col border-l border-border bg-white p-0 sm:max-w-md">
        <SheetHeader className="border-b border-border bg-[#CFE1FA]/25 px-5 py-5 text-left sm:px-6">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-bold ${STATUS_CLASS[session.status]}`}>{LEARNER_STATUS_LABELS[session.status]}</span>
              <SheetTitle className="mt-3 text-xl font-extrabold">{session.subject} - {session.topic}</SheetTitle>
              <SheetDescription className="mt-1">{session.level}</SheetDescription>
            </div>
            <button type="button" onClick={() => onOpenChange(false)} aria-label="Đóng chi tiết" className="grid size-8 shrink-0 place-items-center rounded-lg text-muted-foreground hover:bg-white"><X size={17} weight="bold" /></button>
          </div>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-5 py-5 sm:px-6">
          <div className="flex items-center gap-3 rounded-xl border border-border p-4">
            <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-[#280F91] text-sm font-extrabold text-white">{session.tutorInitials}</span>
            <div><p className="text-xs text-muted-foreground">Gia sư phụ trách</p><p className="mt-0.5 font-extrabold">{session.tutorName}</p></div>
          </div>

          <dl className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <InfoItem label="Ngày học" value={formatLearnerSessionDate(session.date)} />
            <InfoItem label="Khung giờ" value={`${session.startTime} - ${session.endTime}`} />
            <InfoItem label="Mã lớp" value={session.classCode} />
            <InfoItem label="Tư vấn viên" value={session.consultantName} />
          </dl>

          {session.notes && (
            <div className="mt-5 rounded-xl border border-[#FFC500]/30 bg-[#FFC500]/10 p-4">
              <p className="text-xs font-bold text-[#905B0F]">Ghi chú chuẩn bị</p>
              <p className="mt-1.5 text-sm leading-6 text-foreground">{session.notes}</p>
            </div>
          )}
        </div>

        <div className="border-t border-border p-5 sm:px-6">
          {isUpcoming ? (
            <a href={session.classroomLink} target="_blank" rel="noopener noreferrer" className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#280F91] text-sm font-bold text-white transition-colors hover:bg-[#280F91]/90 active:scale-[0.98]">
              <VideoCamera size={18} weight="fill" /> Vào lớp học
            </a>
          ) : (
            <p className="rounded-xl bg-muted px-4 py-3 text-center text-sm font-semibold text-muted-foreground">
              {session.status === "COMPLETED" ? "Buổi học đã hoàn thành" : "Buổi học đã được hủy"}
            </p>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return <div><dt className="text-xs text-muted-foreground">{label}</dt><dd className="mt-1 text-sm font-bold text-foreground">{value}</dd></div>;
}

